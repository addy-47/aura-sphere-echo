
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
      <div className={`flex flex-col items-center justify-center min-h-[calc(100vh-64px)] text-center px-6 py-12 relative overflow-hidden 
        ${theme === 'dark' ? 'bg-black text-white' : 'bg-white text-gray-800'}`}>
        {/* Starry background effect with CSS */}
        <div className="absolute inset-0 overflow-hidden z-0" 
          style={{
            backgroundImage: `radial-gradient(${theme === 'dark' ? '#ffffff' : '#333333'} 1px, transparent 1px)`,
            backgroundSize: '50px 50px',
            opacity: theme === 'dark' ? 0.15 : 0.1
          }}
        />
        
        <div className="max-w-4xl mx-auto flex flex-col items-center z-10 space-y-8">
          {/* Main Hero Text - Centered */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-light tracking-tighter mb-2 text-center">
            Your Digital
            <br />
            <span className={`gradient-text ${theme === 'dark' ? 'from-gray-100 to-gray-400' : 'from-gray-700 to-gray-900'} animate-gradient font-normal`}>
              Doppelgänger
            </span>
          </h1>
          
          <p className={`text-lg md:text-xl ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} max-w-xl text-center mx-auto`}>
            An AI-powered digital reflection that evolves with your personality
          </p>
          
          {/* Enhanced 3D Sphere representation with consistent color in both themes */}
          <div className="my-12 flex justify-center items-center w-full">
            <div 
              className="w-48 h-48 md:w-56 md:h-56 rounded-full mb-2 md:mb-4 relative sphere-shadow z-20 cursor-pointer transition-all duration-500 hover:scale-105"
              style={{ 
                background: 'radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.2) 0%, rgba(0, 0, 0, 0) 70%)',
                backgroundColor: '#1a1a1a', // Same dark color for both themes
                boxShadow: '0 0 80px rgba(255, 255, 255, 0.2), inset 0 0 40px rgba(255, 255, 255, 0.1)'
              }}
            >
              <div className="absolute inset-0 rounded-full" 
                style={{
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.08) 40%, transparent 70%)',
                  boxShadow: '0 0 30px 5px rgba(255, 255, 255, 0.15)'
                }}
              />
            </div>
          </div>
          
          {/* Get Started Button - Centered with hover animation */}
          <Link 
            to="/signin" 
            className="mt-16 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-white font-medium
              transition-all duration-300 hover:scale-105 hover:shadow-glow bg-black/80 backdrop-blur-md border border-white/20 
              shadow-lg hover:shadow-xl hover:border-white/30 w-full sm:w-auto group"
            style={{
              boxShadow: theme === 'dark' ? '0 0 15px rgba(255,255,255,0.1)' : '0 0 15px rgba(0,0,0,0.1)',
              background: 'rgba(0,0,0,0.7)'
            }}
          >
            <span>Get Started</span>
            <ArrowRight size={20} className="transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
