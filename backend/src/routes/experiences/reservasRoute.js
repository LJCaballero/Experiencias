import express from "express";
import auth from "../../middlewares/authMiddleware.js"; // ← Corregido
import { crearReserva, listarReservasUsuario, cancelarReserva } from "../../controllers/reservas/controlReservas.js";

const router = express.Router();

// POST /reservas - Crear una reserva (usuario autenticado)
router.post("/", auth, crearReserva);

// GET /reservas - Listar reservas del usuario autenticado
router.get("/", auth, listarReservasUsuario);

// DELETE /reservas/:reservationId - Cancelar una reserva
router.delete("/:reservationId", auth, cancelarReserva);

export default router;