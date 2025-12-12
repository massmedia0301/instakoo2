import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import HeroBanner from './components/HeroBanner';
import StatsSection from './components/StatsSection';
import OrderForm from './components/OrderForm';
import GuideSection from './components/GuideSection';
import Reviews from './components/Reviews';
import Footer from './components/Footer';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import RechargePage from './components/RechargePage';
import AdminPage from './components/AdminPage';
import ServiceDetailModal from './components/ServiceDetailModal';
import NoticePopup from './components/NoticePopup'; // Imported
import { Platform } from './types';

type ViewState = 'home' | 'login' | 'signup' | 'recharge' | 'admin';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>('home');
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [isNoticePopupOpen, setIsNoticePopupOpen] = useState(false); // State for Notice Popup
  const [targetPlatform, setTargetPlatform] = useState<Platform | null>(null);

  // Initial Logic: Traffic Log & Notice Popup Check
  useEffect(() => {
    // 1. Traffic Log
    try {
      const trafficLogs = JSON.parse(localStorage.getItem('site_traffic') || '[]');
      trafficLogs.push({
        timestamp: new Date().toISOString(),
        path: window.location.pathname
      });
      if (trafficLogs.length > 1000) {
        trafficLogs.shift();
      }
      localStorage.setItem('site_traffic', JSON.stringify(trafficLogs));
    } catch (e) {
      console.error("Traffic logging failed", e);
    }

    // 2. Check Notice Popup "Don't show today"
    try {
        const hideUntil = localStorage.getItem('notice_hide_until');
        const now = new Date();
        
        // Show if no timestamp exists OR current time is past the hidden time
        if (!hideUntil || now > new Date(hideUntil)) {
            // Small delay for better UX (so it doesn't flash instantly on load)
            setTimeout(() => {
                setIsNoticePopupOpen(true);
            }, 500);
        }
    } catch (e) {
        console.error("Notice check failed", e);
    }
  }, []);

  const handleDontShowNoticeToday = () => {
    const tomorrow = new Date();
    tomorrow.setHours(tomorrow.getHours() + 24);
    localStorage.setItem('notice_hide_until', tomorrow.toISOString());
    setIsNoticePopupOpen(false);
  };

  const navigateToHome = () => {
    setCurrentView('home');
    window.scrollTo(0, 0);
  };

  const navigateToLogin = () => {
    setCurrentView('login');
    window.scrollTo(0, 0);
  };

  const navigateToSignup = () => {
    setCurrentView('signup');
    window.scrollTo(0, 0);
  };

  const navigateToRecharge = () => {
    setCurrentView('recharge');
    window.scrollTo(0, 0);
  };
  
  const navigateToAdmin = () => {
    setCurrentView('admin');
    window.scrollTo(0, 0);
  };

  // Logic to handle navigation from Hero Banner to Order Form with tab selection
  const handleHeroOrderNavigate = (platform: Platform) => {
    if (currentView !== 'home') {
      setCurrentView('home');
    }
    setTargetPlatform(platform); // Pass this to OrderForm

    // Scroll after a brief delay to ensure rendering
    setTimeout(() => {
        const orderSection = document.getElementById('order');
        if (orderSection) {
            const headerOffset = 80;
            const elementPosition = orderSection.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth"
            });
        }
    }, 100);
  };

  if (currentView === 'admin') {
    return <AdminPage onLogout={navigateToHome} />;
  }

  if (currentView === 'login') {
    return <LoginPage onBack={navigateToHome} onSignup={navigateToSignup} onAdminLogin={navigateToAdmin} />;
  }

  if (currentView === 'signup') {
    return <SignupPage onBack={navigateToHome} onLogin={navigateToLogin} />;
  }

  if (currentView === 'recharge') {
    return <RechargePage onBack={navigateToHome} />;
  }

  return (
    <div className="min-h-screen flex flex-col font-sans text-dark relative">
      <Header 
        onLogin={navigateToLogin} 
        onSignup={navigateToSignup} 
        onRecharge={navigateToRecharge}
        onOpenServiceGuide={() => setIsServiceModalOpen(true)}
      />
      <main className="flex-grow">
        <HeroBanner 
            onRecharge={navigateToRecharge}
            onNavigateToOrder={handleHeroOrderNavigate}
        />
        
        {/* Order Form moved up */}
        <div className="relative z-10 -mt-6"> 
            <OrderForm targetPlatform={targetPlatform} />
        </div>

        {/* Stats Section moved down */}
        <StatsSection />
        
        <GuideSection />
        <Reviews />
      </main>
      <Footer />

      {/* Startup Notice Popup */}
      {isNoticePopupOpen && (
        <NoticePopup 
            onClose={() => setIsNoticePopupOpen(false)} 
            onDontShowToday={handleDontShowNoticeToday}
        />
      )}

      {/* Service Detail Modal (Triggered by Header) */}
      {isServiceModalOpen && (
        <ServiceDetailModal onClose={() => setIsServiceModalOpen(false)} />
      )}

      {/* Floating KakaoTalk Button */}
      <a 
        href="https://open.kakao.com/o/sample" // Replace with actual open chat link
        target="_blank" 
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-[#FEE500] rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform cursor-pointer"
        title="카카오톡 상담하기"
      >
        <i className="fa-solid fa-comment text-[#3c1e1e] text-2xl"></i>
      </a>
    </div>
  );
};

export default App;