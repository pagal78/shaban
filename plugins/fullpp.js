const { cmd } = require('../command');
const Jimp = require('jimp');

cmd({
    pattern: "fullpp",
    react: "🖼️",
    desc: "Set full zoomed image as profile picture",
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

        const maxSize = 640;
        const zoomed = original.cover(maxSize, maxSize, Jimp.HORIZONTAL_ALIGN_CENTER | Jimp.VERTICAL_ALIGN_MIDDLE);

        const buffer = await zoomed.getBufferAsync(Jimp.MIME_JPEG);
        await conn.updateProfilePicture(conn.user.id, buffer);

        m.reply('✅ *Profile picture zoomed original size ke sath set kar di gayi!*');
    } catch (err) {
        console.error(err);
        m.reply(`❌ *Error:* ${err.message}`);
    }
});
