
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Layout from '../components/Layout';
import { useMood } from '../contexts/MoodContext';
import Logo from '../components/Logo';
import { ArrowRight } from 'lucide-react';

const Index = () => {
  const { moodColor } = useMood();
  
  return (
    <Layout minimal>
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-14rem)] text-center px-4 py-10 relative overflow-hidden">
        {/* Neural network circuit pattern overlay */}
        <div className="absolute inset-0 z-0 opacity-10">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="circuitPattern" x="0" y="0" width="200" height="200" patternUnits="userSpaceOnUse">
                <path d="M10,10 L50,10 L50,50 L90,50 L90,10 L130,10 M10,90 L50,90 L50,50 M130,90 L90,90 L90,50 M130,50 L170,50 L170,90 L130,90 M170,10 L130,10 L130,50 M170,130 L130,130 M130,130 L130,170 L90,170 L90,130 L50,130 L50,170 L10,170 L10,130 M90,130 L90,90 M50,130 L50,90" 
                  stroke="white" strokeWidth="0.5" fill="none" />
                <circle cx="10" cy="10" r="3" fill="white" />
                <circle cx="90" cy="50" r="3" fill="white" />
                <circle cx="130" cy="10" r="3" fill="white" />
                <circle cx="50" cy="90" r="3" fill="white" />
                <circle cx="170" cy="50" r="3" fill="white" />
                <circle cx="90" cy="130" r="3" fill="white" />
                <circle cx="10" cy="170" r="3" fill="white" />
                <circle cx="130" cy="170" r="3" fill="white" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#circuitPattern)" />
          </svg>
        </div>
        
        {/* Soft radial glow background */}
        <div 
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full z-0"
          style={{
            background: 'radial-gradient(circle, rgba(100,100,255,0.08) 0%, rgba(50,50,200,0.05) 40%, transparent 70%)',
            filter: 'blur(40px)',
            animation: 'pulse 8s infinite alternate ease-in-out'
          }}
        />
        
        <div className="max-w-4xl mx-auto flex flex-col items-center z-10">
          {/* Main Hero Text */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-light tracking-tighter mb-4 sm:mb-6 text-white">
            Your Digital
            <br />
            <span className="gradient-text from-gray-100 to-gray-400 animate-gradient font-normal">Doppelgänger</span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-400 mb-8 md:mb-10 max-w-xl">
            An AI-powered digital reflection that evolves with your personality
          </p>
          
          {/* 3D Sphere - moved to higher z-index */}
          <div 
            className="w-52 h-52 md:w-64 md:h-64 rounded-full mb-8 md:mb-10 relative z-20 cursor-pointer transition-all duration-500 hover:transform hover:scale-105"
            style={{ 
              background: 'radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.2) 0%, rgba(0, 0, 0, 0) 70%)',
              boxShadow: '0 0 80px rgba(255, 255, 255, 0.2), inset 0 0 40px rgba(255, 255, 255, 0.1)'
            }}
          >
            <div className="absolute inset-0 rounded-full" 
              style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.08) 40%, transparent 70%)',
                boxShadow: '0 0 30px 5px rgba(255, 255, 255, 0.15)'
              }}
            />
            
            {/* Animated pulse ring */}
            <div className="absolute inset-[-10px] rounded-full animate-pulse opacity-0 hover:opacity-30 transition-opacity duration-300"
              style={{
                border: '2px solid rgba(255,255,255,0.3)',
                boxShadow: '0 0 20px rgba(255,255,255,0.4)'
              }}
            />
            
            {/* Second animated pulse ring with delay */}
            <div className="absolute inset-[-20px] rounded-full animate-pulse opacity-0 hover:opacity-20 transition-opacity duration-300 animation-delay-300"
              style={{
                border: '1px solid rgba(255,255,255,0.2)',
                boxShadow: '0 0 30px rgba(255,255,255,0.3)',
                animationDelay: '0.5s'
              }}
            />
          </div>
          
          {/* Enhanced Get Started Button */}
          <Button 
            asChild 
            size="lg" 
            className="rounded-full w-64 h-16 text-lg font-medium relative overflow-hidden group transition-all duration-300 hover:shadow-[0_0_25px_rgba(255,255,255,0.3)] backdrop-blur-md"
            style={{
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.1)',
            }}
          >
            <Link to="/signin" className="flex items-center justify-center gap-2 w-full h-full relative z-10">
              <span className="transition-transform duration-300 group-hover:translate-x-[-2px]">Get Started</span>
              <ArrowRight size={20} className="transition-transform duration-300 group-hover:translate-x-1" />
              
              {/* Glassmorphism overlay that appears on hover */}
              <div className="absolute top-0 left-0 w-full h-full bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-full" />
              
              {/* Animated border glow effect */}
              <div className="absolute -inset-[1px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background: `linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)`,
                  backgroundSize: '200% 100%',
                  animation: 'shimmer 2s linear infinite'
                }}
              />
            </Link>
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
