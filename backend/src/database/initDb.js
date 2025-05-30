import getPool from "./getPool.js";

const initDB = async () => {
  try {
    let pool = await getPool();

    console.log("Eliminando base de datos 'experiencias_diferentes' si existe...");
   
    await pool.query("DROP DATABASE IF EXISTS experiencias_diferentes");

    console.log("Creando base de datos 'experiencias_diferentes'...");

    await pool.query("CREATE DATABASE experiencias_diferentes");

    await pool.query("USE experiencias_diferentes");

    console.log("Borrando tablas si existen...");
    // Asegúrate de que los nombres de las tablas aquí coincidan exactamente con las de tu proyecto.
    // He puesto nombres sugeridos basados en la descripción del proyecto.
    await pool.query(
      "DROP TABLE IF EXISTS experience_ratings, reservations, experience_photos, experiences, users"
    );

    console.log("Creando tablas...");

    // Tabla de Usuarios (users)
   
    // Considera añadir 'bio' o 'biografia' 
    await pool.query(`
        CREATE TABLE IF NOT EXISTS users (
            id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
            email VARCHAR(100) UNIQUE NOT NULL,
            firstName VARCHAR(50) DEFAULT NULL,
            lastName VARCHAR(50) DEFAULT NULL,
            password VARCHAR(100) NOT NULL,
            avatar VARCHAR(100) DEFAULT NULL,
            active BOOLEAN DEFAULT false, 
            role ENUM('admin', 'normal') DEFAULT 'normal',
            registrationCode CHAR(30),
            recoverPassCode CHAR(10),
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP, 
            modifiedAt DATETIME ON UPDATE CURRENT_TIMESTAMP
        )
    `);

    // Tabla de Experiencias (experiences)
    // Basado en la descripción de tu proyecto: título, descripción, localidad, imagen, fecha, precio, plazas, etc.
    await pool.query(`
        CREATE TABLE IF NOT EXISTS experiences (
            id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
            title VARCHAR(100) NOT NULL,
            description TEXT NOT NULL,
            locality VARCHAR(100) NOT NULL,
            image VARCHAR(255) DEFAULT NULL, -- URL o nombre de la imagen principal
            experienceDate DATETIME NOT NULL, -- Fecha y hora de la experiencia
            price DECIMAL(10, 2) NOT NULL,
            minCapacity INT DEFAULT 1,
            totalCapacity INT NOT NULL,
            availableCapacity INT NOT NULL, -- Para controlar plazas disponibles
            adminId INT NOT NULL, -- ID del administrador que creó la experiencia
            active BOOLEAN DEFAULT true, -- Para desactivar/reactivar experiencias
            confirmed BOOLEAN DEFAULT false, -- Para confirmar experiencias
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP, 
            modifiedAt DATETIME ON UPDATE CURRENT_TIMESTAMP,
            FOREIGN KEY (adminId) REFERENCES users(id) ON DELETE CASCADE
        )
    `);

    // Tabla de Reservas (reservations)
    // Para registrar las reservas de los usuarios a las experiencias.
    await pool.query(`
        CREATE TABLE IF NOT EXISTS reservations (
            id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
            userId INT NOT NULL,
            experienceId INT NOT NULL,
            reservationDate DATETIME DEFAULT CURRENT_TIMESTAMP,
            status ENUM('pending', 'confirmed', 'cancelled', 'completed') DEFAULT 'pending',
            FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
            FOREIGN KEY (experienceId) REFERENCES experiences(id) ON DELETE CASCADE,
            UNIQUE (userId, experienceId) -- Un usuario no puede reservar la misma experiencia dos veces si no se permite
        )
    `);

    // Tabla de Valoraciones de Experiencias (experience_ratings)
    // Para que los usuarios valoren las experiencias (1-5).
    await pool.query(`
        CREATE TABLE IF NOT EXISTS experience_ratings (
            id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
            value TINYINT UNSIGNED NOT NULL, -- Valoración de 1 a 5
            comment TEXT DEFAULT NULL,
            userId INT NOT NULL,
            experienceId INT NOT NULL,
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
            FOREIGN KEY (experienceId) REFERENCES experiences(id) ON DELETE CASCADE,
            UNIQUE (userId, experienceId) -- Un usuario solo puede valorar una experiencia una vez
        )
    `);

    // Opcional: Tabla para fotos adicionales de experiencias, si cada experiencia puede tener múltiples imágenes.
    // Si la columna 'image' en 'experiences' es suficiente para una única imagen, puedes omitir esta.
    /*
    await pool.query(`
        CREATE TABLE IF NOT EXISTS experience_photos (
            id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
            name VARCHAR(255) NOT NULL, -- Nombre del archivo de la imagen
            experienceId INT NOT NULL,
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (experienceId) REFERENCES experiences(id) ON DELETE CASCADE
        )
    `);
    */

    // Insertar un usuario administrador fijo (como se menciona en las tareas de Sprint I).
    // Es CRÍTICO que la contraseña esté hasheada y no en texto plano en un entorno de producción.
    // Para el desarrollo inicial, puedes usar una sencilla, pero cámbiala tan pronto como implementes el hash.
    await pool.query(`
        INSERT INTO users (email, password, role, active)
        VALUES ('admin@experiencias.com', 'SuperAdminJSB44RT', 'admin', true)
    `);
    console.log("Usuario administrador inicial insertado.");

    console.log("¡Tablas creadas y base de datos inicializada!");
    process.exit(0);
  } catch (error) {
    console.error("Error al inicializar la base de datos:", error);
    process.exit(1); // Salir con código de error
  }
};

initDB();