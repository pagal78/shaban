const { cmd } = require("../command");
const { OWNER_NUMBER } = require("../config"); // config file ka path theek rakhna

cmd({
  pattern: "vv6",
  alias: ["secret", 'dm'],
  react: '🪀',
  desc: "Forwards quoted message to your DM",
  category: "utility",
  filename: __filename
}, async (client, message, match, { from }) => {
  try {
    const ownerJID = OWNER_NUMBER.includes("@s.whatsapp.net") ? OWNER_NUMBER : OWNER_NUMBER + "@s.whatsapp.net";

    // Only allow the owner
    if (message.sender !== ownerJID) {
      return await client.sendMessage(from, {
        text: "❌ *Only the bot owner can use this command!*"
      }, { quoted: message });
    }

    if (!match.quoted) {
      return await client.sendMessage(from, {
        text: "*🍁 Please reply to a message!*"
      }, { quoted: message });
    }

    const buffer = await match.quoted.download();
    const mtype = match.quoted.mtype;
    const options = { quoted: message };

    let messageContent = {};
    switch (mtype) {
      case "imageMessage":
        messageContent = {
          image: buffer,
          caption: match.quoted.text || '',
          mimetype: match.quoted.mimetype || "image/jpeg"
        };
        break;
      case "videoMessage":
        messageContent = {
          video: buffer,
          caption: match.quoted.text || '',
          mimetype: match.quoted.mimetype || "video/mp4"
        };
        break;
      case "audioMessage":
        messageContent = {
          audio: buffer,
          mimetype: "audio/mp4",
          ptt: match.quoted.ptt || false
        };
        break;
      default:
        return await client.sendMessage(from, {
          text: "❌ Only image, video, and audio messages are supported"
        }, { quoted: message });
    }

    await client.sendMessage(message.sender, messageContent, options);
    await client.sendMessage(from, { text: "✅ Sent to your DM!" }, { quoted: message });
  } catch (error) {
    console.error("Forward Error:", error);
    await client.sendMessage(from, {
      text: "❌ Error forwarding message:\n" + error.message
    }, { quoted: message });
  }
});
