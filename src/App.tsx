import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import Features from './components/Features';
import ResumeBuilder from './components/ResumeBuilder';
import Portfolio from './components/Portfolio';
import CareerPortal from './components/CareerPortal';
import AuthModal from './components/AuthModal';
import Footer from './components/Footer';
import { ResumeData } from './utils/pdfGenerator';

function App() {
  const [user, setUser] = useState<any>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [resumeData, setResumeData] = useState<ResumeData | undefined>();

  useEffect(() => {
    // Check for saved user data
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('user');
        setUser(null);
      }
    }

    // Load resume data
    const savedResumeData = localStorage.getItem('resumeData');
    if (savedResumeData) {
      try {
        setResumeData(JSON.parse(savedResumeData));
      } catch (e) {
        localStorage.removeItem('resumeData');
        setResumeData(undefined);
      }
    }
  }, []);

  const handleLogin = (userData: any) => {
    setUser(userData);
    setShowAuthModal(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300">
        <Navigation 
          user={user} 
          onLogin={() => setShowAuthModal(true)}
          onLogout={handleLogout}
        />
        <Hero />
        <Features />
        <ResumeBuilder />
        <Portfolio />
        <CareerPortal 
          isLoggedIn={!!user}
          resumeData={resumeData}
          onLogin={() => setShowAuthModal(true)}
        />
        <Footer />
        
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onLogin={handleLogin}
        />
      </div>
    </ThemeProvider>
  );
}

export default App;