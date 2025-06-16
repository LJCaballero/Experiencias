import { updateExperienceSchema } from "../../schemas/experienceSchemas.js";
import getPool from "../../database/getPool.js";

export const updateExperience = async (req, res, next) => {
  try {
    // Solo admin puede actualizar
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Solo el administrador puede actualizar experiencias." });
    }

    const { experienceId } = req.params;
    const { title, description, location, price, available_places } = req.body;

    await updateExperienceSchema.validateAsync({ title, description, location, price, available_places });

    const pool = await getPool();

    // Construir query dinámicamente
    const updates = [];
    const values = [];

    if (title) {
      updates.push("title = ?");
      values.push(title);
    }
    if (description) {
      updates.push("description = ?");
      values.push(description);
    }
    if (location) {
      updates.push("location = ?");
      values.push(location);
    }
    if (price !== undefined) {
      updates.push("price = ?");
      values.push(price);
    }
    if (available_places !== undefined) {
      updates.push("available_places = ?");
      values.push(available_places);
    }

    if (updates.length === 0) {
      return res.status(400).json({ message: "No hay datos para actualizar." });
    }

    values.push(experienceId);

    await pool.query(
      `UPDATE experiences SET ${updates.join(", ")} WHERE id = ?`,
      values
    );

    res.status(200).json({ message: "Experiencia actualizada correctamente." });
  } catch (error) {
    next(error);
  }
};

export const createExperienceFromExisting = async (req, res, next) => {
  try {
    // Solo admin puede crear experiencias
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Solo el administrador puede crear experiencias." });
    }

    const { experienceId } = req.params;

    const pool = await getPool();

    // Obtener la experiencia existente
    const [experiences] = await pool.query(
      "SELECT * FROM experiences WHERE id = ?",
      [experienceId]
    );

    if (experiences.length === 0) {
      return res.status(404).json({ message: "Experiencia no encontrada." });
    }

    const experience = experiences[0];

    // Crear una nueva experiencia con los mismos datos
    const [result] = await pool.query(
      "INSERT INTO experiences (title, description, location, price, available_places) VALUES (?, ?, ?, ?, ?)",
      [experience.title + " (Copia)", experience.description, experience.location, experience.price, experience.available_places]
    );

    // Obtener la nueva experiencia
    const [newExperiences] = await pool.query(
      "SELECT * FROM experiences WHERE id = ?",
      [result.insertId]
    );

    res.status(201).json({ message: "Experiencia creada correctamente.", data: newExperiences[0] });
  } catch (error) {
    next(error);
  }
};


////////


export const listExperiences = async (req, res, next) => {
  try {
    const pool = await getPool();

    // Obtener los parámetros de búsqueda
    const { search, location, minPrice, maxPrice, sort, order, page, limit } = req.query;

    // Construir la query dinámicamente
    let query = "SELECT * FROM experiences WHERE 1=1";
    const values = [];

    if (search) {
      query += " AND (title LIKE ? OR description LIKE ?)";
      values.push(`%${search}%`);
      values.push(`%${search}%`);
    }

    if (location) {
      query += " AND location LIKE ?";
      values.push(`%${location}%`);
    }

    if (minPrice) {
      query += " AND price >= ?";
      values.push(minPrice);
    }

    if (maxPrice) {
      query += " AND price <= ?";
      values.push(maxPrice);
    }

    // Ordenación
    let orderBy = "createdAt"; // Por defecto
    if (sort === "price") {
      orderBy = "price";
    } else if (sort === "available_places") {
      orderBy = "available_places";
    }

    let orderDirection = "DESC"; // Por defecto
    if (order === "ASC") {
      orderDirection = "ASC";
    }

    query += ` ORDER BY ${orderBy} ${orderDirection}`;

    // Paginación
    const pageNumber = parseInt(page) || 1;
    const pageSize = parseInt(limit) || 10;
    const offset = (pageNumber - 1) * pageSize;

    query += " LIMIT ? OFFSET ?";
    values.push(pageSize);
    values.push(offset);

    // Ejecutar la query
    const [experiences] = await pool.query(query, values);

    res.status(200).json({ message: "Lista de experiencias obtenida correctamente.", data: experiences });
  } catch (error) {
    next(error);
  }
};