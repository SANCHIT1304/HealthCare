import { body, validationResult } from 'express-validator';

// Validation result middleware
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: 'Validation failed',
      errors: errors.array().map(error => ({
        field: error.path,
        message: error.msg
      }))
    });
  }
  next();
};

// Registration validation rules
export const validateRegistration = [
  body('firstName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('First name can only contain letters and spaces'),
  
  body('lastName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Last name can only contain letters and spaces'),
  
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address')
    .isLength({ max: 100 })
    .withMessage('Email must be less than 100 characters'),
  
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
  
  body('role')
    .isIn(['patient', 'doctor', 'admin'])
    .withMessage('Role must be patient, doctor, or admin'),
  
  body('phone')
    .matches(/^[\+]?[1-9][\d]{0,15}$/)
    .withMessage('Please provide a valid phone number'),
  
  body('dateOfBirth')
    .optional()
    .custom((value) => {
      if (!value) return true; // Allow empty/undefined values
      if (!Date.parse(value)) {
        throw new Error('Date of birth must be a valid date');
      }
      const birthDate = new Date(value);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      if (age < 0 || age > 120) {
        throw new Error('Date of birth must be reasonable (age 0-120)');
      }
      return true;
    }),
  
  // Doctor-specific validations - only validate if role is doctor
  body('specialization')
    .optional()
    .custom((value, { req }) => {
      if (req.body.role === 'doctor' && !value) {
        throw new Error('Specialization is required for doctors');
      }
      if (req.body.role === 'doctor' && value && (value.length < 2 || value.length > 100)) {
        throw new Error('Specialization must be between 2 and 100 characters');
      }
      return true;
    }),
  
  body('experience')
    .optional()
    .custom((value, { req }) => {
      if (req.body.role === 'doctor' && !value) {
        throw new Error('Experience is required for doctors');
      }
      if (req.body.role === 'doctor' && value) {
        const exp = parseInt(value);
        if (isNaN(exp) || exp < 0 || exp > 50) {
          throw new Error('Experience must be a valid number between 0 and 50 years');
        }
      }
      return true;
    }),
  
  body('location')
    .optional()
    .custom((value, { req }) => {
      if (req.body.role === 'doctor' && !value) {
        throw new Error('Location is required for doctors');
      }
      if (req.body.role === 'doctor' && value && (value.length < 5 || value.length > 200)) {
        throw new Error('Location must be between 5 and 200 characters');
      }
      return true;
    }),
  
  body('consultationFee')
    .optional()
    .custom((value, { req }) => {
      if (req.body.role === 'doctor' && !value) {
        throw new Error('Consultation fee is required for doctors');
      }
      if (req.body.role === 'doctor' && value) {
        const fee = parseFloat(value);
        if (isNaN(fee) || fee < 0 || fee > 10000) {
          throw new Error('Consultation fee must be a valid amount between 0 and 10000');
        }
      }
      return true;
    }),
  
  body('education')
    .optional()
    .custom((value, { req }) => {
      if (req.body.role === 'doctor' && !value) {
        throw new Error('Education is required for doctors');
      }
      if (req.body.role === 'doctor' && value && (value.length < 10 || value.length > 500)) {
        throw new Error('Education must be between 10 and 500 characters');
      }
      return true;
    }),
  
  body('qualifications')
    .optional()
    .custom((value, { req }) => {
      if (req.body.role === 'doctor' && !value) {
        throw new Error('Qualifications are required for doctors');
      }
      if (req.body.role === 'doctor' && value && (value.length < 10 || value.length > 300)) {
        throw new Error('Qualifications must be between 10 and 300 characters');
      }
      return true;
    }),
  
  body('hospitalAffiliation')
    .optional()
    .custom((value, { req }) => {
      if (req.body.role === 'doctor' && value && (value.length < 5 || value.length > 200)) {
        throw new Error('Hospital affiliation must be between 5 and 200 characters');
      }
      return true;
    }),
  
  body('description')
    .optional()
    .custom((value, { req }) => {
      if (req.body.role === 'doctor' && !value) {
        throw new Error('Professional description is required for doctors');
      }
      if (req.body.role === 'doctor' && value && (value.length < 20 || value.length > 1000)) {
        throw new Error('Professional description must be between 20 and 1000 characters');
      }
      return true;
    }),
  
  handleValidationErrors
];

// Login validation rules
export const validateLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  
  handleValidationErrors
];
