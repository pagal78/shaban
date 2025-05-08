const { cmd } = require('../command');
const Jimp = require('jimp');

cmd({
    pattern: "fullpp",
    react: "🖼️",
    desc: "Set full image as bot's profile picture (adjusted for full DP)",
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

        const fgWidth = 720;
        const fgHeight = 1280;

        const canvasSize = 1280; // square canvas (1:1)
        const bg = new Jimp(canvasSize, canvasSize);

        const blurred = image.clone().cover(canvasSize, canvasSize).blur(10);
        bg.composite(blurred, 0, 0);

        const fg = image.clone().contain(fgWidth, fgHeight);
        const x = (canvasSize - fgWidth) / 2;
        const y = (canvasSize - fgHeight) / 2;

        bg.composite(fg, x, y);

        const buffer = await bg.getBufferAsync(Jimp.MIME_JPEG);

        await conn.updateProfilePicture(conn.user.id, buffer);

        m.reply('✅ *Bot ki profile picture 9:16 format ke saath set ho gayi (full view).*');
    } catch (err) {
        console.error(err);
        m.reply(`❌ *Error:* ${err.message}`);
    }
});
