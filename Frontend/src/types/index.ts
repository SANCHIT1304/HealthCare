export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'patient' | 'doctor' | 'admin';
  avatar?: string;
  phone?: string;
  dateOfBirth?: string;
  createdAt: string;
}

export interface Patient extends User {
  role: 'patient';
  medicalHistory?: string[];
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
}

export interface Doctor extends User {
  role: 'doctor';
  specialization: string;
  licenseNumber: string;
  experience: number;
  education: string[];
  isVerified: boolean;
  isApproved: boolean;
  consultationFee: number;
  availability: {
    [key: string]: { start: string; end: string; }[];
  };
  rating: number;
  reviewsCount: number;
}

export interface Admin extends User {
  role: 'admin';
  permissions: string[];
}

export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  reason: string;
  notes?: string;
  prescription?: string;
  createdAt: string;
}

export interface HealthRecord {
  id: string;
  patientId: string;
  date: string;
  type: 'weight' | 'blood_pressure' | 'glucose' | 'heart_rate' | 'temperature';
  value: number;
  unit: string;
  notes?: string;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: Partial<User> & { password: string }) => Promise<void>;
  logout: () => void;
  loading: boolean;
}