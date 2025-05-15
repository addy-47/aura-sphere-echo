
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
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] text-center px-4 py-10 bg-black relative overflow-hidden">
        {/* Starry background effect with CSS */}
        <div className="absolute inset-0 overflow-hidden z-0" 
          style={{
            backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)',
            backgroundSize: '50px 50px',
            opacity: 0.15
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
          
          {/* 3D Sphere representation with enhanced shadow */}
          <div 
            className="w-52 h-52 md:w-64 md:h-64 rounded-full mb-8 md:mb-10 relative sphere-shadow z-20 cursor-pointer transition-all duration-300 hover:shadow-[0_0_100px_rgba(255,255,255,0.3)]"
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
          </div>
          
          {/* CTA Button */}
          <Button 
            asChild 
            size="lg" 
            className="rounded-full w-64 h-16 text-lg bg-white text-black hover:scale-105 hover:bg-gray-200 shadow-glow transition-all duration-300 flex items-center gap-2 font-medium"
          >
            <Link to="/signin">
              Get Started <ArrowRight size={20} />
            </Link>
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
