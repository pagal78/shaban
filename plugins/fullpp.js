const { cmd } = require('../command');

cmd({
    pattern: "fullpp",
    react: "✅",
    desc: "Test image download",
    category: "tools",
    filename: __filename
},
async (conn, mek, m, { quoted, mime }) => {
    try {
        if (!/image/.test(mime)) return m.reply('⚠️ *Kisi image par reply karein.*');

        m.reply('⏳ *Testing image download...*');
        const media = await quoted.download();

        if (!media) {
            return m.reply('❌ *Image download failed.*');
        }

        await conn.sendMessage(m.chat, { image: media, caption: '✅ *Image download successful.*' }, { quoted: mek });
    } catch (err) {
        console.error(err);
        m.reply(`❌ Error: ${err.message}`);
    }
});
