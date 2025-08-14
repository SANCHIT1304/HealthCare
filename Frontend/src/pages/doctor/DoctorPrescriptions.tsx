import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Plus, 
  Search,
  Filter,
  Eye,
  Edit,
  Download,
  Calendar,
  User,
  Pill,
  TestTube,
  Heart,
  AlertCircle,
  CheckCircle,
  Clock,
  Printer,
  Loader,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { useAuth } from '../../contexts/AuthContext';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';
import { doctorService } from '../../services/doctorService';
import { Prescription, PrescriptionListResponse } from '../../types/api';
import toast from 'react-hot-toast';

const DoctorPrescriptions: React.FC = () => {
  const { user } = useAuth();
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [itemsPerPage] = useState(10);

  // Fetch prescriptions
  const fetchPrescriptions = async () => {
    try {
      setLoading(true);
      const params: any = {
        page: currentPage,
        limit: itemsPerPage
      };

      if (statusFilter !== 'all') {
        params.status = statusFilter;
      }

      const response: PrescriptionListResponse = await doctorService.getPrescriptions(params);
      setPrescriptions(response.prescriptions);
      setTotalPages(response.pagination.totalPages);
      setTotalItems(response.pagination.totalItems);
      setError(null);
    } catch (err) {
      console.error('Error fetching prescriptions:', err);
      setError(err instanceof Error ? err.message : 'Failed to load prescriptions');
      toast.error('Failed to load prescriptions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrescriptions();
  }, [currentPage, statusFilter]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'completed':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-4 h-4" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'cancelled':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const handleCreatePrescription = async () => {
    try {
      setLoading(true);
      // This would open a form to create a new prescription
      // For now, we'll just show a success message
      toast.success('Prescription creation feature coming soon');
      setShowCreateModal(false);
    } catch (err) {
      console.error('Error creating prescription:', err);
      toast.error('Failed to create prescription');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPrescription = async (prescriptionId: string) => {
    try {
      // This would generate and download a PDF
      toast.success('Download feature coming soon');
    } catch (err) {
      console.error('Error downloading prescription:', err);
      toast.error('Failed to download prescription');
    }
  };

  const handlePrintPrescription = async (prescriptionId: string) => {
    try {
      // This would print the prescription
      toast.success('Print feature coming soon');
    } catch (err) {
      console.error('Error printing prescription:', err);
      toast.error('Failed to print prescription');
    }
  };

  const openDetailsModal = (prescription: Prescription) => {
    setSelectedPrescription(prescription);
    setShowDetailsModal(true);
  };

  if (loading && prescriptions.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error && prescriptions.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Error Loading Prescriptions
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
            <Button onClick={() => fetchPrescriptions()}>
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

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
            Prescriptions
          </motion.h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage patient prescriptions and medical records
          </p>
        </div>

        {/* Filters */}
        <Card className="p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Search prescriptions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>

            {/* Create New */}
            <Button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Prescription
            </Button>
          </div>
        </Card>

        {/* Prescriptions List */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Prescriptions ({totalItems})
            </h2>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Page {currentPage} of {totalPages}
              </span>
            </div>
          </div>

          {prescriptions.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No prescriptions found
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {searchTerm || statusFilter !== 'all'
                  ? 'Try adjusting your filters'
                  : 'You have no prescriptions yet'}
              </p>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                {prescriptions.map((prescription) => (
                  <motion.div
                    key={prescription._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                        <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          {prescription.patientId.firstName} {prescription.patientId.lastName}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {prescription.diagnosis}
                        </p>
                        <div className="flex items-center space-x-4 mt-1">
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {format(parseISO(prescription.createdAt), 'MMM dd, yyyy')}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            #{prescription.prescriptionNumber}
                          </span>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full flex items-center space-x-1 ${getStatusColor(prescription.status)}`}>
                            {getStatusIcon(prescription.status)}
                            <span>{prescription.status}</span>
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openDetailsModal(prescription)}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownloadPrescription(prescription._id)}
                      >
                        <Download className="w-4 h-4 mr-1" />
                        Download
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePrintPrescription(prescription._id)}
                      >
                        <Printer className="w-4 h-4 mr-1" />
                        Print
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-6">
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} prescriptions
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Previous
                    </Button>
                    <span className="px-3 py-1 text-sm text-gray-600 dark:text-gray-400">
                      {currentPage} / {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      Next
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </Card>

        {/* Prescription Details Modal */}
        <Modal
          isOpen={showDetailsModal}
          onClose={() => setShowDetailsModal(false)}
          title="Prescription Details"
        >
          {selectedPrescription && (
            <div className="space-y-6">
              {/* Patient Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Patient Name
                  </label>
                  <p className="text-gray-900 dark:text-white">
                    {selectedPrescription.patientId.firstName} {selectedPrescription.patientId.lastName}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Prescription Number
                  </label>
                  <p className="text-gray-900 dark:text-white">
                    #{selectedPrescription.prescriptionNumber}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Date
                  </label>
                  <p className="text-gray-900 dark:text-white">
                    {format(parseISO(selectedPrescription.createdAt), 'MMM dd, yyyy')}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Status
                  </label>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(selectedPrescription.status)}`}>
                    {selectedPrescription.status}
                  </span>
                </div>
              </div>

              {/* Diagnosis */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Diagnosis
                </label>
                <p className="text-gray-900 dark:text-white">
                  {selectedPrescription.diagnosis}
                </p>
              </div>

              {/* Symptoms */}
              {selectedPrescription.symptoms && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Symptoms
                  </label>
                  <p className="text-gray-900 dark:text-white">
                    {selectedPrescription.symptoms}
                  </p>
                </div>
              )}

              {/* Medications */}
              {selectedPrescription.medications && selectedPrescription.medications.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Medications
                  </label>
                  <div className="space-y-2">
                    {selectedPrescription.medications.map((med, index) => (
                      <div key={index} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="flex items-center space-x-2 mb-1">
                          <Pill className="w-4 h-4 text-blue-600" />
                          <span className="font-medium text-gray-900 dark:text-white">
                            {med.name}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                          <p><strong>Dosage:</strong> {med.dosage}</p>
                          <p><strong>Frequency:</strong> {med.frequency}</p>
                          <p><strong>Duration:</strong> {med.duration}</p>
                          {med.instructions && (
                            <p><strong>Instructions:</strong> {med.instructions}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Lab Tests */}
              {selectedPrescription.labTests && selectedPrescription.labTests.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Lab Tests
                  </label>
                  <div className="space-y-2">
                    {selectedPrescription.labTests.map((test, index) => (
                      <div key={index} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="flex items-center space-x-2 mb-1">
                          <TestTube className="w-4 h-4 text-green-600" />
                          <span className="font-medium text-gray-900 dark:text-white">
                            {test.name}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {test.description}
                        </p>
                        {test.instructions && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            <strong>Instructions:</strong> {test.instructions}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Lifestyle Recommendations */}
              {selectedPrescription.lifestyleRecommendations && selectedPrescription.lifestyleRecommendations.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Lifestyle Recommendations
                  </label>
                  <div className="space-y-2">
                    {selectedPrescription.lifestyleRecommendations.map((rec, index) => (
                      <div key={index} className="flex items-start space-x-2">
                        <Heart className="w-4 h-4 text-red-600 mt-0.5" />
                        <span className="text-sm text-gray-900 dark:text-white">
                          {rec}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Notes */}
              {selectedPrescription.notes && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Notes
                  </label>
                  <p className="text-gray-900 dark:text-white">
                    {selectedPrescription.notes}
                  </p>
                </div>
              )}

              {/* Follow-up */}
              {selectedPrescription.followUpRequired && selectedPrescription.followUpDate && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Follow-up Date
                  </label>
                  <p className="text-gray-900 dark:text-white">
                    {format(parseISO(selectedPrescription.followUpDate), 'MMM dd, yyyy')}
                  </p>
                </div>
              )}
            </div>
          )}
        </Modal>

        {/* Create Prescription Modal */}
        <Modal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          title="Create New Prescription"
        >
          <div className="space-y-4">
            <p className="text-gray-600 dark:text-gray-400">
              This feature is coming soon. You'll be able to create new prescriptions for your patients.
            </p>
            <div className="flex justify-end space-x-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setShowCreateModal(false)}
              >
                Close
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default DoctorPrescriptions;
