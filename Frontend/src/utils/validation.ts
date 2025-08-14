// Common validation functions for the application

export const validateEmail = (email: string): string | null => {
  if (!email.trim()) {
    return 'Email is required';
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    return 'Please enter a valid email address';
  }
  if (email.trim().length > 100) {
    return 'Email must be less than 100 characters';
  }
  return null;
};

export const validatePassword = (password: string): string | null => {
  if (!password) {
    return 'Password is required';
  }
  if (password.length < 8) {
    return 'Password must be at least 8 characters long';
  }
  if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(password)) {
    return 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character';
  }
  return null;
};

export const validateName = (name: string, fieldName: string): string | null => {
  if (!name.trim()) {
    return `${fieldName} is required`;
  }
  if (name.trim().length < 2) {
    return `${fieldName} must be at least 2 characters`;
  }
  if (name.trim().length > 50) {
    return `${fieldName} must be less than 50 characters`;
  }
  if (!/^[a-zA-Z\s]+$/.test(name.trim())) {
    return `${fieldName} can only contain letters and spaces`;
  }
  return null;
};

export const validatePhone = (phone: string): string | null => {
  if (!phone.trim()) {
    return 'Phone number is required';
  }
  if (!/^[\+]?[1-9][\d]{0,15}$/.test(phone.trim())) {
    return 'Please enter a valid phone number';
  }
  return null;
};

export const validateDateOfBirth = (dateOfBirth: string): string | null => {
  if (!dateOfBirth) {
    return null; // Optional field
  }
  const birthDate = new Date(dateOfBirth);
  const today = new Date();
  const age = today.getFullYear() - birthDate.getFullYear();
  if (age < 0 || age > 120) {
    return 'Please enter a valid date of birth';
  }
  return null;
};

export const validateRequired = (value: string, fieldName: string): string | null => {
  if (!value.trim()) {
    return `${fieldName} is required`;
  }
  return null;
};

export const validateLength = (value: string, fieldName: string, min: number, max: number): string | null => {
  if (!value.trim()) {
    return `${fieldName} is required`;
  }
  if (value.trim().length < min) {
    return `${fieldName} must be at least ${min} characters`;
  }
  if (value.trim().length > max) {
    return `${fieldName} must be less than ${max} characters`;
  }
  return null;
};

export const validateNumber = (value: string, fieldName: string, min: number, max: number): string | null => {
  if (!value.trim()) {
    return `${fieldName} is required`;
  }
  const num = parseFloat(value);
  if (isNaN(num)) {
    return `${fieldName} must be a valid number`;
  }
  if (num < min || num > max) {
    return `${fieldName} must be between ${min} and ${max}`;
  }
  return null;
};

export const validateInteger = (value: string, fieldName: string, min: number, max: number): string | null => {
  if (!value.trim()) {
    return `${fieldName} is required`;
  }
  const num = parseInt(value);
  if (isNaN(num)) {
    return `${fieldName} must be a valid whole number`;
  }
  if (num < min || num > max) {
    return `${fieldName} must be between ${min} and ${max}`;
  }
  return null;
};

// Doctor-specific validation functions
export const validateDoctorFields = (formData: any): Record<string, string> => {
  const errors: Record<string, string> = {};

  // Specialization
  const specializationError = validateLength(formData.specialization, 'Specialization', 2, 100);
  if (specializationError) errors.specialization = specializationError;

  // Location
  const locationError = validateLength(formData.location, 'Location', 5, 200);
  if (locationError) errors.location = locationError;

  // Experience
  const experienceError = validateInteger(formData.experience, 'Experience', 0, 50);
  if (experienceError) errors.experience = experienceError;

  // Consultation Fee
  const consultationFeeError = validateNumber(formData.consultationFee, 'Consultation fee', 0, 10000);
  if (consultationFeeError) errors.consultationFee = consultationFeeError;

  // Education
  const educationError = validateLength(formData.education, 'Education', 10, 500);
  if (educationError) errors.education = educationError;

  // Qualifications
  const qualificationsError = validateLength(formData.qualifications, 'Qualifications', 10, 300);
  if (qualificationsError) errors.qualifications = qualificationsError;

  // Description
  const descriptionError = validateLength(formData.description, 'Professional description', 20, 1000);
  if (descriptionError) errors.description = descriptionError;

  return errors;
};

// Format validation error messages for display
export const formatValidationErrors = (errors: Record<string, string>): string[] => {
  return Object.values(errors).filter(error => error);
};

// Check if form has any errors
export const hasErrors = (errors: Record<string, string>): boolean => {
  return Object.keys(errors).length > 0;
};
