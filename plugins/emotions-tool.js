const { cmd } = require('../command');

cmd({
  pattern: "shy",
  desc: "Fun shy conversation with emotion",
  category: "tools",
  react: "🙈",
  filename: __filename
},
async (conn, mek, m, { from }) => {
  try {
    const shyDialogues = [
      "🙈: Mujhe dekha tumne?",
      "😳: Main... main toh bas...",
      "🥺: Tumhari nazar se bach nahi paaya...",
      "😅: Ab kya bolun main...",
      "😶‍🌫️: Chup rehna hi behtar hai...",
      "💓: Dil dhadak raha hai...",
      "🤐: Yeh baat kisi se mat kehna...",
      "🙃: Tum pagal kar doge ek din..."
    ];

    for (const line of shyDialogues) {
      await conn.sendPresenceUpdate("composing", from);
      await new Promise(r => setTimeout(r, 1000));

      await conn.sendMessage(from, { text: line }, { quoted: mek });
      await new Promise(r => setTimeout(r, 1500));
    }

    await conn.sendPresenceUpdate("paused", from);

    // Final message
    await conn.sendMessage(from, { text: "*Shy Level Maxed Out! Tum bahut dangerous ho...* 😳" }, { quoted: mek });

  } catch (e) {
    console.log(e);
    await conn.sendMessage(from, { text: `❌ *Error:* ${e.message}` }, { quoted: mek });
  }
});