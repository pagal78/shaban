const { cmd } = require('../command');
const Jimp = require('jimp');

cmd({
    pattern: "fullpp",
    react: "🖼️",
    desc: "Set uncropped full image as profile photo with black padding",
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

        const size = 640;
        const background = new Jimp(size, size, "#000000"); // black bg
        original.contain(size, size); // maintain full image

        const x = (size - original.bitmap.width) / 2;
        const y = (size - original.bitmap.height) / 2;

        background.composite(original, x, y);

        const buffer = await background.getBufferAsync(Jimp.MIME_JPEG);
        await conn.updateProfilePicture(conn.user.id, buffer);

        m.reply("✅ *Image full size ke sath profile pe set ho gayi!*");
    } catch (err) {
        console.error(err);
        m.reply(`❌ *Error:* ${err.message}`);
    }
});
