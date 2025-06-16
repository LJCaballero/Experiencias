import express from "express";
import getPool from "../../database/getPool.js"; // ← Corregido
import auth from "../../middlewares/authMiddleware.js"; // ← Usa tu middleware

const router = express.Router();

// POST /valoraciones/:experienceId - Valorar una experiencia
router.post("/:experienceId", auth, async (req, res, next) => {
  try {
    const { experienceId } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user.id; // ← Del middleware auth

    if (!rating || rating < 1 || rating > 5) {
      return res
        .status(400)
        .json({ error: "La puntuación debe estar entre 1 y 5." });
    }

    const pool = await getPool();

    // Verificar si el usuario tiene una reserva completada
    const [reservations] = await pool.query(
      `SELECT * FROM reservations 
             WHERE userId = ? AND experienceId = ? AND status = 'completed'`,
      [userId, experienceId]
    );

    if (reservations.length === 0) {
      return res.status(403).json({
        error:
          "No puedes valorar esta experiencia porque no la has completado.",
      });
    }

    // Verificar si ya existe valoración
    if (reservations[0].rating !== null) {
      return res
        .status(409)
        .json({ error: "Ya has valorado esta experiencia." });
    }

    // Actualizar la reserva con la valoración
    await pool.query(
      `UPDATE reservations SET rating = ?, comment = ?, ratingDate = NOW() 
             WHERE userId = ? AND experienceId = ?`,
      [rating, comment || null, userId, experienceId]
    );

    res.status(201).json({ message: "Valoración registrada correctamente." });
  } catch (error) {
    next(error);
  }
});

export default router;
