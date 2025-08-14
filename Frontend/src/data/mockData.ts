import { User, Doctor, Appointment, HealthRecord } from '../types';

export const mockUsers: User[] = [
  {
    id: '1',
    email: 'john.patient@email.com',
    firstName: 'John',
    lastName: 'Doe',
    role: 'patient',
    phone: '+1-555-0123',
    dateOfBirth: '1990-05-15',
    createdAt: '2024-01-15T10:00:00Z',
    avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
  },
  {
    id: '2',
    email: 'dr.smith@hospital.com',
    firstName: 'Dr. Sarah',
    lastName: 'Smith',
    role: 'doctor',
    phone: '+1-555-0124',
    createdAt: '2024-01-10T09:00:00Z',
    avatar: 'https://images.pexels.com/photos/5215024/pexels-photo-5215024.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
  },
  {
    id: '3',
    email: 'admin@hospital.com',
    firstName: 'Admin',
    lastName: 'User',
    role: 'admin',
    createdAt: '2024-01-01T08:00:00Z',
    avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
  }
];

export const mockDoctors: Doctor[] = [
  {
    id: '2',
    email: 'dr.smith@hospital.com',
    firstName: 'Dr. Sarah',
    lastName: 'Smith',
    role: 'doctor',
    phone: '+1-555-0124',
    createdAt: '2024-01-10T09:00:00Z',
    avatar: 'https://images.pexels.com/photos/5215024/pexels-photo-5215024.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    specialization: 'Cardiology',
    licenseNumber: 'MD123456',
    experience: 12,
    education: ['Harvard Medical School', 'Johns Hopkins Residency'],
    isVerified: true,
    isApproved: true,
    consultationFee: 150,
    availability: {
      monday: [{ start: '09:00', end: '12:00' }, { start: '14:00', end: '17:00' }],
      tuesday: [{ start: '09:00', end: '12:00' }, { start: '14:00', end: '17:00' }],
      wednesday: [{ start: '09:00', end: '12:00' }],
      thursday: [{ start: '09:00', end: '12:00' }, { start: '14:00', end: '17:00' }],
      friday: [{ start: '09:00', end: '12:00' }]
    },
    rating: 4.8,
    reviewsCount: 127
  },
  {
    id: '4',
    email: 'dr.johnson@hospital.com',
    firstName: 'Dr. Michael',
    lastName: 'Johnson',
    role: 'doctor',
    phone: '+1-555-0125',
    createdAt: '2024-01-12T10:00:00Z',
    avatar: 'https://images.pexels.com/photos/612349/pexels-photo-612349.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    specialization: 'Dermatology',
    licenseNumber: 'MD789012',
    experience: 8,
    education: ['Stanford Medical School', 'UCSF Residency'],
    isVerified: true,
    isApproved: false, // Pending approval
    consultationFee: 120,
    availability: {
      monday: [{ start: '10:00', end: '13:00' }, { start: '15:00', end: '18:00' }],
      tuesday: [{ start: '10:00', end: '13:00' }, { start: '15:00', end: '18:00' }],
      wednesday: [{ start: '10:00', end: '13:00' }, { start: '15:00', end: '18:00' }],
      thursday: [{ start: '10:00', end: '13:00' }],
      friday: [{ start: '10:00', end: '13:00' }, { start: '15:00', end: '18:00' }]
    },
    rating: 4.6,
    reviewsCount: 89
  },
  {
    id: '5',
    email: 'dr.williams@hospital.com',
    firstName: 'Dr. Emily',
    lastName: 'Williams',
    role: 'doctor',
    phone: '+1-555-0126',
    createdAt: '2024-01-14T11:00:00Z',
    avatar: 'https://images.pexels.com/photos/5452293/pexels-photo-5452293.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    specialization: 'Pediatrics',
    licenseNumber: 'MD345678',
    experience: 15,
    education: ['Yale Medical School', 'Boston Children\'s Hospital Fellowship'],
    isVerified: true,
    isApproved: true,
    consultationFee: 130,
    availability: {
      monday: [{ start: '08:00', end: '12:00' }, { start: '13:00', end: '16:00' }],
      tuesday: [{ start: '08:00', end: '12:00' }, { start: '13:00', end: '16:00' }],
      wednesday: [{ start: '08:00', end: '12:00' }],
      thursday: [{ start: '08:00', end: '12:00' }, { start: '13:00', end: '16:00' }],
      friday: [{ start: '08:00', end: '12:00' }]
    },
    rating: 4.9,
    reviewsCount: 203
  },
  {
    id: '6',
    email: 'dr.brown@hospital.com',
    firstName: 'Dr. Robert',
    lastName: 'Brown',
    role: 'doctor',
    phone: '+1-555-0127',
    createdAt: '2024-03-01T14:00:00Z',
    avatar: 'https://images.pexels.com/photos/5327921/pexels-photo-5327921.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    specialization: 'Orthopedics',
    licenseNumber: 'MD567890',
    experience: 10,
    education: ['UCLA Medical School', 'Mayo Clinic Fellowship'],
    isVerified: true,
    isApproved: false, // Pending approval
    consultationFee: 180,
    availability: {
      monday: [{ start: '09:00', end: '12:00' }, { start: '14:00', end: '17:00' }],
      tuesday: [{ start: '09:00', end: '12:00' }, { start: '14:00', end: '17:00' }],
      wednesday: [{ start: '09:00', end: '12:00' }],
      thursday: [{ start: '09:00', end: '12:00' }, { start: '14:00', end: '17:00' }],
      friday: [{ start: '09:00', end: '12:00' }]
    },
    rating: 4.7,
    reviewsCount: 156
  }
];

