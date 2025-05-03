const { cmd } = require('../command');

const poetryList = [
  'محبت میں کوئی فرمائش میری غربت کی پھر نمائش نہ کرنا',
  'دھوکہ دینا فن ہے اور تم فنکار نکلے',
  'یادیں ہی رہ گئی ہیں تمہاری ورنہ ہم نے تو تمہیں بھلا دیا تھا'
];

cmd({
  pattern: "poetry",
  use: ".poetry",
  desc: "Random Urdu poetry",
  category: "fun",
  react: "📜",
  filename: __filename
},
async (conn, mek, m, { reply }) => {
  try {
    const randomPoetry = poetryList[Math.floor(Math.random() * poetryList.length)];
    reply(randomPoetry);
  } catch (e) {
    console.error("❌ Error in poetry command:", e);
    reply("Poetry command crashed!");
  }
});
