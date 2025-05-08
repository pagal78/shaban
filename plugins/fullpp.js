const { cmd } = require('../command');
const Jimp = require('jimp');

cmd({
    pattern: "fullpp",
    react: "🖼️",
    desc: "Set WhatsApp-style full DP (9:16 in square frame)",
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

        // Step 1: Resize original image to 720x1280 (9:16)
        const fgWidth = 720;
        const fgHeight = 1280;
        const fg = image.clone().resize(fgWidth, fgHeight);

        // Step 2: Create square canvas (1280x1280) with blurred background
        const canvasSize = 1280;
        const bg = image.clone().cover(canvasSize, canvasSize).blur(10);

        // Step 3: Paste original 9:16 image at center of blurred square
        const x = (canvasSize - fgWidth) / 2;
        const y = 0; // top aligned
        bg.composite(fg, x, y);

        const buffer = await bg.getBufferAsync(Jimp.MIME_JPEG);

        await conn.updateProfilePicture(conn.user.id, buffer);

        m.reply('✅ *Full size DP WhatsApp-style set kar di gayi hai!*');
    } catch (err) {
        console.error(err);
        m.reply(`❌ *Error:* ${err.message}`);
    }
});
