const { cmd } = require('../command');
const Jimp = require('jimp');

cmd({
    pattern: "fullpp",
    react: "🖼️",
    desc: "Set full image (uncropped) as bot's profile picture",
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
        const image = await Jimp.read(media);

        const size = 640;
        const bg = new Jimp(size, size, '#000000'); // black background

        // Resize image to fit inside the square while keeping aspect ratio
        image.contain(size, size); 

        // Center the image on the black background
        bg.composite(image, (size - image.bitmap.width) / 2, (size - image.bitmap.height) / 2);

        const buffer = await bg.getBufferAsync(Jimp.MIME_JPEG);
        await conn.updateProfilePicture(conn.user.id, buffer);

        m.reply('✅ *Image full size ke sath black background mein set kar di gayi!*');
    } catch (err) {
        console.error(err);
        m.reply(`❌ *Error:* ${err.message}`);
    }
});
