import getPool from "../../database/getPool.js";

const duplicateExperienceController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const pool = await getPool();
    const [experiences] = await pool.query("SELECT * FROM experiences WHERE id = ?", [id]);
    if (experiences.length === 0) {
      return res.status(404).json({ error: "Experiencia no encontrada" });
    }
    const exp = experiences[0];
    await pool.query(
      "INSERT INTO experiences (title, description, price) VALUES (?, ?, ?)",
      [exp.title + " (Copia)", exp.description, exp.price]
    );
    res.json({ message: "Experiencia duplicada correctamente" });
  } catch (error) {
    next(error);
  }
};

export default duplicateExperienceController;