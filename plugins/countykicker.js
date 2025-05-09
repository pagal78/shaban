const { cmd } = require('../command');
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

cmd({
    pattern: "kickco",
    alias: ["removecountry"],
    desc: "Remove non-admin group members by country code.",
    react: "🌍",
    category: "group",
    filename: __filename,
},
async (conn, mek, m, {
    from, groupMetadata, groupAdmins, isBotAdmins, senderNumber, reply, isGroup
}) => {
    try {
        if (!isGroup) return reply("This command can only be used in groups.");

        const botOwner = conn.user.id.split(":")[0];
        if (senderNumber !== botOwner) return reply("Only the bot owner can use this command.");

        if (!isBotAdmins) return reply("I need to be an admin to do this.");

        const countryCode = m.text.split(" ")[1]?.replace("+", "").trim();
        if (!countryCode || isNaN(countryCode)) {
            return reply("Please provide a valid country code. Example: `.kickcountry +91`");
        }

        const allParticipants = groupMetadata.participants;
        const nonAdmins = allParticipants.filter(p => !groupAdmins.includes(p.id));
        const toRemove = nonAdmins.filter(p => p.id.split('@')[0].startsWith(countryCode));

        if (toRemove.length === 0) {
            return reply(`No non-admin members found with country code +${countryCode}`);
        }

        reply(`Removing ${toRemove.length} members from +${countryCode}...`);

        for (let participant of toRemove) {
            try {
                await conn.groupParticipantsUpdate(from, [participant.id], "remove");
                await sleep(2000);
            } catch (e) {
                console.error(`Failed to remove ${participant.id}:`, e);
            }
        }

        reply(`Removed all non-admin members with country code +${countryCode}`);
    } catch (e) {
        console.error("Error:", e);
        reply("An error occurred while trying to remove members. Please try again.");
    }
});
