import express from "express";
import { authenticate, register, confirmAccount, forgotPassword, checkPassword, resetPassword } from "../controllers/UsersController.js";

const router = express.Router();

router.post('/login', authenticate);
router.post('/register', register);
router.get('/confirm/:token', confirmAccount);
router.post('/forgot-password', forgotPassword);
router.get('/forgot-password/:token', checkPassword)
router.post('/forgot-password/:token', resetPassword)
export default router;
