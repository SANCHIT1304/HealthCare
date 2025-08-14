import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  firstName: { 
    type: String, 
    required: [true, 'First name is required'],
    trim: true,
    minlength: [2, 'First name must be at least 2 characters'],
    maxlength: [50, 'First name cannot exceed 50 characters'],
    match: [/^[a-zA-Z\s]+$/, 'First name can only contain letters and spaces']
  },
  lastName: { 
    type: String, 
    required: [true, 'Last name is required'],
    trim: true,
    minlength: [2, 'Last name must be at least 2 characters'],
    maxlength: [50, 'Last name cannot exceed 50 characters'],
    match: [/^[a-zA-Z\s]+$/, 'Last name can only contain letters and spaces']
  },
  email: { 
    type: String, 
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    maxlength: [100, 'Email cannot exceed 100 characters'],
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please provide a valid email address']
  },
  password: { 
    type: String, 
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters long']
  },
  phone: { 
    type: String, 
    required: [true, 'Phone number is required'],
    trim: true,
    match: [/^[\+]?[1-9][\d]{0,15}$/, 'Please provide a valid phone number']
  },
  dateOfBirth: { 
    type: Date,
    validate: {
      validator: function(value) {
        if (!value) return true; // Optional field
        const birthDate = new Date(value);
        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear();
        return age >= 0 && age <= 120;
      },
      message: 'Date of birth must be reasonable (age 0-120)'
    }
  },
  role: { 
    type: String, 
    enum: {
      values: ['patient', 'doctor', 'admin'],
      message: 'Role must be patient, doctor, or admin'
    },
    required: [true, 'Role is required']
  },
  isVerified: { 
    type: Boolean, 
    default: false 
  },
  specialization: { 
    type: String,
    trim: true,
    minlength: [2, 'Specialization must be at least 2 characters'],
    maxlength: [100, 'Specialization cannot exceed 100 characters']
  },
  experience: { 
    type: Number,
    min: [0, 'Experience cannot be negative'],
    max: [50, 'Experience cannot exceed 50 years']
  },
  location: { 
    type: String,
    trim: true,
    minlength: [5, 'Location must be at least 5 characters'],
    maxlength: [200, 'Location cannot exceed 200 characters']
  },
  consultationFee: { 
    type: Number, 
    default: 0,
    min: [0, 'Consultation fee cannot be negative'],
    max: [10000, 'Consultation fee cannot exceed $10,000']
  },
  education: { 
    type: [String],
    default: []
  },
  qualifications: { 
    type: String,
    trim: true,
    minlength: [10, 'Qualifications must be at least 10 characters'],
    maxlength: [300, 'Qualifications cannot exceed 300 characters']
  },
  certifications: {
    type: [String],
    default: []
  },
  bio: {
    type: String,
    trim: true,
    maxlength: [1000, 'Bio cannot exceed 1000 characters']
  },
  profileImage: {
    type: String
  },
  licenseNumber: {
    type: String,
    trim: true
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other']
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  hospitalAffiliation: { 
    type: String,
    trim: true,
    maxlength: [200, 'Hospital affiliation cannot exceed 200 characters']
  },
  description: { 
    type: String,
    trim: true,
    minlength: [20, 'Description must be at least 20 characters'],
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for full name
userSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Virtual for age
userSchema.virtual('age').get(function() {
  if (!this.dateOfBirth) return null;
  const today = new Date();
  const birthDate = new Date(this.dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
});

// Index for better query performance
userSchema.index({ role: 1 });
userSchema.index({ isVerified: 1 });
userSchema.index({ specialization: 1 });
userSchema.index({ location: 1 });

// Pre-save middleware to ensure required fields for doctors
userSchema.pre('save', function(next) {
  // For patients, ensure doctor-specific fields are not set
  if (this.role === 'patient') {
    const doctorFields = ['specialization', 'experience', 'location', 'consultationFee', 'education', 'qualifications', 'hospitalAffiliation', 'description'];
    doctorFields.forEach(field => {
      if (this[field] !== undefined && this[field] !== null && this[field] !== '') {
        this[field] = undefined;
      }
    });
  }
  next();
});

export default mongoose.model('User', userSchema);
