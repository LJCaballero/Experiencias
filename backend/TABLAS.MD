-- Crear la base de datos
CREATE DATABASE IF NOT EXISTS experiencias_diferentes;

-- Usar la base de datos
USE experiencias_diferentes;

-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL, -- Aquí se almacenará el hash de la contraseña
    role ENUM('admin', 'client') NOT NULL DEFAULT 'client',
    active BOOLEAN NOT NULL DEFAULT TRUE,
    validation_code VARCHAR(255) NULL,
    name VARCHAR(255) NULL,
    surname VARCHAR(255) NULL,
    bio TEXT NULL,
    avatar VARCHAR(255) NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabla de experiencias
CREATE TABLE IF NOT EXISTS experiences (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    location VARCHAR(255) NOT NULL,
    image VARCHAR(255) NULL, -- Ruta o nombre del archivo de imagen
    date DATE NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    min_capacity INT NOT NULL,
    total_capacity INT NOT NULL,
    status ENUM('active', 'inactive', 'confirmed') NOT NULL DEFAULT 'active',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);