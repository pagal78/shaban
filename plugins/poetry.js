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

    // Scrape poetrymehfil.com
    const mehfilRes = await axios.get('https://poetrymehfil.com/urdu-poetry/the-best-2-line-urdu-poetry-collection-on-every-topic/');
    const $mehfil = cheerio.load(mehfilRes.data);
    $mehfil('p').each((i, el) => {
      const text = $mehfil(el).text().trim();
      if (text.includes('۔') && text.length < 200) {
        const lines = text.split(/[۔\n]/).filter(t => t.trim().length > 0);
        if (lines.length === 2) {
          poetryList.push(lines.join('۔\n') + '۔');
        }
      }
    });

    // Scrape hamariweb.com
    const hwRes = await axios.get('https://hamariweb.com/poetry/two-lines-sad-poetry-spg4/');
    const $hw = cheerio.load(hwRes.data);
    $hw('.pdblock').each((i, el) => {
      const text = $hw(el).text().trim();
      const cleanText = text.replace(/\s{2,}/g, '\n').split('\n').filter(t => t.trim() !== '');
      if (cleanText.length === 2) {
        poetryList.push(cleanText.join('\n') + '۔');
      }
    });

    if (poetryList.length === 0) {
      throw new Error('No valid poetry found');
    }

    const randomPoetry = poetryList[Math.floor(Math.random() * poetryList.length)];

    await conn.sendMessage(from, {
      text: `📝 *Random Urdu Poetry:*\n\n${randomPoetry}`
    }, { quoted: mek });

  } catch (err) {
    console.error('Poetry Fetch Error:', err);
    reply('❌ Poetry fetch nahi ho saki. Thodi dair baad koshish karein.');
  }
});