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
    console.log("[fullpp] Command triggered"); // Debug

    try {
        if (!/image/.test(mime)) {
            console.log("[fullpp] Not an image");
            return m.reply('⚠️ *Kisi image par reply karein jise full DP banana hai.*');
        }

        m.reply('⏳ *Image process ho rahi hai, please wait...*');
        const media = await quoted.download();
        console.log("[fullpp] Image downloaded");

        const image = await Jimp.read(media);
        console.log("[fullpp] Image loaded into Jimp");

        const size = 640;
        const bg = image.clone().cover(size, size).blur(10);
        const fg = image.clone().contain(size, size);

        bg.composite(fg, 0, 0);
        console.log("[fullpp] Image composed");

        const buffer = await bg.getBufferAsync(Jimp.MIME_JPEG);
        await conn.updateProfilePicture(conn.user.id, buffer);

        console.log("[fullpp] Profile picture updated");
        m.reply('✅ *Bot ki profile picture full DP format mein set kar di gayi!*');
    } catch (err) {
        console.error("[fullpp] ERROR:", err);
        m.reply(`❌ *Kuch error aaya:* ${err.message}`);
    }
});
