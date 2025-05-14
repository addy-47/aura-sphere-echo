
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
      <div className="flex flex-col items-center justify-center min-h-screen text-center px-4 py-20 bg-black">
        {/* Navigation at the top */}
        <nav className="fixed top-0 left-0 w-full flex justify-between items-center py-5 px-8 z-50">
          <Logo size="md" monochrome />
          <div className="flex gap-4 items-center">
            <Link to="/chat" className="text-gray-400 hover:text-white transition-colors">Chat</Link>
            <Link to="/dashboard" className="text-gray-400 hover:text-white transition-colors">Dashboard</Link>
            <Link to="/customize" className="text-gray-400 hover:text-white transition-colors">Customize</Link>
            <Button 
              asChild 
              variant="outline" 
              className="border-white/10 text-white hover:bg-white/10 hover:text-white"
            >
              <Link to="/chat">
                Sign in
              </Link>
            </Button>
          </div>
        </nav>
        
        <div className="max-w-4xl mx-auto flex flex-col items-center pt-16">
          {/* Main Hero Text */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-light tracking-tighter mb-8 text-white">
            Your Digital
            <br />
            <span className="gradient-text from-gray-100 to-gray-400 animate-gradient font-normal">Doppelgänger</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-400 mb-16 max-w-xl">
            An AI-powered digital reflection that evolves with your personality
          </p>
          
          {/* 3D Sphere representation */}
          <div 
            className="w-64 h-64 md:w-72 md:h-72 rounded-full mb-16 relative"
            style={{ 
              background: 'radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.2) 0%, rgba(0, 0, 0, 0) 70%)',
              boxShadow: '0 0 40px rgba(255, 255, 255, 0.1) inset'
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
          
          {/* Features section */}
          <div className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 mb-4 bg-white/10 rounded-full flex items-center justify-center">
                <span className="text-2xl">🧠</span>
              </div>
              <h3 className="text-xl font-medium mb-2 text-white">Learns from You</h3>
              <p className="text-gray-400 text-center">Adapts to your personality through continuous interaction</p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 mb-4 bg-white/10 rounded-full flex items-center justify-center">
                <span className="text-2xl">🔒</span>
              </div>
              <h3 className="text-xl font-medium mb-2 text-white">Private & Secure</h3>
              <p className="text-gray-400 text-center">Your data remains encrypted and only accessible to you</p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 mb-4 bg-white/10 rounded-full flex items-center justify-center">
                <span className="text-2xl">✨</span>
              </div>
              <h3 className="text-xl font-medium mb-2 text-white">Mood Responsive</h3>
              <p className="text-gray-400 text-center">Interface adapts to reflect your emotional state</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
