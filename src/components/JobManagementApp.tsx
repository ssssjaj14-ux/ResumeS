import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import PublicCareerPage from './PublicCareerPage';
import AdminPortal from './AdminPortal';
import AdminLogin from './AdminLogin';
import { JobStorageService } from '../services/jobStorageService';
import { Toaster } from 'react-hot-toast';

const JobManagementApp: React.FC = () => {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  useEffect(() => {
    // Check if admin is already logged in
    setIsAdminLoggedIn(JobStorageService.isAdminLoggedIn());
    
    // Initialize sample data if needed
    JobStorageService.initializeSampleData();
  }, []);

  const handleAdminLogin = () => {
    JobStorageService.setAdminSession();
    setIsAdminLoggedIn(true);
  };

  const handleAdminLogout = () => {
    JobStorageService.clearAdminSession();
    setIsAdminLoggedIn(false);
  };

  return (
    <Router>
      <div className="min-h-screen">
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#1F2937',
              color: '#F9FAFB',
              borderRadius: '12px',
              border: '1px solid #374151'
            }
          }}
        />
        
        <Routes>
          {/* Public Career Page */}
          <Route path="/" element={<PublicCareerPage />} />
          <Route path="/careers" element={<PublicCareerPage />} />
          
          {/* Admin Routes */}
          <Route 
            path="/admin" 
            element={
              isAdminLoggedIn ? (
                <AdminPortal onLogout={handleAdminLogout} />
              ) : (
                <AdminLogin onLogin={handleAdminLogin} />
              )
            } 
          />
          
          {/* Redirect any unknown routes to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
};

export default JobManagementApp;