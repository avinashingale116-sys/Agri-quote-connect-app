import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import { Auth, AutofillData } from './components/Auth';
import CustomerDashboard from './pages/CustomerDashboard';
import DealerDashboard from './pages/DealerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import { User, UserRole } from './types';
import { UserService } from './services/mockBackend';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import { MOCK_USERS } from './constants';

const AppContent: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [view, setView] = useState<'landing' | 'dashboard'>('landing');
  const [authAutofill, setAuthAutofill] = useState<AutofillData | undefined>(undefined);
  const { t } = useLanguage();

  useEffect(() => {
    const currentUser = UserService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      setView('dashboard'); // Default to dashboard if already logged in
    }
  }, []);

  const handleLogin = (u: User) => {
    setUser(u);
    setView('dashboard');
  };

  const handleLogout = () => {
    UserService.logout();
    setUser(null);
    setView('landing');
  };

  const handleQuickLogin = (role: UserRole) => {
    const mockUser = MOCK_USERS.find(u => u.role === role);
    if (mockUser) {
        setAuthAutofill({
            mobile: mockUser.mobile,
            role: role,
            timestamp: Date.now()
        });
        setView('landing');
    }
  };

  const renderLandingContent = (showAuth: boolean) => (
    <div className="flex flex-col items-center justify-center min-h-[60vh] py-10">
        <div className="w-full max-w-5xl text-center mb-10 px-4">
            <div className="bg-white/90 backdrop-blur-md p-8 md:p-12 rounded-3xl shadow-2xl border border-white/50 inline-block mb-10">
                <h1 className="text-4xl md:text-6xl font-extrabold text-green-900 mb-6 tracking-tight drop-shadow-sm">
                    {t.landingTitle}
                </h1>
                <p className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed font-medium">
                    {t.landingSubtitle}
                </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                <div className="bg-white/95 backdrop-blur-sm p-6 rounded-xl shadow-lg border-b-4 border-green-600 transform transition hover:-translate-y-1">
                    <div className="text-4xl mb-3 bg-green-100 w-16 h-16 flex items-center justify-center rounded-full">🚜</div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{t.feature1Title}</h3>
                    <p className="text-gray-600">{t.feature1Desc}</p>
                </div>
                <div className="bg-white/95 backdrop-blur-sm p-6 rounded-xl shadow-lg border-b-4 border-orange-500 transform transition hover:-translate-y-1">
                    <div className="text-4xl mb-3 bg-orange-100 w-16 h-16 flex items-center justify-center rounded-full">⚡</div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{t.feature2Title}</h3>
                    <p className="text-gray-600">{t.feature2Desc}</p>
                </div>
                <div className="bg-white/95 backdrop-blur-sm p-6 rounded-xl shadow-lg border-b-4 border-blue-500 transform transition hover:-translate-y-1">
                    <div className="text-4xl mb-3 bg-blue-100 w-16 h-16 flex items-center justify-center rounded-full">🤝</div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{t.feature3Title}</h3>
                    <p className="text-gray-600">{t.feature3Desc}</p>
                </div>
            </div>
        </div>
        
        {showAuth && (
          <div className="w-full max-w-md" id="login-portal">
               <Auth onLogin={handleLogin} autofill={authAutofill} />
          </div>
        )}

        {!showAuth && user && (
          <div className="mt-8">
            <button 
              onClick={() => setView('dashboard')}
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-10 rounded-full shadow-xl transform transition hover:scale-105 active:scale-95 text-lg"
            >
              {t.dashboard} →
            </button>
          </div>
        )}
    </div>
  );

  const renderDashboard = () => {
    if (!user) return null;
    switch (user.role) {
      case UserRole.CUSTOMER:
        return <CustomerDashboard user={user} onNavigate={setView} />;
      case UserRole.DEALER:
        return <DealerDashboard user={user} onNavigate={setView} />;
      case UserRole.ADMIN:
        return <AdminDashboard onNavigate={setView} />;
      default:
        return <div>Unknown Role</div>;
    }
  };

  let dashboardTitle = '';
  if (user) {
    if (user.role === UserRole.ADMIN) dashboardTitle = t.adminPanel;
    else if (user.role === UserRole.DEALER) dashboardTitle = t.dealerPortal;
    else dashboardTitle = t.farmerDashboard;
  }

  return (
    <Layout 
        user={user} 
        onLogout={handleLogout}
        title={dashboardTitle}
        onQuickLogin={handleQuickLogin}
        onNavigate={setView}
        currentView={view}
    >
      {view === 'landing' ? renderLandingContent(!user) : renderDashboard()}
    </Layout>
  );
};

const App: React.FC = () => {
    return (
        <LanguageProvider>
            <AppContent />
        </LanguageProvider>
    );
}

export default App;