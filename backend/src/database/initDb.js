import getPool from "./getPool.js";
import bcrypt from 'bcrypt';
import "dotenv/config";

const initDB = async () => {
  try {
    let pool = await getPool();

    console.log("Eliminando base de datos 'experiencias_diferentes' si existe...");
   
    await pool.query("DROP DATABASE IF EXISTS experiencias_diferentes");

    console.log("Creando base de datos 'experiencias_diferentes'...");

    await pool.query("CREATE DATABASE experiencias_diferentes");

    await pool.query("USE experiencias_diferentes");

    console.log("Borrando tablas si existen...");
    
    await pool.query(
      "DROP TABLE IF EXISTS experience_ratings, reservations, experience_photos, experiences, users"
    );

    console.log("Creando tablas...");

    // Tabla de Usuarios (users)
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
    await pool.query(`
        CREATE TABLE IF NOT EXISTS experiences (
            id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
            title VARCHAR(100) NOT NULL,
            description TEXT NOT NULL,
            locality VARCHAR(100) NOT NULL,
            image VARCHAR(255) DEFAULT NULL,
            experienceDate DATETIME NOT NULL,
            price DECIMAL(10, 2) NOT NULL,
            minCapacity INT DEFAULT 1,
            totalCapacity INT NOT NULL,
            adminId INT NOT NULL,
            active BOOLEAN DEFAULT true,
            confirmed BOOLEAN DEFAULT false,
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP, 
            modifiedAt DATETIME ON UPDATE CURRENT_TIMESTAMP,
            FOREIGN KEY (adminId) REFERENCES users(id) ON DELETE CASCADE
        )
    `);

    // Tabla de Reservas (reservations)
    await pool.query(`
        CREATE TABLE IF NOT EXISTS reservations (
            id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
            userId INT NOT NULL,
            experienceId INT NOT NULL,
            reservationDate DATETIME DEFAULT CURRENT_TIMESTAMP,
            status ENUM('pending', 'confirmed', 'cancelled', 'completed') DEFAULT 'pending',
            FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
            FOREIGN KEY (experienceId) REFERENCES experiences(id) ON DELETE CASCADE,
            UNIQUE (userId, experienceId)
        )
    `);

    // Tabla de Valoraciones de Experiencias (experience_ratings)
    await pool.query(`
        CREATE TABLE IF NOT EXISTS experience_ratings (
            id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
            value TINYINT UNSIGNED NOT NULL,
            comment TEXT DEFAULT NULL,
            userId INT NOT NULL,
            experienceId INT NOT NULL,
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
            FOREIGN KEY (experienceId) REFERENCES experiences(id) ON DELETE CASCADE,
            UNIQUE (userId, experienceId)
        )
    `);

    // Insertar usuario administrador
    const adminPassword = process.env.ADMIN_PASSWORD;
    
    
    
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    

    
    await pool.query(`
        INSERT INTO users (email, password, role, active)
        VALUES (?, ?, 'admin', true)
    `, ['admin@experiencias.com', hashedPassword]);

    console.log("¡Tablas creadas y base de datos inicializada!");
    process.exit(0);
    
  } catch (error) {
    console.error("Error al inicializar la base de datos:", error);
    process.exit(1);
  }
};

initDB();