const { Router } = require('express');
const { getRandomUser } = require('../functions/getRandomUser');
const { getRoommates } = require('../functions/getRoommates');
const { saveAsJson } = require('../functions/saveAsJson');

const router = Router();

router.post('/', async (req, res) => {
  const server_response = {
    message: null,
    error: null,
  };

  try {
    // genera un nuevo roommate usando parte de la data proporcionada por la api randomuser
    const roommate = await getRandomUser();

    // lee y parsea el archivo roommates.json
    const roommates = await getRoommates();

    // agrega el nuevo roomate
    roommates.push(roommate);

    // guarda los roommates en data/roommates.json
    await saveAsJson(roommates, 'roommates');

    res.status(201);
    server_response.message = 'Roommate creado exitosamente';
  } catch (error) {
    console.log(error);
    res.status(500);
    server_response.error = 'Error al crear el roommate';
  }
  res.send(server_response);
});

router.get('/', async (req, res) => {
  const server_response = {
    data: null,
    error: null,
  };

  try {
    // lee y parsea el archivo roommates.json
    const roommates = await getRoommates();

    res.status(200);
    server_response.data = roommates;
  } catch (error) {
    console.log(error);
    res.status(500);
    server_response.error = 'Error al obtener los roommates';
  }
  res.send(server_response);
});

module.exports = router;
