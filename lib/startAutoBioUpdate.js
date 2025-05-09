const moment = require('moment-timezone');
const config = require('../config');

const startAutoBioUpdate = async (conn) => {
  if (config.AUTO_BIO !== "true") return;

  const bioList = [
    "『SHABAN-MD』 | Naam sunte hi hil jaate hain",
    "『SHABAN-MD』 | Samajh gaya na? Samjhdaar ko ishara kaafi",
    "『SHABAN-MD』 | Tera bhai bot hai, par aukaat wala",
    "『SHABAN-MD』 | Jitna dikh raha hoon, usse zyada dangerous hoon",
    "『SHABAN-MD』 | Banda nahi, system hoon main",
    "『SHABAN-MD』 | Mere against khade hone se pehle soch lena",
    "『SHABAN-MD』 | Bina attitude ke toh bio bhi nahi lagta",
    "『SHABAN-MD』 | Na command chhodi, na chance",
    "『SHABAN-MD』 | Akele chalta hoon, par level sabse upar hai",
    "『SHABAN-MD』 | Update main hota hoon, log download hote hain"
  ];

  let index = 0;

  setInterval(async () => {
    try {
      const seconds = moment().tz('Asia/Karachi').format('ss');
      const bio = `${bioList[index % bioList.length]} | ${seconds}s`;
      await conn.updateProfileStatus(bio);
      console.log("Bio updated:", bio);
      index++;
    } catch (err) {
      console.log("Bio update failed:", err.message);
    }
  }, 10000);  // 10 seconds interval
};

module.exports = startAutoBioUpdate;
