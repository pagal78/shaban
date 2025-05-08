const { cmd } = require('../command');
const Jimp = require('jimp');

cmd({
    pattern: "fullpp",
    react: "🖼️",
    desc: "Set full image as bot's profile picture",
    category: "tools",
    filename: __filename
},
async (conn, mek, m) => {
    try {
        const quoted = m.quoted;

        if (!quoted || !quoted.mtype || !quoted.mtype.includes('image')) {
            return m.reply('⚠️ *Kisi image par reply karein.*');
        }

        m.reply('⏳ *Image process ho rahi hai, please wait...*');

        const media = await conn.downloadMediaMessage(quoted);
        const image = await Jimp.read(media);

        const size = 640; // WhatsApp DP size
        const canvas = new Jimp(size, size, '#000000'); // black background, no blur

        image.contain(size, size); // Fit image with aspect ratio

        canvas.composite(image, (size - image.bitmap.width) / 2, (size - image.bitmap.height) / 2);

        const buffer = await canvas.getBufferAsync(Jimp.MIME_JPEG);

        await conn.updateProfilePicture(conn.user.id, buffer);

        m.reply('✅ *Original size ke saath profile picture set kar di gayi!*');
    } catch (err) {
        console.error(err);
        m.reply(`❌ *Error:* ${err.message}`);
    }
});
