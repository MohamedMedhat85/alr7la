import React, { useState, useEffect } from 'react';
import {
  MapPin,
  Sparkles,
  UtensilsCrossed,
  ArrowRight,
  Brain,
  Zap,
  Stars,
  Compass,
  Target,
  ChefHat,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import authService from '../../services/authService';
import LoginModal from '../Auth/SignIn/LoginModal';
import localStorageService from '../../services/localStorageService';

const features = [
  {
    title: 'AI Route Optimization',
    description:
      'Revolutionary algorithms that learn from millions of travelers to craft your perfect journey, optimizing for time, cost, and unforgettable experiences.',
    icon: MapPin,
    gradient: 'from-blue-500 via-purple-500 to-indigo-600',
    accentColor: 'blue',
  },
  {
    title: 'Dynamic Personalization',
    description:
      'Shape your adventure in real-time with our intelligent system that adapts to your preferences, mood, and spontaneous discoveries.',
    icon: Sparkles,
    gradient: 'from-purple-500 via-pink-500 to-rose-500',
    accentColor: 'purple',
  },
  {
    title: 'Culinary Intelligence',
    description:
      'Discover authentic local flavors and hidden culinary gems with our AI-powered taste recommendation system.',
    icon: UtensilsCrossed,
    gradient: 'from-orange-500 via-red-500 to-pink-500',
    accentColor: 'orange',
  },
];

const floatingIcons = [
  { Icon: Brain, delay: 0 },
  { Icon: Zap, delay: 1000 },
  { Icon: Stars, delay: 2000 },
  { Icon: Compass, delay: 1500 },
  { Icon: Target, delay: 500 },
  { Icon: ChefHat, delay: 2500 },
];

export default function ResponsiveAiSection() {
  const [hoveredCard, setHoveredCard] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorageService.getItem('token'));
  const navigate = useNavigate();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Check authentication status on component mount and when localStorage changes
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorageService.getItem('token');
      const currentAuth = !!token;
      if (currentAuth !== isAuthenticated) {
        setIsAuthenticated(currentAuth);
      }
    };

    checkAuth();
    
    // Listen for custom auth change events
    const handleAuthChange = () => {
      checkAuth();
    };
    
    window.addEventListener('authStateChanged', handleAuthChange);
    window.addEventListener('storage', checkAuth);
    
    return () => {
      window.removeEventListener('authStateChanged', handleAuthChange);
      window.removeEventListener('storage', checkAuth);
    };
  }, [isAuthenticated]);

  const handleExperienceAIClick = () => {
    if (isAuthenticated) {
      // User is logged in, navigate to trip planner
      navigate('/trip-planner');
    } else {
      // User is not logged in, show login modal
      setShowLoginModal(true);
    }
  };

  const handleLoginSuccess = () => {
    // Update authentication state immediately
    setIsAuthenticated(true);
    // After successful login, navigate to trip planner
    navigate('/trip-planner');
  };

  return (
    <div className="relative bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50 overflow-hidden w-full flex flex-col justify-center py-6 sm:py-8 md:py-12">
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 pointer-events-none select-none">
        <div className="absolute top-1/4 left-0 w-20 h-20 sm:w-28 sm:h-28 md:w-40 md:h-40 bg-blue-400 opacity-25 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-16 h-16 sm:w-24 sm:h-24 md:w-32 md:h-32 bg-purple-400 opacity-20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1000ms' }}></div>
        <div className="absolute top-1/2 left-1/3 w-12 h-12 sm:w-18 sm:h-18 md:w-24 md:h-24 bg-indigo-400 opacity-15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2000ms' }}></div>
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div
            className="absolute top-1/5 left-1/4 w-6 h-6 sm:w-8 sm:h-8 border-2 border-purple-400 rotate-45"
            style={{ animation: 'spin 20s linear infinite' }}
          ></div>
          <div className="absolute bottom-1/4 right-1/3 w-5 h-5 sm:w-7 sm:h-7 border-2 border-blue-400 rotate-12 animate-pulse"></div>
        </div>
      </div>

      {/* Floating Icons */}
      {floatingIcons.map(({ Icon, delay }, index) => (
        <div
          key={index}
          className="absolute animate-bounce opacity-15 hidden sm:block"
          style={{
            top: `calc(${10 + index * 8}%)`,
            right: `calc(${8 + index * 5}%)`,
            animationDelay: `${delay}ms`,
          }}
        >
          <Icon size={18} className="text-indigo-600" />
        </div>
      ))}

      {/* MAIN CONTAINER */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-2 sm:py-4 flex flex-col items-center">
        {/* HEADER SECTION */}
        <div
          className={`w-full text-center mb-4 sm:mb-6 transition-all duration-1000 ${
            isVisible
              ? 'translate-y-0 opacity-100'
              : 'translate-y-10 opacity-0'
          }`}
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-500 bg-opacity-10 backdrop-blur-sm rounded-full px-3 sm:px-4 py-1.5 sm:py-2 mb-3 sm:mb-4 border border-indigo-200 border-opacity-50">
            <Brain size={14} className="text-indigo-600" />
            <span className="text-indigo-700 font-semibold text-xs sm:text-sm">
              Powered by Advanced AI
            </span>
            <Zap size={10} className="text-yellow-500 animate-pulse" />
          </div>

          {/* Main Heading (one line) */}
          <h1
            className="
              font-black mb-4 sm:mb-5 leading-tight
              text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl
              whitespace-nowrap truncate
            "
          >
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-800 via-indigo-600 to-purple-600">
              The Future of
            </span>{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-500 to-indigo-600 animate-pulse">
              Travel Planning
            </span>
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed mb-6 sm:mb-8">
            Experience the next generation of AI-powered travel planning.
            <span className="font-semibold text-indigo-600"> Revolutionary algorithms</span> meet
            <span className="font-semibold text-purple-600"> personalized intelligence</span> to create your perfect journey.
          </p>
        </div>

        {/* FEATURES GRID */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6 mb-4 sm:mb-6">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div
                key={index}
                className={`group w-full transition-all duration-700 ${
                  isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
                }`}
                style={{ transitionDelay: `${index * 150}ms` }}
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                {/* Card Background */}
                <div className="relative bg-white bg-opacity-90 backdrop-blur-lg rounded-lg sm:rounded-xl px-4 sm:px-5 py-4 sm:py-5 min-h-[240px] sm:min-h-[260px] border border-white border-opacity-30 shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-105 flex flex-col group-hover:border-indigo-200 group-hover:border-opacity-50">
                  {/* Gradient Overlay */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-8 rounded-lg sm:rounded-xl transition-opacity duration-500`}
                  ></div>

                  {/* Floating Badge */}
                  <div className="absolute -top-2 -right-2 bg-white rounded-full p-2 shadow-md border border-indigo-100 group-hover:scale-110 transition-transform duration-300">
                    <IconComponent size={16} className={`text-${feature.accentColor}-500`} />
                  </div>

                  <div className="relative z-10 text-center flex flex-col flex-1">
                    {/* Icon Section */}
                    <div
                      className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${feature.gradient} mb-3 group-hover:scale-105 group-hover:rotate-2 transition-all duration-300 mx-auto`}
                    >
                      <IconComponent size={24} className="text-white" />
                    </div>

                    <div className="flex-1 flex flex-col justify-between">
                      <h3 className="text-lg font-bold text-slate-800 mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-indigo-600 group-hover:to-purple-600 transition-all duration-300">
                        {feature.title}
                      </h3>
                      <p className="text-slate-600 text-sm leading-relaxed mb-4 group-hover:text-slate-700 transition-colors duration-300 whitespace-normal">
                        {feature.description}
                      </p>
                    </div>
                  </div>

                  {/* Hover Effects */}
                  {hoveredCard === index && (
                    <div className="absolute inset-0 pointer-events-none">
                      <div className="absolute top-3 right-3 w-2 h-2 bg-yellow-400 rounded-full animate-ping"></div>
                      <div className="absolute bottom-3 left-3 w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA SECTION */}
        <div className={`text-center w-full transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`} style={{ transitionDelay: '400ms' }}>
          <div className="relative mx-auto w-full max-w-md">
            {/* Glowing Background */}
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl blur opacity-60 group-hover:opacity-80 transition-opacity duration-300 pointer-events-none"></div>
            <button
              onClick={handleExperienceAIClick}
              className="relative group w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold px-6 py-3 sm:px-8 sm:py-4 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-xl flex items-center justify-center gap-3 text-base sm:text-lg overflow-hidden"
            >
              <Brain size={18} className="group-hover:animate-pulse" />
              <span>Experience AI Magic</span>
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform duration-300" />
              {/* Shine Effect */}
              <div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white via-white to-transparent opacity-0 group-hover:opacity-20 transition-opacity duration-300 pointer-events-none"
                style={{ transform: 'skewX(-12deg)', animation: 'shine 1.5s ease-in-out' }}
              ></div>
            </button>
            {/* Floating dots */}
            <div className="absolute -top-1 -left-1 w-3 h-3 bg-yellow-400 rounded-full animate-ping"></div>
            <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '500ms' }}></div>
          </div>
        </div>
      </div>
      <style jsx>{`
        @keyframes shine {
          0% {
            transform: translateX(-100%) skewX(-12deg);
          }
          100% {
            transform: translateX(200%) skewX(-12deg);
          }
        }
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
      
      {/* Login Modal */}
      <LoginModal
        open={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLoginSuccess={handleLoginSuccess}
        onSwitchToRegister={() => setShowLoginModal(false)}
        onSwitchToOtp={() => setShowLoginModal(false)}
      />
    </div>
  );
}