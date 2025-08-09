import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Heart, Mail, Lock, User, Phone, Calendar, FileText, Award } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';
import axios from 'axios';
// ...existing code...

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'patient' as 'patient' | 'doctor',
    phone: '',
    dateOfBirth: '',
    // Doctor specific fields
    specialization: '',
    location: '',
    experience: '',
    education: '',
    description: '',
    consultationFee: '',
    qualifications: '',
    hospitalAffiliation: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName) newErrors.firstName = 'First name is required';
    if (!formData.lastName) newErrors.lastName = 'Last name is required';
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (formData.role === 'doctor') {
      if (!formData.specialization) newErrors.specialization = 'Specialization is required';
      if (!formData.location) newErrors.location = 'Location is required';
      if (!formData.experience) newErrors.experience = 'Experience is required';
      if (!formData.education) newErrors.education = 'Education details are required';
      if (!formData.description) newErrors.description = 'Professional description is required';
      if (!formData.consultationFee) newErrors.consultationFee = 'Consultation fee is required';
      if (!formData.qualifications) newErrors.qualifications = 'Qualifications are required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      // await register(formData);
      const res = await axios.post('http://localhost:5000/api/auth/register', formData);
      setErrors({});
      if (formData.role === 'doctor') {
        navigate('/doctor/pending-verification');
      } else {
        navigate('/');
      }
    } catch (error) {
      console.error('Registration error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Logo */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center space-x-2">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-teal-600 rounded-xl flex items-center justify-center">
                <Heart className="w-7 h-7 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
                HealthCare+
              </span>
            </Link>
            <h2 className="mt-6 text-3xl font-bold text-gray-900 dark:text-white">
              Create Account
            </h2>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Join our healthcare community today
            </p>
          </div>

          <Card className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Role Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  I am a:
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, role: 'patient' }))}
                    className={`p-3 rounded-lg border-2 text-center transition-colors ${
                      formData.role === 'patient'
                        ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-600'
                        : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
                    }`}
                  >
                    <User className="w-6 h-6 mx-auto mb-1" />
                    <span className="text-sm font-medium">Patient</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, role: 'doctor' }))}
                    className={`p-3 rounded-lg border-2 text-center transition-colors ${
                      formData.role === 'doctor'
                        ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-600'
                        : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
                    }`}
                  >
                    <Heart className="w-6 h-6 mx-auto mb-1" />
                    <span className="text-sm font-medium">Doctor</span>
                  </button>
                </div>
              </div>

              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    name="firstName"
                    placeholder="First name"
                    value={formData.firstName}
                    onChange={handleChange}
                    error={errors.firstName}
                    className="pl-10"
                  />
                </div>
                <Input
                  name="lastName"
                  placeholder="Last name"
                  value={formData.lastName}
                  onChange={handleChange}
                  error={errors.lastName}
                />
              </div>

              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  error={errors.email}
                  className="pl-10"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Create password"
                    value={formData.password}
                    onChange={handleChange}
                    error={errors.password}
                    className="pl-10 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>

                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirm password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    error={errors.confirmPassword}
                    className="pl-10 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    name="phone"
                    type="tel"
                    placeholder="Phone number"
                    value={formData.phone}
                    onChange={handleChange}
                    className="pl-10"
                  />
                </div>
                
                {formData.role === 'patient' && (
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      name="dateOfBirth"
                      type="date"
                      placeholder="Date of birth"
                      value={formData.dateOfBirth}
                      onChange={handleChange}
                      className="pl-10"
                    />
                  </div>
                )}
              </div>

              {/* Doctor-specific fields */}
              {formData.role === 'doctor' && (
                <div className="space-y-6 p-6 bg-gradient-to-r from-teal-50 to-blue-50 dark:from-teal-900/20 dark:to-blue-900/20 rounded-lg border border-teal-200 dark:border-teal-700">
                  <div className="flex items-center space-x-2 mb-4">
                    <Award className="w-5 h-5 text-teal-600" />
                    <h3 className="font-semibold text-teal-700 dark:text-teal-300">Professional Information</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      name="specialization"
                      placeholder="Specialization (e.g., Cardiology)"
                      value={formData.specialization}
                      onChange={handleChange}
                      error={errors.specialization}
                    />
                    <Input
                      name="location"
                      placeholder="address"
                      value={formData.location}
                      onChange={handleChange}
                      error={errors.location}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      name="experience"
                      type="number"
                      placeholder="Years of experience"
                      value={formData.experience}
                      onChange={handleChange}
                      error={errors.experience}
                    />
                    <Input
                      name="consultationFee"
                      type="number"
                      placeholder="Consultation fee ($)"
                      value={formData.consultationFee}
                      onChange={handleChange}
                      error={errors.consultationFee}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Education & Qualifications
                    </label>
                    <textarea
                      name="education"
                      placeholder="List your medical education, degrees, and certifications..."
                      value={formData.education}
                      onChange={handleChange}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
                    />
                    {errors.education && <p className="mt-1 text-sm text-red-600">{errors.education}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Professional Qualifications
                    </label>
                    <textarea
                      name="qualifications"
                      placeholder="Board certifications, fellowships, special training..."
                      value={formData.qualifications}
                      onChange={handleChange}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
                    />
                    {errors.qualifications && <p className="mt-1 text-sm text-red-600">{errors.qualifications}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Hospital/Clinic Affiliation
                    </label>
                    <Input
                      name="hospitalAffiliation"
                      placeholder="Current hospital or clinic affiliation"
                      value={formData.hospitalAffiliation}
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Professional Description
                    </label>
                    <textarea
                      name="description"
                      placeholder="Brief description of your practice, expertise, and approach to patient care..."
                      value={formData.description}
                      onChange={handleChange}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
                    />
                    {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
                  </div>

                  <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-lg p-4">
                    <div className="flex items-start space-x-2">
                      <FileText className="w-5 h-5 text-amber-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-amber-800 dark:text-amber-300">Verification Process</h4>
                        <p className="text-sm text-amber-700 dark:text-amber-400 mt-1">
                          Your doctor account will be reviewed by our admin team. You'll receive an email notification once your account is approved. 
                          This process typically takes 24-48 hours.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <Button type="submit" className="w-full" size="lg">
                {formData.role === 'doctor' ? 'Submit for Verification' : 'Create Account'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600 dark:text-gray-400">
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="text-blue-600 hover:text-blue-500 font-medium"
                >
                  Sign in here
                </Link>
              </p>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;