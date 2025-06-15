import getPool from "../../database/getPool.js";

const updateExperienceController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, price } = req.body;
    const pool = await getPool();
    await pool.query(
      "UPDATE experiences SET title = ?, description = ?, price = ? WHERE id = ?",
      [title, description, price, id]
    );
    res.json({ message: "Experiencia actualizada correctamente" });
  } catch (error) {
    next(error);
  }
};

export default updateExperienceController;