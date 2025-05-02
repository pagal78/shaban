const { cmd } = require('../command');

cmd({
  pattern: "shy",
  desc: "Shy animated emoji message with typing and fun",
  category: "tools",
  react: "😳",
  filename: __filename
},
async (conn, mek, m, { from }) => {
  try {
    const shyLines = [
      { emoji: "😳", line: "Kya dekh rahe ho...?" },
      { emoji: "😊", line: "Thoda sharma gaya hoon..." },
      { emoji: "😶", line: "Kuch keh bhi nahi sakta..." },
      { emoji: "🙈", line: "Aankhein band kar lo..." },
      { emoji: "🙊", line: "Mujhse baat mat karo ab..." },
    ];

    let lastMsg = null;

    for (const { emoji, line } of shyLines) {
      // Typing simulation
      await conn.sendPresenceUpdate("composing", from);
      await new Promise(res => setTimeout(res, 700));

      // Delete previous message
      if (lastMsg) {
        await conn.sendMessage(from, { delete: lastMsg.key });
      }

      // Send new animated message
      const msg = await conn.sendMessage(from, { text: `*Shy Mode:* ${emoji}\n_${line}_` }, { quoted: mek });
      lastMsg = msg;

      await new Promise(r => setTimeout(r, 1200));
    }

    await conn.sendPresenceUpdate("paused", from);

    // Final funny line
    await conn.sendMessage(from, { text: "*Bas ab zyada sharma mat ja!* 😅" }, { quoted: mek });

  } catch (e) {
    console.log(e);
    await conn.sendMessage(from, { text: `❌ *Error:* ${e.message}` }, { quoted: mek });
  }
});