export const mockAppointments: Appointment[] = [
  {
    id: '1',
    patientId: '1',
    doctorId: '2',
    date: '2024-03-15',
    time: '10:00',
    status: 'confirmed',
    reason: 'Regular checkup',
    createdAt: '2024-03-01T10:00:00Z'
  },
  {
    id: '2',
    patientId: '1',
    doctorId: '4',
    date: '2024-03-20',
    time: '14:30',
    status: 'pending',
    reason: 'Skin consultation',
    createdAt: '2024-03-05T14:00:00Z'
  },
  {
    id: '3',
    patientId: '1',
    doctorId: '5',
    date: '2024-02-28',
    time: '09:00',
    status: 'completed',
    reason: 'Annual physical examination',
    notes: 'Patient is in good health. Recommended regular exercise and balanced diet.',
    prescription: 'Vitamin D supplements - 1000 IU daily',
    createdAt: '2024-02-20T15:00:00Z'
  },
  {
    id: '4',
    patientId: '1',
    doctorId: '2',
    date: '2024-02-15',
    time: '11:30',
    status: 'cancelled',
    reason: 'Chest pain consultation',
    createdAt: '2024-02-10T12:00:00Z'
  },
  {
    id: '5',
    patientId: '1',
    doctorId: '4',
    date: '2024-04-05',
    time: '16:00',
    status: 'confirmed',
    reason: 'Follow-up dermatology consultation',
    createdAt: '2024-03-25T09:00:00Z'
  }
];

export const mockHealthRecords: HealthRecord[] = [
  {
    id: '1',
    patientId: '1',
    date: '2024-03-01',
    type: 'weight',
    value: 75,
    unit: 'kg'
  },
  {
    id: '2',
    patientId: '1',
    date: '2024-03-01',
    type: 'blood_pressure',
    value: 120,
    unit: 'mmHg',
    notes: 'Systolic reading'
  },
  {
    id: '3',
    patientId: '1',
    date: '2024-03-01',
    type: 'heart_rate',
    value: 72,
    unit: 'bpm'
  },
  {
    id: '4',
    patientId: '1',
    date: '2024-02-28',
    type: 'weight',
    value: 76,
    unit: 'kg'
  },
  {
    id: '5',
    patientId: '1',
    date: '2024-02-25',
    type: 'glucose',
    value: 95,
    unit: 'mg/dL'
  }
];

