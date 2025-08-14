import express from 'express';
import { register, login, getMyProfile } from '../controllers/authController.js';
import {protect} from '../middlewares/authMiddleware.js';
import { validateRegistration, validateLogin } from '../middlewares/validationMiddleware.js';

const router = express.Router();

router.post('/register', validateRegistration, register);
router.post('/login', validateLogin, login);
router.get('/profile', protect, getMyProfile);

export default router;
