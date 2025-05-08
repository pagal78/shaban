const { fetchJson } = require("../lib/functions");
const { downloadTiktok } = require("@mrnima/tiktok-downloader");
const { facebook } = require("@mrnima/facebook-downloader");
const cheerio = require("cheerio");
const { igdl } = require("ruhend-scraper");
const axios = require("axios");
const { cmd, commands } = require('../command');

cmd({
    pattern: "ig",
    alias: ["insta", "instagram"],
    desc: "Download Instagram video",
    category: "downloader",
    react: "📷",
    filename: __filename
},
async (conn, mek, m, { from, args, q, reply }) => {
    try {
        if (!q) return reply("Please provide an Instagram video link.");
        if (!q.includes("instagram.com")) return reply("Invalid Instagram link.");
        
        reply("Downloading video, please wait...");
        
        const apiUrl = `https://rest-lily.vercel.app/api/downloader/igdl?url=${q}`;
        const { data } = await axios.get(apiUrl);
        
        if (!data.status || !data.data || !data.data[0]) return reply("Failed to fetch Instagram video.");
        
        const { url } = data.data[0];
        
        const caption = 
`📷 *Instagram Video* 📷\n\n` +
`👤 *Creator* *SHABAN MD*`;
        
        await conn.sendMessage(from, {
            video: { url: url },
            caption: caption,
            contextInfo: { mentionedJid: [m.sender] }
        }, { quoted: mek });
        
    } catch (e) {
        console.error("Error in Instagram downloader command:", e);
        reply(`An error occurred: ${e.message}`);
    }
});

cmd({ 'pattern': "tiktok", 'alias': ['tt'], 'react': '🎥', 'desc': "download tt videos", 'category': "download", 'filename': __filename }, async (conn, m, store, { from, quoted, q, reply }) => { try { if (!q || !q.startsWith('https://')) { return reply("Need a valid TikTok URL"); }

store.react('⬇️');

let response = await fetch(`https://bk9.fun/download/tiktok2?url=${encodeURIComponent(q)}`);
let jsonData = await response.json();

if (!jsonData.status) {
  return reply("*Failed to fetch video. Please try again later.*");
}

let tiktokData = jsonData.BK9;
let captionMessage = `

𝗧𝗜𝗞𝗧𝗢𝗞 𝗗𝗢𝗪𝗡𝗟𝗢𝗔𝗗𝗘𝗥 🎥
┃▸Title: ${tiktokData.description || 'No title'} 
┃▸Username:${tiktokData.username} 
┃▸Plays:${tiktokData.played} 
┃▸Comments:${tiktokData.commented} 
┃▸Saves:${tiktokData.saved} 
┃▸Shares:${tiktokData.shared}

🎥 1. No Watermark 
🎥 2. With Watermark 
🎵 3. Audio Only `;

const sentMessage = await conn.sendMessage(from, {
  'image': { 'url': tiktokData.thumbnail },
  'caption': captionMessage
});

const messageID = sentMessage.key.id;

conn.ev.on("messages.upsert", async message => {
  const receivedMessage = message.messages[0];
  if (!receivedMessage.message) return;

  const userResponse = receivedMessage.message.conversation || receivedMessage.message.extendedTextMessage?.text;
  const chatID = receivedMessage.key.remoteJid;
  const isReplyToBotMessage = receivedMessage.message.extendedTextMessage &&
                              receivedMessage.message.extendedTextMessage.contextInfo.stanzaId === messageID;

  if (isReplyToBotMessage) {
    await conn.sendMessage(chatID, { 'react': { 'text': '⬇️', 'key': receivedMessage.key } });

    let downloadLinks = tiktokData.video;

    if (userResponse === '1') {
      await conn.sendMessage(chatID, {
        'video': { 'url': downloadLinks.noWatermark },
        'caption': "*Downloaded SHABAN-MD*"
      }, { 'quoted': receivedMessage });
    } else if (userResponse === '2') {
      await conn.sendMessage(chatID, {
        'video': { 'url': downloadLinks.withWatermark },
        'caption': "*Downloaded SHABAN-MD*"
      }, { 'quoted': receivedMessage });
    } else if (userResponse === '3') {
      await conn.sendMessage(chatID, {
        'audio': { 'url': tiktokData.audio },
        'mimetype': "audio/mpeg"
      }, { 'quoted': receivedMessage });
    } else {
      reply("*Invalid selection. Please reply with 1, 2, or 3.*");
    }
  }
});

} catch (error) { console.log(error); reply('An error occurred while processing your request.'); } });



