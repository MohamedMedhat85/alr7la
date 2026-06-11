import React, { useState, useEffect } from 'react';
import { Globe, Share2, UserPlus, Users, ArrowRight, Sparkles, Heart, MessageCircle, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import authService from '../../services/authService';
import LoginModal from '../Auth/SignIn/LoginModal';
import localStorageService from '../../services/localStorageService';

const data = [
    {
        title: 'Global Platform',
        description: 'Connect with explorers worldwide on our cutting-edge social platform designed for the adventurous spirit.',
        icon: Globe,
        gradient: 'from-purple-400 to-pink-400'
    },
    {
        title: 'Share Adventures',
        description: 'Transform your journeys into captivating stories with rich media, interactive maps, and inspiring narratives.',
        icon: Share2,
        gradient: 'from-blue-400 to-cyan-400'
    },
    {
        title: 'Build Network',
        description: 'Forge meaningful connections with fellow travelers and discover your tribe of adventure enthusiasts.',
        icon: UserPlus,
        gradient: 'from-green-400 to-emerald-400'
    },
    {
        title: 'Group Journeys',
        description: 'Create exclusive travel circles, plan epic adventures together, and make memories that last forever.',
        icon: Users,
        gradient: 'from-orange-400 to-red-400'
    }
];

const floatingElements = [
    { icon: Heart, delay: 0, duration: 3000 },
    { icon: MessageCircle, delay: 1000, duration: 3500 },
    { icon: Zap, delay: 2000, duration: 3000 },
    { icon: Sparkles, delay: 1500, duration: 4000 }
];

export default function AmazingSocialSection() {
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

    const handleStartJourneyClick = () => {
        if (isAuthenticated) {
            // User is logged in, navigate to feed
            navigate('/feed');
        } else {
            // User is not logged in, show login modal
            setShowLoginModal(true);
        }
    };

    const handleLoginSuccess = () => {
        // Update authentication state immediately
        setIsAuthenticated(true);
        // After successful login, navigate to feed
        navigate('/feed');
    };

    return (
        <div className="relative bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden text-[.97rem]">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 pointer-events-none select-none">
                <div className="absolute top-1/3 left-0 w-40 h-40 lg:w-72 lg:h-72 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-0 right-0 w-20 h-20 lg:w-40 lg:h-40 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
                <div className="absolute top-2/3 left-1/3 w-16 h-16 lg:w-32 lg:h-32 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
            </div>

            {/* Floating Icons (hide excess on xs screens) */}
            {floatingElements.map((element, index) => {
                const IconComponent = element.icon;
                return (
                    <div
                        key={index}
                        className={`absolute animate-bounce opacity-20 md:block ${index > 1 ? 'hidden sm:block' : ''}`}
                        style={{
                            top: `${20 + (index * 15)}%`,
                            right: `${10 + (index * 8)}%`,
                            animationDelay: `${element.delay}ms`,
                            animationDuration: `${element.duration}ms`,
                        }}
                    >
                        <IconComponent size={22} className="text-white" />
                    </div>
                );
            })}

            {/* MAIN CONTAINER */}
            <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 py-8 lg:py-12">
                <div className="flex flex-col lg:flex-row gap-8 md:gap-12 items-start">
                    {/* TOP LEFT - HEADING */}
                    <div className={`lg:w-1/3 space-y-6 transition-all duration-1000 ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-12 opacity-0'}`}>
                        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-3 py-1.5 text-xs sm:text-sm text-white/80">
                            <Sparkles size={16} className="text-yellow-400" />
                            Next Generation Social Platform
                        </div>
                        <h1 className="text-3xl xs:text-4xl md:text-5xl lg:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-200 to-pink-200 leading-tight">
                            Connect.<br />
                            Share.<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                                Explore.
                            </span>
                        </h1>
                        <p className="text-lg xs:text-xl text-white/70 leading-relaxed max-w-xl">
                            Join the most innovative social platform designed for modern explorers. 
                            Where every journey becomes an unforgettable story.
                        </p>
                        {/* CTA Button */}
                        <div className="pt-4">
                            <button 
                                onClick={handleStartJourneyClick}
                                className="group relative inline-flex items-center gap-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-4 px-8 xs:py-5 xs:px-10 rounded-2xl transition-all duration-300 hover:scale-[1.035] hover:shadow-2xl hover:shadow-purple-500/25 text-lg xs:text-xl"
                            >
                                <span className="">Start Your Journey</span>
                                <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform duration-300" />
                                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity duration-300"></div>
                            </button>
                        </div>
                    </div>
                    
                    {/* RIGHT - FEATURE CARDS */}
                    <div className={`lg:w-2/3 transition-all duration-1000 delay-300 ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-12 opacity-0'}`}>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {data.map((item, index) => {
                                const IconComponent = item.icon;
                                return (
                                    <div
                                        key={index}
                                        className={`group relative p-6 rounded-3xl bg-white/5 backdrop-blur-sm border border-white/10 cursor-pointer transition-all duration-500 hover:scale-[1.04] hover:bg-white/10 ${
                                            hoveredCard === index ? 'ring-2 ring-purple-400/50' : ''
                                        }`}
                                        onMouseEnter={() => setHoveredCard(index)}
                                        onMouseLeave={() => setHoveredCard(null)}
                                    >
                                        <div className={`absolute inset-0 bg-gradient-to-r ${item.gradient} opacity-0 group-hover:opacity-15 rounded-3xl transition-opacity duration-500`}></div>
                                        <div className="relative z-10 text-center">
                                            <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-r ${item.gradient} mb-4 group-hover:scale-110 transition-transform duration-300 mx-auto`}>
                                                <IconComponent size={28} className="text-white" />
                                            </div>
                                            <h3 className="text-xl font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-200 group-hover:to-pink-200 transition-all duration-300">
                                                {item.title}
                                            </h3>
                                            <p className="text-white/65 text-base leading-relaxed group-hover:text-white/85 transition-colors duration-300">
                                                {item.description}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
            {/* Responsive Animations */}
            <style jsx>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-10px); }
                }
                @keyframes spin-slow {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                .animate-float { animation: float 3s ease-in-out infinite; }
                .animate-spin-slow { animation: spin-slow 18s linear infinite; }
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