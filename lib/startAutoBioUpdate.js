const moment = require('moment-timezone');
const config = require('../config'); // Correct path for your setup

const startAutoBioUpdate = async (conn) => {
  if (config.AUTO_BIO !== "true") return;

  const bioList = [
    "SHABAN-MD Online",
    "Bot by @shaban",
    "Zinda Hun Yar",
    "WhatsApp Automation",
    "Node.js Powered"
  ];

  let index = 0;

  setInterval(async () => {
    try {
      const time = moment().tz('Asia/Karachi').format('hh:mm A');
      const bio = `${bioList[index % bioList.length]} | ${time}`;
      await conn.updateProfileStatus(bio);
      console.log("Bio updated:", bio);
      index++;
    } catch (err) {
      console.log("Bio update failed:", err.message);
    }
  }, 30000);  // 30 seconds interval
};

module.exports = startAutoBioUpdate;