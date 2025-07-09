
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Layout from '../components/Layout';
import { useMood } from '../contexts/MoodContext';
import { useTheme } from '../contexts/ThemeContext';
import Logo from '../components/Logo';
import { ArrowRight } from 'lucide-react';
import { Canvas } from '@react-three/fiber';
import ParticleSystem from '../components/ParticleSystem';

const Index = () => {
  const { moodColor } = useMood();
  const { theme } = useTheme();
  
  return (
    <Layout minimal>
      <div className={`flex flex-col items-center justify-center min-h-[calc(100vh-64px)] text-center px-6 py-12 relative overflow-hidden 
        ${theme === 'dark' ? 'bg-black text-white' : 'bg-white text-gray-800'}`}>
        
        {/* Minimal Particle Background */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <Canvas 
            camera={{ position: [0, 0, 10], fov: 60 }}
            gl={{ alpha: true, antialias: false, powerPreference: "high-performance" }}
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
          >
            <ParticleSystem count={200} size={0.01} opacity={0.4} speed={0.02} range={30} />
          </Canvas>
        </div>
        
        {/* Starry background effect with CSS */}
        <div className="absolute inset-0 overflow-hidden z-1" 
          style={{
            backgroundImage: `radial-gradient(${theme === 'dark' ? '#ffffff' : '#333333'} 1px, transparent 1px)`,
            backgroundSize: '50px 50px',
            opacity: theme === 'dark' ? 0.15 : 0.1
          }}
        />
        
        <div className="max-w-4xl mx-auto flex flex-col items-center z-10 space-y-8 relative">
          {/* Main Hero Text - Centered with neutral gradient */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-light tracking-tighter mb-2 text-center">
            <span className={`${theme === 'dark' 
              ? 'bg-gradient-to-r from-gray-200 via-gray-400 to-gray-600 bg-clip-text text-transparent' 
              : 'bg-gradient-to-r from-gray-600 via-gray-800 to-black bg-clip-text text-transparent'
            }`}>
              Your Digital
            </span>
            <br />
            <span className={`font-normal animate-pulse ${theme === 'dark'
              ? 'bg-gradient-to-r from-white via-gray-300 to-gray-500 bg-clip-text text-transparent'
              : 'bg-gradient-to-r from-black via-gray-700 to-gray-500 bg-clip-text text-transparent'
            }`}>
              Doppelgänger
            </span>
          </h1>
          
          <p className={`text-lg md:text-xl ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} max-w-xl text-center mx-auto`}>
            An AI-powered digital reflection that evolves with your personality
          </p>
          
          {/* Enhanced 3D Sphere representation - CENTERED */}
          <div className="my-12 flex justify-center items-center w-full">
            <div 
              className="w-48 h-48 md:w-56 md:h-56 rounded-full mb-2 md:mb-4 relative sphere-shadow z-20 cursor-pointer transition-all duration-500 hover:scale-105"
              style={{ 
                background: 'radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.2) 0%, rgba(0, 0, 0, 0) 70%)',
                backgroundColor: '#1a1a1a',
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
          
          {/* Get Started Button - Centered with gradient text */}
          <Link 
            to="/signin" 
            className={`mt-16 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full font-medium
              transition-all duration-300 hover:scale-105 hover:shadow-glow backdrop-blur-md border 
              shadow-lg hover:shadow-xl w-full sm:w-auto group ${theme === 'dark'
                ? 'border-white/20 hover:border-white/30 bg-black/80 hover:bg-black/90'
                : 'border-gray-300/50 hover:border-gray-400/60 bg-white/80 hover:bg-white/90'
              }`}
            style={{
              boxShadow: theme === 'dark' ? '0 0 15px rgba(255,255,255,0.1)' : '0 0 15px rgba(0,0,0,0.1)'
            }}
          >
            <span className={`${theme === 'dark'
              ? 'bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent'
              : 'bg-gradient-to-r from-black via-gray-700 to-gray-500 bg-clip-text text-transparent'
            }`}>
              Get Started
            </span>
            <ArrowRight size={20} className={`transition-transform duration-300 group-hover:translate-x-1 ${theme === 'dark' ? 'text-white' : 'text-black'}`} />
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
