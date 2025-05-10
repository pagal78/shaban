const { cmd } = require("../command");

cmd({
  pattern: "vv5",
  alias: ["secret", 'dm'],
  react: '🪀',
  desc: "Forwards quoted message to bot user's DM",
  category: "utility",
  filename: __filename
}, async (client, message, match, { from }) => {
  try {
    // Only the user on which bot is active can use this
    if (message.sender !== client.user.id) {
      return await client.sendMessage(from, {
        text: "❌ *Access Denied:* Only the bot's own user can use this command."
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

    // Always forward to bot's own DM (client.user.id)
    await client.sendMessage(client.user.id, messageContent, options);

    await client.sendMessage(from, {
      text: "✅ Media has been sent to your DM!"
    }, { quoted: message });

  } catch (error) {
    console.error("Forward Error:", error);
    await client.sendMessage(from, {
      text: "❌ Error forwarding message:\n" + error.message
    }, { quoted: message });
  }
});
