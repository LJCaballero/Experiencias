import { Router } from "express";
import userRouter from "./userRouter.js";
import adminRoute from "./adminRoute.js";
import experiencesRouter from "./experiencesRoutes.js";

const router = Router();

router.use("/users", userRouter);
router.use("/admin", adminRoute);
router.use("/experiences", experiencesRouter);

export default router;