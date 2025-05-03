const axios = require('axios');
const cheerio = require('cheerio');
const { cmd } = require('../command');

cmd({
  pattern: 'poetry',
  desc: 'Get random 2-line Urdu poetry.',
  category: 'fun',
  react: '📝',
  filename: __filename
}, async (conn, mek, m, { from, reply }) => {
  try {
    const response = await axios.get('https://poetrymehfil.com/urdu-poetry/the-best-2-line-urdu-poetry-collection-on-every-topic/');
    const $ = cheerio.load(response.data);

    const poetryList = [];

    $('p').each((i, el) => {
      const text = $(el).text().trim();
      
      // Filter: Must contain Urdu full stop (۔) or look like couplet
      if (text.includes('۔') && text.length < 200) {
        // Ensure it's actually two lines by checking sentence parts
        const lines = text.split(/[۔\n]/).filter(t => t.trim().length > 0);
        if (lines.length === 2) {
          poetryList.push(lines.join('۔\n') + '۔');  // Join with Urdu full stop again
        }
      }
    });

    if (poetryList.length === 0) {
      throw new Error('No valid poetry found');
    }

    // Get a truly random poetry
    const randomPoetry = poetryList[Math.floor(Math.random() * poetryList.length)];

    await conn.sendMessage(from, {
      text: `📝 *Random Urdu Poetry:*\n\n${randomPoetry}`
    }, { quoted: mek });

  } catch (err) {
    console.error('Poetry Fetch Error:', err);
    reply('❌ Poetry fetch nahi ho saki. Thodi dair baad koshish karein.');
  }
});