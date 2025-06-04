// backend/src/routes/experiencesRoutes.js
import express from "express";
import listExperiencesController from "../controllers/experiences/listExperiencesController.js";

const router = express.Router();

// GET /experiences
router.get("/", listExperiencesController);

export default router;
