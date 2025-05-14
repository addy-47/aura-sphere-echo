
import React from 'react';
import { useMood } from '../contexts/MoodContext';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  withText?: boolean;
  monochrome?: boolean;
}

const Logo: React.FC<LogoProps> = ({ size = 'md', withText = true, monochrome = false }) => {
  const { moodColor } = useMood();
  
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-16 w-16'
  };
  
  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-4xl'
  };
  
  return (
    <div className="flex flex-col items-center gap-2">
      <div 
        className={`relative rounded-full overflow-hidden ${sizeClasses[size]} ${monochrome ? '' : 'animate-pulse-slow'}`}
        style={monochrome ? {} : { 
          background: `conic-gradient(from 0deg, ${moodColor}, #9b87f5, #7E69AB, ${moodColor})`,
          boxShadow: `0 0 15px ${moodColor}40`
        }}
      >
        <div 
          className={`absolute inset-0 ${monochrome ? 'bg-gray-200' : 'bg-background'} rounded-full flex items-center justify-center`}
        >
          {monochrome ? (
            <svg width="60%" height="60%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-gray-600">
              <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="0.5" />
              <path d="M8 12H16M12 16V8M7 9L17 15M7 15L17 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          ) : (
            <div className="text-xl">🧠</div>
          )}
        </div>
      </div>
      
      {withText && (
        <span className={`font-light ${textSizes[size]} tracking-widest ${monochrome ? 'text-foreground' : 'gradient-text from-primary to-primary/70'} uppercase`}>
          Neura
        </span>
      )}
    </div>
  );
};

export default Logo;
