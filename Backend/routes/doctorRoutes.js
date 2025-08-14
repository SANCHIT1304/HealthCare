import express from 'express';
import {
  getDashboardStats,
  getAppointments,
  updateAppointmentStatus,
  getAvailability,
  updateAvailability,
  getAvailableSlots,
  createPrescription,
  getPrescriptions,
  updatePrescription,
  getDoctorProfile,
  updateDoctorProfile,
  getAppointmentDetails,
  cancelAppointment
} from '../controllers/doctorController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { validateDoctor } from '../middlewares/roleMiddleware.js';

const router = express.Router();

// Apply authentication and doctor role middleware to all routes
router.use(protect);
router.use(validateDoctor);

// Dashboard routes
router.get('/dashboard/stats', getDashboardStats);

// Appointment routes
router.get('/appointments', getAppointments);
router.get('/appointments/:appointmentId', getAppointmentDetails);
router.patch('/appointments/:appointmentId/status', updateAppointmentStatus);
router.patch('/appointments/:appointmentId/cancel', cancelAppointment);

// Availability routes
router.get('/availability', getAvailability);
router.put('/availability', updateAvailability);
router.get('/availability/slots/:date', getAvailableSlots);

// Prescription routes
router.post('/prescriptions', createPrescription);
router.get('/prescriptions', getPrescriptions);
router.put('/prescriptions/:prescriptionId', updatePrescription);

// Profile routes
router.get('/profile', getDoctorProfile);
router.put('/profile', updateDoctorProfile);

export default router;
