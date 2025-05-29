import express from "express";
import crearAdminFijo from "../controllers/admin/adminController.js";

const router = express.Router();

router.post("/seed/admin", crearAdminFijo); //informacion del admin, eliminar mas adelante

export default router;
