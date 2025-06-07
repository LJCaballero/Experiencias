import { Router } from "express";
import userRouter from "./users/userRouter.js";
import adminRoute from "./users/adminRoute.js";
import experiencesRouter from "./experiences/experiencesRoutes.js";


const router = Router();

router.use("/users", userRouter);
router.use("/admin", adminRoute);
router.use("/experiences", experiencesRouter);

export default router;
