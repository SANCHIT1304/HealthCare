import express from 'express';
import { register, login, getMyProfile } from '../controllers/authController.js';
import {protect} from '../middlewares/authMiddleware.js';
// import { check } from 'express-validator';

const router = express.Router();

router.post('/register', register);
// router.post('/login', loginUser);
// router.post('/register', [
//   check('name', 'Name is required').notEmpty(),
//   check('email', 'Valid email is required').isEmail(),
//   check('password', 'Password must be 6+ characters').isLength({ min: 6 }),
//   check('role', 'Role is required').notEmpty(),
// ], register);

router.post('/login', login);
router.get('/profile', protect, getMyProfile);

export default router;
