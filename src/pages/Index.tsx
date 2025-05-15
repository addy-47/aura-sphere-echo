
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Layout from '../components/Layout';
import { useMood } from '../contexts/MoodContext';
import { useTheme } from '../contexts/ThemeContext';
import Logo from '../components/Logo';
import { ArrowRight } from 'lucide-react';

const Index = () => {
  const { moodColor } = useMood();
  const { theme } = useTheme();
  
  return (
    <Layout minimal>
      <div className={`flex flex-col items-center justify-center min-h-[calc(100vh-64px)] text-center px-4 py-6 relative overflow-hidden 
        ${theme === 'dark' ? 'bg-black text-white' : 'bg-white text-black'}`}>
        {/* Starry background effect with CSS */}
        <div className="absolute inset-0 overflow-hidden z-0" 
          style={{
            backgroundImage: `radial-gradient(${theme === 'dark' ? '#ffffff' : '#000000'} 1px, transparent 1px)`,
            backgroundSize: '50px 50px',
            opacity: 0.15
          }}
        />
        
        <div className="max-w-4xl mx-auto flex flex-col items-center z-10">
          {/* Main Hero Text */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-light tracking-tighter mb-4 sm:mb-6">
            Your Digital
            <br />
            <span className={`gradient-text ${theme === 'dark' ? 'from-gray-100 to-gray-400' : 'from-gray-700 to-gray-900'} animate-gradient font-normal`}>
              Doppelgänger
            </span>
          </h1>
          
          <p className={`text-lg md:text-xl ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} mb-8 md:mb-10 max-w-xl`}>
            An AI-powered digital reflection that evolves with your personality
          </p>
          
          {/* Enhanced 3D Sphere representation with improved shadow */}
          <div 
            className="w-48 h-48 md:w-56 md:h-56 rounded-full mb-8 md:mb-10 relative sphere-shadow z-20 cursor-pointer transition-all duration-500 hover:scale-105"
            style={{ 
              background: theme === 'dark' 
                ? 'radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.2) 0%, rgba(0, 0, 0, 0) 70%)' 
                : 'radial-gradient(circle at 30% 30%, rgba(0, 0, 0, 0.2) 0%, rgba(255, 255, 255, 0) 70%)',
              boxShadow: theme === 'dark'
                ? '0 0 80px rgba(255, 255, 255, 0.2), inset 0 0 40px rgba(255, 255, 255, 0.1)'
                : '0 0 80px rgba(0, 0, 0, 0.1), inset 0 0 40px rgba(0, 0, 0, 0.05)'
            }}
          >
            <div className="absolute inset-0 rounded-full" 
              style={{
                background: theme === 'dark'
                  ? 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.08) 40%, transparent 70%)'
                  : 'linear-gradient(135deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.05) 40%, transparent 70%)',
                boxShadow: theme === 'dark'
                  ? '0 0 30px 5px rgba(255, 255, 255, 0.15)'
                  : '0 0 30px 5px rgba(0, 0, 0, 0.08)'
              }}
            />
          </div>
          
          {/* Enhanced Get Started Button */}
          <Link to="/signin" className="group perspective w-64">
            <div className="relative glassmorphism-button w-full h-16 rounded-full overflow-hidden transition-all duration-300 transform hover:scale-105 group-hover:shadow-glow-pulse">
              {/* Pulsing glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              {/* Orbiting particles */}
              <div className="absolute inset-0">
                <div className="orbiting-particle"></div>
                <div className="orbiting-particle delay-1"></div>
                <div className="orbiting-particle delay-2"></div>
              </div>
              
              {/* Button content */}
              <div className="absolute inset-0 flex items-center justify-center gap-2 text-lg font-medium text-white backdrop-blur-sm bg-white/10 group-hover:bg-white/20 transition-all duration-300">
                <span className="transform group-hover:translate-x-[-2px] transition-transform duration-300">Get Started</span>
                <ArrowRight 
                  size={20} 
                  className="transform group-hover:translate-x-1 transition-transform duration-300" 
                />
              </div>
              
              {/* Inner glow border */}
              <div className="absolute inset-0 border border-white/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          </Link>
          
          {/* Add custom CSS for the button animations */}
          <style>
            {`
            .perspective {
              perspective: 500px;
            }
            
            .glassmorphism-button {
              backdrop-filter: blur(8px);
              transform-style: preserve-3d;
              box-shadow: 0 0 20px rgba(255, 255, 255, 0.1);
            }
            
            .shadow-glow-pulse {
              animation: pulse 2s infinite;
              box-shadow: 0 0 25px rgba(255, 255, 255, 0.3);
            }
            
            @keyframes pulse {
              0% { box-shadow: 0 0 15px rgba(255, 255, 255, 0.3); }
              50% { box-shadow: 0 0 30px rgba(255, 255, 255, 0.5); }
              100% { box-shadow: 0 0 15px rgba(255, 255, 255, 0.3); }
            }
            
            .orbiting-particle {
              position: absolute;
              width: 4px;
              height: 4px;
              background-color: rgba(255, 255, 255, 0.7);
              border-radius: 50%;
              opacity: 0;
              top: 50%;
              left: 0;
              transform: translateY(-50%);
              animation: orbit 4s linear infinite;
            }
            
            .delay-1 {
              animation-delay: 1s;
            }
            
            .delay-2 {
              animation-delay: 2s;
            }
            
            @keyframes orbit {
              0% {
                opacity: 0;
                left: 0;
                transform: translateY(-50%);
              }
              20% {
                opacity: 1;
              }
              80% {
                opacity: 1;
              }
              100% {
                opacity: 0;
                left: 100%;
                transform: translateY(-50%);
              }
            }
            `}
          </style>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
