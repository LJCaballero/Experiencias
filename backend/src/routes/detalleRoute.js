
import express from "express";
import getExperienceByIdController from "../controllers/experiences/getExperienceByIdController.js";

const router = express.Router();

router.get("/:id", getExperienceByIdController);

export default router;