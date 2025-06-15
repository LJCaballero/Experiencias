import getPool from "../../database/getPool.js";

const rateExperienceController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rating } = req.body;
    const userId = req.user.id;
    const pool = await getPool();

    // Verifica que el usuario haya reservado la experiencia
    const [reservas] = await pool.query(
      "SELECT * FROM reservations WHERE user_id = ? AND experience_id = ?",
      [userId, id]
    );
    if (reservas.length === 0) {
      return res.status(403).json({ error: "No puedes valorar una experiencia que no has reservado" });
    }

    // Guarda la valoración
    await pool.query(
      "INSERT INTO valoraciones (user_id, experience_id, rating) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE rating = ?",
      [userId, id, rating, rating]
    );
    res.json({ message: "Valoración guardada correctamente" });
  } catch (error) {
    next(error);
  }
};

export default rateExperienceController;