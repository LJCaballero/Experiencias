import jwt from "jsonwebtoken";
import getPool from "../../database/getPool.js";
import bcrypt from "bcrypt";

const resetPasswordController = async (req, res, next) => {
  try {
    const { token } = req.params;
    const { password } = req.body;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const hashedPassword = await bcrypt.hash(password, 10);
    const pool = await getPool();
    await pool.query("UPDATE users SET password = ? WHERE id = ?", [hashedPassword, decoded.userId]);
    res.json({ message: "Contraseña actualizada correctamente" });
  } catch (error) {
    next(error);
  }
};

export default resetPasswordController;