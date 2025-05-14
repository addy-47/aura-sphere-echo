
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
      <div className="flex flex-col items-center justify-center min-h-screen text-center px-4 py-20 bg-black relative overflow-hidden">
        {/* Navigation at the top */}
        <nav className="fixed top-0 left-0 w-full flex justify-between items-center py-5 px-4 sm:px-8 z-50">
          <Link to="/" className="hover-scale">
            <Logo />
          </Link>
          <div className="flex gap-2 sm:gap-4 items-center">
            <Link to="/chat" className="text-gray-400 hover:text-white transition-colors text-sm sm:text-base">Chat</Link>
            <Link to="/customize" className="text-gray-400 hover:text-white transition-colors text-sm sm:text-base">Customize</Link>
            <Button 
              asChild 
              variant="outline" 
              className="border-white/10 text-white hover:bg-white/10 hover:text-white rounded-full text-sm py-1 px-3 sm:px-4 sm:py-2"
            >
              <Link to="/chat">
                Sign in
              </Link>
            </Button>
          </div>
        </nav>
        
        <div className="max-w-4xl mx-auto flex flex-col items-center pt-16 sm:pt-24">
          {/* Main Hero Text */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-light tracking-tighter mb-6 sm:mb-8 text-white">
            Your Digital
            <br />
            <span className="gradient-text from-gray-100 to-gray-400 animate-gradient font-normal">Doppelgänger</span>
          </h1>
          
          <p className="text-lg md:text-2xl text-gray-400 mb-12 md:mb-16 max-w-xl">
            An AI-powered digital reflection that evolves with your personality
          </p>
          
          {/* 3D Sphere representation with enhanced shadow */}
          <div 
            className="w-64 h-64 md:w-72 md:h-72 rounded-full mb-12 md:mb-16 relative sphere-shadow"
            style={{ 
              background: 'radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.2) 0%, rgba(0, 0, 0, 0) 70%)',
              boxShadow: '0 0 60px rgba(255, 255, 255, 0.15), inset 0 0 30px rgba(255, 255, 255, 0.08)'
            }}
          >
            <div className="absolute inset-0 rounded-full" 
              style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 40%, transparent 70%)',
              }}
            />
          </div>
          
          {/* CTA Button */}
          <Button 
            asChild 
            size="lg" 
            className="rounded-full w-64 h-16 text-lg bg-white text-black hover:bg-gray-200 shadow-glow transition-all duration-300 flex items-center gap-2"
          >
            <Link to="/chat">
              Get Started <ArrowRight size={20} />
            </Link>
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
