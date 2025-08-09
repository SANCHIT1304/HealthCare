import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import Navbar from './components/layout/Navbar';
import ProtectedRoute from './components/layout/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from './pages/NotFound';

// Patient Pages
import PatientDashboard from './pages/patient/PatientDashboard';
import Doctors from './pages/patient/Doctors';
import DoctorProfile from './pages/patient/DoctorProfile';
import BookAppointment from './pages/patient/BookAppointment';
import Appointments from './pages/patient/Appointments';
import PatientProfile from './pages/patient/PatientProfile';

// Doctor Pages
import PendingVerification from './pages/doctor/PendingVerification';
import DoctorDashboard from './pages/doctor/DoctorDashboard';
import DoctorAppointments from './pages/doctor/DoctorAppointments';
import DoctorAvailability from './pages/doctor/DoctorAvailability';
import DoctorProfilePage from './pages/doctor/DoctorProfile';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import DoctorVerification from './pages/admin/DoctorVerification';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
            <Navbar />
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Patient Routes */}
              <Route 
                path="/patient/dashboard" 
                element={
                  <ProtectedRoute requiredRole="patient">
                    <PatientDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/patient/doctors" 
                element={
                  <ProtectedRoute requiredRole="patient">
                    <Doctors />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/patient/doctors/:doctorId" 
                element={
                  <ProtectedRoute requiredRole="patient">
                    <DoctorProfile />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/patient/book-appointment/:doctorId" 
                element={
                  <ProtectedRoute requiredRole="patient">
                    <BookAppointment />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/patient/appointments" 
                element={
                  <ProtectedRoute requiredRole="patient">
                    <Appointments />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/patient/profile" 
                element={
                  <ProtectedRoute requiredRole="patient">
                    <PatientProfile />
                  </ProtectedRoute>
                } 
              />

              {/* Doctor Routes */}
              <Route path="/doctor/pending-verification" element={<PendingVerification />} />
              <Route 
                path="/doctor/dashboard" 
                element={
                  <ProtectedRoute requiredRole="doctor">
                    <DoctorDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/doctor/appointments" 
                element={
                  <ProtectedRoute requiredRole="doctor">
                    <DoctorAppointments />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/doctor/availability" 
                element={
                  <ProtectedRoute requiredRole="doctor">
                    <DoctorAvailability />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/doctor/profile" 
                element={
                  <ProtectedRoute requiredRole="doctor">
                    <DoctorProfilePage />
                  </ProtectedRoute>
                } 
              />

              {/* Admin Routes */}
              <Route 
                path="/admin/dashboard" 
                element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/verify-doctors" 
                element={
                  <ProtectedRoute requiredRole="admin">
                    <DoctorVerification />
                  </ProtectedRoute>
                } 
              />

              {/* 404 Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>

            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: 'var(--toast-bg)',
                  color: 'var(--toast-color)',
                  border: '1px solid var(--toast-border)',
                },
                success: {
                  iconTheme: {
                    primary: '#10B981',
                    secondary: '#ffffff',
                  },
                },
                error: {
                  iconTheme: {
                    primary: '#EF4444',
                    secondary: '#ffffff',
                  },
                },
              }}
            />
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;