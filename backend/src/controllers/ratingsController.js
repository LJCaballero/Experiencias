import getPool from "../database/getPool.js";

export const getUserRatings = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const pool = await getPool();

    const [ratings] = await pool.query(
      `SELECT 
        r.id AS reservationId,
        r.rating,
        r.comment,
        r.ratingDate,
        e.id AS experienceId,
        e.title AS experienceTitle,
        e.image AS experienceImage
      FROM reservations r
      JOIN experiences e ON r.experienceId = e.id
      WHERE r.userId = ? AND r.rating IS NOT NULL
      ORDER BY r.ratingDate DESC`,
      [userId]
    );

    res.status(200).json({ ratings });
  } catch (error) {
    next(error);
  }
};
