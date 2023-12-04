import express from "express";
import checkAuth from "../middleware/authMiddleware.js";
import { createAnimal,editAnimal, deleteAnimal } from "../controllers/AnimalsController.js";
const router = express.Router();

router.post('/veterinary/create', checkAuth, createAnimal);
router.put('/veterinary/edit/:id', checkAuth, editAnimal);
router.delete('/veterinary/:id', checkAuth, deleteAnimal);

export default router;