import React from 'react';
import { User, UserRole } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface LayoutProps {
  children: React.ReactNode;
  user: User | null;
  onLogout: () => void;
  title?: string;
  onQuickLogin?: (role: UserRole) => void;
  onNavigate?: (view: 'landing' | 'dashboard') => void;
  currentView?: 'landing' | 'dashboard';
}

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  user, 
  onLogout, 
  title, 
  onQuickLogin, 
  onNavigate, 
  currentView = 'landing' 
}) => {
  const { t, language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
      setLanguage(language === 'en' ? 'mr' : 'en');
  };

  const handleQuickLinkClick = (e: React.MouseEvent, role: UserRole) => {
    e.preventDefault();
    if (onQuickLogin) {
      onQuickLogin(role);
      const loginPortal = document.getElementById('login-portal');
      if (loginPortal) {
        loginPortal.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50/90 backdrop-blur-sm transition-all duration-500">
      {/* Header */}
      <header className="bg-green-800/95 text-white shadow-lg sticky top-0 z-50 backdrop-blur-md border-b border-green-700">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8 h-full">
            <div 
              className="flex items-center gap-2 cursor-pointer" 
              onClick={() => onNavigate?.('landing')}
            >
              <div className="bg-white/10 p-1.5 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-green-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
              </div>
              <span className="font-bold text-xl tracking-tight text-white drop-shadow-sm">{t.appTitle}</span>
            </div>

            {/* Navigation Tabs */}
            <nav className="hidden md:flex items-center h-full gap-1">
              <button
                onClick={() => onNavigate?.('landing')}
                className={`px-4 h-full flex items-center gap-2 border-b-2 transition-all font-medium ${
                  currentView === 'landing' 
                    ? 'border-white bg-white/10 text-white' 
                    : 'border-transparent text-green-100 hover:text-white hover:bg-white/5'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                {t.home}
              </button>
              
              {user && (
                <button
                  onClick={() => onNavigate?.('dashboard')}
                  className={`px-4 h-full flex items-center gap-2 border-b-2 transition-all font-medium ${
                    currentView === 'dashboard' 
                      ? 'border-white bg-white/10 text-white' 
                      : 'border-transparent text-green-100 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  {t.dashboard}
                </button>
              )}
            </nav>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
                onClick={toggleLanguage}
                className="bg-white/10 hover:bg-white/20 text-white text-sm px-3 py-1 rounded transition-colors font-medium border border-white/20 shadow-sm"
            >
                {language === 'en' ? 'मराठी' : 'English'}
            </button>

            {user && (
              <div className="hidden md:flex flex-col text-right">
                <span className="text-sm font-semibold text-white">{user.name}</span>
                <span className="text-xs text-green-200 capitalize">{user.role.toLowerCase()}</span>
              </div>
            )}
            {user ? (
               <button 
               onClick={onLogout}
               className="bg-orange-600 hover:bg-orange-700 text-white text-sm px-4 py-2 rounded-lg transition-colors shadow-md font-medium"
             >
               {t.logout}
             </button>
            ) : null}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-8">
        {title && currentView === 'dashboard' && (
            <div className="mb-6 bg-white/80 p-4 rounded-xl shadow-sm border border-white inline-block backdrop-blur-sm">
                <h1 className="text-2xl font-bold text-green-900">{title}</h1>
            </div>
        )}
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-10 border-t border-gray-800">
        <div className="container mx-auto px-4">
          {!user && (
            <div className="grid md:grid-cols-2 gap-8 mb-8 pb-8 border-b border-gray-800">
                <div>
                    <h3 className="text-lg font-bold text-white mb-4">{t.appTitle}</h3>
                    <p className="text-sm text-gray-500 max-w-xs">{t.landingSubtitle}</p>
                </div>
                <div>
                    <h3 className="text-sm font-bold text-gray-300 uppercase tracking-wider mb-4">{t.quickLinks}</h3>
                    <div className="flex flex-col space-y-3">
                        <a 
                            href="#" 
                            onClick={(e) => handleQuickLinkClick(e, UserRole.CUSTOMER)}
                            className="text-gray-400 hover:text-white transition-colors"
                        >
                            {t.farmerLogin}
                        </a>
                        <a 
                            href="#" 
                            onClick={(e) => handleQuickLinkClick(e, UserRole.DEALER)}
                            className="text-gray-400 hover:text-white transition-colors"
                        >
                            {t.dealerLogin}
                        </a>
                        <a 
                            href="#" 
                            onClick={(e) => handleQuickLinkClick(e, UserRole.ADMIN)}
                            className="text-gray-400 hover:text-white transition-colors"
                        >
                            {t.adminLogin}
                        </a>
                    </div>
                </div>
            </div>
          )}
          <div className="text-center">
             <p>&copy; {new Date().getFullYear()} {t.footerText}</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;