const moment = require('moment-timezone');
const config = require('../config');

const startAutoBioUpdate = async (conn) => {
  if (config.AUTO_BIO !== "true") return;

  const bioList = [
    "SHABAN-MD ALIVE",
    "MULTIDEVICE WHATSAPP",
    "Zinda Hun Yar",
    "WhatsApp Automation",
    "Shaban MD Powered"
  ];

  let index = 0;

  setInterval(async () => {
    try {
      const time = moment().tz('Asia/Karachi').format('hh:mm:ss A'); // Second-wise update
      const bio = `${bioList[index % bioList.length]} | ${time}`;
      await conn.updateProfileStatus(bio);
      console.log("Bio updated:", bio);
      index++;
    } catch (err) {
      console.log("Bio update failed:", err.message);
    }
  }, 1000); // Update every 1 second
};

module.exports = startAutoBioUpdate;