import express from 'express';
import {
  getVerifiedDoctors,
  getDoctorProfile,
  getDoctorAvailability,
  bookAppointment,
  getAppointments,
  cancelAppointment,
  getPrescriptions,
  getProfile
} from '../controllers/patientController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { validatePatient } from '../middlewares/roleMiddleware.js';

const router = express.Router();

// Apply authentication and patient role middleware to all routes
router.use(protect);
router.use(validatePatient);

// Doctor search and profile routes
router.get('/doctors', getVerifiedDoctors);
router.get('/doctors/:doctorId', getDoctorProfile);
router.get('/doctors/:doctorId/availability/:date', getDoctorAvailability);

// Appointment routes
router.post('/appointments', bookAppointment);
router.get('/appointments', getAppointments);
router.patch('/appointments/:appointmentId/cancel', cancelAppointment);

// Prescription routes
router.get('/prescriptions', getPrescriptions);

// Profile routes
router.get('/profile', getProfile);

export default router;
