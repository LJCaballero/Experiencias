import express from "express";
import { getUserRatings } from "../controllers/ratingsController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/my-ratings", authMiddleware, getUserRatings);

export default router;
