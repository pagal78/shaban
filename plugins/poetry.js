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
    
    // Load the HTML content into Cheerio
    const $ = cheerio.load(response.data);

    // Extract poetry from the page (using specific selectors)
    const poetryList = [];
    $('p').each((i, el) => {
      const poetryText = $(el).text().trim();
      if (poetryText.length > 0) {
        poetryList.push(poetryText);
      }
    });

    // Filter and clean poetry
    const filteredPoetry = poetryList.filter(text => text.includes('۔')); // Only Urdu text with sentence-ending punctuation.

    if (filteredPoetry.length === 0) {
      throw new Error('No valid poetry found.');
    }

    // Get a random poetry
    const randomPoetry = filteredPoetry[Math.floor(Math.random() * filteredPoetry.length)];

    await conn.sendMessage(from, { text: `📝 *Random Urdu Poetry:*\n\n${randomPoetry}` }, { quoted: mek });

  } catch (err) {
    console.error('Error fetching poetry:', err.message);
    reply('❌ Poetry fetch nahi ho saki. Thodi dair baad koshish karein.');
  }
});