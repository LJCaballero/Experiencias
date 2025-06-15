import jwt from "jsonwebtoken";
import getPool from "../../database/getPool.js";
import { sendPasswordResetEmail } from "../../services/emailService.js";

const forgotPasswordController = async (req, res, next) => {
  try {
    const { email } = req.body;
    const pool = await getPool();
    const [users] = await pool.query("SELECT id FROM users WHERE email = ?", [email]);
    if (users.length === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    const user = users[0];
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    await sendPasswordResetEmail(email, token);
    res.json({ message: "Correo de recuperación enviado" });
  } catch (error) {
    next(error);
  }
};

export default forgotPasswordController;