const { cmd } = require('../command');
const axios = require('axios');
const Jimp = require('jimp');
const { writeFileSync, unlinkSync } = require('fs');

cmd({
    pattern: "fullpp",
    react: "🖼️",
    desc: "Convert image to WhatsApp full DP",
    category: "tools",
    filename: __filename
},
async (conn, mek, m) => {
    try {
        const quoted = m.quoted;
        if (!quoted || !quoted.mtype.includes('image')) {
            return m.reply('⚠️ Please reply to an image');
        }

        m.reply('🔄 Processing your image...');

        // Download media and convert to workable format
        const media = await conn.downloadMediaMessage(quoted);
        const tempPath = './temp_image.jpg';
        writeFileSync(tempPath, media);

        try {
            // Process with Jimp
            const image = await Jimp.read(tempPath);
            const processed = await image
                .cover(640, 1280) // WhatsApp full DP size
                .quality(85); // Reduce file size

            const buffer = await processed.getBufferAsync(Jimp.MIME_JPEG);
            await conn.updateProfilePicture(conn.user.id, buffer);
            m.reply('✅ Full DP set successfully!');
        } catch (processError) {
            console.error('Processing error:', processError);
            throw new Error('Image processing failed');
        } finally {
            // Clean up temp file
            try { unlinkSync(tempPath); } catch (e) {}
        }

    } catch (error) {
        console.error('Final error:', error);
        m.reply(`❌ Error: ${error.message.includes('processing') ? 'Failed to process image' : error.message}`);
        
        // Alternative fallback
        if (error.message.includes('unsupported image format')) {
            m.reply('⚠️ Trying alternative conversion method...');
            // Could add alternative conversion here
        }
    }
});
