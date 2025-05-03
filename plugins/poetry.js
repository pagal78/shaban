const { cmd } = require('../lib/command');
const axios = require('axios');

cmd({
  pattern: 'sadpoetry',
  desc: 'Send a random sad Urdu poetry',
  type: 'fun',
  use: '',
  filename: __filename
}, async (m) => {
  try {
    const response = await axios.get('https://poetrydb.org/lang/ur;type:sad');
    const randomPoetry = response.data[Math.floor(Math.random() * response.data.length)].line.join('\n');
    m.reply(randomPoetry);
  } catch (error) {
    console.error(error);
    m.reply('Kuch galat ho gaya. Koshish dobara karein.');
  }
});
