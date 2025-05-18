
import React, { useEffect, useState } from 'react';
import { useMood } from '../contexts/MoodContext';
import Logo from './Logo';
import { Skeleton } from '@/components/ui/skeleton';

interface LoaderPageProps {
  isLoading: boolean;
}

const LoaderPage: React.FC<LoaderPageProps> = ({ isLoading }) => {
  const { moodColor } = useMood();
  const [fadeOut, setFadeOut] = useState(false);
  const [isHidden, setIsHidden] = useState(false);

  // Handle fade out animation with proper cleanup
  useEffect(() => {
    let fadeTimer: NodeJS.Timeout;
    let hideTimer: NodeJS.Timeout;
    
    if (!isLoading) {
      setFadeOut(true);
      // After fade out animation completes, set hidden
      fadeTimer = setTimeout(() => {
        setIsHidden(true);
      }, 500); // Match the duration of the fade out transition
    } else {
      setFadeOut(false);
      setIsHidden(false);
    }
    
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(hideTimer);
    };
  }, [isLoading]);

  // If hidden, don't render at all
  if (isHidden) {
    return null;
  }

  return (
    <>
      {/* Add keyframes for shimmer animation in a style element without jsx/global props */}
      <style dangerouslySetInnerHTML={{ 
        __html: `
          @keyframes shimmer {
            0% { background-position: 200% 0; }
            100% { background-position: -200% 0; }
          }
        `
      }} />
      
      <div 
        className={`fixed inset-0 z-50 flex flex-col items-center justify-center transition-opacity duration-500 ${
          fadeOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
        style={{
          background: `radial-gradient(circle at center, ${moodColor}25, ${moodColor}15)`,
          backdropFilter: 'blur(12px)',
        }}
      >
        <div className="relative flex flex-col items-center">
          {/* Improved logo container with pulse effect */}
          <div className="relative h-24 w-24 mb-6">
            <div className="absolute inset-0 flex items-center justify-center">
              <Logo size="lg" withText={false} />
            </div>
            
            <div 
              className="absolute inset-0 rounded-full animate-pulse" 
              style={{ 
                background: `radial-gradient(circle, ${moodColor}70 0%, transparent 70%)`,
                opacity: 0.7,
                animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
              }}
            />
            
            <div 
              className="absolute inset-0 rounded-full" 
              style={{ 
                background: `radial-gradient(circle, transparent 50%, ${moodColor}30 75%, transparent 95%)`,
                opacity: 0.5,
                animation: 'ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite'
              }}
            />
          </div>
          
          {/* Progress bar with animated gradient */}
          <div className="w-48 h-1.5 bg-secondary/30 rounded-full overflow-hidden mb-4">
            <div 
              className="h-full rounded-full animate-pulse"
              style={{
                background: `linear-gradient(90deg, transparent, ${moodColor}, transparent)`,
                width: '100%',
                backgroundSize: '200% 100%',
                animation: 'shimmer 2s infinite linear'
              }}
            />
          </div>
          
          {/* Loading text with subtle animation */}
          <div className="flex items-center gap-1.5">
            <p 
              className="text-sm font-medium text-foreground/80"
              style={{ 
                textShadow: `0 0 10px ${moodColor}50`
              }}
            >
              Loading
            </p>
            {[0, 1, 2].map((i) => (
              <div 
                key={i} 
                className="animate-bounce h-1.5 w-1.5 rounded-full"
                style={{
                  background: moodColor,
                  animationDelay: `${i * 0.15}s`,
                  animationDuration: '1s'
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default LoaderPage;
