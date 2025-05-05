// lib/helper/presenceManager.js
async function updatePresence(conn, jid, config, isOwner) {
    try {
        if (config.AUTO_OFFLINE === 'true') {
            await conn.sendPresenceUpdate('unavailable', jid);
            return 'unavailable';
        }

        if (config.ALWAYS_ONLINE === 'true') {
            await conn.sendPresenceUpdate('available', jid);
            return 'available';
        }

        if (config.PUBLIC_MODE === 'true') {
            if (isOwner) {
                await conn.sendPresenceUpdate('available', jid);
                return 'available';
            } else {
                await conn.sendPresenceUpdate('unavailable', jid);
                return 'unavailable';
            }
        }

        if (config.AUTO_TYPING === 'true') {
            await conn.sendPresenceUpdate('composing', jid);
            return 'typing';
        }

        if (config.AUTO_RECORDING === 'true') {
            await conn.sendPresenceUpdate('recording', jid);
            return 'recording';
        }

        return null;
    } catch (e) {
        console.error("Presence Error:", e);
        return null;
    }
}

module.exports = { updatePresence };
