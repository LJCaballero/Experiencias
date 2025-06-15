// backend/src/routes/experiencesRoutes.js
import express from "express";
import listExperiencesController from "../../controllers/experiences/listExperiencesController.js";
import newExperienceController from "../../controllers/experiences/newExperienceController.js";
import auth from "../../middlewares/authMiddleware.js";
import getExperienceByIdController from "../../controllers/experiences/getExperienceByIdController.js";
import createReservationController from "../../controllers/users/createReservationController.js";
import updateExperienceStatusController from "../../controllers/experiences/updateExperienceStatusController.js";
import updateExperienceController from "../../controllers/experiences/updateExperienceController.js";

import isAdmin from "../../middlewares/isAdmin.js";
import duplicateExperienceController from "../../controllers/experiences/duplicateExperienceController.js";

import Joi from "joi";
import { validateBody } from "../../middlewares/validation.js";

const experienceSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  price: Joi.number().required(),
});

const statusSchema = Joi.object({
  status: Joi.string().valid('active', 'inactive').required(),
});


import rateExperienceController from "../../controllers/experiences/rateExperienceController.js";

const router = express.Router();

// GET /experiences - Listar todas las experiencias (público)
router.get("/", listExperiencesController);

// POST /experiences - Crear nueva experiencia (solo admin)
router.post("/", auth, newExperienceController);

// GET /experiences/:id - Detalle
router.get("/:id", getExperienceByIdController);

// POST /experiences/:id/reservas - Crear reserva
router.post("/:id/reservas", auth, createReservationController);

// PATCH /experiences/:id/status - Actualizar estado de experiencia (solo admin)
router.patch("/:id/status", auth, updateExperienceStatusController);


//mirar
router.post("/:id/reservas", auth, createReservationController); 

//admin
router.put("/:id", auth, isAdmin, updateExperienceController);

//duplica
router.post("/:id/duplicate", auth, isAdmin, duplicateExperienceController);


// joi
router.post("/", auth, isAdmin, validateBody(experienceSchema), newExperienceController);
router.put("/:id", auth, isAdmin, validateBody(experienceSchema), updateExperienceController);
router.patch("/:id/status", auth, isAdmin, validateBody(statusSchema), updateExperienceStatusController);
router.post("/:id/duplicate", auth, isAdmin, duplicateExperienceController);

router.post("/:id/rate", auth, rateExperienceController);


export default router;
