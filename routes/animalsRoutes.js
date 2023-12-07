import express from "express";
import checkAuth from "../middleware/authMiddleware.js";
import {getAnimals,createAnimal,editAnimal, deleteAnimal } from "../controllers/AnimalsController.js";
const router = express.Router();

router.get('/animals',checkAuth,getAnimals);
router.post('/animals/create',checkAuth, createAnimal);
router.put('/animals/edit/:id',checkAuth, editAnimal);
router.delete('/animals/:id',checkAuth, deleteAnimal);

export default router;