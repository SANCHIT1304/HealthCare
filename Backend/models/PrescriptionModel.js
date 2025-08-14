import mongoose from 'mongoose';

const medicationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Medication name is required'],
    trim: true,
    maxlength: [100, 'Medication name cannot exceed 100 characters']
  },
  dosage: {
    type: String,
    required: [true, 'Dosage is required'],
    trim: true,
    maxlength: [50, 'Dosage cannot exceed 50 characters']
  },
  frequency: {
    type: String,
    required: [true, 'Frequency is required'],
    trim: true,
    maxlength: [50, 'Frequency cannot exceed 50 characters']
  },
  duration: {
    type: String,
    required: [true, 'Duration is required'],
    trim: true,
    maxlength: [50, 'Duration cannot exceed 50 characters']
  },
  instructions: {
    type: String,
    trim: true,
    maxlength: [200, 'Instructions cannot exceed 200 characters']
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: [1, 'Quantity must be at least 1']
  },
  unit: {
    type: String,
    required: [true, 'Unit is required'],
    enum: ['tablets', 'capsules', 'ml', 'mg', 'g', 'units', 'puffs', 'drops', 'patches']
  }
}, { _id: false });

const prescriptionSchema = new mongoose.Schema({
  appointmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment',
    required: [true, 'Appointment ID is required']
  },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Doctor ID is required']
  },
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Patient ID is required']
  },
  diagnosis: {
    type: String,
    required: [true, 'Diagnosis is required'],
    trim: true,
    maxlength: [500, 'Diagnosis cannot exceed 500 characters']
  },
  symptoms: {
    type: String,
    trim: true,
    maxlength: [500, 'Symptoms cannot exceed 500 characters']
  },
  medications: [medicationSchema],
  notes: {
    type: String,
    trim: true,
    maxlength: [1000, 'Notes cannot exceed 1000 characters']
  },
  followUpDate: {
    type: Date,
    validate: {
      validator: function(value) {
        if (!value) return true; // Optional field
        return value > new Date();
      },
      message: 'Follow-up date must be in the future'
    }
  },
  followUpRequired: {
    type: Boolean,
    default: false
  },
  labTests: [{
    name: {
      type: String,
      required: [true, 'Lab test name is required'],
      trim: true,
      maxlength: [100, 'Lab test name cannot exceed 100 characters']
    },
    description: {
      type: String,
      trim: true,
      maxlength: [200, 'Lab test description cannot exceed 200 characters']
    },
    urgency: {
      type: String,
      enum: ['routine', 'urgent', 'emergency'],
      default: 'routine'
    }
  }],
  lifestyleRecommendations: [{
    category: {
      type: String,
      enum: ['diet', 'exercise', 'sleep', 'stress', 'other'],
      required: [true, 'Category is required']
    },
    recommendation: {
      type: String,
      required: [true, 'Recommendation is required'],
      trim: true,
      maxlength: [200, 'Recommendation cannot exceed 200 characters']
    }
  }],
  allergies: [{
    type: String,
    trim: true,
    maxlength: [100, 'Allergy name cannot exceed 100 characters']
  }],
  contraindications: [{
    type: String,
    trim: true,
    maxlength: [200, 'Contraindication cannot exceed 200 characters']
  }],
  status: {
    type: String,
    enum: ['active', 'completed', 'cancelled'],
    default: 'active'
  },
  isDigital: {
    type: Boolean,
    default: true
  },
  signature: {
    type: String,
    trim: true
  },
  prescriptionNumber: {
    type: String,
    unique: true,
    required: [true, 'Prescription number is required']
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for formatted prescription number
prescriptionSchema.virtual('formattedPrescriptionNumber').get(function() {
  return `RX-${this.prescriptionNumber}`;
});

// Virtual for total medications count
prescriptionSchema.virtual('medicationsCount').get(function() {
  return this.medications.length;
});

// Virtual for lab tests count
prescriptionSchema.virtual('labTestsCount').get(function() {
  return this.labTests.length;
});

// Indexes for better query performance
prescriptionSchema.index({ appointmentId: 1 });
prescriptionSchema.index({ doctorId: 1 });
prescriptionSchema.index({ patientId: 1 });
prescriptionSchema.index({ status: 1 });
prescriptionSchema.index({ prescriptionNumber: 1 });
prescriptionSchema.index({ createdAt: -1 });

// Pre-save middleware to generate prescription number
prescriptionSchema.pre('save', async function(next) {
  if (this.isNew) {
    const count = await this.constructor.countDocuments();
    this.prescriptionNumber = `PRES${String(count + 1).padStart(6, '0')}`;
  }
  next();
});

// Static method to get prescriptions by patient
prescriptionSchema.statics.getByPatient = function(patientId, options = {}) {
  const query = { patientId };
  
  if (options.status) {
    query.status = options.status;
  }
  
  return this.find(query)
    .populate('doctorId', 'firstName lastName specialization')
    .populate('appointmentId', 'date time reason')
    .sort({ createdAt: -1 });
};

// Static method to get prescriptions by doctor
prescriptionSchema.statics.getByDoctor = function(doctorId, options = {}) {
  const query = { doctorId };
  
  if (options.status) {
    query.status = options.status;
  }
  
  return this.find(query)
    .populate('patientId', 'firstName lastName')
    .populate('appointmentId', 'date time reason')
    .sort({ createdAt: -1 });
};

export default mongoose.model('Prescription', prescriptionSchema);