// Facebook-dl

cmd({ pattern: "fb", alias: ["facebook"], desc: "Download Facebook videos", category: "download", filename: __filename }, async (conn, m, store, { from, quoted, args, q, reply }) => { try { if (!q || !q.startsWith("https://")) { return conn.sendMessage(from, { text: "Need URL" }, { quoted: m }); }

await conn.sendMessage(from, {
  react: { text: '⏳', key: m.key }
});

const response = await fetch(`https://bk9.fun/download/fb?url=${encodeURIComponent(q)}`);
const fbData = await response.json();

if (!fbData.status) {
  return reply("❌ Error fetching the video. Please try again.");
}

const caption = `*FB DOWNLOADER*\n`
  + `
┃▸*Title*:${fbData.BK9.title}\n`
  + ` ┃▸*Description*:${fbData.BK9.desc}\n`
  + `\n\n`
  + `🌐 *Download Options:*\n`
  + `1️⃣  *SD Quality*\n`
  + `2️⃣  *HD Quality*\n`
  + `🎵 *Audio Options:*\n`
  + `3️⃣  *Audio (SD)*\n`
  + `4️⃣  *Document (MP3)*\n`
  + `5️⃣  *Voice (PTT)*\n\n`
  + `📌 *Reply with the number to download your choice.*`;

const sentMsg = await conn.sendMessage(from, {
  image: { url: fbData.BK9.thumb },
  caption: caption
}, { quoted: m });

const messageID = sentMsg.key.id;

conn.ev.on("messages.upsert", async (msgData) => {
  const receivedMsg = msgData.messages[0];
  if (!receivedMsg.message) return;
  
  const receivedText = receivedMsg.message.conversation || receivedMsg.message.extendedTextMessage?.text;
  const senderID = receivedMsg.key.remoteJid;
  const isReplyToBot = receivedMsg.message.extendedTextMessage?.contextInfo?.stanzaId === messageID;
  
  if (isReplyToBot) {
    await conn.sendMessage(senderID, {
      react: { text: '⬇️', key: receivedMsg.key }
    });
    
    switch (receivedText) {
      case "1":
        await conn.sendMessage(senderID, {
          video: { url: fbData.BK9.sd },
          caption: "📥 *Downloaded SHABAN-MD*"
        }, { quoted: receivedMsg });
        break;

      case "2":
        await conn.sendMessage(senderID, {
          video: { url: fbData.BK9.hd },
          caption: "📥 *Downloaded SHABAN-MD*"
        }, { quoted: receivedMsg });
        break;

      case "3":
        await conn.sendMessage(senderID, {
          audio: { url: fbData.BK9.sd },
          mimetype: "audio/mpeg"
        }, { quoted: receivedMsg });
        break;

      case "4":
        await conn.sendMessage(senderID, {
          document: { url: fbData.BK9.sd },
          mimetype: "audio/mpeg",
          fileName: "Facebook_Audio.mp3",
          caption: "📥 *Audio Downloaded SHABAN-MD*"
        }, { quoted: receivedMsg });
        break;

      case "5":
        await conn.sendMessage(senderID, {
          audio: { url: fbData.BK9.sd },
          mimetype: "audio/mp4",
          ptt: true
        }, { quoted: receivedMsg });
        break;

      default:
        reply("❌ Invalid option! Please reply with 1, 2, 3, 4, or 5.");
    }
  }
});

} catch (error) { console.error("Error:", error); reply("❌ Error fetching the video. Please try again."); } });



// twitter-dl

