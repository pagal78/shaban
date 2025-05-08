const { cmd } = require('../command');
const Jimp = require('jimp');

cmd({
    pattern: "fullpp",
    react: "🖼️",
    desc: "Set uncropped full image as profile picture",
    category: "tools",
    filename: __filename
},
async (conn, mek, m) => {
    try {
        const quoted = m.quoted;
        if (!quoted || !quoted.mtype || !quoted.mtype.includes('image')) {
            return m.reply('⚠️ *Kisi image par reply karein.*');
        }

        m.reply('⏳ *Image process ho rahi hai...*');

        const media = await conn.downloadMediaMessage(quoted);
        const original = await Jimp.read(media);

        const maxSize = 640; // WhatsApp DP requirement
        const bg = new Jimp(maxSize, maxSize, 0xffffffff); // white square background

        // Resize original image to fit within square without distortion
        original.scaleToFit(maxSize, maxSize);

        // Center it
        const x = (maxSize - original.bitmap.width) / 2;
        const y = (maxSize - original.bitmap.height) / 2;
        bg.composite(original, x, y);

        const buffer = await bg.getBufferAsync(Jimp.MIME_JPEG);
        await conn.updateProfilePicture(conn.user.id, buffer);

        m.reply('✅ *Profile picture full original size mein set kar di gayi.*');
    } catch (err) {
        console.error(err);
        m.reply(`❌ *Error:* ${err.message}`);
    }
});
