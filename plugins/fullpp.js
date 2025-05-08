const { cmd } = require('../command');
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

cmd({
    pattern: "fullpp",
    react: "🖼️",
    desc: "Convert image to WhatsApp full DP using BandaheAli API",
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

        // Download the image
        const media = await conn.downloadMediaMessage(quoted);
        const tempPath = './temp_image.jpg';
        fs.writeFileSync(tempPath, media);

        // Prepare form data
        const form = new FormData();
        form.append('image', fs.createReadStream(tempPath));

        // Send to API
        const response = await axios.post('https://fullpp-bandaheali.onrender.com/upload', form, {
            headers: form.getHeaders(),
            responseType: 'arraybuffer'
        });

        // Save and update profile
        const outputPath = './full_dp.jpg';
        fs.writeFileSync(outputPath, response.data);
        await conn.updateProfilePicture(conn.user.id, fs.readFileSync(outputPath));

        m.reply('✅ Full DP set successfully!');

        // Clean up
        fs.unlinkSync(tempPath);
        fs.unlinkSync(outputPath);

    } catch (error) {
        console.error('Error:', error);
        m.reply(`❌ Failed to process image: ${error.message}`);
        
        // Fallback to local processing if API fails
        try {
            const Jimp = require('jimp');
            const image = await Jimp.read(media);
            const buffer = await image.cover(640, 1280).getBufferAsync(Jimp.MIME_JPEG);
            await conn.updateProfilePicture(conn.user.id, buffer);
            m.reply('✅ Used fallback method to set DP');
        } catch (fallbackError) {
            m.reply('❌ Both API and fallback methods failed');
        }
    }
});
