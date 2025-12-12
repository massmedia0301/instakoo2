import React, { useState, useEffect } from 'react';

interface HeaderProps {
  onLogin: () => void;
  onSignup: () => void;
  onRecharge: () => void;
  onOpenServiceGuide: () => void; // Added prop
}

const Header: React.FC<HeaderProps> = ({ onLogin, onSignup, onRecharge, onOpenServiceGuide }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToOrder = () => {
    const orderSection = document.getElementById('order');
    if (orderSection) {
      // Offset for fixed header
      const headerOffset = 80;
      const elementPosition = orderSection.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
  
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  const navItems = [
    { 
      name: '주문하기', 
      href: '#order', 
      action: scrollToOrder 
    },
    { 
      name: '서비스 안내', 
      href: '#', 
      action: onOpenServiceGuide 
    },
    { 
      name: '충전하기', 
      href: '#', 
      action: onRecharge 
    },
    { 
      name: '고객센터', 
      href: 'https://open.kakao.com/o/sample', // Direct link to Kakao or similar
      action: null,
      external: true
    },
  ];

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/90 backdrop-blur-md shadow-sm py-3' : 'bg-transparent py-4'
      }`}
    >
      <div className="max-w-5xl mx-auto px-4 md:px-8 flex justify-between items-center">
        {/* Logo Area */}
        <a href="#" onClick={(e) => { e.preventDefault(); window.scrollTo({top:0, behavior:'smooth'}); }} className="flex items-center gap-2 group">
          <div className="relative w-9 h-9 bg-primary rounded-xl flex items-center justify-center transform group-hover:rotate-12 transition-transform">
             <span className="text-white font-bold text-lg italic">in</span>
          </div>
          <span className="text-xl font-bold text-primary tracking-tight">instakoo</span>
        </a>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <a 
              key={item.name} 
              href={item.href} 
              target={item.external ? "_blank" : "_self"}
              onClick={(e) => {
                if (item.action) {
                  e.preventDefault();
                  item.action();
                }
              }}
              className="text-gray-600 hover:text-primary font-medium transition-colors text-sm"
            >
              {item.name}
            </a>
          ))}
          <div className="flex items-center gap-2 ml-2">
            <button 
              onClick={onLogin}
              className="text-primary font-medium hover:text-primaryLight transition-colors text-sm"
            >
              로그인
            </button>
            <button 
              onClick={onSignup}
              className="bg-primary hover:bg-primaryLight text-white px-4 py-1.5 rounded-full font-bold shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 text-sm"
            >
              회원가입
            </button>
          </div>
        </nav>

        {/* Mobile Hamburger */}
        <button 
          className="md:hidden text-gray-700 text-xl"
          onClick={() => setIsMobileMenuOpen(true)}
        >
          <i className="fa-solid fa-bars"></i>
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}></div>
          <div className="relative w-[80%] max-w-sm bg-white h-full shadow-2xl p-6 flex flex-col">
            <div className="flex justify-between items-center mb-8">
              <span className="text-2xl font-bold text-primary">instakoo</span>
              <button onClick={() => setIsMobileMenuOpen(false)} className="text-gray-500 text-2xl">
                <i className="fa-solid fa-times"></i>
              </button>
            </div>
            
            <nav className="flex flex-col gap-6">
              {navItems.map((item) => (
                <a 
                  key={item.name} 
                  href={item.href} 
                  target={item.external ? "_blank" : "_self"}
                  className="text-lg font-medium text-gray-800 border-b border-gray-100 pb-2"
                  onClick={(e) => {
                    if (!item.external) {
                      setIsMobileMenuOpen(false);
                      if (item.action) {
                        e.preventDefault();
                        item.action();
                      }
                    }
                  }}
                >
                  {item.name}
                </a>
              ))}
            </nav>

            <div className="mt-auto flex flex-col gap-3">
              <button 
                onClick={() => { setIsMobileMenuOpen(false); onLogin(); }}
                className="w-full py-3 rounded-xl border border-primary text-primary font-bold"
              >
                로그인
              </button>
              <button 
                onClick={() => { setIsMobileMenuOpen(false); onSignup(); }}
                className="w-full py-3 rounded-xl bg-primary text-white font-bold shadow-lg"
              >
                회원가입
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;