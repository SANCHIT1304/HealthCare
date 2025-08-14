import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Star, 
  Calendar,
  Clock,
  DollarSign,
  User,
  Loader2
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { patientService } from '../../services/patientService';
import { User as UserType } from '../../types/api';
import toast from 'react-hot-toast';

const Doctors: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState('');
  const [doctors, setDoctors] = useState<UserType[]>([]);
  const [filteredDoctors, setFilteredDoctors] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);
  const [specializations, setSpecializations] = useState<string[]>([]);

  // Fetch doctors on component mount
  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const response = await patientService.getVerifiedDoctors();
      setDoctors(response.doctors);
      setFilteredDoctors(response.doctors);
      
      // Extract unique specializations
      const specs = Array.from(new Set(response.doctors.map(doc => doc.specialization).filter(Boolean)));
      setSpecializations(specs as string[]); //changed from specs to specs as string[]
    } catch (error) {
      console.error('Error fetching doctors:', error);
      toast.error('Failed to load doctors');
    } finally {
      setLoading(false);
    }
  };

  // Filter doctors based on search and specialization
  useEffect(() => {
    let filtered = doctors.filter(doctor => {
      const matchesSearch = 
        doctor.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (doctor.specialization && doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesSpecialization = 
        !selectedSpecialization || doctor.specialization === selectedSpecialization;

      return matchesSearch && matchesSpecialization;
    });

    setFilteredDoctors(filtered);
  }, [searchTerm, selectedSpecialization, doctors]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold text-gray-900 dark:text-white mb-2"
          >
            Find Doctors
          </motion.h1>
          <p className="text-gray-600 dark:text-gray-400">
            Connect with verified healthcare professionals
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8">
          <Card className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Search doctors by name or specialization..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="md:w-64">
                <select
                  value={selectedSpecialization}
                  onChange={(e) => setSelectedSpecialization(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                >
                  <option value="">All Specializations</option>
                  {specializations.map(spec => (
                    <option key={spec} value={spec}>{spec}</option>
                  ))}
                </select>
              </div>
            </div>
          </Card>
        </div>

        {/* Results */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            <span className="ml-2 text-gray-600 dark:text-gray-400">Loading doctors...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDoctors.map((doctor, index) => (
            <motion.div
              key={doctor._id} // Changed from doctor.id to doctor._id
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card hover className="p-6 h-full">
                <div className="text-center mb-4">
                  <img
                    src={doctor.profileImage || `https://ui-avatars.com/api/?name=${doctor.firstName}+${doctor.lastName}&background=random`}
                    alt={`${doctor.firstName} ${doctor.lastName}`}
                    className="w-20 h-20 rounded-full object-cover mx-auto mb-4"
                  />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {doctor.firstName} {doctor.lastName}
                  </h3>
                  <p className="text-blue-600 dark:text-blue-400 font-medium">
                    {doctor.specialization || 'General Medicine'}
                  </p>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <Star className="w-4 h-4 mr-2 text-yellow-500" />
                    <span>4.8 (120 reviews)</span>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <User className="w-4 h-4 mr-2" />
                    <span>{doctor.experience || 5} years experience</span>
                  </div>

                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <DollarSign className="w-4 h-4 mr-2" />
                    <span>${doctor.consultationFee || 50} consultation</span>
                  </div>

                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <Clock className="w-4 h-4 mr-2" />
                    <span>Available today</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Link to={`/patient/doctors/${doctor._id}`} className="block">
                    <Button variant="outline" className="w-full">
                      View Profile
                    </Button>
                  </Link>
                  <Link to={`/patient/book-appointment/${doctor._id}`} className="block">
                    <Button className="w-full">
                      <Calendar className="w-4 h-4 mr-2" />
                      Book Appointment
                    </Button>
                  </Link>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
        )}
        {!loading && filteredDoctors.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No doctors found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Try adjusting your search criteria
            </p>
            <Button 
              onClick={() => {
                setSearchTerm('');
                setSelectedSpecialization('');
              }}
            >
              Clear Filters
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Doctors;