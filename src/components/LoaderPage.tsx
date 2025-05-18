
import React, { useEffect, useState } from 'react';
import { useMood } from '../contexts/MoodContext';
import Logo from './Logo';

interface LoaderPageProps {
  isLoading: boolean;
}

const LoaderPage: React.FC<LoaderPageProps> = ({ isLoading }) => {
  const { moodColor } = useMood();
  const [fadeOut, setFadeOut] = useState(false);

  // Handle fade out animation
  useEffect(() => {
    if (!isLoading) {
      setFadeOut(true);
    } else {
      setFadeOut(false);
    }
  }, [isLoading]);

  if (!isLoading && fadeOut) {
    return null;
  }

  return (
    <div 
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-background transition-opacity duration-500 ${
        fadeOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      style={{
        background: `radial-gradient(circle at center, ${moodColor}15, ${moodColor}05)`,
        backdropFilter: 'blur(8px)',
      }}
    >
      <div className="relative h-20 w-20">
        <Logo size="lg" withText={false} />
        <div 
          className="absolute inset-0 rounded-full animate-ping" 
          style={{ 
            background: `radial-gradient(circle, ${moodColor}60 0%, transparent 70%)`,
            opacity: 0.6 
          }}
        />
      </div>
      
      <div className="mt-8 relative">
        <div className="flex space-x-2 justify-center items-center">
          {[0, 1, 2].map((i) => (
            <div 
              key={i} 
              className="animate-bounce"
              style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                background: moodColor,
                animationDelay: `${i * 0.15}s`,
                animationDuration: '1s'
              }}
            />
          ))}
        </div>
        <p className="text-muted-foreground mt-4 animate-pulse">Loading...</p>
      </div>
    </div>
  );
};

export default LoaderPage;
