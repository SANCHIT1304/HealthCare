// Base API Response
export interface ApiResponse<T> {
  statusCode: number;
  data: T;
  message: string;
  success: boolean;
}

// User/Doctor Types
export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: 'patient' | 'doctor' | 'admin';
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other';
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  // Doctor specific fields
  specialization?: string;
  experience?: number;
  consultationFee?: number;
  education?: string[];
  certifications?: string[];
  bio?: string;
  profileImage?: string;
  isVerified?: boolean;
  createdAt: string;
  updatedAt: string;
}

// Appointment Types
export interface Appointment {
  _id: string;
  patientId: User;
  doctorId: User;
  date: string;
  time: string;
  reason: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'no-show';
  notes?: string;
  prescription?: string;
  diagnosis?: string;
  symptoms?: string;
  followUpDate?: string;
  consultationFee: number;
  paymentStatus: 'pending' | 'paid' | 'refunded';
  cancelledBy?: 'patient' | 'doctor';
  cancellationReason?: string;
  createdAt: string;
  updatedAt: string;
}

// Availability Types
export interface TimeSlot {
  start: string;
  end: string;
}

export interface WeeklySchedule {
  monday: TimeSlot[];
  tuesday: TimeSlot[];
  wednesday: TimeSlot[];
  thursday: TimeSlot[];
  friday: TimeSlot[];
  saturday: TimeSlot[];
  sunday: TimeSlot[];
}

export interface Availability {
  _id: string;
  doctorId: string;
  weeklySchedule: WeeklySchedule;
  appointmentDuration: number; // in minutes
  bufferTime: number; // in minutes
  maxAppointmentsPerDay: number;
  emergencySlots: boolean;
  emergencyTimeSlots: TimeSlot[];
  notes?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Prescription Types
export interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
}

export interface LabTest {
  name: string;
  description: string;
  instructions: string;
}

export interface Prescription {
  _id: string;
  prescriptionNumber: string;
  appointmentId: string;
  doctorId: string;
  patientId: User;
  diagnosis: string;
  symptoms: string;
  medications: Medication[];
  notes: string;
  followUpDate?: string;
  followUpRequired: boolean;
  labTests: LabTest[];
  lifestyleRecommendations: string[];
  allergies: string[];
  contraindications: string[];
  status: 'active' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

// Dashboard Stats
export interface DashboardStats {
  totalAppointments: number;
  pendingAppointments: number;
  todayAppointments: number;
  completedAppointments: number;
  totalPatients: number;
  monthlyRevenue: number;
}

export interface DashboardData {
  stats: DashboardStats;
  recentAppointments: Appointment[];
  upcomingAppointments: Appointment[];
}

// Pagination
export interface Pagination {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

// Appointment List Response
export interface AppointmentListResponse {
  appointments: Appointment[];
  pagination: Pagination;
}

// Prescription List Response
export interface PrescriptionListResponse {
  prescriptions: Prescription[];
  pagination: Pagination;
}

// Available Slots Response
export interface AvailableSlotsResponse {
  date: string;
  availableSlots: TimeSlot[];
  totalSlots: number;
  bookedSlots: number;
}
