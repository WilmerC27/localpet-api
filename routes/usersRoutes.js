import express from "express";
import { authenticate, register, confirmAccount, forgotPassword, checkPassword, resetPassword, getRoles, createRol } from "../controllers/UsersController.js";
import checkAuth from "../middleware/authMiddleware.js";
import dashboardRoutes from './dashboardRoutes.js';

const router = express.Router();

//Public
router.post('/login', authenticate);
router.post('/register', register);
router.get('/confirm/:token', confirmAccount);
router.post('/forgot-password', forgotPassword);
router.get('/forgot-password/:token', checkPassword);
router.post('/forgot-password/:token', resetPassword);
router.get('/home', checkAuth, dashboardRoutes)
router.get('/roles', checkAuth, getRoles);
router.post('/roles', checkAuth, createRol);

export default router;