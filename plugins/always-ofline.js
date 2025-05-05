const config = require('../config');
const { cmd } = require('../command');

// Presence Control (Always/Offline)

cmd({
  on: "body"
}, async (conn, mek, m, { from }) => {
  try {
    if (config.ALWAYS_OFFLINE === "true") {
      // Bot ko hamesha offline dikhaye
      await conn.sendPresenceUpdate("unavailable", from);
    }
    // Agar false hai to kuch na kare → WhatsApp apna presence khud handle karega
  } catch (e) {
    console.error("[Always Offline Error]", e);
  }
});