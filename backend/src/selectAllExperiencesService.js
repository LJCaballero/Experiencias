// backend/src/services/experiences/selectAllExperiencesService.js
import getPool from "../../db/getPool.js";

const selectAllExperiencesService = async () => {
  const pool = await getPool();

  const [rows] = await pool.query(`
    SELECT 
      id, title, description, locality, image, experienceDate, price, 
      minCapacity, totalCapacity, adminId, active, confirmed, createdAt
    FROM experiences
    WHERE active = true
  `);

  return rows;
};

export default selectAllExperiencesService;
