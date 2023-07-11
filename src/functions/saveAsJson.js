const fs = require('fs/promises');
const path = require('path');

async function saveAsJson(obj, fileName) {
  const filePath = path.join(__dirname, '..', '..', 'data', `${fileName}.json`);
  const data = JSON.stringify(obj, null, 2);
  await fs.writeFile(filePath, data);
}

module.exports = { saveAsJson };
