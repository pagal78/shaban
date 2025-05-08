const { cmd } = require('../command');
const Jimp = require('jimp');

cmd({
    pattern: "fullpp",
    react: "🖼️",
    desc: "WhatsApp Full Profile Picture بغیر کسی پس منظر کے",
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
        const image = await Jimp.read(media);
        
        // WhatsApp Full DP سائز (640x1280)
        const processedImage = await image
            .cover(640, 1280) // 9:16 ریشو میں کراپ کریں
            .quality(80); // فائل سائز کم کریں

        const buffer = await processedImage.getBufferAsync(Jimp.MIME_JPEG);
        await conn.updateProfilePicture(conn.user.id, buffer);

        m.reply("✅ کامیابی! آپ کا پروفائل پکچر فل ڈی پی میں سیٹ ہو گیا ہے۔");

    } catch (err) {
        console.error(err);
        m.reply(`❌ خرابی: ${err.message}\n\n⚠️ اگر مسئلہ جاری رہے تو تصویر کو دستی طور پر 640x1280 پکسلز کی JPEG میں تبدیل کر کے دوبارہ کوشش کریں۔`);
    }
});
