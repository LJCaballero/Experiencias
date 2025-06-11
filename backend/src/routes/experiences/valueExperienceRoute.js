import express from 'express';
import getPool from '../db/getPool.js';
import jwt from 'jsonwebtoken'; // Asumiendo que usas JWT para autenticación

const router = express.Router();

router.post('/api/valoraciones/:experienceId', async (req, res) => {
    const { experienceId } = req.params;
    const { rating, comment } = req.body;
    const authHeader = req.headers.authorization;

    // Validación de autenticación
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Token no proporcionado' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;

        if (!rating || rating < 1 || rating > 5) {
            return res.status(400).json({ error: 'La puntuación debe estar entre 1 y 5.' });
        }

        const pool = await getPool();

        // Verificar si el usuario tiene una reserva completada para esa experiencia
        const [reservations] = await pool.query(
            `SELECT * FROM reservations 
             WHERE userId = ? AND experienceId = ? AND status = 'completed'`,
            [userId, experienceId]
        );

        if (reservations.length === 0) {
            return res.status(403).json({ error: 'No puedes valorar esta experiencia porque no la has completado o no tienes reserva.' });
        }

        // Verificar si ya existe valoración
        if (reservations[0].rating !== null) {
            return res.status(409).json({ error: 'Ya has valorado esta experiencia.' });
        }

        // Actualizar la reserva con la valoración
        await pool.query(
            `UPDATE reservations SET rating = ?, comment = ?, ratingDate = NOW() 
             WHERE userId = ? AND experienceId = ?`,
            [rating, comment || null, userId, experienceId]
        );

        return res.status(201).json({ message: 'Valoración registrada correctamente.' });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Error al registrar la valoración.' });
    }
});

export default router;
