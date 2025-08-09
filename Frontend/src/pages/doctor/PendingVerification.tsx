import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Mail, CheckCircle, AlertCircle, Home } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

const PendingVerification: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card className="p-8 text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Clock className="w-10 h-10 text-white" />
            </div>

            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Account Under Review
            </h1>

            <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
              Thank you for registering as a doctor, Dr. {user?.firstName} {user?.lastName}!
            </p>

            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-lg p-6 mb-8">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-6 h-6 text-amber-600 mt-0.5" />
                <div className="text-left">
                  <h3 className="font-semibold text-amber-800 dark:text-amber-300 mb-2">
                    Verification in Progress
                  </h3>
                  <p className="text-amber-700 dark:text-amber-400 text-sm leading-relaxed">
                    Your doctor account is currently being reviewed by our admin team. We verify all medical 
                    credentials, licenses, and professional information to ensure the highest quality of care 
                    for our patients.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-gray-900 dark:text-white">Application Submitted</span>
                </div>
                <span className="text-green-600 dark:text-green-400 text-sm font-medium">Completed</span>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center">
                    <Clock className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-gray-900 dark:text-white">Document Verification</span>
                </div>
                <span className="text-amber-600 dark:text-amber-400 text-sm font-medium">In Progress</span>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg opacity-50">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-gray-900 dark:text-white">Account Activation</span>
                </div>
                <span className="text-gray-500 dark:text-gray-400 text-sm font-medium">Pending</span>
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-6 mb-8">
              <div className="flex items-start space-x-3">
                <Mail className="w-6 h-6 text-blue-600 mt-0.5" />
                <div className="text-left">
                  <h3 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">
                    What Happens Next?
                  </h3>
                  <ul className="text-blue-700 dark:text-blue-400 text-sm space-y-1">
                    <li>• Our team will verify your medical license and credentials</li>
                    <li>• We'll review your professional background and qualifications</li>
                    <li>• You'll receive an email notification once approved (24-48 hours)</li>
                    <li>• After approval, you can access your doctor dashboard and start accepting patients</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/">
                <Button variant="outline" className="w-full sm:w-auto">
                  <Home className="w-4 h-4 mr-2" />
                  Return to Home
                </Button>
              </Link>
              <Button className="w-full sm:w-auto">
                <Mail className="w-4 h-4 mr-2" />
                Contact Support
              </Button>
            </div>

            <p className="text-sm text-gray-500 dark:text-gray-400 mt-6">
              Need help? Contact our support team at{' '}
              <a href="mailto:support@healthcare.com" className="text-blue-600 hover:text-blue-500">
                support@healthcare.com
              </a>
            </p>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default PendingVerification;