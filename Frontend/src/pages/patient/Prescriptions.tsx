import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, User, Calendar, Eye, Loader2, Search } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { patientService } from '../../services/patientService';
import { Prescription as PrescriptionType } from '../../types/api';
import toast from 'react-hot-toast';

const Prescriptions: React.FC = () => {
  const [prescriptions, setPrescriptions] = useState<PrescriptionType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  const fetchPrescriptions = async () => {
    try {
      setLoading(true);
      const response = await patientService.getPrescriptions();
      setPrescriptions(response.prescriptions);
    } catch (error) {
      console.error('Error fetching prescriptions:', error);
      toast.error('Failed to load prescriptions');
    } finally {
      setLoading(false);
    }
  };

  const filteredPrescriptions = prescriptions.filter(prescription => 
    (prescription.doctorId as any)?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (prescription.doctorId as any)?.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    prescription.diagnosis.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold text-gray-900 dark:text-white mb-2"
          >
            My Prescriptions
          </motion.h1>
          <p className="text-gray-600 dark:text-gray-400">
            View all your medical prescriptions
          </p>
        </div>

        <Card className="p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Search prescriptions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </Card>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            <span className="ml-2 text-gray-600 dark:text-gray-400">Loading prescriptions...</span>
          </div>
        ) : filteredPrescriptions.length > 0 ? (
          <div className="space-y-6">
            {filteredPrescriptions.map((prescription, index) => (
              <motion.div
                key={prescription._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                    <div className="flex items-center space-x-4 flex-1">
                      <img
                        src={(prescription.doctorId as any)?.profileImage || `https://ui-avatars.com/api/?name=${(prescription.doctorId as any)?.firstName}+${(prescription.doctorId as any)?.lastName}&background=random`}
                        alt={(prescription.doctorId as any)?.firstName}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {(prescription.doctorId as any)?.firstName} {(prescription.doctorId as any)?.lastName}
                        </h3>
                        <p className="text-blue-600 dark:text-blue-400 font-medium">
                          {(prescription.doctorId as any)?.specialization || 'General Medicine'}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {prescription.diagnosis}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-8">
                      <div className="text-center lg:text-left">
                        <div className="flex items-center text-gray-600 dark:text-gray-400 mb-1">
                          <Calendar className="w-4 h-4 mr-2" />
                          <span className="text-sm">
                            {format(parseISO(prescription.createdAt), 'MMM d, yyyy')}
                          </span>
                        </div>
                        <div className="flex items-center text-gray-600 dark:text-gray-400 mb-2">
                          <FileText className="w-4 h-4 mr-2" />
                          <span className="text-sm">{prescription.prescriptionNumber}</span>
                        </div>
                        <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
                          <span className="capitalize">{prescription.status}</span>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4 mr-1" />
                          View Details
                        </Button>
                        <Button variant="outline" size="sm">
                          <FileText className="w-4 h-4 mr-1" />
                          Download
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : !loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No prescriptions found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {searchTerm ? 'Try adjusting your search criteria' : 'You don\'t have any prescriptions yet'}
            </p>
            {searchTerm && (
              <Button
                variant="outline"
                onClick={() => setSearchTerm('')}
              >
                Clear Search
              </Button>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Prescriptions;
