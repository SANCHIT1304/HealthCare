import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Patient ID is required']
  },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Doctor ID is required']
  },
  date: {
    type: Date,
    required: [true, 'Appointment date is required'],
    validate: {
      validator: function(value) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return value >= today;
      },
      message: 'Appointment date must be today or in the future'
    }
  },
  time: {
    type: String,
    required: [true, 'Appointment time is required'],
    match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please provide a valid time format (HH:MM)']
  },
  reason: {
    type: String,
    required: [true, 'Reason for appointment is required'],
    trim: true,
    minlength: [10, 'Reason must be at least 10 characters'],
    maxlength: [500, 'Reason cannot exceed 500 characters']
  },
  status: {
    type: String,
    enum: {
      values: ['pending', 'confirmed', 'cancelled', 'completed'],
      message: 'Status must be pending, confirmed, cancelled, or completed'
    },
    default: 'pending'
  },
  notes: {
    type: String,
    trim: true,
    maxlength: [1000, 'Notes cannot exceed 1000 characters']
  },
  prescription: {
    type: String,
    trim: true,
    maxlength: [2000, 'Prescription cannot exceed 2000 characters']
  },
  consultationFee: {
    type: Number,
    required: [true, 'Consultation fee is required'],
    min: [0, 'Consultation fee cannot be negative']
  },
  paymentStatus: {
    type: String,
    enum: {
      values: ['pending', 'paid', 'refunded'],
      message: 'Payment status must be pending, paid, or refunded'
    },
    default: 'pending'
  },
  symptoms: {
    type: String,
    trim: true,
    maxlength: [500, 'Symptoms cannot exceed 500 characters']
  },
  diagnosis: {
    type: String,
    trim: true,
    maxlength: [500, 'Diagnosis cannot exceed 500 characters']
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
  isEmergency: {
    type: Boolean,
    default: false
  },
  cancelledBy: {
    type: String,
    enum: ['patient', 'doctor', 'system'],
    validate: {
      validator: function(value) {
        if (this.status === 'cancelled' && !value) {
          return false;
        }
        return true;
      },
      message: 'Cancelled by field is required when status is cancelled'
    }
  },
  cancellationReason: {
    type: String,
    trim: true,
    maxlength: [200, 'Cancellation reason cannot exceed 200 characters'],
    validate: {
      validator: function(value) {
        if (this.status === 'cancelled' && !value) {
          return false;
        }
        return true;
      },
      message: 'Cancellation reason is required when status is cancelled'
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for appointment duration (default 30 minutes)
appointmentSchema.virtual('duration').get(function() {
  return 30; // minutes
});

// Virtual for formatted date
appointmentSchema.virtual('formattedDate').get(function() {
  return this.date.toLocaleDateString();
});

// Virtual for formatted time
appointmentSchema.virtual('formattedTime').get(function() {
  return this.time;
});

// Indexes for better query performance
appointmentSchema.index({ doctorId: 1, date: 1 });
appointmentSchema.index({ patientId: 1, date: 1 });
appointmentSchema.index({ status: 1 });
appointmentSchema.index({ date: 1, time: 1 });
appointmentSchema.index({ doctorId: 1, status: 1 });

// Pre-save middleware to validate appointment time conflicts
appointmentSchema.pre('save', async function(next) {
  if (this.isNew || this.isModified('date') || this.isModified('time') || this.isModified('doctorId')) {
    try {
      const conflictingAppointment = await this.constructor.findOne({
        doctorId: this.doctorId,
        date: {
          $gte: this.date,
          $lt: new Date(this.date.getTime() + 24 * 60 * 60 * 1000)
        },
        time: this.time,
        status: { $in: ['pending', 'confirmed'] },
        _id: { $ne: this._id }
      });

      if (conflictingAppointment) {
        const error = new Error('Appointment time slot is already booked');
        return next(error);
      }
    } catch (err) {
      return next(err);
    }
  }
  next();
});

export default mongoose.model('Appointment', appointmentSchema);
