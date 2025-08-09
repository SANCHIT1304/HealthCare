import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Clock, 
  User, 
  Star, 
  MapPin,
  Phone,
  Mail,
  Filter,
  Search,
  Plus,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
  Edit,
  Trash2,
  MessageCircle,
  Video,
  FileText
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { format, isAfter, isBefore, isToday, isTomorrow, parseISO, addDays } from 'date-fns';
import { useAuth } from '../../contexts/AuthContext';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';
import { mockAppointments, mockDoctors } from '../../data/mockData';
import toast from 'react-hot-toast';

interface ExtendedAppointment {
  id: string;
  patientId: string;
  doctorId: string;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  reason: string;
  notes?: string;
  prescription?: string;
  createdAt: string;
  doctor?: any;
}

const Appointments: React.FC = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [timeFilter, setTimeFilter] = useState<string>('all');
  const [selectedAppointment, setSelectedAppointment] = useState<ExtendedAppointment | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');

  // Extended appointments with doctor info
  const extendedAppointments: ExtendedAppointment[] = useMemo(() => {
    return mockAppointments
      .filter(apt => apt.patientId === user?.id)
      .map(apt => ({
        ...apt,
        doctor: mockDoctors.find(doc => doc.id === apt.doctorId)
      }));
  }, [user?.id]);

  // Filter appointments
  const filteredAppointments = useMemo(() => {
    let filtered = extendedAppointments;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(apt => 
        apt.doctor?.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        apt.doctor?.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        apt.doctor?.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
        apt.reason.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(apt => apt.status === statusFilter);
    }

    // Time filter
    if (timeFilter !== 'all') {
      const now = new Date();
      const appointmentDate = parseISO(apt.date);
      
      filtered = filtered.filter(apt => {
        const aptDate = parseISO(apt.date);
        
        switch (timeFilter) {
          case 'today':
            return isToday(aptDate);
          case 'tomorrow':
            return isTomorrow(aptDate);
          case 'upcoming':
            return isAfter(aptDate, now) || isToday(aptDate);
          case 'past':
            return isBefore(aptDate, now) && !isToday(aptDate);
          case 'this-week':
            return isAfter(aptDate, now) && isBefore(aptDate, addDays(now, 7));
          default:
            return true;
        }
      });
    }

    // Sort by date and time
    return filtered.sort((a, b) => {
      const dateA = new Date(`${a.date} ${a.time}`);
      const dateB = new Date(`${b.date} ${b.time}`);
      return dateB.getTime() - dateA.getTime();
    });
  }, [extendedAppointments, searchTerm, statusFilter, timeFilter]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'completed':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="w-4 h-4" />;
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getTimeLabel = (date: string) => {
    const aptDate = parseISO(date);
    const now = new Date();

    if (isToday(aptDate)) return 'Today';
    if (isTomorrow(aptDate)) return 'Tomorrow';
    if (isAfter(aptDate, now)) return 'Upcoming';
    return 'Past';
  };

  const handleCancelAppointment = async () => {
    if (!selectedAppointment || !cancelReason.trim()) {
      toast.error('Please provide a reason for cancellation');
      return;
    }

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Appointment cancelled successfully');
      setShowCancelModal(false);
      setCancelReason('');
      setSelectedAppointment(null);
    } catch (error) {
      toast.error('Failed to cancel appointment');
    }
  };

  const handleReschedule = (appointment: ExtendedAppointment) => {
    // Navigate to booking page with pre-filled data
    toast.info('Redirecting to reschedule...');
  };

  const stats = {
    total: extendedAppointments.length,
    upcoming: extendedAppointments.filter(apt => 
      isAfter(parseISO(apt.date), new Date()) || isToday(parseISO(apt.date))
    ).length,
    completed: extendedAppointments.filter(apt => apt.status === 'completed').length,
    cancelled: extendedAppointments.filter(apt => apt.status === 'cancelled').length
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
            My Appointments
          </motion.h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage and track all your medical appointments
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            { label: 'Total', value: stats.total, color: 'bg-blue-500', icon: Calendar },
            { label: 'Upcoming', value: stats.upcoming, color: 'bg-green-500', icon: Clock },
            { label: 'Completed', value: stats.completed, color: 'bg-purple-500', icon: CheckCircle },
            { label: 'Cancelled', value: stats.cancelled, color: 'bg-red-500', icon: XCircle }
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                      {stat.label}
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {stat.value}
                    </p>
                  </div>
                  <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Filters and Search */}
        <Card className="p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Search appointments by doctor, specialization, or reason..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Status Filter */}
            <div className="lg:w-48">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            {/* Time Filter */}
            <div className="lg:w-48">
              <select
                value={timeFilter}
                onChange={(e) => setTimeFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="tomorrow">Tomorrow</option>
                <option value="this-week">This Week</option>
                <option value="upcoming">Upcoming</option>
                <option value="past">Past</option>
              </select>
            </div>

            {/* Book New Appointment */}
            <Link to="/patient/doctors">
              <Button className="w-full lg:w-auto">
                <Plus className="w-4 h-4 mr-2" />
                Book New
              </Button>
            </Link>
          </div>
        </Card>

        {/* Appointments List */}
        {filteredAppointments.length > 0 ? (
          <div className="space-y-6">
            {filteredAppointments.map((appointment, index) => (
              <motion.div
                key={appointment.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                    {/* Doctor Info */}
                    <div className="flex items-center space-x-4 flex-1">
                      <img
                        src={appointment.doctor?.avatar || `https://ui-avatars.com/api/?name=${appointment.doctor?.firstName}+${appointment.doctor?.lastName}&background=random`}
                        alt={appointment.doctor?.firstName}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {appointment.doctor?.firstName} {appointment.doctor?.lastName}
                        </h3>
                        <p className="text-blue-600 dark:text-blue-400 font-medium">
                          {appointment.doctor?.specialization}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {appointment.reason}
                        </p>
                      </div>
                    </div>

                    {/* Appointment Details */}
                    <div className="flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-8">
                      {/* Date & Time */}
                      <div className="text-center lg:text-left">
                        <div className="flex items-center text-gray-600 dark:text-gray-400 mb-1">
                          <Calendar className="w-4 h-4 mr-2" />
                          <span className="text-sm">
                            {format(parseISO(appointment.date), 'MMM d, yyyy')}
                          </span>
                        </div>
                        <div className="flex items-center text-gray-600 dark:text-gray-400">
                          <Clock className="w-4 h-4 mr-2" />
                          <span className="text-sm">{appointment.time}</span>
                        </div>
                        <span className="inline-block mt-2 px-2 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400 text-xs rounded-full">
                          {getTimeLabel(appointment.date)}
                        </span>
                      </div>

                      {/* Status */}
                      <div className="text-center">
                        <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(appointment.status)}`}>
                          {getStatusIcon(appointment.status)}
                          <span className="ml-1 capitalize">{appointment.status}</span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col sm:flex-row gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedAppointment(appointment);
                            setShowDetailsModal(true);
                          }}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          Details
                        </Button>

                        {appointment.status === 'confirmed' && isAfter(parseISO(appointment.date), new Date()) && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleReschedule(appointment)}
                            >
                              <Edit className="w-4 h-4 mr-1" />
                              Reschedule
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedAppointment(appointment);
                                setShowCancelModal(true);
                              }}
                              className="text-red-600 hover:text-red-700 border-red-300 hover:border-red-400"
                            >
                              <XCircle className="w-4 h-4 mr-1" />
                              Cancel
                            </Button>
                          </>
                        )}

                        {appointment.status === 'completed' && (
                          <Button variant="outline" size="sm">
                            <FileText className="w-4 h-4 mr-1" />
                            Report
                          </Button>
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
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No appointments found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {searchTerm || statusFilter !== 'all' || timeFilter !== 'all'
                ? 'Try adjusting your search criteria'
                : 'You haven\'t booked any appointments yet'
              }
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {(searchTerm || statusFilter !== 'all' || timeFilter !== 'all') && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm('');
                    setStatusFilter('all');
                    setTimeFilter('all');
                  }}
                >
                  Clear Filters
                </Button>
              )}
              <Link to="/patient/doctors">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Book Your First Appointment
                </Button>
              </Link>
            </div>
          </motion.div>
        )}

        {/* Appointment Details Modal */}
        <Modal
          isOpen={showDetailsModal}
          onClose={() => setShowDetailsModal(false)}
          title="Appointment Details"
          maxWidth="max-w-2xl"
        >
          {selectedAppointment && (
            <div className="space-y-6">
              {/* Doctor Info */}
              <div className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <img
                  src={selectedAppointment.doctor?.avatar || `https://ui-avatars.com/api/?name=${selectedAppointment.doctor?.firstName}+${selectedAppointment.doctor?.lastName}&background=random`}
                  alt={selectedAppointment.doctor?.firstName}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {selectedAppointment.doctor?.firstName} {selectedAppointment.doctor?.lastName}
                  </h3>
                  <p className="text-blue-600 dark:text-blue-400 font-medium">
                    {selectedAppointment.doctor?.specialization}
                  </p>
                  <div className="flex items-center mt-1">
                    <Star className="w-4 h-4 text-yellow-500 mr-1" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {selectedAppointment.doctor?.rating} ({selectedAppointment.doctor?.reviewsCount} reviews)
                    </span>
                  </div>
                </div>
              </div>

              {/* Appointment Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Date & Time
                  </label>
                  <p className="text-gray-900 dark:text-white">
                    {format(parseISO(selectedAppointment.date), 'EEEE, MMMM d, yyyy')} at {selectedAppointment.time}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Status
                  </label>
                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedAppointment.status)}`}>
                    {getStatusIcon(selectedAppointment.status)}
                    <span className="ml-1 capitalize">{selectedAppointment.status}</span>
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Reason for Visit
                  </label>
                  <p className="text-gray-900 dark:text-white">
                    {selectedAppointment.reason}
                  </p>
                </div>
                {selectedAppointment.notes && (
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Doctor's Notes
                    </label>
                    <p className="text-gray-900 dark:text-white">
                      {selectedAppointment.notes}
                    </p>
                  </div>
                )}
                {selectedAppointment.prescription && (
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Prescription
                    </label>
                    <p className="text-gray-900 dark:text-white">
                      {selectedAppointment.prescription}
                    </p>
                  </div>
                )}
              </div>

              {/* Contact Options */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <Button variant="outline" className="flex-1">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Message Doctor
                </Button>
                <Button variant="outline" className="flex-1">
                  <Video className="w-4 h-4 mr-2" />
                  Video Call
                </Button>
                <Button variant="outline" className="flex-1">
                  <Phone className="w-4 h-4 mr-2" />
                  Call Office
                </Button>
              </div>
            </div>
          )}
        </Modal>

        {/* Cancel Appointment Modal */}
        <Modal
          isOpen={showCancelModal}
          onClose={() => setShowCancelModal(false)}
          title="Cancel Appointment"
        >
          <div className="space-y-4">
            <p className="text-gray-600 dark:text-gray-400">
              Are you sure you want to cancel this appointment? Please provide a reason for cancellation.
            </p>
            <textarea
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="Reason for cancellation..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
            />
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowCancelModal(false)}
                className="flex-1"
              >
                Keep Appointment
              </Button>
              <Button
                variant="danger"
                onClick={handleCancelAppointment}
                className="flex-1"
                disabled={!cancelReason.trim()}
              >
                Cancel Appointment
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default Appointments;