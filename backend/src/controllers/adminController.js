import getPool from "../database/getPool.js";
import bcrypt from "bcrypt";
import "dotenv/config";

const crearAdminFijo = async (req, res, next) => {
  // Definimos los datos fijos del admin
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminUserName = process.env.ADMIN_USERNAME;
  const adminPassword = process.env.ADMIN_PASSWORD;
  const adminRole = "admin";

  //Comprobamos que las variables existen
  if (!adminEmail || !adminUserName || !adminPassword) {
    console.error(
      "ERROR: Las variables de entorno ADMIN_EMAIL, ADMIN_USERNAME y ADMIN_PASSWORD no están configuradas."
    );
    return res.status(500).send({
      status: "error",
      message:
        "Error interno del servidor: Faltan credenciales del administrador fijo.",
    });
  }
  let pool;

  try {
    pool = await getPool();

    // Hashing de la contraseña

    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    const sql = `
        INSERT INTO users (email, username, password, role, active)
        VALUES(?,?,?,?,?)       
         `;

    const values = [adminEmail, adminUserName, hashedPassword, adminRole, true];

    const [result] = await pool.query(sql, values);

    console.log("Usuario administrador fijo creado correctamente");

    res.status(201).json({
      status: "ok",
      message: "Usuario administrador fijo creado exitosamente.",
      data: {
        id: result.insertId,
        email: adminEmail,
        username: adminUserName,
        role: adminRole,
      },
    });

  } catch (error) {
    console.error(
      "Error al crear el usuario administrador fijo:",
      error.message
    );
    next(error);
  }
};
export default crearAdminFijo;