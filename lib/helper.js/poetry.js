const axios = require('axios');

async function fetchPoetry() {
  try {
    const res = await axios.get('https://poetrymehfil.com/wp-json/wp/v2/posts?categories=146&per_page=50');
    const posts = res.data;
    const random = posts[Math.floor(Math.random() * posts.length)];
    const cleanText = random.title.rendered.replace(/(<([^>]+)>)/gi, '');
    return `*✒️ Urdu Poetry:*\n\n${cleanText}`;
  } catch (e) {
    console.error('Poetry Fetch Error:', e.message);
    return 'Poetry fetch nahi ho saki. Thodi dair baad koshish karein.';
  }
}

module.exports = { fetchPoetry };