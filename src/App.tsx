import React, { useState } from 'react';
import { Header } from './components/Header';
import { HomePage } from './components/HomePage';
import { DiagnosisPage } from './components/DiagnosisPage';
import { ClinicsPage } from './components/ClinicsPage';
import { ProfilePage } from './components/ProfilePage';
import { AdminPage } from './components/AdminPage';
import { useLocalStorage } from './hooks/useLocalStorage';

function App() {
  const [currentView, setCurrentView] = useState('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useLocalStorage('healthcare_user', null);

  const renderCurrentView = () => {
    switch (currentView) {
      case 'home':
        return <HomePage onViewChange={setCurrentView} />;
      case 'diagnosis':
        return <DiagnosisPage />;
      case 'clinics':
        return <ClinicsPage />;
      case 'profile':
        return <ProfilePage user={user} setUser={setUser} />;
      case 'admin':
        return <AdminPage />;
      default:
        return <HomePage onViewChange={setCurrentView} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        currentView={currentView}
        onViewChange={setCurrentView}
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
      />
      {renderCurrentView()}
    </div>
  );
}

export default App;