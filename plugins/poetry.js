const axios = require('axios');
const { cmd } = require('../command');

cmd({
  pattern: 'poetry',
  desc: 'Get random 2-line Urdu poetry.',
  category: 'fun',
  react: '📝',
  filename: __filename
}, async (conn, mek, m, { from, reply }) => {
  try {
    console.log('📌 Poetry command triggered');
    const response = await axios.get('https://poetrymehfil.com/urdu-poetry/the-best-2-line-urdu-poetry-collection-on-every-topic/');
    console.log('Response received:', response.data); // Debugging line

    const html = response.data;

    // Extract 2-line poetry using regex
    const poetryList = [...html.matchAll(/<p>(.*?)<\/p>/g)].map(p => p[1])
      .filter(line => line.includes('<br>') || line.includes('<br />'))
      .map(p => p.replace(/<br\s*\/?>/gi, '\n').replace(/<\/?[^>]+(>|$)/g, '').trim());

    if (poetryList.length === 0) throw new Error("No poetry found");

    const randomPoetry = poetryList[Math.floor(Math.random() * poetryList.length)];
    await conn.sendMessage(from, { text: `📝 *Random Urdu Poetry:*\n\n${randomPoetry}` }, { quoted: mek });
  } catch (err) {
    console.error('Poetry Error:', err.message);
    reply('❌ Poetry fetch nahi ho saki. Thodi dair baad koshish karein.');
  }
});