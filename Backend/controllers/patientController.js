import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import User from '../models/UserModel.js';
import Appointment from '../models/AppointmentModel.js';
import Availability from '../models/AvailabilityModel.js';
import Prescription from '../models/PrescriptionModel.js';

// Get verified doctors with filters
const getVerifiedDoctors = asyncHandler(async (req, res) => {
  const { specialization, search, page = 1, limit = 10 } = req.query;
  
  const filter = {
    role: 'doctor',
    isVerified: true
  };

  if (specialization) {
    filter.specialization = { $regex: specialization, $options: 'i' };
  }

  if (search) {
    filter.$or = [
      { firstName: { $regex: search, $options: 'i' } },
      { lastName: { $regex: search, $options: 'i' } },
      { specialization: { $regex: search, $options: 'i' } }
    ];
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);
  
  const doctors = await User.find(filter)
    .select('-password -__v')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  const total = await User.countDocuments(filter);

  const pagination = {
    currentPage: parseInt(page),
    totalPages: Math.ceil(total / parseInt(limit)),
    totalItems: total,
    itemsPerPage: parseInt(limit)
  };

  res.status(200).json(
    new ApiResponse(200, { doctors, pagination }, "Doctors retrieved successfully")
  );
});

// Get doctor profile
const getDoctorProfile = asyncHandler(async (req, res) => {
  const { doctorId } = req.params;

  const doctor = await User.findOne({
    _id: doctorId,
    role: 'doctor',
    isVerified: true
  }).select('-password -__v');

  if (!doctor) {
    throw new ApiError(404, "Doctor not found");
  }

  res.status(200).json(
    new ApiResponse(200, doctor, "Doctor profile retrieved successfully")
  );
});

