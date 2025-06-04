import getPool from "../../database/getPool.js";
import bcrypt from "bcrypt";
import Joi from "joi";
import jwt from "jsonwebtoken";

const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  name: Joi.string().min(2).required(),
  username: Joi.string().min(2).required()
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

const changePasswordSchema = Joi.object({
  oldPassword: Joi.string().required(),
  newPassword: Joi.string().min(6).required()
});

export const registerUser = async (req, res, next) => {
  try {
    const { email, password, name, username } = req.body;
    await registerSchema.validateAsync({ email, password, name, username });

    const pool = await getPool();

    const [existing] = await pool.query("SELECT id FROM users WHERE email = ?", [email]);

    if (existing.length > 0) {
      return res.status(409).json({ message: "El usuario ya existe." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
      "INSERT INTO users (email, password, name, username, created_at) VALUES (?, ?, ?, ?, NOW())",
      [email, hashedPassword, name, username]
    );

    res.status(201).json({ message: "Usuario registrado correctamente." });
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    await loginSchema.validateAsync({ email, password });

    const pool = await getPool();

    const [users] = await pool.query("SELECT id, email, password, name FROM users WHERE email = ?", [email]);

    if (users.length === 0) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    const user = users[0];
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        name: user.name
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({ token });
  } catch (error) {
    next(error);
  }
};

export const validateUser = async (req, res) => {
  res.status(200).json({ user: req.user });
};

export const changePassword = async (req, res, next) => {
  try {
    const { oldPassword, newPassword } = req.body;
    await changePasswordSchema.validateAsync({ oldPassword, newPassword });

    const pool = await getPool();

    const [users] = await pool.query("SELECT password FROM users WHERE id = ?", [req.user.id]);

    if (users.length === 0) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const user = users[0];
    const isMatch = await bcrypt.compare(oldPassword, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Contraseña actual incorrecta" });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    await pool.query("UPDATE users SET password = ? WHERE id = ?", [hashedNewPassword, req.user.id]);

    res.status(200).json({ message: "Contraseña actualizada correctamente" });
  } catch (error) {
    next(error);
  }
};

export const getUserInfo = async (req, res, next) => {
  try {
    const pool = await getPool();

    const [users] = await pool.query(
      "SELECT id, email, name, username, created_at FROM users WHERE id = ?",
      [req.user.id]
    );

    if (users.length === 0) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.status(200).json({ user: users[0] });
  } catch (error) {
    next(error);
  }
};