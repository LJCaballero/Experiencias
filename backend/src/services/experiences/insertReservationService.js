import getPool from "../../database/getPool.js";

const insertReservationService = async (experienceId, userId, experienceDate, numberOfPeople) => {
  const pool = await getPool();

  // Verificamos que la experiencia existe
  const [experience] = await pool.query(
    "SELECT * FROM experiences WHERE id = ?",
    [experienceId]
  );

  if (experience.length === 0) {
    const error = new Error("Experiencia no encontrada");
    error.statusCode = 404;
    throw error;
  }

  // Verificamos que ya has hecho la reserva
  const [existingReservation] = await pool.query(
    "SELECT id FROM reservations WHERE userId = ? AND experienceId = ?",
    [userId, experienceId]
  );

  if (existingReservation.length > 0) {
    const error = new Error("Ya tienes una reserva para esta experiencia");
    error.statusCode = 409;
    throw error;
  }

  // Hacemos la reserva
  const [result] = await pool.query(
    `INSERT INTO reservations (experienceId, userId, experienceDate, numberOfPeople, status) 
     VALUES (?, ?, ?, ?, 'pending')`,
    [experienceId, userId, experienceDate, numberOfPeople]
  );

  return result.insertId;
};

export default insertReservationService;