// Endpoint para hacer la reserva de las experiencias

import express from "express";
import getPool from "../../database/getPool.js";
import auth from "../../middlewares/authMiddleware.js";

import {
  crearReserva,
  listarReservasUsuario,
  cancelarReserva,
} from "../../controllers/reservas/controlReservas.js";


const router = express.Router();

router.post("/", async (req, res) => {
  const { experienceID, userID, experienceDate, numberOfPeople } = req.body;

  if (
    !experienceID ||
    !userID ||
    !experienceDate ||
    numberOfPeople === undefined
  ) {
    return res
      .status(400)
      .json({ error: "Faltan datos necesarios para la reserva" });
  }

  if (isNaN(Number(numberOfPeople)) || Number(numberOfPeople) <= 0) {
    return res.status(400).json({
      error: "El número de personas debe ser un número mayor que cero",
    });
  }


    try {
        const pool = await getPool();
        const [result] = await pool.query(
            'INSERT INTO reservations (experienceId, userId, experienceDate, numberOfPeople) VALUES (?, ?, ?, ?)',
            [experienceID, userID, experienceDate, numberOfPeople]
        );


    const nuevaReserva = {
      id: result.insertId,
      experienceID,
      userID,
      experienceDate,
      numberOfPeople: Number(numberOfPeople),
    };

    res.status(201).json({
      message: "Reserva realizada con éxito",
      reserva: nuevaReserva,
    });
  } catch (error) {
    console.error("Error al realizar la reserva:", error);
    res.status(500).json({ error: "Error al realizar la reserva" });
  }
});

export default router;
