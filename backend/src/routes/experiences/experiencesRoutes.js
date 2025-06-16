import express from "express";
import listExperiencesController from "../../controllers/experiences/listExperiencesController.js";
import newExperienceController from "../../controllers/experiences/newExperienceController.js";
import getExperienceByIdController from "../../controllers/experiences/getExperienceByIdController.js";
import updateExperienceStatusController from "../../controllers/experiences/updateExperienceStatusController.js";
import createReservationController from "../../controllers/users/createReservationController.js";
import auth from "../../middlewares/authMiddleware.js";
import { rateExperience } from "../../controllers/users/authController.js";

import { updateExperience } from "../../controllers/experiences/experienceController.js";

import { createExperienceFromExisting } from "../../controllers/experiences/experienceController.js";

import { listExperiences } from "../../controllers/experiences/experienceController.js";

const router = express.Router();

////
router.put("/reservations/:reservationId/rate", auth, rateExperience);

// GET /experiences - Listar todas las experiencias (público)
router.get("/", listExperiencesController);

// GET /experiences/:id - Detalle de experiencia (público)
router.get("/:id", getExperienceByIdController);

// Agregar esta ruta
router.put("/reservations/:reservationId/rate", auth, rateExperience);

// POST /experiences - Crear nueva experiencia (solo admin)
router.post("/", auth, (req, res, next) => {
  if (req.user.role !== "admin") {
    return res
      .status(403)
      .json({ message: "Solo los administradores pueden crear experiencias" });
  }
  newExperienceController(req, res, next);
});

// PATCH /experiences/:id/status - Actualizar estado (solo admin)
router.patch("/:id/status", auth, (req, res, next) => {
  if (req.user.role !== "admin") {
    return res
      .status(403)
      .json({ message: "Solo los administradores pueden modificar el estado" });
  }
  updateExperienceStatusController(req, res, next);
});

// POST /experiences/:id/reservas - Crear reserva para una experiencia
router.post("/:id/reservas", auth, createReservationController);

router.post(
  "/experiences/:experienceId/copy",
  auth,
  createExperienceFromExisting
);

router.put("/experiences/:experienceId", auth, updateExperience);

router.get("/experiences", listExperiences);

export default router;
