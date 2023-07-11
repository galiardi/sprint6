const { v4: uuid } = require('uuid');
const { Router } = require('express');
const { getGastos } = require('../functions/getGastos');
const { getRoommates } = require('../functions/getRoommates');
const { saveAsJson } = require('../functions/saveAsJson');

const router = Router();

router.post('/', async (req, res) => {
  const server_response = {
    message: null,
    error: null,
  };

  try {
    const { roommateId, comentario, monto } = req.body;

    // lee y parsea el archivo gastos.json
    const gastos = await getGastos();

    // lee y parsea el archivo roommates.json
    const roommates = await getRoommates();

    // obtiene el roommate al que le corresponde el gasto. Si no existe envia un error al cliente
    const roommate = roommates.find((roommate) => roommate.id === roommateId);
    if (!roommate) {
      server_response.error = 'El usuario no existe. El gasto no ha sido guardado';
      return res.status(400).send(server_response);
    }

    const gasto = {
      id: uuid(),
      roommateId,
      nombre: roommate.nombre,
      comentario,
      monto: Number(monto),
    };

    // deuda de cada roommate
    const debtByRoommate = Math.round(gasto.monto / roommates.length);

    // actualiza cuanto recibe el roommate que hizo el gasto
    roommate.recibe += gasto.monto - debtByRoommate;

    // actauliza cuanto deben cada uno de los roommates, excepto el que hizo el gasto
    roommates.forEach((roommate) => {
      if (roommate.id === gasto.roommateId) return;
      roommate.debe += debtByRoommate;
    });

    /* 
    Guarda los roommates en data/roommates.json
    Si hay un error, envia error al cliente y termina la función
    para no guardar un gasto que no modificó la información de los roommates. 
    */
    try {
      await saveAsJson(roommates, 'roommates');
    } catch (error) {
      console.log(error);
      server_response.error =
        'Error al actualizar los usuarios. El gasto no ha sido guardado';
      return res.status(500).send(server_response);
    }

    // agrega un nuevo gasto
    gastos.push(gasto);

    // guarda los gastos en data/gastos.json
    saveAsJson(gastos, 'gastos');

    res.status(201);
    server_response.message = 'Gasto guardado con exito';
  } catch (error) {
    console.log(error);
    res.status(500);
    server_response.error = 'Error al guardar el gasto';
  }
  res.send(server_response);
});

router.get('/', async (req, res) => {
  const server_response = {
    data: null,
    data: null,
  };
  try {
    const gastos = await getGastos();
    server_response.data = gastos;
    res.status(200);
  } catch (error) {
    console.log(error);
    server_response.error = 'Error al obtener los gastos';
    res.status(500);
  }
  res.send(server_response);
});

router.put('/:id', async (req, res) => {
  // PENDIENTE!!!!! ACTUALIZAR LA INFORMACION DE LOS ROOMMATES:
  // 1ro.DESHACER LAS MODIFICACIONES EFECTUADAS POR EL GASTO ANTIGUO
  // 2do.REALIZAR LAS MODIFICACIONES CORRESPONDIENTES AL GASTO NUEVO
  const server_response = {
    message: null,
    error: null,
  };

  try {
    const { id } = req.params;
    const { roommateId, comentario, monto } = req.body;

    const gastos = await getGastos();

    // Si el gasto no existe, envia error al cliente y termina la funcion
    if (!gastos.find((gasto) => gasto.id === id)) {
      server_response.error = 'El gasto no existe';
      return res.status(400).send(server_response);
    }

    const updatedGasto = {
      id,
      roommateId,
      comentario,
      monto,
    };

    // crea un arreglo con el gasto actualizado
    const updatedGastos = gastos.map((gasto) => {
      if (gasto.id === id) return updatedGasto;
      return gasto;
    });

    // guarda los gastos actualizados
    await saveAsJson(updatedGastos, 'gastos');

    server_response.message = 'El gasto fue actualizado';
    res.status(200);
  } catch (error) {
    server_response.error = 'Error al actualizar el gasto';
    res.status(500);
  }
  res.send(server_response);
});

router.delete('/:id', async (req, res) => {
  const server_response = {
    message: null,
    error: null,
  };
  try {
    const { id } = req.params;

    const gastos = await getGastos();

    // si el gasto no existe envia un error al cliente y termina la funcion
    if (!gastos.find((gasto) => gasto.id === id)) {
      server_response.error = 'El gasto no existe';
      return res.status(400).send(server_response);
    }

    const updatedGastos = gastos.filter((gasto) => gasto.id !== id);

    // guarda los gastos
    await saveAsJson(updatedGastos, 'gastos');

    server_response.message = 'El gasto se ha borrado';
    res.status(200);
  } catch (error) {
    console.log(error);
    server_response.error = 'Error al borrar el gasto';
    res.status(500);
  }
  res.send(server_response);
});

module.exports = router;
