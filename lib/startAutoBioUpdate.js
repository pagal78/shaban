const moment = require('moment-timezone');
const config = require('../config');

const startAutoBioUpdate = async (conn) => {
  if (config.AUTO_BIO !== "true") return;

  const bioList = [
    "بِسـٜـٜـٜـٜـٜمِ ٱللـّٰـہِ ٱلرَّحـٜـٜـٜـٜـٜيمِ",
    "اَسـٜـٜـٜـٜـٜلامُ عَليـٜـٜـٜـٜـٜکمُ",
    "ٱلـحَـمـدُ لِلّٰـه",
    "سُـبـحَـانَ ٱللّٰـه",
    "ٱللّٰـهُ أَكـبـر",
    "أستَغفِرُ ٱللّٰـه",
    "لَا إِلٰهَ إِلَّا ٱللّٰـهُ، مُحَمَّدٌ رَّسُولُ ٱللّٰـهِ",
    "『SHABAN-MD』 | Alive 24/⁷ Simple Bot"
  ];

  let index = 0;

  setInterval(async () => {
    try {
      const bio = bioList[index % bioList.length]; // Time removed here
      await conn.updateProfileStatus(bio);
      console.log("Bio updated:", bio);
      index++;
    } catch (err) {
      console.log("Bio update failed:", err.message);
    }
  }, 10000);  // 10 seconds interval
};

module.exports = startAutoBioUpdate;
