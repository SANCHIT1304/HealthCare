import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Star, 
  Calendar, 
  Clock, 
  DollarSign,
  User,
  Phone,
  Mail,
  CheckCircle,
  MessageCircle
} from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { patientService } from '../../services/patientService';
import { User as UserType } from '../../types/api';
import toast from 'react-hot-toast';

const DoctorProfile: React.FC = () => {
  const { doctorId } = useParams<{ doctorId: string }>();
  const [doctor, setDoctor] = useState<UserType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        setLoading(true);
        const data = await patientService.getDoctorProfile(doctorId!);
        setDoctor(data);
      } catch (error) {
        console.error('Error loading doctor profile:', error);
        toast.error('Failed to load doctor profile');
        setDoctor(null);
      } finally {
        setLoading(false);
      }
    };
    if (doctorId) fetchDoctor();
  }, [doctorId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Clock className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading doctor profile...</p>
        </div>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
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

  const renderStars = (rating: number = 5) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`w-4 h-4 ${i < rating ? 'text-yellow-500 fill-current' : 'text-gray-300'}`} />
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link 
            to="/patient/doctors" 
            className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Doctors
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Doctor Info Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              {/* Basic Info */}
              <Card className="p-6">
                <div className="text-center mb-6">
                  <img
                    src={doctor.profileImage || `https://ui-avatars.com/api/?name=${doctor.firstName}+${doctor.lastName}&background=random`}
                    alt={`${doctor.firstName} ${doctor.lastName}`}
                    className="w-32 h-32 rounded-full object-cover mx-auto mb-4"
                  />
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {doctor.firstName} {doctor.lastName}
                  </h1>
                  <p className="text-blue-600 dark:text-blue-400 font-medium text-lg">
                    {doctor.specialization || 'General Medicine'}
                  </p>
                  {doctor.isVerified && (
                    <div className="flex items-center justify-center mt-2">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                      <span className="text-green-600 dark:text-green-400 text-sm font-medium">
                        Verified Doctor
                      </span>
                    </div>
                  )}
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
                      <div className="flex mr-2">
                        {renderStars(5)}
                      </div>
                      <span className="font-medium text-gray-900 dark:text-white">
                        4.8 (120)
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

                  {doctor.licenseNumber && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 dark:text-gray-400">License</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {doctor.licenseNumber}
                      </span>
                    </div>
                  )}
                </div>
              </Card>

              {/* Contact Info */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Contact Information
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <Mail className="w-5 h-5 text-gray-400 mr-3" />
                    <span className="text-gray-600 dark:text-gray-300">{doctor.email}</span>
                  </div>
                  {doctor.phone && (
                    <div className="flex items-center">
                      <Phone className="w-5 h-5 text-gray-400 mr-3" />
                      <span className="text-gray-600 dark:text-gray-300">{doctor.phone}</span>
                    </div>
                  )}
                </div>
              </Card>

              {/* Quick Actions */}
              <Card className="p-6">
                <div className="space-y-3">
                  <Link to={`/patient/book-appointment/${doctor._id}`} className="block">
                    <Button className="w-full" size="lg">
                      <Calendar className="w-5 h-5 mr-2" />
                      Book Appointment
                    </Button>
                  </Link>
                  <Button variant="outline" className="w-full">
                    <MessageCircle className="w-5 h-5 mr-2" />
                    Send Message
                  </Button>
                </div>
              </Card>
            </motion.div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  About Dr. {doctor.lastName}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {doctor.bio || 'Information about this doctor will be available soon.'}
                </p>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorProfile;