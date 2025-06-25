// src/controllers/reservas/ControlReservas.js
import getPool from '../../database/getPool.js'; 
import { isBefore, addHours } from 'date-fns'; // Se necesita instalar 'npm install date-fns' 

function toMySQLDateTime(dateString) {
  const date = new Date(dateString);
  const pad = n => n < 10 ? '0' + n : n;
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

// --- Controlador para Crear una Reserva (anteriormente en tu rutas, ahora centralizado) ---
const crearReserva = async (req, res, next) => {
    let connection;
    try {
        const { experienceId, userId, experienceDate, numberOfPeople } = req.body;
        const formattedDate = toMySQLDateTime(experienceDate);

        if (!experienceId || !userId || !experienceDate || numberOfPeople === undefined) {
            const error = new Error('Faltan datos necesarios para la reserva');
            error.statusCode = 400;
            throw error;
        }

        if (isNaN(Number(numberOfPeople)) || Number(numberOfPeople) <= 0) {
            const error = new Error('El número de personas debe ser un número mayor que cero');
            error.statusCode = 400;
            throw error;
        }


        // Si el userId del body no coincide con el del token, podrías lanzar un error
        if (req.user.id !== userId) {
             const error = new Error('El ID de usuario en la reserva no coincide con el usuario autenticado.');
             error.statusCode = 403; // Forbidden
             throw error;
        }


        const pool = await getPool();
        connection = await pool.getConnection();

        // Calcular plazas disponibles en el momento de la consulta
        const [experience] = await connection.query(
            `SELECT totalCapacity, (totalCapacity - (SELECT IFNULL(SUM(numberOfPeople), 0) FROM reservations WHERE experienceId = ? AND status IN ('pending', 'confirmed'))) AS available_places FROM experiences WHERE id = ?`,
            [experienceId, experienceId]
        );

        if (experience.length === 0) {
            const error = new Error('Experiencia no encontrada.');
            error.statusCode = 404;
            throw error;
        }

        const availablePlaces = experience[0].available_places;

        if (availablePlaces < Number(numberOfPeople)) {
            const error = new Error('No hay suficientes plazas disponibles para esta experiencia.');
            error.statusCode = 400;
            throw error;
        }

        await connection.beginTransaction();

        const [result] = await connection.execute(
            'INSERT INTO reservations (experienceId, userId, experienceDate, numberOfPeople, status) VALUES (?, ?, ?, ?, "pending")',
            [experienceId, userId, formattedDate, Number(numberOfPeople)]
        );

        await connection.commit();

        const nuevaReserva = {
            id: result.insertId,
            experienceId,
            userId,
            experienceDate,
            numberOfPeople: Number(numberOfPeople),
            status: 'pending'
        };

        res.status(201).json({
            status: 'ok',
            message: 'Reserva realizada con éxito',
            data: { reserva: nuevaReserva }
        });

    } catch (error) {
        if (connection) await connection.rollback();
        console.error('Error al realizar la reserva:', error);
        next(error);
    } finally {
        if (connection) connection.release();
    }
};

// --- Controlador para Listar Reservas del Usuario ---
const listarReservasUsuario = async (req, res, next) => {
    try {
        const userId = req.user.id; // ID del usuario autenticado

        const pool = await getPool();

        const [reservations] = await pool.query(
            `SELECT
                r.id AS reservation_id,
                r.reservationDate,
                r.status AS reservation_status,
                r.numberOfPeople,
                e.id AS experience_id,
                e.title AS experience_title,
                e.description AS experience_description,
                e.locality AS experience_locality,
                e.experienceDate AS experience_date,
                e.price AS experience_price,
                e.image AS experience_image,
                r.rating,
                r.comment,
                r.ratingDate
             FROM reservations r
             JOIN experiences e ON r.experienceId = e.id
             WHERE r.userId = ?
             ORDER BY r.reservationDate DESC`,
            [userId]
        );

        res.json({
            status: 'ok',
            message: 'Listado de reservas del usuario',
            data: {
                reservations: reservations, // Usamos 'reservations' para la lista
            },
        });

    } catch (error) {
        console.error('Error al obtener las reservas del usuario:', error);
        next(error);
    }
};

// --- Controlador para Cancelar una Reserva ---
const cancelarReserva = async (req, res, next) => {
    let connection;
    try {
        const userId = req.user.id; // ID del usuario autenticado
        const userRole = req.user.role; // Rol del usuario
        const { reservationId } = req.params; // Usamos 'reservationId' para el parámetro URL

        const pool = await getPool();
        connection = await pool.getConnection();

        const [reservationInfo] = await connection.query(
            `SELECT userId, experienceId, status, numberOfPeople, experienceDate FROM reservations WHERE id = ?`,
            [reservationId]
        );

        if (reservationInfo.length === 0) {
            const error = new Error(`Reserva con ID ${reservationId} no encontrada.`);
            error.statusCode = 404;
            throw error;
        }

        const reservation = reservationInfo[0];

        if (reservation.userId !== userId && userRole !== 'admin') {
            const error = new Error('No tienes permiso para cancelar esta reserva.');
            error.statusCode = 403;
            throw error;
        }

        if (reservation.status === 'cancelled' || reservation.status === 'completed') {
            const error = new Error(`La reserva ya está ${reservation.status}. No se puede cancelar.`);
            error.statusCode = 400;
            throw error;
        }

        const experienceDate = new Date(reservation.experienceDate);
        const cancellationDeadline = addHours(experienceDate, -24);

        if (isBefore(cancellationDeadline, new Date())) {
            const error = new Error('La cancelación no es posible. El plazo de 24 horas antes de la experiencia ha expirado.');
            error.statusCode = 400;
            throw error;
        }

        await connection.beginTransaction();

        await connection.query(
            `UPDATE reservations SET status = 'cancelled' WHERE id = ?`,
            [reservationId]
        );

        //Revisar 
        /*
        await connection.query(
            `UPDATE experiences SET available_places = available_places + ? WHERE id = ?`,
            [reservation.numberOfPeople, reservation.experienceId]
        );
        */

        await connection.commit();

        res.json({
            status: 'ok',
            message: `Reserva con ID ${reservationId} cancelada exitosamente.`,
        });

    } catch (error) {
        if (connection) await connection.rollback();
        console.error('Error al cancelar la reserva:', error);
        next(error);
    } finally {
        if (connection) connection.release();
    }
};


export {
    crearReserva,
    listarReservasUsuario,
    cancelarReserva,
};