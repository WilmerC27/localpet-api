import express from "express";
import checkAuth from "../middleware/authMiddleware.js";
import { createVeterinary, findVeterinary, editVeterinary, deleteVeterinary, findAllVeterinaries } from "../controllers/VeterinaryController.js";
const router = express.Router();

router.post('/veterinary/create', checkAuth, createVeterinary);
router.get('/veterinary/:id', checkAuth, findVeterinary);
router.get('/veterinary', checkAuth, findAllVeterinaries);
router.put('/veterinary/edit/:id', checkAuth, editVeterinary);
router.delete('/veterinary/:id', checkAuth, deleteVeterinary);

export default router;