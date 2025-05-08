const { cmd } = require('../command');
const Jimp = require('jimp');

cmd({
    pattern: "fullpp",
    react: "🖼️",
    desc: "Set full image as bot's profile picture",
    category: "tools",
    filename: __filename
},
async (conn, mek, m, { quoted, mime }) => {
    try {
        if (!/image/.test(mime)) return m.reply('⚠️ *Kisi image par reply karein jise full DP banana hai.*');

        m.reply('⏳ *Image process ho rahi hai, please wait...*');

        const media = await quoted.download();
        const image = await Jimp.read(media);

        const size = 640; // WhatsApp DP size
        const bg = image.clone().cover(size, size).blur(10);  // blur background
        const fg = image.clone().contain(size, size);         // original image center mein

        bg.composite(fg, 0, 0);

        const buffer = await bg.getBufferAsync(Jimp.MIME_JPEG);

        await conn.updateProfilePicture(conn.user.id, buffer);

        m.reply('✅ *Bot ki profile picture full DP format mein set kar di gayi!*');
    } catch (err) {
        console.error(err);
        m.reply(`❌ *Kuch error aaya:* ${err.message}`);
    }
});
