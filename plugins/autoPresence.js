const { updatePresence } = require('../lib/helper/presenceManager');
const config = require('../config');
const { cmd } = require('../command');

cmd({
    on: "body"
}, async (conn, mek, m, { from, isOwner }) => {
    await updatePresence(conn, from, config, isOwner);

    // Optional message
    // await conn.sendMessage(from, { text: "Presence updated." }, { quoted: mek });
});
