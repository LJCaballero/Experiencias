import getPool from "../../database/getPool.js";

const validateUserController = async (req, res, next) => {
  try {
    const { validationCode } = req.params;
    const pool = await getPool();

    // Busca el usuario con ese código de validación
    const [users] = await pool.query(
      "SELECT id FROM users WHERE validation_code = ?",
      [validationCode]
    );

    if (users.length === 0) {
      return res.status(404).json({ error: "Código de validación no válido" });
    }

    // Marca el usuario como validado y borra el código
    await pool.query(
      "UPDATE users SET validated = 1, validation_code = NULL WHERE id = ?",
      [users[0].id]
    );

    res.json({ message: "Usuario validado correctamente" });
  } catch (error) {
    next(error);
  }
};

export default validateUserController;