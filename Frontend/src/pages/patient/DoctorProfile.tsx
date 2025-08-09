import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Star, 
  MapPin, 
  Calendar, 
  Clock, 
  DollarSign,
  User,
  GraduationCap,
  Award,
  Phone,
  Mail,
  CheckCircle,
  MessageCircle
} from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { mockDoctors } from '../../data/mockData';

const DoctorProfile: React.FC = () => {
  const { doctorId } = useParams<{ doctorId: string }>();
  const [activeTab, setActiveTab] = useState<'overview' | 'reviews' | 'availability'>('overview');
  
  const doctor = mockDoctors.find(d => d.id === doctorId);

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

  // Mock reviews data
  const reviews = [
    {
      id: '1',
      patientName: 'Sarah Johnson',
      rating: 5,
      comment: 'Excellent doctor! Very thorough and caring. Explained everything clearly.',
      date: '2024-02-15'
    },
    {
      id: '2',
      patientName: 'Michael Chen',
      rating: 5,
      comment: 'Professional and knowledgeable. Great bedside manner.',
      date: '2024-02-10'
    },
    {
      id: '3',
      patientName: 'Emily Davis',
      rating: 4,
      comment: 'Good consultation, though the wait time was a bit long.',
      date: '2024-02-05'
    }
  ];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'reviews', label: 'Reviews', icon: MessageCircle },
    { id: 'availability', label: 'Availability', icon: Calendar }
  ];

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? 'text-yellow-500 fill-current' : 'text-gray-300'
        }`}
      />
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
                    src={doctor.avatar || `https://ui-avatars.com/api/?name=${doctor.firstName}+${doctor.lastName}&background=random`}
                    alt={`${doctor.firstName} ${doctor.lastName}`}
                    className="w-32 h-32 rounded-full object-cover mx-auto mb-4"
                  />
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {doctor.firstName} {doctor.lastName}
                  </h1>
                  <p className="text-blue-600 dark:text-blue-400 font-medium text-lg">
                    {doctor.specialization}
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
                      {doctor.experience} years
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Rating</span>
                    <div className="flex items-center">
                      <div className="flex mr-2">
                        {renderStars(Math.floor(doctor.rating))}
                      </div>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {doctor.rating} ({doctor.reviewsCount})
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Consultation Fee</span>
                    <div className="flex items-center">
                      <DollarSign className="w-4 h-4 text-green-500 mr-1" />
                      <span className="font-medium text-gray-900 dark:text-white">
                        ${doctor.consultationFee}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">License</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {doctor.licenseNumber}
                    </span>
                  </div>
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
                  <Link to={`/patient/book-appointment/${doctor.id}`} className="block">
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
              {/* Tabs */}
              <Card className="p-6 mb-6">
                <div className="flex space-x-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-all ${
                        activeTab === tab.id
                          ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm'
                          : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                      }`}
                    >
                      <tab.icon className="w-4 h-4 mr-2" />
                      {tab.label}
                    </button>
                  ))}
                </div>
              </Card>

              {/* Tab Content */}
              <div className="space-y-6">
                {activeTab === 'overview' && (
                  <>
                    {/* About */}
                    <Card className="p-6">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        About Dr. {doctor.lastName}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                        Dr. {doctor.firstName} {doctor.lastName} is a highly experienced {doctor.specialization.toLowerCase()} 
                        with {doctor.experience} years of practice. Known for providing comprehensive and compassionate care, 
                        Dr. {doctor.lastName} is committed to helping patients achieve optimal health outcomes through 
                        evidence-based treatment approaches and personalized care plans.
                      </p>
                    </Card>

                    {/* Education */}
                    <Card className="p-6">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                        <GraduationCap className="w-5 h-5 mr-2" />
                        Education & Training
                      </h3>
                      <div className="space-y-3">
                        {doctor.education.map((edu, index) => (
                          <div key={index} className="flex items-center">
                            <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                            <span className="text-gray-600 dark:text-gray-300">{edu}</span>
                          </div>
                        ))}
                      </div>
                    </Card>

                    {/* Specializations */}
                    <Card className="p-6">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                        <Award className="w-5 h-5 mr-2" />
                        Specializations
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full text-sm font-medium">
                          {doctor.specialization}
                        </span>
                        <span className="px-3 py-1 bg-teal-100 dark:bg-teal-900/30 text-teal-800 dark:text-teal-300 rounded-full text-sm font-medium">
                          Preventive Care
                        </span>
                        <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 rounded-full text-sm font-medium">
                          Patient Education
                        </span>
                      </div>
                    </Card>
                  </>
                )}

                {activeTab === 'reviews' && (
                  <Card className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                      Patient Reviews ({reviews.length})
                    </h3>
                    <div className="space-y-6">
                      {reviews.map((review) => (
                        <div key={review.id} className="border-b border-gray-200 dark:border-gray-700 pb-6 last:border-b-0">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h4 className="font-medium text-gray-900 dark:text-white">
                                {review.patientName}
                              </h4>
                              <div className="flex items-center mt-1">
                                <div className="flex mr-2">
                                  {renderStars(review.rating)}
                                </div>
                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                  {new Date(review.date).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          </div>
                          <p className="text-gray-600 dark:text-gray-300">
                            {review.comment}
                          </p>
                        </div>
                      ))}
                    </div>
                  </Card>
                )}

                {activeTab === 'availability' && (
                  <Card className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                      Weekly Availability
                    </h3>
                    <div className="space-y-4">
                      {Object.entries(doctor.availability).map(([day, slots]) => (
                        <div key={day} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <span className="font-medium text-gray-900 dark:text-white capitalize">
                            {day}
                          </span>
                          <div className="flex flex-wrap gap-2">
                            {slots.length > 0 ? (
                              slots.map((slot, index) => (
                                <span
                                  key={index}
                                  className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-full text-sm"
                                >
                                  {slot.start} - {slot.end}
                                </span>
                              ))
                            ) : (
                              <span className="text-gray-500 dark:text-gray-400 text-sm">
                                Not available
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorProfile;