const { v4: uuid } = require('uuid');

async function getRandomUser() {
  const response = await fetch('https://randomuser.me/api/?results=1');
  const data = await response.json();
  const { name, email, cell } = data.results[0];
  return {
    id: uuid(),
    nombre: name.first + ' ' + name.last,
    correo: email,
    celular: cell,
    debe: 0,
    recibe: 0,
  };
}

module.exports = { getRandomUser };
