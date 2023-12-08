import express from 'express';
import checkAuth from '../middleware/authMiddleware.js';
import { createVacuna, getVacunas } from '../controllers/VacunasController.js';

const router = express.Router();


router.get('/vacunas', checkAuth, getVacunas);

router.post('/vacunas/animal', checkAuth, createVacuna);

export default router;