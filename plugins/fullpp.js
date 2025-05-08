const { cmd } = require('../command');
const sharp = require('sharp');

cmd({
    pattern: "fullpp",
    react: "📸",
    desc: "WhatsApp Full DP (9:16 Ratio) - Sharp.js",
    category: "tools",
    filename: __filename
},
async (conn, mek, m) => {
    try {
        const quoted = m.quoted;
        if (!quoted || !quoted.mtype.includes('image')) {
            return m.reply("⚠️ براہ کرم کسی تصویر پر ریپلائی کریں۔");
        }

        m.reply("⏳ تصویر کو فل ڈی پی میں تبدیل کیا جا رہا ہے...");

        const media = await conn.downloadMediaMessage(quoted);
        
        // Sharp کے ساتھ تصویر پروسیس کریں
        const buffer = await sharp(media)
            .resize(640, 1280, {  // بالکل 9:16 ریشو
                fit: 'cover',     // تصویر کو کراپ کریں
                position: 'center' // درمیان سے فوکس کریں
            })
            .jpeg({              // JPEG میں کنورٹ کریں
                quality: 80,      // کوالٹی کم کریں
                mozjpeg: true     // بہترین کمپریشن
            })
            .toBuffer();

        // صارف کو تصویر بھیجیں (کیونکہ بوٹ پروفائل نہیں بدل سکتا)
        await conn.sendMessage(m.chat, { 
            image: buffer, 
            caption: "✅ *یہ تصویر WhatsApp Full DP کے لیے تیار ہے!*\n\nاسے ڈاؤنلوڈ کریں اور اپنے پروفائل پر سیٹ کریں۔" 
        });

    } catch (err) {
        console.error(err);
        m.reply("❌ تصویر پروسیس نہیں ہو سکی۔ Sharp.js انسٹال ہے؟");
    }
});
