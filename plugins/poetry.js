const { cmd } = require('../lib/command');
const { createCanvas } = require('canvas');
const { Sticker, StickerTypes } = require('wa-sticker-formatter');

// Aap yahan jitni marzi poetry lines add kar sakte hain
const poetryLines = [
  'محبت اگر چہ خواب ہے، حقیقتوں کا رنگ رکھتی ہے',
  'ہمیں خبر ہے کہ ہم کچھ نہیں، مگر تمھاری کمی بہت ہے',
  'یادیں وہ خزانہ ہیں جو وقت کے ساتھ قیمتی ہوتا جاتا ہے',
  'دل وہ مسافر ہے جو کبھی منزل پر نہیں رکتا',
  'خاموشی بھی ایک زبان ہے، اور یہ اکثر وہ سب کہہ دیتی ہے جو الفاظ نہیں کہہ سکتے',
  'ہم نے خوابوں میں بھی تیری خوشبو محسوس کی ہے',
  'دھوکہ دینے والوں کو معاف کرنا ہی سب سے بڑا بدلہ ہے',
  'تیرا نام لبوں پر آتے ہی مسکراہٹ سی چھا جاتی ہے',
];

cmd({
  pattern: 'poetry',
  desc: 'Random Urdu poetry sticker',
  category: 'fun',
  use: '.poetry',
}, async ({ conn, m }) => {
  try {
    const text = poetryLines[Math.floor(Math.random() * poetryLines.length)];
    const canvas = createCanvas(512, 512);
    const ctx = canvas.getContext('2d');

    // Background white
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Urdu text settings
    ctx.fillStyle = '#000000';
    ctx.font = '28px sans-serif'; // Font-free version
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Break lines if long
    const lines = text.match(/.{1,25}/g);
    lines.forEach((line, i) => {
      ctx.fillText(line, canvas.width / 2, 200 + i * 40);
    });

    // Create sticker
    const buffer = canvas.toBuffer();
    const sticker = new Sticker(buffer, {
      pack: 'SHABAN-MD',
      author: 'Poetry Bot',
      type: StickerTypes.FULL,
      quality: 75,
      background: 'transparent',
    });

    const stickerBuffer = await sticker.toBuffer();
    await conn.sendMessage(m.chat, { sticker: stickerBuffer }, { quoted: m });

  } catch (e) {
    console.error('Poetry sticker error:', e);
    m.reply('Sticker banate waqt error aaya.');
  }
});
