import express from 'express';
import { getVeterinaries } from '../controllers/PanelController.js';
import checkAuth from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/veterinaries', checkAuth, getVeterinaries);


export default router;