import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  MapPin,
  Edit,
  Save,
  Camera,
  Heart,
  Activity,
  Shield,
  FileText
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { mockHealthRecords } from '../../data/mockData';
import toast from 'react-hot-toast';

const PatientProfile: React.FC = () => {
  const { user } = useAuth();
  
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    dateOfBirth: user?.dateOfBirth || '',
    address: '123 Main Street, City, State 12345',
    emergencyContactName: 'Jane Doe',
    emergencyContactPhone: '+1-555-0199',
    emergencyContactRelation: 'Sister',
    bloodType: 'O+',
    allergies: 'Penicillin, Shellfish',
    medicalConditions: 'Hypertension',
    currentMedications: 'Lisinopril 10mg daily',
    insuranceProvider: 'Blue Cross Blue Shield',
    insurancePolicyNumber: 'BC123456789'
  });

  const patientHealthRecords = mockHealthRecords.filter(record => record.patientId === user?.id);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success('Profile updated successfully!');
      setIsEditing(false);
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    // Reset form data
    setFormData({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      phone: user?.phone || '',
      dateOfBirth: user?.dateOfBirth || '',
      address: '123 Main Street, City, State 12345',
      emergencyContactName: 'Jane Doe',
      emergencyContactPhone: '+1-555-0199',
      emergencyContactRelation: 'Sister',
      bloodType: 'O+',
      allergies: 'Penicillin, Shellfish',
      medicalConditions: 'Hypertension',
      currentMedications: 'Lisinopril 10mg daily',
      insuranceProvider: 'Blue Cross Blue Shield',
      insurancePolicyNumber: 'BC123456789'
    });
    setIsEditing(false);
  };

  const calculateAge = (dateOfBirth: string) => {
    if (!dateOfBirth) return 'Not provided';
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold text-gray-900 dark:text-white mb-2"
          >
            My Profile
          </motion.h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your personal information and medical details
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Summary */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              {/* Profile Picture & Basic Info */}
              <Card className="p-6">
                <div className="text-center">
                  <div className="relative inline-block mb-4">
                    <img
                      src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.firstName}+${user?.lastName}&background=random`}
                      alt={user?.firstName}
                      className="w-32 h-32 rounded-full object-cover mx-auto"
                    />
                    {isEditing && (
                      <button className="absolute bottom-0 right-0 w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-700 transition-colors">
                        <Camera className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {user?.firstName} {user?.lastName}
                  </h2>
                  <p className="text-blue-600 dark:text-blue-400 font-medium">
                    Patient
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                    Age: {calculateAge(formData.dateOfBirth)} years
                  </p>
                </div>

                <div className="mt-6 space-y-3">
                  <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <Mail className="w-5 h-5 mr-3" />
                    <span className="text-sm">{user?.email}</span>
                  </div>
                  <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <Phone className="w-5 h-5 mr-3" />
                    <span className="text-sm">{formData.phone || 'Not provided'}</span>
                  </div>
                  <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <Calendar className="w-5 h-5 mr-3" />
                    <span className="text-sm">
                      {formData.dateOfBirth ? new Date(formData.dateOfBirth).toLocaleDateString() : 'Not provided'}
                    </span>
                  </div>
                  <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <MapPin className="w-5 h-5 mr-3" />
                    <span className="text-sm">{formData.address}</span>
                  </div>
                </div>
              </Card>

              {/* Health Summary */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <Heart className="w-5 h-5 mr-2 text-red-500" />
                  Health Summary
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Blood Type</span>
                    <span className="font-medium text-gray-900 dark:text-white">{formData.bloodType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Health Records</span>
                    <span className="font-medium text-gray-900 dark:text-white">{patientHealthRecords.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Last Checkup</span>
                    <span className="font-medium text-gray-900 dark:text-white">2 weeks ago</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Next Appointment</span>
                    <span className="font-medium text-gray-900 dark:text-white">Mar 15, 2024</span>
                  </div>
                </div>
              </Card>

              {/* Quick Actions */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Quick Actions
                </h3>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <Activity className="w-4 h-4 mr-2" />
                    View Health Records
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Calendar className="w-4 h-4 mr-2" />
                    Book Appointment
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <FileText className="w-4 h-4 mr-2" />
                    Download Reports
                  </Button>
                </div>
              </Card>
            </motion.div>
          </div>

          {/* Profile Details */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              {/* Action Buttons */}
              <Card className="p-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Personal Information
                  </h3>
                  <div className="flex gap-3">
                    {isEditing ? (
                      <>
                        <Button variant="outline\" onClick={handleCancel}>
                          Cancel
                        </Button>
                        <Button onClick={handleSave} loading={loading}>
                          <Save className="w-4 h-4 mr-2" />
                          Save Changes
                        </Button>
                      </>
                    ) : (
                      <Button onClick={() => setIsEditing(true)}>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit Profile
                      </Button>
                    )}
                  </div>
                </div>
              </Card>

              {/* Basic Information */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Basic Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      First Name
                    </label>
                    {isEditing ? (
                      <Input
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                      />
                    ) : (
                      <p className="text-gray-900 dark:text-white">{formData.firstName}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Last Name
                    </label>
                    {isEditing ? (
                      <Input
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                      />
                    ) : (
                      <p className="text-gray-900 dark:text-white">{formData.lastName}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email
                    </label>
                    {isEditing ? (
                      <Input
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                      />
                    ) : (
                      <p className="text-gray-900 dark:text-white">{formData.email}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Phone
                    </label>
                    {isEditing ? (
                      <Input
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                      />
                    ) : (
                      <p className="text-gray-900 dark:text-white">{formData.phone || 'Not provided'}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Date of Birth
                    </label>
                    {isEditing ? (
                      <Input
                        name="dateOfBirth"
                        type="date"
                        value={formData.dateOfBirth}
                        onChange={handleChange}
                      />
                    ) : (
                      <p className="text-gray-900 dark:text-white">
                        {formData.dateOfBirth ? new Date(formData.dateOfBirth).toLocaleDateString() : 'Not provided'}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Address
                    </label>
                    {isEditing ? (
                      <Input
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                      />
                    ) : (
                      <p className="text-gray-900 dark:text-white">{formData.address}</p>
                    )}
                  </div>
                </div>
              </Card>

              {/* Emergency Contact */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
                  <Phone className="w-5 h-5 mr-2" />
                  Emergency Contact
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Name
                    </label>
                    {isEditing ? (
                      <Input
                        name="emergencyContactName"
                        value={formData.emergencyContactName}
                        onChange={handleChange}
                      />
                    ) : (
                      <p className="text-gray-900 dark:text-white">{formData.emergencyContactName}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Phone
                    </label>
                    {isEditing ? (
                      <Input
                        name="emergencyContactPhone"
                        value={formData.emergencyContactPhone}
                        onChange={handleChange}
                      />
                    ) : (
                      <p className="text-gray-900 dark:text-white">{formData.emergencyContactPhone}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Relationship
                    </label>
                    {isEditing ? (
                      <Input
                        name="emergencyContactRelation"
                        value={formData.emergencyContactRelation}
                        onChange={handleChange}
                      />
                    ) : (
                      <p className="text-gray-900 dark:text-white">{formData.emergencyContactRelation}</p>
                    )}
                  </div>
                </div>
              </Card>

              {/* Medical Information */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
                  <Heart className="w-5 h-5 mr-2 text-red-500" />
                  Medical Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Blood Type
                    </label>
                    {isEditing ? (
                      <select
                        name="bloodType"
                        value={formData.bloodType}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      >
                        <option value="">Select blood type</option>
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                      </select>
                    ) : (
                      <p className="text-gray-900 dark:text-white">{formData.bloodType}</p>
                    )}
                  </div>
                  <div className="md:col-span-1">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Allergies
                    </label>
                    {isEditing ? (
                      <textarea
                        name="allergies"
                        value={formData.allergies}
                        onChange={handleChange}
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
                        placeholder="List any allergies..."
                      />
                    ) : (
                      <p className="text-gray-900 dark:text-white">{formData.allergies || 'None reported'}</p>
                    )}
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Medical Conditions
                    </label>
                    {isEditing ? (
                      <textarea
                        name="medicalConditions"
                        value={formData.medicalConditions}
                        onChange={handleChange}
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
                        placeholder="List any medical conditions..."
                      />
                    ) : (
                      <p className="text-gray-900 dark:text-white">{formData.medicalConditions || 'None reported'}</p>
                    )}
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Current Medications
                    </label>
                    {isEditing ? (
                      <textarea
                        name="currentMedications"
                        value={formData.currentMedications}
                        onChange={handleChange}
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
                        placeholder="List current medications..."
                      />
                    ) : (
                      <p className="text-gray-900 dark:text-white">{formData.currentMedications || 'None reported'}</p>
                    )}
                  </div>
                </div>
              </Card>

              {/* Insurance Information */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
                  <Shield className="w-5 h-5 mr-2" />
                  Insurance Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Insurance Provider
                    </label>
                    {isEditing ? (
                      <Input
                        name="insuranceProvider"
                        value={formData.insuranceProvider}
                        onChange={handleChange}
                      />
                    ) : (
                      <p className="text-gray-900 dark:text-white">{formData.insuranceProvider}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Policy Number
                    </label>
                    {isEditing ? (
                      <Input
                        name="insurancePolicyNumber"
                        value={formData.insurancePolicyNumber}
                        onChange={handleChange}
                      />
                    ) : (
                      <p className="text-gray-900 dark:text-white">{formData.insurancePolicyNumber}</p>
                    )}
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientProfile;