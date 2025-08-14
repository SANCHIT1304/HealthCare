import Appointment from '../models/AppointmentModel.js';
import Availability from '../models/AvailabilityModel.js';
import Prescription from '../models/PrescriptionModel.js';
import User from '../models/UserModel.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';

// Get doctor dashboard statistics
const getDashboardStats = asyncHandler(async (req, res) => {
  const doctorId = req.user.id;
  
  // Get today's date
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  // Get appointments statistics
  const totalAppointments = await Appointment.countDocuments({ doctorId });
  const pendingAppointments = await Appointment.countDocuments({ 
    doctorId, 
    status: 'pending' 
  });
  const todayAppointments = await Appointment.countDocuments({
    doctorId,
    date: {
      $gte: today,
      $lt: tomorrow
    }
  });
  const completedAppointments = await Appointment.countDocuments({
    doctorId,
    status: 'completed'
  });
  
  // Get total patients
  const uniquePatients = await Appointment.distinct('patientId', { doctorId });
  const totalPatients = uniquePatients.length;
  
  // Get monthly revenue (last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  const monthlyRevenue = await Appointment.aggregate([
    {
      $match: {
        doctorId: doctorId,
        status: 'completed',
        createdAt: { $gte: thirtyDaysAgo }
      }
    },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: '$consultationFee' }
      }
    }
  ]);
  
  const revenue = monthlyRevenue.length > 0 ? monthlyRevenue[0].totalRevenue : 0;
  
  // Get recent appointments
  const recentAppointments = await Appointment.find({ doctorId })
    .populate('patientId', 'firstName lastName')
    .sort({ date: 1 })
    .limit(5);
  
  // Get upcoming appointments
  const upcomingAppointments = await Appointment.find({
    doctorId,
    date: { $gte: today },
    status: { $in: ['confirmed', 'pending'] }
  })
    .populate('patientId', 'firstName lastName')
    .sort({ date: 1 })
    .limit(5);
  
  res.status(200).json(new ApiResponse(200, {
    stats: {
      totalAppointments,
      pendingAppointments,
      todayAppointments,
      completedAppointments,
      totalPatients,
      monthlyRevenue: revenue
    },
    recentAppointments,
    upcomingAppointments
  }, 'Dashboard statistics retrieved successfully'));
});

// Get doctor's appointments with filters
const getAppointments = asyncHandler(async (req, res) => {
  const doctorId = req.user.id;
  const { 
    status, 
    date, 
    page = 1, 
    limit = 10,
    search,
    timeFilter 
  } = req.query;
  
  const query = { doctorId };
  
  // Apply status filter
  if (status && status !== 'all') {
    query.status = status;
  }
  
  // Apply date filter
  if (date) {
    const filterDate = new Date(date);
    filterDate.setHours(0, 0, 0, 0);
    const nextDay = new Date(filterDate);
    nextDay.setDate(nextDay.getDate() + 1);
    
    query.date = {
      $gte: filterDate,
      $lt: nextDay
    };
  }
  
  // Apply time filter
  if (timeFilter) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);
    
    switch (timeFilter) {
      case 'today':
        query.date = {
          $gte: today,
          $lt: tomorrow
        };
        break;
      case 'tomorrow':
        query.date = {
          $gte: tomorrow,
          $lt: new Date(tomorrow.getTime() + 24 * 60 * 60 * 1000)
        };
        break;
      case 'this-week':
        query.date = {
          $gte: today,
          $lt: nextWeek
        };
        break;
      case 'upcoming':
        query.date = { $gte: today };
        break;
      case 'past':
        query.date = { $lt: today };
        break;
    }
  }
  
  // Apply search filter
  if (search) {
    query.$or = [
      { reason: { $regex: search, $options: 'i' } },
      { notes: { $regex: search, $options: 'i' } }
    ];
  }
  
  const pageNumber = parseInt(page, 10) || 1;
  const limitNumber = parseInt(limit, 10) || 10;
  const skip = (pageNumber - 1) * limitNumber;
  
  const appointments = await Appointment.find(query)
    .populate('patientId', 'firstName lastName phone email')
    .sort({ date: 1, time: 1 })
    .skip(skip)
    .limit(limitNumber);
  
  const total = await Appointment.countDocuments(query);
  
  res.status(200).json(new ApiResponse(200, {
    appointments,
    pagination: {
      currentPage: pageNumber,
      totalPages: Math.ceil(total / limitNumber),
      totalItems: total,
      itemsPerPage: limitNumber
    }
  }, 'Appointments retrieved successfully'));
});

