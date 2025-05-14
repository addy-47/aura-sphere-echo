
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Layout from '../components/Layout';
import { useMood } from '../contexts/MoodContext';
import Logo from '../components/Logo';

const Index = () => {
  const { moodColor } = useMood();
  
  return (
    <Layout minimal>
      <div className="flex flex-col items-center justify-center min-h-screen text-center px-4 py-20 bg-gradient-to-b from-background to-background/95">
        <div className="max-w-4xl mx-auto flex flex-col items-center">
          {/* Logo */}
          <div className="mb-6">
            <Logo size="lg" monochrome />
          </div>
          
          {/* Main text */}
          <h1 className="text-5xl sm:text-7xl md:text-8xl font-light tracking-tight mb-8">
            Digital
            <br />
            Doppelgänger
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-16 max-w-xl">
            An AI-powered digital reflection 
            <br />
            of your unique personality
          </p>
          
          {/* 3D Sphere representation */}
          <div 
            className="w-64 h-64 md:w-80 md:h-80 rounded-full bg-gradient-to-b from-foreground/80 to-foreground/30 mb-16 shadow-2xl"
            style={{ 
              filter: 'blur(1px)'
            }}
          ></div>
          
          {/* CTA Button */}
          <Button 
            asChild 
            size="lg" 
            className="rounded-full w-64 h-16 text-lg border border-foreground/20 hover:border-foreground/40 bg-background hover:bg-background/80 shadow-lg transition-all duration-300"
          >
            <Link to="/chat">
              Get Started
            </Link>
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
