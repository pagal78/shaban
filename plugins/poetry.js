const { cmd } = require('../command'); // Adjusted to your actual path

const poetryList = [
  'محبت میں کوئی فرمائش نہ کرنا\nمیری غربت کی پھر نمائش نہ کرنا',
  'یادیں ہی رہ گئی ہیں تمہاری،\nورنہ ہم نے تو تمہیں بھلا دیا تھا۔',
  'توٹا ہو دل تو دکھ ہوتا ہے\nکر کے محبت کسی سے یہ دل روتا ہے',
  'دھوکہ دینا فن ہے\nاور تم فنکار نکلے',
  'وفا کے نام پر کیا کیا سہا ہم نے\nجیسے بے وفا ہونا جرم نہ ہو',
  'خاموشیاں بہت کچھ کہہ جاتی ہیں\nدل کی بات زبان تک نہیں آتی'
];

cmd({
  pattern: "poetry",
  use: ".poetry",
  desc: "Random Urdu 2-line poetry",
  category: "fun",
  react: "📜",
  filename: __filename
},
async (conn, mek, m, { from, reply }) => {
  try {
    const randomPoetry = poetryList[Math.floor(Math.random() * poetryList.length)];

    await conn.sendMessage(from, {
      text: randomPoetry
    }, { quoted: mek });

  } catch (e) {
    console.error("Error in poetry command:", e);
    reply("❌ Poetry command crashed.");
  }
});
