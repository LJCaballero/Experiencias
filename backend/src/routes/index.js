import { Router } from "express";

import userRouter from "./users/userRouter.js";
import adminRoute from "./users/adminRoute.js";
import experiencesRouter from "./experiences/experiencesRoutes.js";
import reservasRouter from "./experiences/reservasRoute.js";


const router = Router();

router.use("/users", userRouter);
router.use("/admin", adminRoute);
router.use("/experiences", experiencesRouter);
router.use("/reservas", reservasRouter);

export default router;
