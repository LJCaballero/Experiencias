// backend/src/routes/experiencesRoutes.js
import express from "express";
import listExperiencesController from "../controllers/experiences/listExperiencesController.js";
import newExperienceController from "../controllers/experiences/newExperienceController.js";
import auth from "../middlewares/authMiddleware.js";

const router = express.Router();

// GET /experiences - Listar todas las experiencias (público)
router.get("/", listExperiencesController);

// POST /experiences - Crear nueva experiencia (solo admin)
router.post("/", auth, newExperienceController);

export default router;