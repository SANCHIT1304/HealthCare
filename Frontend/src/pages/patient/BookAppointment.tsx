import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Clock, 
  User, 
  Star, 
  DollarSign, 
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { format, addDays, isSameDay, isAfter, startOfDay } from 'date-fns';
import { useAuth } from '../../contexts/AuthContext';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { patientService } from '../../services/patientService';
import { User as UserType } from '../../types/api';
import toast from 'react-hot-toast';

const BookAppointment: React.FC = () => {
  const { doctorId } = useParams<{ doctorId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [doctor, setDoctor] = useState<UserType | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [doctorLoading, setDoctorLoading] = useState(true);
  const [availableSlots, setAvailableSlots] = useState<Array<{start: string, end: string}>>([]);

  // Fetch doctor data on component mount
  useEffect(() => {
    if (doctorId) {
      fetchDoctor();
    }
  }, [doctorId]);

  const fetchDoctor = async () => {
    try {
      setDoctorLoading(true);
      const doctorData = await patientService.getDoctorProfile(doctorId!);
      setDoctor(doctorData);
    } catch (error) {
      console.error('Error fetching doctor:', error);
      toast.error('Failed to load doctor information');
    } finally {
      setDoctorLoading(false);
    }
  };

  // Fetch availability when date is selected
  useEffect(() => {
    if (selectedDate && doctorId) {
      fetchAvailability();
    }
  }, [selectedDate, doctorId]);

  const fetchAvailability = async () => {
    try {
      const dateString = format(selectedDate!, 'yyyy-MM-dd');
      const availability = await patientService.getDoctorAvailability(doctorId!, dateString);
      setAvailableSlots(availability.availableSlots);
    } catch (error) {
      console.error('Error fetching availability:', error);
      toast.error('Failed to load availability');
      setAvailableSlots([]);
    }
  };

  if (doctorLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading doctor information...</p>
        </div>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Doctor Not Found
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            The doctor you're looking for doesn't exist.
          </p>
          <Link to="/patient/doctors">
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Doctors
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Generate next 14 days for date selection
  const availableDates = Array.from({ length: 14 }, (_, i) => addDays(new Date(), i + 1));

  // Get available time slots for selected date
  const getAvailableTimeSlots = (date: Date) => {
    return availableSlots.map(slot => slot.start);
  };

  const handleBookAppointment = async () => {
    if (!selectedDate || !selectedTime || !reason.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const dateString = format(selectedDate, 'yyyy-MM-dd');
      await patientService.bookAppointment({
        doctorId: doctorId!,
        date: dateString,
        time: selectedTime,
        reason
      });
      
      toast.success('Appointment booked successfully!');
      navigate('/patient/appointments');
    } catch (error) {
      console.error('Error booking appointment:', error);
      toast.error('Failed to book appointment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const timeSlots = selectedDate ? getAvailableTimeSlots(selectedDate) : [];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link 
            to="/patient/doctors" 
            className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Doctors
          </Link>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold text-gray-900 dark:text-white mb-2"
          >
            Book Appointment
          </motion.h1>
          <p className="text-gray-600 dark:text-gray-400">
            Schedule your consultation with {doctor.firstName} {doctor.lastName}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Doctor Info */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Card className="p-6 sticky top-6">
                <div className="text-center mb-6">
                  <img
                    src={doctor.profileImage || `https://ui-avatars.com/api/?name=${doctor.firstName}+${doctor.lastName}&background=random`}
                    alt={`${doctor.firstName} ${doctor.lastName}`}
                    className="w-24 h-24 rounded-full object-cover mx-auto mb-4"
                  />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {doctor.firstName} {doctor.lastName}
                  </h3>
                  <p className="text-blue-600 dark:text-blue-400 font-medium">
                    {doctor.specialization || 'General Medicine'}
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Experience</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {doctor.experience || 5} years
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Rating</span>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-500 mr-1" />
                      <span className="font-medium text-gray-900 dark:text-white">
                        4.8
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Consultation Fee</span>
                    <div className="flex items-center">
                      <DollarSign className="w-4 h-4 text-green-500 mr-1" />
                      <span className="font-medium text-gray-900 dark:text-white">
                        ${doctor.consultationFee || 50}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <Link to={`/patient/doctors/${doctor._id}`}>
                    <Button variant="outline" className="w-full">
                      <User className="w-4 h-4 mr-2" />
                      View Full Profile
                    </Button>
                  </Link>
                </div>
              </Card>
            </motion.div>
          </div>

          {/* Booking Form */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-8"
            >
              {/* Date Selection */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  Select Date
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
                  {availableDates.map((date, index) => {
                    const isSelected = selectedDate && isSameDay(date, selectedDate);
                    
                    return (
                      <button
                        key={index}
                        onClick={() => setSelectedDate(date)}
                        className={`p-3 rounded-lg text-center transition-all ${
                          isSelected
                            ? 'bg-blue-600 text-white shadow-lg'
                            : 'bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:border-blue-300 hover:shadow-md'
                        }`}
                      >
                        <div className="text-xs font-medium">
                          {format(date, 'EEE')}
                        </div>
                        <div className="text-lg font-bold">
                          {format(date, 'd')}
                        </div>
                        <div className="text-xs">
                          {format(date, 'MMM')}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </Card>

              {/* Time Selection */}
              {selectedDate && (
                <Card className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                    <Clock className="w-5 h-5 mr-2" />
                    Select Time
                  </h3>
                  {timeSlots.length > 0 ? (
                    <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                      {timeSlots.map((time, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedTime(time)}
                          className={`p-3 rounded-lg text-center transition-all ${
                            selectedTime === time
                              ? 'bg-blue-600 text-white shadow-lg'
                              : 'bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:border-blue-300 hover:shadow-md'
                          }`}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 dark:text-gray-400">
                        {selectedDate ? 'No available time slots for this date' : 'Please select a date first'}
                      </p>
                    </div>
                  )}
                </Card>
              )}

              {/* Reason for Visit */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Reason for Visit
                </h3>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Please describe your symptoms or reason for consultation..."
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
                />
              </Card>

              {/* Booking Summary & Confirm */}
              {selectedDate && selectedTime && reason.trim() && (
                <Card className="p-6 bg-gradient-to-r from-blue-50 to-teal-50 dark:from-blue-900/20 dark:to-teal-900/20 border-blue-200 dark:border-blue-700">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                    <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
                    Booking Summary
                  </h3>
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Doctor:</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {doctor.firstName} {doctor.lastName}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Date:</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {format(selectedDate, 'EEEE, MMMM d, yyyy')}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Time:</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {selectedTime}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Consultation Fee:</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        ${doctor.consultationFee || 50}
                      </span>
                    </div>
                  </div>
                  <Button 
                    onClick={handleBookAppointment}
                    loading={loading}
                    className="w-full"
                    size="lg"
                  >
                    Confirm Booking
                  </Button>
                </Card>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookAppointment;