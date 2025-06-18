import getPool from '../../database/getPool.js';

const selectExperienceByIdService = async (experienceId) => {
    try {
        const pool = await getPool();
        const [rows] = await pool.query(
            `SELECT e.*, COUNT(r.id) AS reservations FROM experiences e LEFT JOIN reservations r ON e.id = r.experienceId WHERE e.id = ? GROUP BY e.id`,
            [experienceId]
        );

        // Si no se encuentra la experiencia, devuelve null o undefined para que el controlador lo maneje
        return rows.length > 0 ? rows[0] : null;
    } catch (error) {
        console.error('Error en selectExperienceByIdService:', error);
        throw error; // Relanza el error para que el controlador lo capture
    }
};

export default selectExperienceByIdService;
