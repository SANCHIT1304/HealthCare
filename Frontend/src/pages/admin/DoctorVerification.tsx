import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Mail, 
  Phone, 
  Award, 
  GraduationCap,
  CheckCircle,
  XCircle,
  Eye,
  Clock,
  AlertCircle,
  FileText,
  Star
} from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import { mockDoctors } from '../../data/mockData';
import toast from 'react-hot-toast';

const DoctorVerification: React.FC = () => {
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [loading, setLoading] = useState(false);

  // Filter pending doctors
  const pendingDoctors = mockDoctors.filter(doc => !doc.isApproved);

  const handleApprove = async (doctorId: string) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success('Doctor approved successfully!');
    } catch (error) {
      toast.error('Failed to approve doctor');
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) {
      toast.error('Please provide a reason for rejection');
      return;
    }

    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success('Doctor application rejected');
      setShowRejectModal(false);
      setRejectReason('');
      setSelectedDoctor(null);
    } catch (error) {
      toast.error('Failed to reject application');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (isApproved: boolean, isVerified: boolean) => {
    if (isApproved) return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
    if (isVerified) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
    return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
  };

  const getStatusIcon = (isApproved: boolean, isVerified: boolean) => {
    if (isApproved) return <CheckCircle className="w-4 h-4" />;
    if (isVerified) return <Clock className="w-4 h-4" />;
    return <XCircle className="w-4 h-4" />;
  };

  const getStatusText = (isApproved: boolean, isVerified: boolean) => {
    if (isApproved) return 'Approved';
    if (isVerified) return 'Pending Review';
    return 'Rejected';
  };

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
            Doctor Verification
          </motion.h1>
          <p className="text-gray-600 dark:text-gray-400">
            Review and verify doctor applications
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    Pending Applications
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {pendingDoctors.length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-white" />
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    Approved Doctors
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {mockDoctors.filter(doc => doc.isApproved).length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    Total Applications
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {mockDoctors.length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Pending Applications */}
        {pendingDoctors.length > 0 ? (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Pending Applications ({pendingDoctors.length})
            </h2>
            
            {pendingDoctors.map((doctor, index) => (
              <motion.div
                key={doctor.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
              >
                <Card className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                    {/* Doctor Info */}
                    <div className="flex items-center space-x-4 flex-1">
                      <img
                        src={doctor.avatar || `https://ui-avatars.com/api/?name=${doctor.firstName}+${doctor.lastName}&background=random`}
                        alt={doctor.firstName}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          Dr. {doctor.firstName} {doctor.lastName}
                        </h3>
                        <p className="text-blue-600 dark:text-blue-400 font-medium">
                          {doctor.specialization}
                        </p>
                        <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600 dark:text-gray-400">
                          <div className="flex items-center">
                            <Mail className="w-4 h-4 mr-1" />
                            <span>{doctor.email}</span>
                          </div>
                          <div className="flex items-center">
                            <Award className="w-4 h-4 mr-1" />
                            <span>{doctor.experience} years</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Application Details */}
                    <div className="flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-8">
                      {/* License & Status */}
                      <div className="text-center lg:text-left">
                        <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                          License: {doctor.licenseNumber}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                          Fee: ${doctor.consultationFee}
                        </div>
                        <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(doctor.isApproved, doctor.isVerified)}`}>
                          {getStatusIcon(doctor.isApproved, doctor.isVerified)}
                          <span className="ml-1">{getStatusText(doctor.isApproved, doctor.isVerified)}</span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col sm:flex-row gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedDoctor(doctor);
                            setShowDetailsModal(true);
                          }}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          Review
                        </Button>

                        {!doctor.isApproved && (
                          <>
                            <Button
                              size="sm"
                              onClick={() => handleApprove(doctor.id)}
                              loading={loading}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Approve
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedDoctor(doctor);
                                setShowRejectModal(true);
                              }}
                              className="text-red-600 hover:text-red-700 border-red-300 hover:border-red-400"
                            >
                              <XCircle className="w-4 h-4 mr-1" />
                              Reject
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              All Applications Reviewed
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              No pending doctor applications at this time
            </p>
          </motion.div>
        )}

        {/* Doctor Details Modal */}
        <Modal
          isOpen={showDetailsModal}
          onClose={() => setShowDetailsModal(false)}
          title="Doctor Application Review"
          maxWidth="max-w-4xl"
        >
          {selectedDoctor && (
            <div className="space-y-6">
              {/* Doctor Header */}
              <div className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <img
                  src={selectedDoctor.avatar || `https://ui-avatars.com/api/?name=${selectedDoctor.firstName}+${selectedDoctor.lastName}&background=random`}
                  alt={selectedDoctor.firstName}
                  className="w-20 h-20 rounded-full object-cover"
                />
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Dr. {selectedDoctor.firstName} {selectedDoctor.lastName}
                  </h3>
                  <p className="text-blue-600 dark:text-blue-400 font-medium text-lg">
                    {selectedDoctor.specialization}
                  </p>
                  <div className="flex items-center mt-2">
                    <Star className="w-4 h-4 text-yellow-500 mr-1" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {selectedDoctor.rating} ({selectedDoctor.reviewsCount} reviews)
                    </span>
                  </div>
                </div>
              </div>

              {/* Professional Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                    Professional Details
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">License Number:</span>
                      <span className="text-gray-900 dark:text-white">{selectedDoctor.licenseNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Experience:</span>
                      <span className="text-gray-900 dark:text-white">{selectedDoctor.experience} years</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Consultation Fee:</span>
                      <span className="text-gray-900 dark:text-white">${selectedDoctor.consultationFee}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Verified:</span>
                      <span className={selectedDoctor.isVerified ? 'text-green-600' : 'text-red-600'}>
                        {selectedDoctor.isVerified ? 'Yes' : 'No'}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                    Contact Information
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center">
                      <Mail className="w-4 h-4 mr-2 text-gray-400" />
                      <span className="text-gray-900 dark:text-white">{selectedDoctor.email}</span>
                    </div>
                    <div className="flex items-center">
                      <Phone className="w-4 h-4 mr-2 text-gray-400" />
                      <span className="text-gray-900 dark:text-white">{selectedDoctor.phone}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Education */}
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                  <GraduationCap className="w-5 h-5 mr-2" />
                  Education & Training
                </h4>
                <div className="space-y-2">
                  {selectedDoctor.education.map((edu: string, index: number) => (
                    <div key={index} className="flex items-start">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mr-3 mt-2"></div>
                      <span className="text-gray-900 dark:text-white">{edu}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Professional Description */}
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                  Professional Description
                </h4>
                <p className="text-gray-900 dark:text-white leading-relaxed">
                  Experienced medical professional dedicated to providing comprehensive healthcare services 
                  with a focus on patient-centered care and evidence-based treatment approaches. Committed 
                  to maintaining the highest standards of medical practice and continuous professional development.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <Button
                  onClick={() => handleApprove(selectedDoctor.id)}
                  loading={loading}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Approve Application
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowDetailsModal(false);
                    setShowRejectModal(true);
                  }}
                  className="flex-1 text-red-600 hover:text-red-700 border-red-300 hover:border-red-400"
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Reject Application
                </Button>
              </div>
            </div>
          )}
        </Modal>

        {/* Reject Modal */}
        <Modal
          isOpen={showRejectModal}
          onClose={() => setShowRejectModal(false)}
          title="Reject Application"
        >
          <div className="space-y-4">
            <div className="flex items-start space-x-3 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <AlertCircle className="w-6 h-6 text-red-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-red-800 dark:text-red-300">
                  Reject Doctor Application
                </h4>
                <p className="text-red-700 dark:text-red-400 text-sm mt-1">
                  Please provide a detailed reason for rejecting this application. 
                  This will be sent to the doctor for their reference.
                </p>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Reason for Rejection *
              </label>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Please provide specific reasons for rejection (e.g., invalid license, incomplete documentation, etc.)"
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
              />
            </div>
            
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowRejectModal(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={handleReject}
                loading={loading}
                className="flex-1"
                disabled={!rejectReason.trim()}
              >
                Reject Application
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default DoctorVerification;