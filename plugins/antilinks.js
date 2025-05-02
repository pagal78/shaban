const { cmd } = require('../command');
const config = require("../config");


// Anti-Bad Words System
cmd({
  'on': "body"
}, async (conn, m, store, {
  from,
  body,
  isGroup,
  isAdmins,
  isBotAdmins,
  reply,
  sender
}) => {
  try {
    const badWords = ["wtf", "mia", "xxx", "fuck", 'sex', "huththa", "pakaya", 'ponnaya', "hutto"];

    if (!isGroup || isAdmins || !isBotAdmins) {
      return;
    }

    const messageText = body.toLowerCase();
    const containsBadWord = badWords.some(word => messageText.includes(word));

    if (containsBadWord && config.ANTI_BAD_WORD === 'true') {
      await conn.sendMessage(from, { 'delete': m.key }, { 'quoted': m });
      await conn.sendMessage(from, { 'text': "🚫 ⚠️ BAD WORDS NOT ALLOWED ⚠️ 🚫" }, { 'quoted': m });
    }
  } catch (error) {
    console.error(error);
    reply("An error occurred while processing the message.");
  }
});

// Anti-Link System
const linkPatterns = [
  /https?:\/\/\S+/gi // Yeh kisi bhi "http" ya "https" se start hone wale link ko pakdega
];

cmd({
  on: "body"
}, async (conn, m, store, {
  from,
  body,
  sender,
  isGroup,
  isAdmins,
  isBotAdmins,
  reply
}) => {
  try {
    if (!isGroup || isAdmins || !isBotAdmins) return;

    // Detect link in message
    const linkPatterns = [/https?:\/\/\S+/];
    const containsLink = linkPatterns.some(pattern => pattern.test(body));

    if (containsLink && config.ANTI_LINK === 'true') {
      console.log(`Link detected from ${sender}: ${body}`);

      // Delete the message
      try {
        await conn.sendMessage(from, { delete: m.key });
        console.log(`Message deleted: ${m.key.id}`);
      } catch (deleteError) {
        console.error("Failed to delete message:", deleteError);
      }

      // Inform group and remove user
      await conn.sendMessage(from, {
        text: `🚫SHABAN-MD @${sender.split('@')[0]} sent a link and has been removed.`,
        mentions: [sender]
      });

      await conn.groupParticipantsUpdate(from, [sender], "remove");
    }
  } catch (error) {
    console.error("Anti-link error:", error);
    reply("❌ An error occurred while processing the anti-link command.");
  }
});