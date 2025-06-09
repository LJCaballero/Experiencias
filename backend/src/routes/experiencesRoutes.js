// backend/src/routes/experiencesRoutes.js
import express from "express";
import listExperiencesController from "../controllers/experiences/listExperiencesController.js";
import detailExperienceRouter from "./detalleRoute.js";

const router = express.Router();

// GET /experiences (listado general)
router.get("/", listExperiencesController);

router.use("/", detailExperienceRouter);
export default router;
