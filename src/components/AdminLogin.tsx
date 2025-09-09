import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Eye, EyeOff, Shield, AlertCircle } from 'lucide-react';

interface AdminLoginProps {
  onLogin: () => void;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ onLogin }) => {
  const [passcode, setPasscode] = useState('');
  const [showPasscode, setShowPasscode] = useState(false);
  const [error, setError] = useState('');
  const [attempts, setAttempts] = useState(0);

  const ADMIN_PASSCODE = '723899';
  const MAX_ATTEMPTS = 5;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (attempts >= MAX_ATTEMPTS) {
      setError('Too many failed attempts. Please try again later.');
      return;
    }

    if (passcode === ADMIN_PASSCODE) {
      onLogin();
      setError('');
      setAttempts(0);
    } else {
      setAttempts(prev => prev + 1);
      setError(`Invalid passcode. ${MAX_ATTEMPTS - attempts - 1} attempts remaining.`);
      setPasscode('');
      
      // Add a small delay to prevent rapid attempts
      setTimeout(() => {
        if (attempts + 1 < MAX_ATTEMPTS) {
          setError('');
        }
      }, 2000);
    }
  };

  const isBlocked = attempts >= MAX_ATTEMPTS;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-white text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className="w-16 h-16 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center"
          >
            <Shield className="w-8 h-8" />
          </motion.div>
          <h1 className="text-2xl font-bold mb-2">Admin Portal</h1>
          <p className="text-blue-100">Enter your passcode to access the job management system</p>
        </div>

        {/* Form */}
        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Admin Passcode
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={showPasscode ? 'text' : 'password'}
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  className={`w-full pl-10 pr-12 py-3 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    error ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder="Enter 6-digit passcode"
                  maxLength={6}
                  disabled={isBlocked}
                  autoComplete="off"
                />
                <button
                  type="button"
                  onClick={() => setShowPasscode(!showPasscode)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  disabled={isBlocked}
                >
                  {showPasscode ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center space-x-2 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg"
              >
                <AlertCircle className="w-5 h-5" />
                <span className="text-sm">{error}</span>
              </motion.div>
            )}

            <motion.button
              type="submit"
              disabled={!passcode || passcode.length !== 6 || isBlocked}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: isBlocked ? 1 : 1.02 }}
              whileTap={{ scale: isBlocked ? 1 : 0.98 }}
            >
              {isBlocked ? 'Access Blocked' : 'Access Admin Portal'}
            </motion.button>
          </form>

          {/* Security Notice */}
          <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
              <Shield className="w-4 h-4" />
              <span className="text-sm">
                This portal is protected by a secure passcode. Unauthorized access is prohibited.
              </span>
            </div>
          </div>

          {/* Attempts Counter */}
          <div className="mt-4 text-center">
            <div className="flex justify-center space-x-1">
              {[...Array(MAX_ATTEMPTS)].map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full ${
                    i < attempts ? 'bg-red-500' : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                />
              ))}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              {attempts}/{MAX_ATTEMPTS} attempts used
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;