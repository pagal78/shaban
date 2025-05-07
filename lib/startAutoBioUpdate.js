const moment = require('moment-timezone');
const config = require('../config');

const startAutoBioUpdate = async (conn) => { if (config.AUTO_BIO !== "true") return;

const bioList = [ "SHABAN-MD Online", "Bot by @shaban", "Zinda Hun Yar", "WhatsApp Automation", "Node.js Powered" ];

let index = 0; const intervalTime = 30000; // Fixed 30 seconds

setInterval(async () => { try { const time = moment().tz('Asia/Karachi').format('hh:mm A'); // 12-hour format const bio = ${bioList[index % bioList.length]} | ${time}; await conn.updateProfileStatus(bio); console.log("✅ Bio updated:", bio); index++; } catch (err) { console.error("❌ Bio update failed:", err); } }, intervalTime); };

module.exports = startAutoBioUpdate;
