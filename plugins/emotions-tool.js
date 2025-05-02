const { cmd } = require('../command');

cmd({
  pattern: "shy",
  desc: "Animated shy mode in one message",
  category: "tools",
  react: "😳",
  filename: __filename
},
async (conn, mek, m, { from }) => {
  try {
    const shyFrames = [
      "🙈",
      "🙈 Mujhe dekha tumne?",
      "😳 Main... main toh bas...",
      "🥺 Tumhari nazar se bach nahi paaya...",
      "😅 Ab kya bolun main...",
      "😶‍🌫️ Chup rehna hi behtar hai...",
      "💓 Dil dhadak raha hai...",
      "🤐 Yeh baat kisi se mat kehna...",
      "🙃 Tum pagal kar doge ek din...",
      "*Tum bahut dangerous ho...* 😳"
    ];

    // Send initial message
    const anim = await conn.sendMessage(from, { text: shyFrames[0] }, { quoted: mek });

    for (const frame of shyFrames) {
      await conn.sendPresenceUpdate("composing", from);
      await new Promise(r => setTimeout(r, 1400));

      await conn.relayMessage(
        from,
        {
          protocolMessage: {
            key: anim.key,
            type: 14,
            editedMessage: {
              conversation: frame
            }
          }
        },
        {}
      );
    }

    await conn.sendPresenceUpdate("paused", from);

  } catch (e) {
    console.log(e);
    await conn.sendMessage(from, { text: `❌ *Error:* ${e.message}` }, { quoted: mek });
  }
});