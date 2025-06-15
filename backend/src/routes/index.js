import { Router } from "express";

import userRouter from "./users/userRouter.js";
import experiencesRouter from "./experiences/experiencesRoutes.js";

const router = Router();

router.use("/users", userRouter);
router.use("/experiences", experiencesRouter);

export default router;
