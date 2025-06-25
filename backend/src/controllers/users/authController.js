import { v4 as uuidv4 } from "uuid";
import getPool from "../../database/getPool.js";
import bcrypt from "bcrypt";
import Joi from "joi";
import jwt from "jsonwebtoken";

const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  firstName: Joi.string().min(2).required(),
  lastName: Joi.string().min(2).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const changePasswordSchema = Joi.object({
  oldPassword: Joi.string().required(),
  newPassword: Joi.string().min(6).required(),
});

const ratingSchema = Joi.object({
  rating: Joi.number().integer().min(1).max(5).required(),
  comment: Joi.string().max(500).optional(),
});

const forgotPasswordSchema = Joi.object({
  email: Joi.string().email().required(),
});

const resetPasswordSchema = Joi.object({
  resetToken: Joi.string().required(),
  newPassword: Joi.string().min(6).required(),
});

const updateProfileSchema = Joi.object({
  firstName: Joi.string().min(2).optional(),
  lastName: Joi.string().min(2).optional(),
  email: Joi.string().email().optional(),
});

export const registerUser = async (req, res, next) => {
  try {
    const { email, password, firstName, lastName } = req.body;
    await registerSchema.validateAsync({
      email,
      password,
      firstName,
      lastName,
    });

    const pool = await getPool();

    const [existing] = await pool.query(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );

    if (existing.length > 0) {
      return res.status(409).json({ message: "El usuario ya existe." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const validationCode = uuidv4();

    await pool.query(
      "INSERT INTO users (email, password, firstName, lastName, validation_code, createdAt) VALUES (?, ?, ?, ?, ?, NOW())",
      [email, hashedPassword, firstName, lastName, validationCode]
    );

    res.status(201).json({
      message: "Usuario registrado correctamente. Por favor, valida tu email.",
      validationCode,
    });
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    await loginSchema.validateAsync({ email, password });

    const pool = await getPool();

    const [users] = await pool.query(
      "SELECT id, email, password, firstName, lastName, role FROM users WHERE email = ?",
      [email]
    );

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
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    });
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

    const [users] = await pool.query(
      "SELECT password FROM users WHERE id = ?",
      [req.user.id]
    );

    if (users.length === 0) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const user = users[0];
    const isMatch = await bcrypt.compare(oldPassword, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Contraseña actual incorrecta" });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    await pool.query("UPDATE users SET password = ? WHERE id = ?", [
      hashedNewPassword,
      req.user.id,
    ]);

    res.status(200).json({ message: "Contraseña actualizada correctamente" });
  } catch (error) {
    next(error);
  }
};

export const getUserInfo = async (req, res, next) => {
  try {
    const pool = await getPool();

    const [users] = await pool.query(
      "SELECT id, email, firstName, lastName, createdAt FROM users WHERE id = ?",
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

export const rateExperience = async (req, res, next) => {
  try {
    const { rating, comment } = req.body;
    const { reservationId } = req.params;
    const userId = req.user.id;

    await ratingSchema.validateAsync({ rating, comment });

    const pool = await getPool();

    const [reservations] = await pool.query(
      "SELECT id, status FROM reservations WHERE id = ? AND userId = ?",
      [reservationId, userId]
    );

    if (reservations.length === 0) {
      return res.status(404).json({ message: "Reserva no encontrada" });
    }

    if (reservations[0].status !== "completed") {
      return res
        .status(400)
        .json({ message: "Solo puedes valorar experiencias completadas" });
    }

    await pool.query(
      "UPDATE reservations SET rating = ?, comment = ?, ratingDate = NOW() WHERE id = ?",
      [rating, comment, reservationId]
    );

    res.status(200).json({
      message: "Valoración guardada correctamente",
      data: { rating, comment },
    });
  } catch (error) {
    next(error);
  }
};

export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    await forgotPasswordSchema.validateAsync({ email });

    const pool = await getPool();

    const [users] = await pool.query("SELECT id FROM users WHERE email = ?", [
      email,
    ]);

    if (users.length === 0) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const resetToken = uuidv4();
    const resetTokenExpiry = new Date(Date.now() + 3600000);

    await pool.query(
      "UPDATE users SET reset_token = ?, reset_token_expiry = ? WHERE email = ?",
      [resetToken, resetTokenExpiry, email]
    );

    // Opción email (descomentar para usar)
    /*
    import nodemailer from "nodemailer";
    const transporter = nodemailer.createTransport({
      host: 'smtp.tu-servidor.com',
      port: 587,
      secure: false,
      auth: {
        user: 'tu-email@dominio.com',
        pass: 'tu-password',
      },
    });

    const resetUrl = `https://tuapp.com/reset-password?token=${resetToken}`;

    await transporter.sendMail({
      from: '"Tu App" <no-reply@tuapp.com>',
      to: email,
      subject: 'Recuperación de contraseña',
      html: `<p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p><a href="${resetUrl}">${resetUrl}</a>`,
    });
    */

    res.status(200).json({
      message: "Token de recuperación generado",
      resetToken, // solo para pruebas, quitar en producción si usas email
    });
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const { resetToken, newPassword } = req.body;
    await resetPasswordSchema.validateAsync({ resetToken, newPassword });

    const pool = await getPool();

    const [users] = await pool.query(
      "SELECT id FROM users WHERE reset_token = ? AND reset_token_expiry > NOW()",
      [resetToken]
    );

    if (users.length === 0) {
      return res.status(400).json({ message: "Token inválido o expirado" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await pool.query(
      "UPDATE users SET password = ?, reset_token = NULL, reset_token_expiry = NULL WHERE reset_token = ?",
      [hashedPassword, resetToken]
    );

    res.status(200).json({ message: "Contraseña actualizada correctamente" });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const { firstName, lastName, email } = req.body;
    const userId = req.user.id;

    await updateProfileSchema.validateAsync({ firstName, lastName, email });

    const pool = await getPool();

    if (email) {
      const [existing] = await pool.query(
        "SELECT id FROM users WHERE email = ? AND id != ?",
        [email, userId]
      );

      if (existing.length > 0) {
        return res.status(409).json({ message: "El email ya está en uso" });
      }
    }

    const updates = [];
    const values = [];

    if (firstName) {
      updates.push("firstName = ?");
      values.push(firstName);
    }
    if (lastName) {
      updates.push("lastName = ?");
      values.push(lastName);
    }
    if (email) {
      updates.push("email = ?");
      values.push(email);
    }

    if (updates.length === 0) {
      return res.status(400).json({ message: "No hay datos para actualizar" });
    }

    values.push(userId);

    await pool.query(
      `UPDATE users SET ${updates.join(", ")} WHERE id = ?`,
      values
    );

    res.status(200).json({ message: "Perfil actualizado correctamente" });
  } catch (error) {
    next(error);
  }
};
