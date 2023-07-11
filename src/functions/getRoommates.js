const fs = require('fs/promises');
const path = require('path');

async function getRoommates() {
  const roommatesPath = path.join(__dirname, '..', '..', 'data', 'roommates.json');
  const roommates = JSON.parse(await fs.readFile(roommatesPath));
  return roommates;
}

module.exports = { getRoommates };
