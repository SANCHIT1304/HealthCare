import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  UserCheck, 
  UserX, 
  Calendar,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  BarChart3,
  Activity,
  DollarSign
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { mockUsers, mockDoctors, mockAppointments } from '../../data/mockData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();

  // Mock data for charts
  const monthlyData = [
    { month: 'Jan', appointments: 45, revenue: 6750 },
    { month: 'Feb', appointments: 52, revenue: 7800 },
    { month: 'Mar', appointments: 48, revenue: 7200 },
    { month: 'Apr', appointments: 61, revenue: 9150 },
    { month: 'May', appointments: 55, revenue: 8250 },
    { month: 'Jun', appointments: 67, revenue: 10050 }
  ];

  const userGrowthData = [
    { month: 'Jan', patients: 120, doctors: 8 },
    { month: 'Feb', patients: 135, doctors: 9 },
    { month: 'Mar', patients: 148, doctors: 11 },
    { month: 'Apr', patients: 162, doctors: 12 },
    { month: 'May', patients: 178, doctors: 14 },
    { month: 'Jun', patients: 195, doctors: 15 }
  ];

  const pendingDoctors = mockDoctors.filter(doc => !doc.isApproved);
  const totalPatients = mockUsers.filter(u => u.role === 'patient').length;
  const totalDoctors = mockDoctors.filter(doc => doc.isApproved).length;
  const totalAppointments = mockAppointments.length;
  const pendingAppointments = mockAppointments.filter(apt => apt.status === 'pending').length;

  const stats = [
    {
      title: 'Total Patients',
      value: totalPatients.toString(),
      icon: Users,
      color: 'bg-blue-500',
      change: '+12 this month'
    },
    {
      title: 'Active Doctors',
      value: totalDoctors.toString(),
      icon: UserCheck,
      color: 'bg-green-500',
      change: '+3 this month'
    },
    {
      title: 'Total Appointments',
      value: totalAppointments.toString(),
      icon: Calendar,
      color: 'bg-purple-500',
      change: '+45 this month'
    },
    {
      title: 'Monthly Revenue',
      value: '$10,050',
      icon: DollarSign,
      color: 'bg-orange-500',
      change: '+18% from last month'
    }
  ];

  const recentActivities = [
    {
      type: 'doctor_approval',
      message: 'Dr. Sarah Smith account approved',
      time: '2 hours ago',
      icon: CheckCircle,
      color: 'text-green-600'
    },
    {
      type: 'new_patient',
      message: 'New patient registration: John Doe',
      time: '4 hours ago',
      icon: Users,
      color: 'text-blue-600'
    },
    {
      type: 'appointment',
      message: '15 new appointments scheduled today',
      time: '6 hours ago',
      icon: Calendar,
      color: 'text-purple-600'
    },
    {
      type: 'doctor_pending',
      message: 'Dr. Michael Johnson pending approval',
      time: '1 day ago',
      icon: Clock,
      color: 'text-orange-600'
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
            Admin Dashboard
          </motion.h1>
          <p className="text-gray-600 dark:text-gray-400">
            Platform overview and management
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

        {/* Pending Approvals Alert */}
        {pendingDoctors.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-8"
          >
            <Card className="p-6 bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <AlertCircle className="w-6 h-6 text-amber-600" />
                  <div>
                    <h3 className="font-semibold text-amber-800 dark:text-amber-300">
                      Pending Doctor Approvals
                    </h3>
                    <p className="text-amber-700 dark:text-amber-400 text-sm">
                      {pendingDoctors.length} doctor{pendingDoctors.length !== 1 ? 's' : ''} waiting for verification
                    </p>
                  </div>
                </div>
                <Button className="bg-amber-600 hover:bg-amber-700">
                  Review Applications
                </Button>
              </div>
            </Card>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Monthly Appointments Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                  Monthly Appointments & Revenue
                </h2>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                      <XAxis dataKey="month" className="text-sm" />
                      <YAxis className="text-sm" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'rgba(255, 255, 255, 0.95)',
                          border: 'none',
                          borderRadius: '8px',
                          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                        }}
                      />
                      <Bar dataKey="appointments" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </motion.div>

            {/* User Growth Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Card className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                  User Growth Trends
                </h2>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={userGrowthData}>
                      <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                      <XAxis dataKey="month" className="text-sm" />
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
                        dataKey="patients"
                        stroke="#3B82F6"
                        strokeWidth={3}
                        dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                        name="Patients"
                      />
                      <Line
                        type="monotone"
                        dataKey="doctors"
                        stroke="#10B981"
                        strokeWidth={3}
                        dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                        name="Doctors"
                      />
                    </LineChart>
                  </ResponsiveContainer>
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
              transition={{ delay: 0.7 }}
            >
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Quick Actions
                </h3>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <UserCheck className="w-4 h-4 mr-2" />
                    Verify Doctors ({pendingDoctors.length})
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Users className="w-4 h-4 mr-2" />
                    Manage Users
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    View Reports
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Activity className="w-4 h-4 mr-2" />
                    System Health
                  </Button>
                </div>
              </Card>
            </motion.div>

            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
            >
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Recent Activity
                </h3>
                <div className="space-y-4">
                  {recentActivities.map((activity, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <activity.icon className={`w-5 h-5 mt-0.5 ${activity.color}`} />
                      <div className="flex-1">
                        <p className="text-sm text-gray-900 dark:text-white">
                          {activity.message}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {activity.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>

            {/* System Status */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.9 }}
            >
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  System Status
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Server Status</span>
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                      <span className="text-green-600 dark:text-green-400 text-sm">Online</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Database</span>
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                      <span className="text-green-600 dark:text-green-400 text-sm">Connected</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">API Status</span>
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                      <span className="text-green-600 dark:text-green-400 text-sm">Operational</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Last Backup</span>
                    <span className="text-gray-900 dark:text-white text-sm">2 hours ago</span>
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

export default AdminDashboard;