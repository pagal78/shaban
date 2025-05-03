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
    const poetryList = [];

    const hwRes = await axios.get('https://hamariweb.com/poetry/two-lines-sad-poetry-spg4/');
    const $ = cheerio.load(hwRes.data);

    $('.poetrybox .pdblock a').each((i, el) => {
      const html = $(el).html();
      if (html) {
        const text = html.replace(/<br\s*\/?>/gi, '\n').replace(/<\/?[^>]+(>|$)/g, "").trim();
        const lines = text.split('\n').filter(line => line.trim());
        if (lines.length === 2) {
          poetryList.push(lines.join('\n') + '۔');
        }
      }
    });

    if (poetryList.length === 0) {
      throw new Error('No valid poetry found');
    }

    const randomPoetry = poetryList[Math.floor(Math.random() * poetryList.length)];

    await conn.sendMessage(from, {
      text: `📝 *Random Urdu Poetry (HamariWeb):*\n\n${randomPoetry}`
    }, { quoted: mek });

  } catch (err) {
    console.error('Poetry Fetch Error:', err);
    reply('❌ Poetry fetch nahi ho saki. Thodi dair baad koshish karein.');
  }
});
