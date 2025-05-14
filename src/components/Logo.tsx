
import React from 'react';
import { useMood } from '../contexts/MoodContext';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  withText?: boolean;
}

const Logo: React.FC<LogoProps> = ({ size = 'md', withText = true }) => {
  const { moodColor } = useMood();
  
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };
  
  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl'
  };
  
  return (
    <div className="flex items-center gap-2">
      <div 
        className={`relative rounded-full overflow-hidden ${sizeClasses[size]} animate-pulse-slow`}
        style={{ 
          background: `conic-gradient(from 0deg, ${moodColor}, #9b87f5, #7E69AB, ${moodColor})`,
          boxShadow: `0 0 15px ${moodColor}40`
        }}
      >
        <div className="absolute inset-[2px] bg-background rounded-full flex items-center justify-center">
          <div className="text-xl">🧠</div>
        </div>
      </div>
      
      {withText && (
        <span className={`font-extrabold ${textSizes[size]} tracking-tight gradient-text from-primary to-primary/70`}>
          Neura
        </span>
      )}
    </div>
  );
};

export default Logo;