// Update appointment status
const updateAppointmentStatus = asyncHandler(async (req, res) => {
  const { appointmentId } = req.params;
  const { status, notes, prescription, diagnosis, symptoms, followUpDate } = req.body;
  
  const appointment = await Appointment.findById(appointmentId);
  
  if (!appointment) {
    throw new ApiError(404, 'Appointment not found');
  }
  
  if (appointment.doctorId.toString() !== req.user.id.toString()) {
    throw new ApiError(403, 'You can only update your own appointments');
  }
  
  // Update appointment
  appointment.status = status;
  if (notes) appointment.notes = notes;
  if (prescription) appointment.prescription = prescription;
  if (diagnosis) appointment.diagnosis = diagnosis;
  if (symptoms) appointment.symptoms = symptoms;
  if (followUpDate) appointment.followUpDate = followUpDate;
  
  await appointment.save();
  
  // If appointment is completed, create prescription
  if (status === 'completed' && (diagnosis || prescription)) {
    const prescriptionData = {
      appointmentId: appointment._id,
      doctorId: req.user.id,
      patientId: appointment.patientId,
      diagnosis: diagnosis || 'No specific diagnosis',
      symptoms: symptoms || '',
      notes: prescription || '',
      medications: [],
      followUpDate: followUpDate || null,
      followUpRequired: !!followUpDate
    };
    
    await Prescription.create(prescriptionData);
  }
  
  res.status(200).json(new ApiResponse(200, appointment, 'Appointment status updated successfully'));
});

// Get doctor's availability
const getAvailability = asyncHandler(async (req, res) => {
  const doctorId = req.user.id;
  
  let availability = await Availability.findOne({ doctorId });
  
  if (!availability) {
    // Create default availability if none exists
    availability = await Availability.create({
      doctorId,
      weeklySchedule: {
        monday: [],
        tuesday: [],
        wednesday: [],
        thursday: [],
        friday: [],
        saturday: [],
        sunday: []
      }
    });
  }
  
  res.status(200).json(new ApiResponse(200, availability, 'Availability retrieved successfully'));
});

// Update doctor's availability
const updateAvailability = asyncHandler(async (req, res) => {
  const doctorId = req.user.id;
  const {
    weeklySchedule,
    appointmentDuration,
    bufferTime,
    maxAppointmentsPerDay,
    emergencySlots,
    emergencyTimeSlots,
    notes,
    isActive
  } = req.body;
  
  let availability = await Availability.findOne({ doctorId });
  
  if (!availability) {
    availability = new Availability({ doctorId });
  }
  
  // Update fields
  if (weeklySchedule) availability.weeklySchedule = weeklySchedule;
  if (appointmentDuration) availability.appointmentDuration = appointmentDuration;
  if (bufferTime !== undefined) availability.bufferTime = bufferTime;
  if (maxAppointmentsPerDay) availability.maxAppointmentsPerDay = maxAppointmentsPerDay;
  if (emergencySlots !== undefined) availability.emergencySlots = emergencySlots;
  if (emergencyTimeSlots) availability.emergencyTimeSlots = emergencyTimeSlots;
  if (notes !== undefined) availability.notes = notes;
  if (isActive !== undefined) availability.isActive = isActive;
  
  await availability.save();
  
  res.status(200).json(new ApiResponse(200, availability, 'Availability updated successfully'));
});

// Get available time slots for a specific date
const getAvailableSlots = asyncHandler(async (req, res) => {
  const { date } = req.params;
  const doctorId = req.user.id;
  
  const requestedDate = new Date(date);
  if (isNaN(requestedDate.getTime())) {
    throw new ApiError(400, 'Invalid date format');
  }
  
  const availableSlots = await Availability.getAvailableSlots(doctorId, requestedDate);
  
  // Filter out already booked slots
  const bookedAppointments = await Appointment.find({
    doctorId,
    date: {
      $gte: requestedDate,
      $lt: new Date(requestedDate.getTime() + 24 * 60 * 60 * 1000)
    },
    status: { $in: ['pending', 'confirmed'] }
  });
  
  const bookedTimes = bookedAppointments.map(apt => apt.time);
  const availableSlotsFiltered = availableSlots.filter(slot => 
    !bookedTimes.includes(slot.start)
  );
  
  res.status(200).json(new ApiResponse(200, {
    date: requestedDate,
    availableSlots: availableSlotsFiltered,
    totalSlots: availableSlots.length,
    bookedSlots: bookedTimes.length
  }, 'Available slots retrieved successfully'));
});

// Create prescription
const createPrescription = asyncHandler(async (req, res) => {
  const {
    appointmentId,
    diagnosis,
    symptoms,
    medications,
    notes,
    followUpDate,
    followUpRequired,
    labTests,
    lifestyleRecommendations,
    allergies,
    contraindications
  } = req.body;
  
  const doctorId = req.user.id;
  
  // Verify appointment exists and belongs to doctor
  const appointment = await Appointment.findById(appointmentId);
  if (!appointment) {
    throw new ApiError(404, 'Appointment not found');
  }
  
  if (appointment.doctorId.toString() !== doctorId.toString()) {
    throw new ApiError(403, 'You can only create prescriptions for your appointments');
  }
  
  // Check if prescription already exists
  const existingPrescription = await Prescription.findOne({ appointmentId });
  if (existingPrescription) {
    throw new ApiError(400, 'Prescription already exists for this appointment');
  }
  
  const prescription = await Prescription.create({
    appointmentId,
    doctorId,
    patientId: appointment.patientId,
    diagnosis,
    symptoms,
    medications,
    notes,
    followUpDate,
    followUpRequired,
    labTests,
    lifestyleRecommendations,
    allergies,
    contraindications
  });
  
  // Update appointment status to completed
  appointment.status = 'completed';
  appointment.diagnosis = diagnosis;
  appointment.symptoms = symptoms;
  appointment.notes = notes;
  await appointment.save();
  
  res.status(201).json(new ApiResponse(201, prescription, 'Prescription created successfully'));
});

