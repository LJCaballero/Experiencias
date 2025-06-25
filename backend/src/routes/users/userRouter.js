import express from "express";
import {
  registerUser,
  loginUser,
  validateUser,
  changePassword,
  getUserInfo,
} from "../../controllers/users/authController.js";

import authMiddleware from "../../middlewares/authMiddleware.js";
import validateUserController from "../../controllers/users/validateUserController.js";


import { forgotPassword, resetPassword } from '../../controllers/users/authController.js';

import { updateProfile } from "../../controllers/users/authController.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/validate-user", authMiddleware, validateUser);
router.put("/change-password", authMiddleware, changePassword);
router.get("/profile", authMiddleware, getUserInfo);
router.get("/validate/:validationCode", validateUserController);

// Rutas para recuperación de contraseña
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

router.put("/profile", authMiddleware, updateProfile);

export default router;
