import React from 'react';
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
  Star
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { mockAppointments, mockDoctors } from '../../data/mockData';
import { format, isToday, isTomorrow, parseISO } from 'date-fns';

const DoctorDashboard: React.FC = () => {
  const { user } = useAuth();
  
  // Get doctor data
  const doctorData = mockDoctors.find(doc => doc.id === user?.id);
  
  // Get doctor's appointments
  const doctorAppointments = mockAppointments.filter(apt => apt.doctorId === user?.id);
  
  const todayAppointments = doctorAppointments.filter(apt => isToday(parseISO(apt.date)));
  const upcomingAppointments = doctorAppointments.filter(apt => 
    apt.status === 'confirmed' && (isToday(parseISO(apt.date)) || isTomorrow(parseISO(apt.date)))
  );

  const stats = [
    {
      title: 'Today\'s Appointments',
      value: todayAppointments.length.toString(),
      icon: Calendar,
      color: 'bg-blue-500',
      change: '+2 from yesterday'
    },
    {
      title: 'Total Patients',
      value: '127',
      icon: Users,
      color: 'bg-green-500',
      change: '+12 this month'
    },
    {
      title: 'Pending Approvals',
      value: doctorAppointments.filter(apt => apt.status === 'pending').length.toString(),
      icon: Clock,
      color: 'bg-orange-500',
      change: '3 need review'
    },
    {
      title: 'Monthly Revenue',
      value: '$12,450',
      icon: DollarSign,
      color: 'bg-purple-500',
      change: '+18% from last month'
    }
  ];

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
          {stats.map((stat, index) => (
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
                    <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                      {stat.change}
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Today's Appointments */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Today's Appointments
                  </h2>
                  <Link to="/doctor/appointments">
                    <Button variant="outline" size="sm">
                      View All
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  </Link>
                </div>

                {todayAppointments.length > 0 ? (
                  <div className="space-y-4">
                    {todayAppointments.slice(0, 3).map((appointment, index) => (
                      <div
                        key={appointment.id}
                        className="flex items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                      >
                        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mr-4">
                          <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900 dark:text-white">
                            Patient Consultation
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {appointment.reason}
                          </p>
                          <p className="text-sm text-blue-600 dark:text-blue-400">
                            {appointment.time}
                          </p>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                          appointment.status === 'confirmed'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                        }`}>
                          {appointment.status}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      No appointments scheduled for today
                    </p>
                    <Link to="/doctor/availability">
                      <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        Set Availability
                      </Button>
                    </Link>
                  </div>
                )}
              </Card>
            </motion.div>

            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                  Recent Activity
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        Appointment completed with John Doe
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <Calendar className="w-5 h-5 text-blue-600 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        New appointment request received
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">4 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-center p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                    <AlertCircle className="w-5 h-5 text-orange-600 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        Availability updated for next week
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">1 day ago</p>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Quick Actions
                </h3>
                <div className="space-y-3">
                  <Link to="/doctor/appointments" className="block">
                    <Button variant="outline" className="w-full justify-start">
                      <Calendar className="w-4 h-4 mr-2" />
                      Manage Appointments
                    </Button>
                  </Link>
                  <Link to="/doctor/availability" className="block">
                    <Button variant="outline" className="w-full justify-start">
                      <Clock className="w-4 h-4 mr-2" />
                      Set Availability
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
            </motion.div>

            {/* Profile Summary */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
            >
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Profile Summary
                </h3>
                <div className="text-center mb-4">
                  <img
                    src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.firstName}+${user?.lastName}&background=random`}
                    alt={user?.firstName}
                    className="w-16 h-16 rounded-full object-cover mx-auto mb-3"
                  />
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    Dr. {user?.firstName} {user?.lastName}
                  </h4>
                  <p className="text-sm text-blue-600 dark:text-blue-400">
                    {doctorData?.specialization}
                  </p>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Experience:</span>
                    <span className="text-gray-900 dark:text-white">{doctorData?.experience} years</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Rating:</span>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-500 mr-1" />
                      <span className="text-gray-900 dark:text-white">{doctorData?.rating}</span>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Patients:</span>
                    <span className="text-gray-900 dark:text-white">127</span>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Performance Metrics */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
            >
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  This Month
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Appointments</span>
                    <div className="flex items-center">
                      <span className="text-gray-900 dark:text-white font-medium mr-2">45</span>
                      <TrendingUp className="w-4 h-4 text-green-500" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">New Patients</span>
                    <div className="flex items-center">
                      <span className="text-gray-900 dark:text-white font-medium mr-2">12</span>
                      <TrendingUp className="w-4 h-4 text-green-500" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Revenue</span>
                    <div className="flex items-center">
                      <span className="text-gray-900 dark:text-white font-medium mr-2">$12,450</span>
                      <TrendingUp className="w-4 h-4 text-green-500" />
                    </div>
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

export default DoctorDashboard;