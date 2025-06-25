import { Router } from "express";

import userRouter from "./users/userRouter.js";
import experiencesRouter from "./experiences/experiencesRoutes.js";
import reservasRouter from "./experiences/reservasRoute.js";
import valoracionesRouter from "./experiences/valueExperienceRoute.js";
import ratingsRouter from "./ratings.js";

const router = Router();

router.use("/users", userRouter);
router.use("/experiences", experiencesRouter);
router.use("/reservas", reservasRouter);
router.use("/valoraciones", valoracionesRouter);
router.use("/ratings", ratingsRouter); 

export default router;