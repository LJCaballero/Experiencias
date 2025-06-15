import getPool from "../../database/getPool.js";

const updateProfileController = async (req, res, next) => {
  try {
    const { name, email } = req.body;
    const userId = req.user.id;
    const pool = await getPool();
    await pool.query("UPDATE users SET name = ?, email = ? WHERE id = ?", [name, email, userId]);
    res.json({ message: "Perfil actualizado correctamente" });
  } catch (error) {
    next(error);
  }
};

export default updateProfileController;