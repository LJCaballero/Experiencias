import { Router } from "express";
import newExperienceController from "../controllers/experiences/newExperienceController.js";

const router = Router();

router.post("/experiences", newExperienceController);

export default router;