import getPool from "../../database/getPool.js";

const updateExperienceStatusService = async (experienceId, statusData) => {
  const pool = await getPool();

  // Verificamos que la experiencia existe
  const [existingExperience] = await pool.query(
    "SELECT id, adminId FROM experiences WHERE id = ?",
    [experienceId]
  );

  if (existingExperience.length === 0) {
    const error = new Error("Experiencia no encontrada");
    error.statusCode = 404;
    throw error;
  }

  // Construir la query dinámicamente basada en los campos proporcionados
  const fieldsToUpdate = [];
  const values = [];

  if (statusData.active !== undefined) {
    fieldsToUpdate.push("active = ?");
    values.push(statusData.active);
  }

  if (statusData.confirmed !== undefined) {
    fieldsToUpdate.push("confirmed = ?");
    values.push(statusData.confirmed);
  }

  if (fieldsToUpdate.length === 0) {
    const error = new Error("No hay campos válidos para actualizar");
    error.statusCode = 400;
    throw error;
  }

  // Agregar el ID al final de los valores
  values.push(experienceId);

  // Ejecutar la actualización
  const updateQuery = `
    UPDATE experiences 
    SET ${fieldsToUpdate.join(", ")}, modifiedAt = NOW()
    WHERE id = ?
  `;

  await pool.query(updateQuery, values);

  // Retornar la experiencia actualizada
  const [updatedExperience] = await pool.query(
    "SELECT * FROM experiences WHERE id = ?",
    [experienceId]
  );

  return updatedExperience[0];
};

export default updateExperienceStatusService;