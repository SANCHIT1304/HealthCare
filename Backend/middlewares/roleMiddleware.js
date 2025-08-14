import { ApiError } from '../utils/ApiError.js';

export const validateDoctor = (req, res, next) => {
  if (req.user.role !== 'doctor') {
    return next(new ApiError(403, 'Access denied. Doctor role required.'));
  }
  next();
};

export const validatePatient = (req, res, next) => {
  if (req.user.role !== 'patient') {
    return next(new ApiError(403, 'Access denied. Patient role required.'));
  }
  next();
};

export const validateAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return next(new ApiError(403, 'Access denied. Admin role required.'));
  }
  next();
};
