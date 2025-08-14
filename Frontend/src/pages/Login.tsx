import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Heart, Mail, Lock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';
import axios from 'axios';

const Login: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';
  const message = location.state?.message;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address';
    } else if (formData.email.trim().length > 100) {
      newErrors.email = 'Email must be less than 100 characters';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', formData);
      
      if (res.status === 200) {
        const user = res.data.user;
        const token = res.data.token;
        
        // Login through auth context
        login(user, token);

        // Navigate based on user role and verification status
        if (user.role === 'doctor') {
          if (!user.isVerified) {
            navigate('/doctor/pending-verification', { replace: true });
          } else {
            navigate('/doctor/dashboard', { replace: true });
          }
        } else if (user.role === 'patient') {
          navigate('/patient/dashboard', { replace: true });
        } else if (user.role === 'admin') {
          navigate('/admin/dashboard', { replace: true });
        } else {
          navigate(from, { replace: true });
        }
      }
    } catch (error: any) {
      console.error('Login error:', error);
      
      if (error.response?.data?.errors) {
        const serverErrors: Record<string, string> = {};
        error.response.data.errors.forEach((err: any) => {
          if (err.field === 'general') {
            serverErrors.general = err.message;
          } else {
            serverErrors[err.field] = err.message;
          }
        });
        setErrors(serverErrors);
      } else if (error.response?.status === 403) {
        setErrors({ general: 'Your doctor account is pending verification. Please wait for admin approval.' });
      } else {
        setErrors({ general: 'Login failed. Please check your credentials and try again.' });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Demo account buttons
  const demoAccounts = [
    { email: 'john.patient@email.com', role: 'Patient', color: 'bg-blue-600' },
    { email: 'dr.smith@hospital.com', role: 'Doctor', color: 'bg-teal-600' },
    { email: 'admin@hospital.com', role: 'Admin', color: 'bg-purple-600' }
  ];

  const handleDemoLogin = async (email: string) => {
    try {
      setIsSubmitting(true);
      const res = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password: 'demo123'
      });
      
      if (res.status === 200) {
        const user = res.data.user;
        const token = res.data.token;
        
        // Login through auth context
        login(user, token);

        // Navigate based on user role and verification status
        if (user.role === 'doctor') {
          if (!user.isVerified) {
            navigate('/doctor/pending-verification', { replace: true });
          } else {
            navigate('/doctor/dashboard', { replace: true });
          }
        } else if (user.role === 'patient') {
          navigate('/patient/dashboard', { replace: true });
        } else if (user.role === 'admin') {
          navigate('/admin/dashboard', { replace: true });
        } else {
          navigate(from, { replace: true });
        }
      }
    } catch (error: any) {
      console.error('Demo login error:', error);
      if (error.response?.data?.errors) {
        const serverErrors: Record<string, string> = {};
        error.response.data.errors.forEach((err: any) => {
          if (err.field === 'general') {
            serverErrors.general = err.message;
          } else {
            serverErrors[err.field] = err.message;
          }
        });
        setErrors(serverErrors);
      } else {
        setErrors({ general: 'Demo login failed. Please try again.' });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
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
              Welcome Back
            </h2>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Sign in to your account to continue
            </p>
          </div>

          <Card className="p-8">
            {/* Success/Info Message */}
            {message && (
              <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg">
                <p className="text-green-800 dark:text-green-300 text-sm">{message}</p>
              </div>
            )}

            {/* General Error Display */}
            {errors.general && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg">
                <p className="text-red-800 dark:text-red-300 text-sm">{errors.general}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
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
              </div>

              <div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
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
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? 'Signing In...' : 'Sign In'}
              </Button>
            </form>

            {/* Demo Accounts */}
            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-600 dark:text-gray-400 text-center mb-4">
                Try demo accounts:
              </p>
              <div className="space-y-2">
                {demoAccounts.map((account, index) => (
                  <button
                    key={index}
                    onClick={() => handleDemoLogin(account.email)}
                    disabled={isSubmitting}
                    className={`w-full p-3 rounded-lg text-white text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50 ${account.color}`}
                  >
                    Login as {account.role}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6 text-center">
              <p className="text-gray-600 dark:text-gray-400">
                Don't have an account?{' '}
                <Link
                  to="/register"
                  className="text-blue-600 hover:text-blue-500 font-medium"
                >
                  Sign up here
                </Link>
              </p>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;