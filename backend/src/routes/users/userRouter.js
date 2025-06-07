import express from "express";
import {
  registerUser,
  loginUser,
  validateUser,
  changePassword,
  getUserInfo,
} from "../../controllers/users/authController.js";

import { auth } from "../../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/validate-user", auth, validateUser);
router.patch("/password", auth, changePassword);
router.get("/profile", auth, getUserInfo);

export default router;