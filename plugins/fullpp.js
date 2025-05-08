const { cmd } = require('../command');
const axios = require('axios');
const Jimp = require('jimp');

cmd({
    pattern: "fullpp",
    react: "🖼️",
    desc: "Set full profile picture using optimized API method",
    category: "tools",
    filename: __filename
},
async (conn, mek, m) => {
    try {
        const quoted = m.quoted;

        if (!quoted || !quoted.mtype || !quoted.mtype.includes('image')) {
            return m.reply('⚠️ *Kisi image par reply karein.*');
        }

        m.reply('⏳ *Image ko optimize kar raha hoon...*');

        // Download and pre-process image
        const media = await conn.downloadMediaMessage(quoted);
        let image = await Jimp.read(media);
        
        // Resize to reduce file size (max width 1000px, maintain aspect ratio)
        image = image.resize(1000, Jimp.AUTO);
        
        // Convert to buffer with quality 85%
        const optimizedBuffer = await image.getBufferAsync(Jimp.MIME_JPEG, {
            quality: 85
        });

        // Convert to base64
        const base64Image = optimizedBuffer.toString('base64');

        // Send to API with timeout
        const response = await axios.post('https://fullpp-bandaheali.onrender.com/api/process', {
            image: base64Image
        }, {
            responseType: 'arraybuffer',
            timeout: 30000 // 30 seconds timeout
        });

        const buffer = Buffer.from(response.data, 'binary');
        await conn.updateProfilePicture(conn.user.id, buffer);

        m.reply('✅ *Full DP set ho gayi hai!*');

    } catch (err) {
        console.error(err);
        
        // Fallback to local processing if API fails
        try {
            m.reply('⚠️ API issue, local processing kar raha hoon...');
            const media = await conn.downloadMediaMessage(quoted);
            const image = await Jimp.read(media);
            const processed = await image.resize(640, 1280);
            const buffer = await processed.getBufferAsync(Jimp.MIME_JPEG);
            await conn.updateProfilePicture(conn.user.id, buffer);
            m.reply('✅ *Local method se full DP set ho gayi!*');
        } catch (fallbackErr) {
            m.reply(`❌ Dono methods fail: ${fallbackErr.message}`);
        }
    }
});