// Get doctor's prescriptions
const getPrescriptions = asyncHandler(async (req, res) => {
  const doctorId = req.user.id;
  const { status, page = 1, limit = 10 } = req.query;
  
  const query = { doctorId };
  if (status && status !== 'all') {
    query.status = status;
  }
  
  const skip = (page - 1) * limit;
  
  const prescriptions = await Prescription.find(query)
    .populate('patientId', 'firstName lastName')
    .populate('appointmentId', 'date time reason')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));
  
  const total = await Prescription.countDocuments(query);
  
  res.status(200).json(new ApiResponse(200, {
    prescriptions,
    pagination: {
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / limit),
      totalItems: total,
      itemsPerPage: parseInt(limit)
    }
  }, 'Prescriptions retrieved successfully'));
});

// Update prescription
const updatePrescription = asyncHandler(async (req, res) => {
  const { prescriptionId } = req.params;
  const updateData = req.body;
  
  const prescription = await Prescription.findById(prescriptionId);
  
  if (!prescription) {
    throw new ApiError(404, 'Prescription not found');
  }
  
  if (prescription.doctorId.toString() !== req.user.id.toString()) {
    throw new ApiError(403, 'You can only update your own prescriptions');
  }
  
  Object.assign(prescription, updateData);
  await prescription.save();
  
  res.status(200).json(new ApiResponse(200, prescription, 'Prescription updated successfully'));
});

// Get doctor profile
const getDoctorProfile = asyncHandler(async (req, res) => {
  const doctorId = req.user.id;
  
  const doctor = await User.findById(doctorId).select('-password');
  
  if (!doctor) {
    throw new ApiError(404, 'Doctor not found');
  }
  
  res.status(200).json(new ApiResponse(200, doctor, 'Doctor profile retrieved successfully'));
});

// Update doctor profile
const updateDoctorProfile = asyncHandler(async (req, res) => {
  const doctorId = req.user.id;
  const updateData = req.body;
  
  // Remove sensitive fields that shouldn't be updated
  delete updateData.password;
  delete updateData.email;
  delete updateData.role;
  delete updateData.isVerified;
  
  const doctor = await User.findByIdAndUpdate(
    doctorId,
    updateData,
    { new: true, runValidators: true }
  ).select('-password');
  
  if (!doctor) {
    throw new ApiError(404, 'Doctor not found');
  }
  
  res.status(200).json(new ApiResponse(200, doctor, 'Doctor profile updated successfully'));
});

// Get appointment details
const getAppointmentDetails = asyncHandler(async (req, res) => {
  const { appointmentId } = req.params;
  const doctorId = req.user.id;
  
  const appointment = await Appointment.findById(appointmentId)
    .populate('patientId', 'firstName lastName phone email dateOfBirth')
    .populate('doctorId', 'firstName lastName specialization');
  
  if (!appointment) {
    throw new ApiError(404, 'Appointment not found');
  }
  
  if (appointment.doctorId._id.toString() !== doctorId.toString()) {
    throw new ApiError(403, 'You can only view your own appointments');
  }
  
  // Get prescription if exists
  const prescription = await Prescription.findOne({ appointmentId });
  
  res.status(200).json(new ApiResponse(200, {
    appointment,
    prescription
  }, 'Appointment details retrieved successfully'));
});

// Cancel appointment
const cancelAppointment = asyncHandler(async (req, res) => {
  const { appointmentId } = req.params;
  const { cancellationReason } = req.body;
  
  const appointment = await Appointment.findById(appointmentId);
  
  if (!appointment) {
    throw new ApiError(404, 'Appointment not found');
  }
  
  if (appointment.doctorId.toString() !== req.user.id.toString()) {
    throw new ApiError(403, 'You can only cancel your own appointments');
  }
  
  if (appointment.status === 'cancelled') {
    throw new ApiError(400, 'Appointment is already cancelled');
  }
  
  appointment.status = 'cancelled';
  appointment.cancelledBy = 'doctor';
  appointment.cancellationReason = cancellationReason;
  
  await appointment.save();
  
  res.status(200).json(new ApiResponse(200, appointment, 'Appointment cancelled successfully'));
});

export {
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
};
