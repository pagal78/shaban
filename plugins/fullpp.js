const { cmd } = require('../command');
const Jimp = require('jimp');

cmd({
    pattern: "fullpp",
    react: "🖼️",
    desc: "Set WhatsApp-style full DP (9:16 ratio without blur background)",
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

        // Step 1: Resize original image to 720x1280 (9:16 ratio)
        const fgWidth = 720;
        const fgHeight = 1280;
        const processedImage = image.resize(fgWidth, fgHeight);

        // Step 2: Create white background canvas (1280x1280)
        const canvasSize = 1280;
        const bg = new Jimp(canvasSize, canvasSize, 0xFFFFFFFF); // White background
        
        // Step 3: Paste 9:16 image centered on white background
        const x = (canvasSize - fgWidth) / 2;
        const y = (canvasSize - fgHeight) / 2;
        bg.composite(processedImage, x, y);

        const buffer = await bg.getBufferAsync(Jimp.MIME_JPEG);

        await conn.updateProfilePicture(conn.user.id, buffer);

        m.reply('✅ *Full size DP (9:16 ratio) set kar di gayi hai!*');
    } catch (err) {
        console.error(err);
        m.reply(`❌ *Error:* ${err.message}`);
    }
});