export const mockPrescriptions = [
  {
    id: '1',
    appointmentId: '3',
    patientId: '1',
    diagnosis: 'Hypertension',
    symptoms: 'High blood pressure, occasional headaches',
    medications: [
      {
        name: 'Lisinopril',
        dosage: '10mg',
        frequency: 'Once daily',
        duration: '30 days',
        instructions: 'Take in the morning with food',
        quantity: 30,
        unit: 'tablets'
      },
      {
        name: 'Amlodipine',
        dosage: '5mg',
        frequency: 'Once daily',
        duration: '30 days',
        instructions: 'Take in the evening',
        quantity: 30,
        unit: 'tablets'
      }
    ],
    notes: 'Monitor blood pressure weekly. Follow up in 4 weeks.',
    followUpDate: '2024-04-15',
    followUpRequired: true,
    labTests: [
      {
        name: 'Complete Blood Count',
        description: 'Routine blood work to monitor overall health',
        urgency: 'routine'
      },
      {
        name: 'Kidney Function Test',
        description: 'Monitor kidney function due to medication',
        urgency: 'routine'
      }
    ],
    lifestyleRecommendations: [
      {
        category: 'diet',
        recommendation: 'Reduce sodium intake to less than 2g per day'
      },
      {
        category: 'exercise',
        recommendation: '30 minutes of moderate exercise 5 days per week'
      },
      {
        category: 'stress',
        recommendation: 'Practice stress management techniques'
      }
    ],
    allergies: ['Penicillin', 'Sulfa drugs'],
    contraindications: ['Pregnancy', 'Severe kidney disease'],
    status: 'active'
  },
  {
    id: '2',
    appointmentId: '5',
    patientId: '1',
    diagnosis: 'Eczema',
    symptoms: 'Dry, itchy skin patches on arms and legs',
    medications: [
      {
        name: 'Hydrocortisone Cream',
        dosage: '1%',
        frequency: 'Twice daily',
        duration: '14 days',
        instructions: 'Apply to affected areas after bathing',
        quantity: 1,
        unit: 'tube'
      },
      {
        name: 'Cetirizine',
        dosage: '10mg',
        frequency: 'Once daily',
        duration: '7 days',
        instructions: 'Take at bedtime for itching relief',
        quantity: 7,
        unit: 'tablets'
      }
    ],
    notes: 'Keep skin moisturized. Avoid hot showers and harsh soaps.',
    followUpDate: '2024-04-20',
    followUpRequired: true,
    labTests: [],
    lifestyleRecommendations: [
      {
        category: 'diet',
        recommendation: 'Avoid known food allergens'
      },
      {
        category: 'other',
        recommendation: 'Use fragrance-free moisturizers'
      }
    ],
    allergies: ['Latex'],
    contraindications: [],
    status: 'active'
  },
  {
    id: '3',
    appointmentId: '6',
    patientId: '1',
    diagnosis: 'Upper Respiratory Infection',
    symptoms: 'Cough, sore throat, mild fever',
    medications: [
      {
        name: 'Acetaminophen',
        dosage: '500mg',
        frequency: 'Every 6 hours as needed',
        duration: '5 days',
        instructions: 'Take for fever and pain relief',
        quantity: 20,
        unit: 'tablets'
      }
    ],
    notes: 'Rest and stay hydrated. Symptoms should improve within 5-7 days.',
    followUpRequired: false,
    labTests: [],
    lifestyleRecommendations: [
      {
        category: 'diet',
        recommendation: 'Increase fluid intake'
      },
      {
        category: 'sleep',
        recommendation: 'Get adequate rest'
      }
    ],
    allergies: [],
    contraindications: [],
    status: 'completed'
  }
];