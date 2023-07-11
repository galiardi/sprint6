const fs = require('fs/promises');
const path = require('path');

async function getGastos() {
  const gastosPath = path.join(__dirname, '..', '..', 'data', 'gastos.json');
  const gastos = JSON.parse(await fs.readFile(gastosPath));
  return gastos;
}

module.exports = { getGastos };
