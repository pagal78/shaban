const { cmd } = require('../command');
const axios = require('axios');

cmd({
    pattern: "fullpp",
    react: "🖼️",
    desc: "Set full profile picture using BandaheAli API",
    category: "tools",
    filename: __filename
},
async (conn, mek, m) => {
    try {
        const quoted = m.quoted;

        if (!quoted || !quoted.mtype || !quoted.mtype.includes('image')) {
            return m.reply('⚠️ *Kisi image par reply karein.*');
        }

        m.reply('⏳ *BandaheAli API se image process ho rahi hai...*');

        // Download the image
        const media = await conn.downloadMediaMessage(quoted);
        
        // Convert to base64
        const base64Image = media.toString('base64');

        // Send to BandaheAli API
        const response = await axios.post('https://fullpp-bandaheali.onrender.com/api/process', {
            image: base64Image
        }, {
            responseType: 'arraybuffer'
        });

        // Get processed image
        const buffer = Buffer.from(response.data, 'binary');

        // Set profile picture
        await conn.updateProfilePicture(conn.user.id, buffer);

        m.reply('✅ *Full DP (BandaheAli API) set kar di gayi hai!*');

    } catch (err) {
        console.error(err);
        m.reply(`❌ *Error:* ${err.message}`);
    }
});
