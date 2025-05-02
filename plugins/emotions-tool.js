const { cmd } = require('../command');

cmd({
  pattern: "shy",
  desc: "Random shy poetry with animation",
  category: "tools",
  react: "💘",
  filename: __filename
},
async (conn, mek, m, { from }) => {
  try {
    const shyLines = [
      "🙈 Tumhe dekh kar kuch kehne ka dil karta hai...",
      "😳 Par har baar zubaan sharm se ruk jaati hai...",
      "🥺 Tere naam pe kuch likhne chala tha...",
      "😅 Magar lafz bhi sharma gaye...",
      "💓 Har baar dil kehta hai, 'kuch toh bol'...",
      "😶‍🌫️ Par aankhon ki khamoshi sab keh jaati hai...",
      "🤐 Kya tum bhi mehsoos karte ho kuch...?",
      "🙃 Ya main hi hoon jo pagal ho raha hoon...",
      "🌸 Tumhari muskurahat meri kamzori ban gayi hai...",
      "❤️ Main chup hoon, par dil sab keh raha hai...",
      "👀 Tumhari ek nazar, aur main fida...",
      "✨ Tumhara naam sunte hi chehra muskara jaata hai...",
      "🤯 Kabhi kabhi sochta hoon, itni feelings kyun hain...",
      "🥹 Tujhse baat na ho toh din adhoora lagta hai...",
      "🤎 Tum khwabon mein bhi sharmaane lagte ho...",
      "🫣 Main toh tere reply ka intezar karta hoon har waqt..."
    ];

    // Random 8 lines
    const selectedLines = shyLines.sort(() => 0.5 - Math.random()).slice(0, 8);
    selectedLines.push("*Tum itne cute kyun ho?* 😳"); // Final punch line

    let lastMsg;

    for (const line of selectedLines) {
      await conn.sendPresenceUpdate("composing", from);
      await new Promise(r => setTimeout(r, 800));

      if (lastMsg) {
        await conn.sendMessage(from, { delete: lastMsg.key });
        await new Promise(r => setTimeout(r, 200));
      }

      lastMsg = await conn.sendMessage(from, { text: line }, { quoted: mek });
      await new Promise(r => setTimeout(r, 1300));
    }

    await conn.sendPresenceUpdate("paused", from);

  } catch (e) {
    console.log(e);
    await conn.sendMessage(from, { text: `❌ *Error:* ${e.message}` }, { quoted: mek });
  }
});