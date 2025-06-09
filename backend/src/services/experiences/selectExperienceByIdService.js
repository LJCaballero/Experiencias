import getPool from '../../database/getPool.js';

const selectExperienceByIdService = async (experienceId) => {
    try {
        const pool = await getPool();
        const [rows] = await pool.query(
            `SELECT * FROM experiences WHERE id = ?`,
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