cmd({ pattern: "twitter", alias: ["twt", "twdl"], desc: "Download Twitter videos", category: "download", filename: __filename }, async (conn, m, store, { from, quoted, q, reply }) => { try { if (!q || !q.startsWith("https://")) { return conn.sendMessage(from, { text: "❌ Please provide a valid Twitter URL." }, { quoted: m }); }

await conn.sendMessage(from, {
  react: { text: '⏳', key: m.key }
});

const response = await axios.get(`https://bk9.fun/download/twitter-2?url=${q}`);
const data = response.data;

if (!data || !data.status || !data.BK9 || !data.BK9.BK9) {
  return reply("⚠️ Failed to retrieve Twitter video. Please check the link and try again.");
}

const videos = data.BK9.BK9.filter(item => item.type === "video");
if (videos.length === 0) {
  return reply("⚠️ No video found in the provided URL.");
}

const [video1, video2] = videos;

const caption = `〔 *TWITTER DOWNLOADER* 〕\n`
  + `┃▸ *Author:* ${data.BK9.authorName} (@${data.BK9.authorUsername})\n`
  + `┃▸ *Likes:* ${data.BK9.likes}\n`
  + `┃▸ *Replies:* ${data.BK9.replies}\n`
  + `┃▸ *Retweets:* ${data.BK9.retweets}\n`
  + `╰━━━⪼\n\n`
  + `📹 *Download Options:*\n`
  + `1️⃣  *Video 1 (Higher Resolution)*\n`
  + `2️⃣  *Video 2 (Lower Resolution)*\n\n`
  + `📌 *Reply with the number to download your choice.*`;

const sentMsg = await conn.sendMessage(from, {
  text: caption
}, { quoted: m });

const messageID = sentMsg.key.id;

conn.ev.on("messages.upsert", async (msgData) => {
  const receivedMsg = msgData.messages[0];
  if (!receivedMsg.message) return;

  const receivedText = receivedMsg.message.conversation || receivedMsg.message.extendedTextMessage?.text;
  const senderID = receivedMsg.key.remoteJid;
  const isReplyToBot = receivedMsg.message.extendedTextMessage?.contextInfo?.stanzaId === messageID;

  if (isReplyToBot) {
    await conn.sendMessage(senderID, {
      react: { text: '⬇️', key: receivedMsg.key }
    });

    switch (receivedText) {
      case "1":
        await conn.sendMessage(senderID, {
          video: { url: video1.url },
          caption: "📥 *Downloaded SHABAN-MD*"
        }, { quoted: receivedMsg });
        break;

      case "2":
        await conn.sendMessage(senderID, {
          video: { url: video2.url },
          caption: "📥 *Downloaded SHABAN-MD*"
        }, { quoted: receivedMsg });
        break;

      default:
        reply("❌ Invalid option! Please reply with 1 or 2.");
    }
  }
});

} catch (error) { console.error("Error:", error); reply("❌ An error occurred while processing your request. Please try again."); } });



// MediaFire-dl

cmd({ pattern: "mediafire", alias: ["mfire"], desc: "To download MediaFire files.", react: "🎥", category: "download", filename: __filename }, async (conn, m, store, { from, quoted, q, reply }) => { try { if (!q) { return reply("❌ Please provide a valid MediaFire link."); }

await conn.sendMessage(from, {
  react: { text: "⏳", key: m.key }
});

const response = await axios.get(`https://bk9.fun/download/mediafire?url=${q}`);
const data = response.data;

if (!data || !data.status || !data.BK9 || !data.BK9.link) {
  return reply("⚠️ Failed to fetch MediaFire download link. Ensure the link is valid and public.");
}

const { link, name, filetype, mime, size } = data.BK9;
const file_name = name || "mediafire_download";
const mime_type = mime || "application/octet-stream";
const file_size = size || "Unknown size";

await conn.sendMessage(from, {
  react: { text: "⬆️", key: m.key }
});

const caption = `〔 *MEDIAFIRE DOWNLOADER* 〕\n`
  + `┃▸ *File Name:* ${file_name}\n`
  + `┃▸ *File Type:* ${filetype || "Unknown"}\n`
  + `┃▸ *File Size:* ${file_size}\n`
  + `╰━━━⪼\n\n`
  + `📥 *Downloading your file...*`;

await conn.sendMessage(from, {
  document: { url: link },
  mimetype: mime_type,
  fileName: file_name,
  caption: caption
}, { quoted: m });

} catch (error) { console.error("Error:", error); reply("❌ An error occurred while processing your request. Please try again."); } });



// apk-dl

