// import express from 'express';
// import authMiddleware from '../middlewares/authMiddleware.js';
// import adminMiddleware from '../middlewares/adminMiddleware.js';
// import {
//   getPendingDoctors,
//   verifyDoctor,
// } from '../controllers/adminController.js';

// const router = express.Router();

// router.use(authMiddleware);
// router.use(adminMiddleware);

// router.get('/doctors/pending', getPendingDoctors);
// router.put('/doctors/:id/verify', verifyDoctor);

// export default router;

import express from 'express'
import {addDoctor} from '../controllers/adminController.js'
import upload from '../middlewares/multer.js'

const adminRouter =express.Router()

adminRouter.post('/add-doctor', upload.single('image'),addDoctor)

export default adminRouter