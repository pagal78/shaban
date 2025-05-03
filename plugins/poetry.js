const { fetchPoetry } = require('../lib/helper/poetry');

module.exports = {
  command: ['poetry'],
  description: 'Send a random Urdu poetry',
  category: 'fun',
  async handler(m, { conn }) {
    try {
      const poetry = await fetchPoetry();
      await conn.sendMessage(m.chat, { text: poetry }, { quoted: m });
    } catch (err) {
      console.error('Poetry Error:', err.message);
      await conn.sendMessage(m.chat, { text: 'کچھ غلط ہو گیا ہے، بعد میں کوشش کریں۔' }, { quoted: m });
    }
  }
};