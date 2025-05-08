const { cmd } = require('../command');

cmd({
    pattern: "fullpp",
    react: "✅",
    desc: "Test image download",
    category: "tools",
    filename: __filename
},
async (conn, mek, m) => {
    try {
        const quoted = m.quoted;

        if (!quoted || !quoted.mtype || !quoted.mtype.includes('image')) {
            return m.reply('⚠️ *Kisi image par reply karein.*');
        }

        m.reply('⏳ *Image mil gayi, download ho rahi hai...*');

        const media = await conn.downloadMediaMessage(quoted);

        if (!media) return m.reply('❌ *Image download fail hua.*');

        await conn.sendMessage(m.chat, {
            image: media,
            caption: '✅ *Image download successful.*'
        }, { quoted: mek });

    } catch (err) {
        console.error(err);
        m.reply(`❌ Error: ${err.message}`);
    }
});
