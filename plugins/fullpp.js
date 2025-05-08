const { cmd } = require('../command');
const Jimp = require('jimp');
const axios = require('axios');

cmd({
    pattern: "fullpp",
    react: "🖼️",
    desc: "WhatsApp Full DP (BandaheAli Style - 9:16 without background)",
    category: "tools",
    filename: __filename
},
async (conn, mek, m) => {
    try {
        const quoted = m.quoted;
        if (!quoted || !quoted.mtype || !quoted.mtype.includes('image')) {
            return m.reply('⚠️ *Kisi image par reply karein.*');
        }

        m.reply('⏳ *Processing image (BandaheAli Style)...*');

        // Download and process locally
        const media = await conn.downloadMediaMessage(quoted);
        let image = await Jimp.read(media);

        // Calculate dimensions (BandaheAli Style)
        const targetWidth = 640;
        const targetHeight = 1280;
        
        // Resize and crop to exactly 9:16
        image = image.cover(targetWidth, targetHeight);

        // Convert to buffer
        const buffer = await image.getBufferAsync(Jimp.MIME_JPEG);

        // Update profile picture
        await conn.updateProfilePicture(conn.user.id, buffer);
        m.reply('✅ *Full DP (BandaheAli Style) set successfully!*');

    } catch (err) {
        console.error(err);
        m.reply(`❌ *Error:* ${err.message}`);
    }
});