cmd({
  pattern: "apk",
  desc: "dl  from mod",
  category: "download",
  filename: __filename
}, async (conn, m, store, {
  from,
  quoted,
  q,
  reply
}) => {
  try {
    if (!q) {
      return reply("❌ Please provide an apk name to search.");
    }

    await conn.sendMessage(from, { react: { text: "⏳", key: m.key } });

    const apiUrl = `http://ws75.aptoide.com/api/7/apps/search/query=${q}/limit=1`;
    const response = await axios.get(apiUrl);
    const data = response.data;

    if (!data || !data.datalist || !data.datalist.list.length) {
      return reply("⚠️ No results found for the given app name.");
    }

    const app = data.datalist.list[0];
    const appSize = (app.size / 1048576).toFixed(2); // Convert bytes to MB

    const caption = `*Apk Downldoader*
┃ 📦 *Name:* ${app.name}
┃ 🏋 *Size:* ${appSize} MB
┃ 📦 *Package:* ${app.package}
┃ 📅 *Updated On:* ${app.updated}
┃ 👨‍💻 *Developer:* ${app.developer.name}
╰━━━━━━━━━━━━━━━┈⊷
🔗 *Powered By Mʀ-Sʜᴀʙᴀɴ*`;

    await conn.sendMessage(from, { react: { text: "⬆️", key: m.key } });

    await conn.sendMessage(from, {
      document: { url: app.file.path_alt },
      fileName: `${app.name}.apk`,
      mimetype: "application/vnd.android.package-archive",
      caption: caption
    }, { quoted: m });

    await conn.sendMessage(from, { react: { text: "✅", key: m.key } });

  } catch (error) {
    console.error("Error:", error);
    reply("❌ An error occurred while fetching the APK. Please try again.");
  }
});

// G-Drive-DL

cmd({
  pattern: "gdrive",
  desc: "Download Google Drive files.",
  react: "🌐",
  category: "download",
  filename: __filename
}, async (conn, m, store, {
  from,
  quoted,
  q,
  reply
}) => {
  try {
    if (!q) {
      return reply("❌ Please provide a valid Google Drive link.");
    }

    await conn.sendMessage(from, { react: { text: "⬇️", key: m.key } });

    const apiUrl = `https://api.fgmods.xyz/api/downloader/gdrive?url=${q}&apikey=mnp3grlZ`;
    const response = await axios.get(apiUrl);
    const downloadUrl = response.data.result.downloadUrl;

    if (downloadUrl) {
      await conn.sendMessage(from, { react: { text: "⬆️", key: m.key } });

      await conn.sendMessage(from, {
        document: { url: downloadUrl },
        mimetype: response.data.result.mimetype,
        fileName: response.data.result.fileName,
        caption: "*© Powered By Mʀ-Sʜᴀʙᴀɴ*"
      }, { quoted: m });

      await conn.sendMessage(from, { react: { text: "✅", key: m.key } });
    } else {
      return reply("⚠️ No download URL found. Please check the link and try again.");
    }
  } catch (error) {
    console.error("Error:", error);
    reply("❌ An error occurred while fetching the Google Drive file. Please try again.");
  }
}); 
            
// Snapchat

cmd({ pattern: "snap", alias: ["snapchat", "snp"], desc: "To download Snapchat videos.", react: "📹", category: "download", filename: __filename }, async (conn, m, store, { from, q, reply }) => { try { if (!q || !q.startsWith("http")) { return reply("❌ Please provide a valid Snapchat link."); }

await conn.sendMessage(from, {
  react: { text: "⏳", key: m.key }
});

const response = await axios.get(`https://api.nexoracle.com/downloader/snapchat?apikey=2f9b02060a600d6c88&url=${encodeURIComponent(q)}`);
const data = response.data;

if (!data || data.status !== 200 || !data.result || !data.result.url) {
  return reply("⚠️ Failed to fetch Snapchat content. Please check the link and try again.");
}

if (data.result.url) {
  await conn.sendMessage(from, {
    video: { url: data.result.url },
    mimetype: "video/mp4",
    caption: `📥 *Snapchat Video Downloaded SHABAN-MD*

🎥 Title: ${data.result.title}
📏 Size: ${data.result.size}` }, { quoted: m }); }

} catch (error) { console.error("Error:", error); reply("❌ An error occurred while processing your request. Please try again."); } });
