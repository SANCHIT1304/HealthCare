import React from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Activity, 
  Users, 
  Clock,
  TrendingUp,
  Heart,
  Plus,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { mockAppointments, mockHealthRecords, mockDoctors } from '../../data/mockData';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const PatientDashboard: React.FC = () => {
  const { user } = useAuth();

  // Mock data for health metrics
  const healthData = mockHealthRecords
    .filter(record => record.type === 'weight')
    .slice(-7)
    .map(record => ({
      date: new Date(record.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      weight: record.value
    }));

  const upcomingAppointments = mockAppointments.filter(apt => 
    apt.patientId === user?.id && apt.status !== 'cancelled'
  );

  const stats = [
    {
      title: 'Upcoming Appointments',
      value: upcomingAppointments.length.toString(),
      icon: Calendar,
      color: 'bg-blue-500',
      change: '+2 this month'
    },
    {
      title: 'Health Records',
      value: mockHealthRecords.filter(r => r.patientId === user?.id).length.toString(),
      icon: Activity,
      color: 'bg-green-500',
      change: '+5 recent entries'
    },
    {
      title: 'Doctors Consulted',
      value: '3',
      icon: Users,
      color: 'bg-purple-500',
      change: '2 specialists'
    },
    {
      title: 'Avg. Response Time',
      value: '2h',
      icon: Clock,
      color: 'bg-orange-500',
      change: '15min faster'
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
            Welcome back, {user?.firstName}!
          </motion.h1>
          <p className="text-gray-600 dark:text-gray-400">
            Here's your health overview for today
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
            {/* Upcoming Appointments */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Upcoming Appointments
                  </h2>
                  <Link to="/patient/appointments">
                    <Button variant="outline" size="sm">
                      View All
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  </Link>
                </div>

                {upcomingAppointments.length > 0 ? (
                  <div className="space-y-4">
                    {upcomingAppointments.slice(0, 3).map((appointment, index) => {
                      const doctor = mockDoctors.find(d => d.id === appointment.doctorId);
                      return (
                        <div
                          key={appointment.id}
                          className="flex items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                        >
                          <img
                            src={doctor?.avatar || `https://ui-avatars.com/api/?name=${doctor?.firstName}+${doctor?.lastName}&background=random`}
                            alt={doctor?.firstName}
                            className="w-12 h-12 rounded-full object-cover mr-4"
                          />
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-900 dark:text-white">
                              {doctor?.firstName} {doctor?.lastName}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {doctor?.specialization}
                            </p>
                            <p className="text-sm text-blue-600 dark:text-blue-400">
                              {new Date(appointment.date).toLocaleDateString()} at {appointment.time}
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
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      No upcoming appointments
                    </p>
                    <Link to="/patient/doctors">
                      <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        Book Appointment
                      </Button>
                    </Link>
                  </div>
                )}
              </Card>
            </motion.div>

            {/* Health Trends */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Health Trends
                  </h2>
                  <Link to="/patient/health">
                    <Button variant="outline" size="sm">
                      View Details
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  </Link>
                </div>

                {healthData.length > 0 ? (
                  <div>
                    <div className="h-64 mb-4">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={healthData}>
                          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                          <XAxis dataKey="date" className="text-sm" />
                          <YAxis className="text-sm" />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: 'rgba(255, 255, 255, 0.95)',
                              border: 'none',
                              borderRadius: '8px',
                              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                            }}
                          />
                          <Line
                            type="monotone"
                            dataKey="weight"
                            stroke="#3B82F6"
                            strokeWidth={3}
                            dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                            activeDot={{ r: 6, stroke: '#3B82F6', strokeWidth: 2 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <TrendingUp className="w-4 h-4 mr-1 text-green-500" />
                      Weight tracking over the last 7 days
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      No health data recorded yet
                    </p>
                    <Link to="/patient/health">
                      <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Health Record
                      </Button>
                    </Link>
                  </div>
                )}
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
                  <Link to="/patient/doctors" className="block">
                    <Button variant="outline" className="w-full justify-start">
                      <Calendar className="w-4 h-4 mr-2" />
                      Book Appointment
                    </Button>
                  </Link>
                  <Link to="/patient/health" className="block">
                    <Button variant="outline" className="w-full justify-start">
                      <Activity className="w-4 h-4 mr-2" />
                      Log Health Data
                    </Button>
                  </Link>
                  <Link to="/patient/appointments" className="block">
                    <Button variant="outline" className="w-full justify-start">
                      <Clock className="w-4 h-4 mr-2" />
                      View History
                    </Button>
                  </Link>
                </div>
              </Card>
            </motion.div>

            {/* Health Tips */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
            >
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Health Tip of the Day
                </h3>
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-teal-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Heart className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                      Stay Hydrated
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Drink at least 8 glasses of water daily to maintain optimal health and boost your energy levels.
                    </p>
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

export default PatientDashboard;