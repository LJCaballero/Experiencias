import { Router } from "express";

import userRouter from "./users/userRouter.js";
import experiencesRouter from "./experiences/experiencesRoutes.js";
import reservasRouter from "./experiences/reservasRoute.js";


const router = Router();

router.use("/users", userRouter);
router.use("/experiences", experiencesRouter);
router.use("/reservas", reservasRouter);

export default router;