// Book appointment
const bookAppointment = asyncHandler(async (req, res) => {
  try {
    console.log('Request body:', req.body);
    console.log('Request user:', req.user);
    
    const { doctorId, date, time, reason } = req.body;
    const patientId = req.user.id;
    
    console.log('Booking appointment:', { doctorId, date, time, reason, patientId });

  if (!doctorId || !date || !time || !reason) {
    throw new ApiError(400, "All fields are required");
  }

  console.log('Looking for doctor with ID:', doctorId);
  const doctor = await User.findOne({
    _id: doctorId,
    role: 'doctor',
    isVerified: true
  });

  if (!doctor) {
    console.log('Doctor not found or not verified');
    throw new ApiError(404, "Doctor not found or not verified");
  }
  console.log('Found doctor:', doctor.firstName, doctor.lastName);

  // Parse the date string and validate
  const appointmentDate = new Date(date);
  if (isNaN(appointmentDate.getTime())) {
    throw new ApiError(400, "Invalid date format");
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  if (appointmentDate < today) {
    throw new ApiError(400, "Appointment date must be in the future");
  }

  // Check for existing appointments with proper date comparison
  const existingAppointment = await Appointment.findOne({
    doctorId,
    date: {
      $gte: appointmentDate,
      $lt: new Date(appointmentDate.getTime() + 24 * 60 * 60 * 1000)
    },
    time,
    status: { $in: ['pending', 'confirmed'] }
  });

  if (existingAppointment) {
    throw new ApiError(400, "This time slot is already booked");
  }

  const appointmentData = {
    patientId,
    doctorId,
    date: appointmentDate, // Use the parsed Date object
    time,
    reason,
    status: 'pending',
    consultationFee: doctor.consultationFee || 0,
    paymentStatus: 'pending'
  };

  console.log('Creating appointment with data:', appointmentData);

  let appointment;
  try {
    appointment = await Appointment.create(appointmentData);
    console.log('Appointment created successfully:', appointment._id);
  } catch (createError) {
    console.error('Error creating appointment:', createError);
    if (createError.name === 'ValidationError') {
      throw new ApiError(400, `Validation Error: ${createError.message}`);
    }
    throw new ApiError(500, 'Failed to create appointment');
  }

  try {
    await appointment.populate([
      { path: 'doctorId', select: 'firstName lastName specialization profileImage' },
      { path: 'patientId', select: 'firstName lastName email phone' }
    ]);
  } catch (populateError) {
    console.error('Population error:', populateError);
    // Continue without population if it fails
  }

    res.status(201).json(
      new ApiResponse(201, appointment, "Appointment booked successfully")
    );
  } catch (error) {
    console.error('Error in bookAppointment:', error);
    throw error;
  }
});

// Get patient appointments
const getAppointments = asyncHandler(async (req, res) => {
  const patientId = req.user.id;
  const { status, page = 1, limit = 10 } = req.query;

  const filter = { patientId };
  if (status && status !== 'all') {
    filter.status = status;
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const appointments = await Appointment.find(filter)
    .populate('doctorId', 'firstName lastName specialization profileImage')
    .sort({ date: -1, time: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  const total = await Appointment.countDocuments(filter);

  const pagination = {
    currentPage: parseInt(page),
    totalPages: Math.ceil(total / parseInt(limit)),
    totalItems: total,
    itemsPerPage: parseInt(limit)
  };

  res.status(200).json(
    new ApiResponse(200, { appointments, pagination }, "Appointments retrieved successfully")
  );
});

// Cancel appointment
const cancelAppointment = asyncHandler(async (req, res) => {
  const { appointmentId } = req.params;
  const { cancellationReason } = req.body;
  const patientId = req.user.id;

  if (!cancellationReason) {
    throw new ApiError(400, "Cancellation reason is required");
  }

  const appointment = await Appointment.findOne({
    _id: appointmentId,
    patientId,
    status: { $in: ['pending', 'confirmed'] }
  });

  if (!appointment) {
    throw new ApiError(404, "Appointment not found or cannot be cancelled");
  }

  appointment.status = 'cancelled';
  appointment.cancelledBy = 'patient';
  appointment.cancellationReason = cancellationReason;
  await appointment.save();

  res.status(200).json(
    new ApiResponse(200, appointment, "Appointment cancelled successfully")
  );
});

// Get patient prescriptions
const getPrescriptions = asyncHandler(async (req, res) => {
  const patientId = req.user.id;
  const { page = 1, limit = 10 } = req.query;

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const prescriptions = await Prescription.find({ patientId })
    .populate('doctorId', 'firstName lastName specialization')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  const total = await Prescription.countDocuments({ patientId });

  const pagination = {
    currentPage: parseInt(page),
    totalPages: Math.ceil(total / parseInt(limit)),
    totalItems: total,
    itemsPerPage: parseInt(limit)
  };

  res.status(200).json(
    new ApiResponse(200, { prescriptions, pagination }, "Prescriptions retrieved successfully")
  );
});

// Get patient profile
const getProfile = asyncHandler(async (req, res) => {
  const patientId = req.user.id;

  const patient = await User.findById(patientId).select('-password -__v');

  if (!patient) {
    throw new ApiError(404, "Patient not found");
  }

  res.status(200).json(
    new ApiResponse(200, patient, "Profile retrieved successfully")
  );
});

// Get doctor availability (real slots based on Availability + filter out booked)
const getDoctorAvailability = asyncHandler(async (req, res) => {
  const { doctorId, date } = req.params;

  const doctor = await User.findOne({
    _id: doctorId,
    role: 'doctor',
    isVerified: true
  });

  if (!doctor) {
    throw new ApiError(404, "Doctor not found");
  }

  const requestedDate = new Date(date);
  if (isNaN(requestedDate.getTime())) {
    throw new ApiError(400, 'Invalid date format');
  }

  // Generate raw available slots from doctor's weekly schedule
  const allSlots = await Availability.getAvailableSlots(doctorId, requestedDate);

  // Filter out already booked slots for that doctor and date
  const dayStart = new Date(requestedDate);
  dayStart.setHours(0, 0, 0, 0);
  const dayEnd = new Date(dayStart);
  dayEnd.setDate(dayEnd.getDate() + 1);

  const existingAppointments = await Appointment.find({
    doctorId,
    date: { $gte: dayStart, $lt: dayEnd },
    status: { $in: ['pending', 'confirmed'] }
  });
  const bookedTimes = new Set(existingAppointments.map((apt) => apt.time));

  const availableSlots = allSlots.filter((slot) => !bookedTimes.has(slot.start));

  res.status(200).json(
    new ApiResponse(
      200,
      {
        date,
        availableSlots,
        totalSlots: allSlots.length,
        bookedSlots: allSlots.length - availableSlots.length
      },
      'Availability retrieved successfully'
    )
  );
});

export {
  getVerifiedDoctors,
  getDoctorProfile,
  getDoctorAvailability,
  bookAppointment,
  getAppointments,
  cancelAppointment,
  getPrescriptions,
  getProfile
};
