import mongoose from 'mongoose';

const timeSlotSchema = new mongoose.Schema({
  start: {
    type: String,
    required: [true, 'Start time is required'],
    match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please provide a valid time format (HH:MM)']
  },
  end: {
    type: String,
    required: [true, 'End time is required'],
    match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please provide a valid time format (HH:MM)']
  }
}, { _id: false });

const availabilitySchema = new mongoose.Schema({
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Doctor ID is required'],
    unique: true
  },
  weeklySchedule: {
    monday: [timeSlotSchema],
    tuesday: [timeSlotSchema],
    wednesday: [timeSlotSchema],
    thursday: [timeSlotSchema],
    friday: [timeSlotSchema],
    saturday: [timeSlotSchema],
    sunday: [timeSlotSchema]
  },
  isActive: {
    type: Boolean,
    default: true
  },
  appointmentDuration: {
    type: Number,
    default: 30,
    min: [15, 'Appointment duration must be at least 15 minutes'],
    max: [120, 'Appointment duration cannot exceed 120 minutes']
  },
  bufferTime: {
    type: Number,
    default: 5,
    min: [0, 'Buffer time cannot be negative'],
    max: [30, 'Buffer time cannot exceed 30 minutes']
  },
  maxAppointmentsPerDay: {
    type: Number,
    default: 20,
    min: [1, 'Maximum appointments per day must be at least 1'],
    max: [50, 'Maximum appointments per day cannot exceed 50']
  },
  emergencySlots: {
    type: Boolean,
    default: false
  },
  emergencyTimeSlots: [timeSlotSchema],
  notes: {
    type: String,
    trim: true,
    maxlength: [500, 'Notes cannot exceed 500 characters']
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for total weekly hours
availabilitySchema.virtual('totalWeeklyHours').get(function() {
  let totalHours = 0;
  Object.values(this.weeklySchedule).forEach(daySlots => {
    daySlots.forEach(slot => {
      const start = new Date(`2000-01-01 ${slot.start}`);
      const end = new Date(`2000-01-01 ${slot.end}`);
      totalHours += (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    });
  });
  return totalHours;
});

// Virtual for active days count
availabilitySchema.virtual('activeDaysCount').get(function() {
  return Object.values(this.weeklySchedule).filter(daySlots => daySlots.length > 0).length;
});

// Indexes for better query performance
availabilitySchema.index({ doctorId: 1 });
availabilitySchema.index({ isActive: 1 });

// Pre-save middleware to validate time slots
availabilitySchema.pre('save', function(next) {
  // Validate each day's time slots
  Object.entries(this.weeklySchedule).forEach(([day, slots]) => {
    slots.forEach((slot, index) => {
      // Check if start time is before end time
      if (slot.start >= slot.end) {
        const error = new Error(`Invalid time slot on ${day}: Start time must be before end time`);
        return next(error);
      }
    });

    // Check for overlapping slots within the same day
    for (let i = 0; i < slots.length; i++) {
      for (let j = i + 1; j < slots.length; j++) {
        const slot1 = slots[i];
        const slot2 = slots[j];
        if (
          (slot1.start < slot2.end && slot1.end > slot2.start) ||
          (slot2.start < slot1.end && slot2.end > slot1.start)
        ) {
          const error = new Error(`Overlapping time slots detected on ${day}`);
          return next(error);
        }
      }
    }
  });

  // Validate emergency time slots if enabled
  if (this.emergencySlots && this.emergencyTimeSlots.length > 0) {
    this.emergencyTimeSlots.forEach((slot, index) => {
      if (slot.start >= slot.end) {
        const error = new Error(`Invalid emergency time slot: Start time must be before end time`);
        return next(error);
      }
    });

    // Check for overlapping emergency slots
    for (let i = 0; i < this.emergencyTimeSlots.length; i++) {
      for (let j = i + 1; j < this.emergencyTimeSlots.length; j++) {
        const slot1 = this.emergencyTimeSlots[i];
        const slot2 = this.emergencyTimeSlots[j];
        if (
          (slot1.start < slot2.end && slot1.end > slot2.start) ||
          (slot2.start < slot1.end && slot2.end > slot1.start)
        ) {
          const error = new Error('Overlapping emergency time slots detected');
          return next(error);
        }
      }
    }
  }

  next();
});

// Static method to get available time slots for a specific date
availabilitySchema.statics.getAvailableSlots = async function(doctorId, date) {
  const availability = await this.findOne({ doctorId, isActive: true });
  if (!availability) return [];

  // Determine day key from provided date (monday-sunday)
  const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const dayKey = dayNames[date.getDay()];
  const daySlots = availability.weeklySchedule[dayKey] || [];

  // Generate time slots based on appointment duration and buffer time
  const availableSlots = [];
  daySlots.forEach(slot => {
    const start = new Date(`2000-01-01 ${slot.start}`);
    const end = new Date(`2000-01-01 ${slot.end}`);
    const duration = availability.appointmentDuration + availability.bufferTime;

    let currentTime = new Date(start);
    while (currentTime < end) {
      const slotEnd = new Date(currentTime.getTime() + (availability.appointmentDuration * 60 * 1000));
      if (slotEnd <= end) {
        availableSlots.push({
          start: currentTime.toTimeString().slice(0, 5),
          end: slotEnd.toTimeString().slice(0, 5)
        });
      }
      currentTime = new Date(currentTime.getTime() + (duration * 60 * 1000));
    }
  });

  return availableSlots;
};

export default mongoose.model('Availability', availabilitySchema);
