import express from 'express';
import crearAdminFijo from '../controllers/adminController.js';

const router = express.Router();

router.post('/seed/admin', crearAdminFijo);

export default router