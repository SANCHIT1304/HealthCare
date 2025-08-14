import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Users, 
  Clock,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Plus,
  ArrowRight,
  DollarSign,
  Star,
  FileText
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { doctorService } from '../../services/doctorService';
import { DashboardData, Appointment } from '../../types/api';
import { format, isToday, isTomorrow, parseISO } from 'date-fns';
import toast from 'react-hot-toast';

const DoctorDashboard: React.FC = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const data = await doctorService.getDashboardStats();
        setDashboardData(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
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

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Error Loading Dashboard
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return null;
  }

  const { stats, recentAppointments, upcomingAppointments } = dashboardData;

  const statsData = [
    {
      title: 'Today\'s Appointments',
      value: stats.todayAppointments.toString(),
      icon: Calendar,
      color: 'bg-blue-500',
      change: `${stats.todayAppointments > 0 ? '+' : ''}${stats.todayAppointments} today`
    },
    {
      title: 'Total Patients',
      value: stats.totalPatients.toString(),
      icon: Users,
      color: 'bg-green-500',
      change: `${stats.totalPatients} unique patients`
    },
    {
      title: 'Pending Approvals',
      value: stats.pendingAppointments.toString(),
      icon: Clock,
      color: 'bg-orange-500',
      change: `${stats.pendingAppointments} need review`
    },
    {
      title: 'Monthly Revenue',
      value: `$${stats.monthlyRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: 'bg-purple-500',
      change: 'This month'
    }
  ];

  const formatAppointmentTime = (date: string, time: string) => {
    const appointmentDate = parseISO(date);
    const timeString = time;
    return `${format(appointmentDate, 'MMM dd')} at ${timeString}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-400';
      case 'pending':
        return 'text-orange-600 bg-orange-100 dark:bg-orange-900 dark:text-orange-400';
      case 'completed':
        return 'text-blue-600 bg-blue-100 dark:bg-blue-900 dark:text-blue-400';
      case 'cancelled':
        return 'text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-400';
      default:
        return 'text-gray-600 bg-gray-100 dark:bg-gray-700 dark:text-gray-400';
    }
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
            Welcome back, Dr. {user?.firstName}!
          </motion.h1>
          <p className="text-gray-600 dark:text-gray-400">
            Here's your practice overview for today
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsData.map((stat, index) => (
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
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {stat.value}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {stat.change}
                    </p>
                  </div>
                  <div className={`p-3 rounded-lg ${stat.color}`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Today's Appointments */}
          <div className="lg:col-span-2">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Today's Appointments
                </h2>
                <Link to="/doctor/appointments">
                  <Button variant="outline" size="sm">
                    View All
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
              
              {upcomingAppointments.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">
                    No appointments scheduled for today
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {upcomingAppointments.slice(0, 5).map((appointment) => (
                    <div
                      key={appointment._id}
                      className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                          <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {appointment.patientId.firstName} {appointment.patientId.lastName}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {formatAppointmentTime(appointment.date, appointment.time)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(appointment.status)}`}>
                          {appointment.status}
                        </span>
                        <Link to={`/doctor/appointments/${appointment._id}`}>
                          <Button variant="outline" size="sm">
                            View
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>

          {/* Quick Actions */}
          <div>
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Quick Actions
              </h2>
              <div className="space-y-3">
                <Link to="/doctor/appointments" className="block">
                  <Button variant="outline" className="w-full justify-start">
                    <Calendar className="w-4 h-4 mr-2" />
                    View Appointments
                  </Button>
                </Link>
                <Link to="/doctor/availability" className="block">
                  <Button variant="outline" className="w-full justify-start">
                    <Clock className="w-4 h-4 mr-2" />
                    Set Availability
                  </Button>
                </Link>
                <Link to="/doctor/prescriptions" className="block">
                  <Button variant="outline" className="w-full justify-start">
                    <FileText className="w-4 h-4 mr-2" />
                    Manage Prescriptions
                  </Button>
                </Link>
                <Link to="/doctor/profile" className="block">
                  <Button variant="outline" className="w-full justify-start">
                    <Users className="w-4 h-4 mr-2" />
                    Update Profile
                  </Button>
                </Link>
              </div>
            </Card>

            {/* Recent Activity */}
            <Card className="p-6 mt-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Recent Activity
              </h2>
              <div className="space-y-4">
                {recentAppointments.slice(0, 3).map((appointment) => (
                  <div key={appointment._id} className="flex items-center space-x-3">
                    <div className={`w-2 h-2 rounded-full ${
                      appointment.status === 'completed' ? 'bg-green-500' :
                      appointment.status === 'confirmed' ? 'bg-blue-500' :
                      appointment.status === 'pending' ? 'bg-orange-500' : 'bg-red-500'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {appointment.patientId.firstName} {appointment.patientId.lastName}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {format(parseISO(appointment.date), 'MMM dd, yyyy')} - {appointment.status}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;