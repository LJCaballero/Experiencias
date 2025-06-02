import getPool from "../../database/getPool.js";

const selectExperienceByIdService = async (experienceId) => {
  const pool = await getPool();

  //Obtenemos la info de la experiencia

  const [experience] = await pool.query(
    `
        SELECT e.id, e.title, e.description, e.locality, e.image, e.experienceDate, e.price, e.minCapacity, e.totalCapacity, e.active, e.confirmed, e.createdAt,
        u.id as adminId 
        FROM experiences e
        INNER JOIN users u ON e.adminId = u.id
        WHERE e.id=?
        GROUP BY e.id 
        
        `,
    [experienceId]
  );
  // GROUP BY e.id  -- para datos que se puedan repetir

  //Posibilidad de crear una tabla para las fotos de la experiencia

  //Devuelveme la experiencia y si no existe null
  return experience[0] || null;
};

export default selectExperienceByIdService;
