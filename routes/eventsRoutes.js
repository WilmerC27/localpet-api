import express from "express";
import checkAuth from "../middleware/authMiddleware.js";
import { getEvents, createEvents, editEvents, deleteEvents } from "../controllers/EventsController.js";

const router = express.Router();

router.get('/events', checkAuth, getEvents);
router.post('/events/create', checkAuth, createEvents);
router.put('/events/edit/:id', checkAuth, editEvents);
router.delete('/events/:id', checkAuth, deleteEvents);

export default router;