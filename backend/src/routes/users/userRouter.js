import express from "express";
import {
  registerUser,
  loginUser,
  validateUser,
  changePassword,
  getUserInfo,
} from "../../controllers/users/authController.js";

import auth from "../../middlewares/authMiddleware.js";     
import forgotPasswordController from "../../controllers/users/forgotPasswordController.js";
import resetPasswordController from "../../controllers/users/resetPasswordController.js";
import updateProfileController from "../../controllers/users/updateProfileController.js";

import Joi from "joi";
import { validateBody } from "../../middlewares/validation.js";

const registerSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const passwordSchema = Joi.object({
  password: Joi.string().min(6).required(),
});

const profileSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
});

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/validate-user", auth, validateUser);
router.patch("/password", auth, changePassword);
router.get("/profile", auth, getUserInfo);
router.post("/forgot-password", forgotPasswordController);
router.post("/reset-password/:token", resetPasswordController);
router.put("/profile", auth, updateProfileController);

router.post("/register", validateBody(registerSchema), registerUser);
router.post("/login", validateBody(loginSchema), loginUser);
router.patch("/password", auth, validateBody(passwordSchema), changePassword);
router.put("/profile", auth, validateBody(profileSchema), updateProfileController);
router.post("/forgot-password", validateBody(Joi.object({ email: Joi.string().email().required() })), forgotPasswordController);
router.post("/reset-password/:token", validateBody(passwordSchema), resetPasswordController);


export default router;