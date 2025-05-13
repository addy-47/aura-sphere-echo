
import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useMood } from '../contexts/MoodContext';
import Layout from '../components/Layout';
import { ArrowRight } from 'lucide-react';

const Index = () => {
  const { mood, moodColor } = useMood();
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Simple parallax effect
    const handleScroll = () => {
      if (!heroRef.current) return;
      const scrollY = window.scrollY;
      heroRef.current.style.transform = `translateY(${scrollY * 0.3}px)`;
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <Layout>
      <div className="flex flex-col items-center min-h-[85vh] relative">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden -z-10">
          <div className="absolute top-1/4 -left-20 w-40 h-40 rounded-full bg-gradient-radial from-happy/20 to-transparent animate-pulse-slow" />
          <div className="absolute bottom-1/4 -right-20 w-60 h-60 rounded-full bg-gradient-radial from-excited/20 to-transparent animate-pulse-slow" style={{ animationDelay: '1s' }} />
        </div>
        
        {/* Hero section */}
        <div className="relative flex flex-col items-center text-center py-20 px-4 max-w-4xl mx-auto" ref={heroRef}>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Meet Your Digital Doppelganger
          </h1>
          
          <p className="text-xl md:text-2xl mb-8 text-muted-foreground">
            Neura AI learns from you and evolves with you, creating a digital reflection that understands your unique identity.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <Button asChild size="lg">
              <Link to="/chat">
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/customize">Customize Your AI</Link>
            </Button>
          </div>
          
          <div 
            className="w-64 h-64 md:w-80 md:h-80 rounded-full animate-float"
            style={{ 
              background: `radial-gradient(circle at center, ${moodColor}, transparent 70%)`,
              boxShadow: `0 0 40px 5px ${moodColor}40`
            }}
          >
            <div className="w-full h-full flex items-center justify-center text-6xl">
              🧠
            </div>
          </div>
        </div>
        
        {/* Features section */}
        <div className="w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-4 py-16">
          {[
            {
              title: "Adaptive Intelligence",
              description: "Neura learns and adapts to your preferences, behaviors, and communication style.",
              icon: "🔄"
            },
            {
              title: "Emotional Understanding",
              description: "Recognizes emotional context and responds with appropriate mood and tone.",
              icon: "❤️"
            },
            {
              title: "Secure & Private",
              description: "Your data stays on your device. We never share your personal information.",
              icon: "🔒"
            }
          ].map((feature, i) => (
            <div 
              key={i} 
              className="glass-card p-6 flex flex-col items-center text-center transition-all duration-300 hover:translate-y-[-5px]"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
        
        {/* Call to action */}
        <div className="w-full max-w-4xl mx-auto text-center px-4 py-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to meet your digital self?</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Neura AI becomes more personalized the more you interact with it.
          </p>
          <Button asChild size="lg">
            <Link to="/chat">
              Start Chatting Now <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
