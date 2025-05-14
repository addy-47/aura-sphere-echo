
import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useMood } from '../contexts/MoodContext';
import Layout from '../components/Layout';
import { ArrowRight, MessageCircle, Settings, Star, Heart, ShieldCheck } from 'lucide-react';

const Index = () => {
  const { mood, moodColor } = useMood();
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Parallax effect
    const handleScroll = () => {
      if (!heroRef.current) return;
      const scrollY = window.scrollY;
      heroRef.current.style.transform = `translateY(${scrollY * 0.2}px)`;
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <Layout>
      <div className="flex flex-col items-center min-h-[85vh] relative">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden -z-10">
          <div 
            className="absolute top-1/4 -left-20 w-72 h-72 rounded-full bg-gradient-radial opacity-30 animate-pulse-slow"
            style={{ background: `radial-gradient(circle at center, ${moodColor}, transparent 70%)` }}
          />
          <div 
            className="absolute bottom-1/4 -right-20 w-96 h-96 rounded-full bg-gradient-radial opacity-20 animate-pulse-slow" 
            style={{ 
              background: `radial-gradient(circle at center, ${moodColor}, transparent 70%)`, 
              animationDelay: '1s' 
            }} 
          />
        </div>
        
        {/* Hero section */}
        <div className="relative flex flex-col items-center text-center py-20 px-4 max-w-4xl mx-auto" ref={heroRef}>
          <span 
            className="absolute -top-10 left-1/2 transform -translate-x-1/2 px-3 py-1 rounded-full text-sm font-medium"
            style={{ 
              background: `linear-gradient(90deg, ${moodColor}40, ${moodColor}90)`,
              boxShadow: `0 0 15px ${moodColor}40`
            }}
          >
            Welcome to the future of AI
          </span>
          
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 gradient-text from-foreground via-foreground to-foreground/70 tracking-tight">
            Meet Your Digital Doppelganger
          </h1>
          
          <p className="text-xl md:text-2xl mb-10 text-muted-foreground leading-relaxed max-w-2xl">
            Neura AI learns from you and evolves with you, creating a digital reflection that understands your unique identity.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 mb-16">
            <Button 
              asChild 
              size="lg" 
              className="hover-scale rounded-full group px-6" 
              style={{ 
                background: `linear-gradient(45deg, ${moodColor}, ${moodColor}90)`,
                boxShadow: `0 0 15px ${moodColor}40`
              }}
            >
              <Link to="/chat" className="flex items-center">
                <MessageCircle className="mr-2 h-5 w-5 group-hover:animate-wave" />
                Get Started
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button 
              asChild 
              variant="outline" 
              size="lg" 
              className="hover-lift rounded-full px-6 backdrop-blur-sm"
            >
              <Link to="/customize" className="flex items-center">
                <Settings className="mr-2 h-5 w-5 group-hover:animate-spin-slow" />
                Customize Your AI
              </Link>
            </Button>
          </div>
          
          {/* Brain visualization */}
          <div 
            className="w-64 h-64 md:w-80 md:h-80 rounded-full flex items-center justify-center animate-float relative"
            style={{ 
              background: `radial-gradient(circle at center, ${moodColor}, transparent 70%)`,
              boxShadow: `0 0 40px ${moodColor}40`
            }}
          >
            <div className="absolute inset-0 rounded-full opacity-80 animate-spin-slow" style={{
              background: `conic-gradient(transparent, ${moodColor}40, transparent)`,
              animationDuration: '12s'
            }}></div>
            <div className="w-full h-full flex items-center justify-center text-6xl md:text-7xl">
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
              icon: <Star className="h-10 w-10" style={{ color: moodColor }} />,
            },
            {
              title: "Emotional Understanding",
              description: "Recognizes emotional context and responds with appropriate mood and tone.",
              icon: <Heart className="h-10 w-10" style={{ color: moodColor }} />,
            },
            {
              title: "Secure & Private",
              description: "Your data stays on your device. We never share your personal information.",
              icon: <ShieldCheck className="h-10 w-10" style={{ color: moodColor }} />,
            }
          ].map((feature, i) => (
            <div 
              key={i} 
              className="glassmorphism p-8 flex flex-col items-center text-center transition-all duration-300 hover-lift"
              style={{ boxShadow: `0 8px 32px ${moodColor}20` }}
            >
              <div className="mb-6 p-4 rounded-full bg-background/30 backdrop-blur-lg">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
        
        {/* Testimonials */}
        <div className="w-full bg-gradient-to-b from-background to-background/80 py-16">
          <div className="max-w-5xl mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              What Users Are Saying
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  quote: "Neura has become an essential part of my daily workflow. It's like having an AI extension of myself.",
                  author: "Alex P., Product Manager"
                },
                {
                  quote: "The way it adapts to my communication style is incredible. It feels like it truly understands me.",
                  author: "Jamie L., Content Creator"
                }
              ].map((testimonial, i) => (
                <div 
                  key={i}
                  className="glassmorphism p-6 rounded-xl hover-lift"
                  style={{ boxShadow: `0 4px 20px ${moodColor}15` }}
                >
                  <p className="mb-4 italic text-foreground/80">"{testimonial.quote}"</p>
                  <p className="text-sm font-medium">{testimonial.author}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Call to action */}
        <div className="w-full max-w-4xl mx-auto text-center px-4 py-20">
          <div 
            className="glassmorphism p-10 rounded-2xl relative overflow-hidden"
            style={{ boxShadow: `0 10px 40px ${moodColor}30` }}
          >
            {/* Background gradient */}
            <div 
              className="absolute inset-0 opacity-30"
              style={{ background: `linear-gradient(45deg, transparent, ${moodColor}, transparent)` }}
            ></div>
            
            <h2 className="text-3xl md:text-4xl font-bold mb-6 relative z-10">Ready to meet your digital self?</h2>
            <p className="text-xl text-muted-foreground mb-8 relative z-10 max-w-xl mx-auto">
              Neura AI becomes more personalized the more you interact with it.
            </p>
            <Button 
              asChild 
              size="lg" 
              className="hover-scale rounded-full px-8 py-6 text-lg relative z-10"
              style={{ 
                background: `linear-gradient(45deg, ${moodColor}, ${moodColor}90)`,
                boxShadow: `0 0 20px ${moodColor}50`
              }}
            >
              <Link to="/chat">
                Start Chatting Now <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
