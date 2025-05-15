
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
    <div className="flex items-center gap-3">
      <div 
        className={`relative rounded-full overflow-hidden ${sizeClasses[size]}`}
        style={{ 
          background: 'linear-gradient(135deg, #333333, #1a1a1a)',
          boxShadow: '0 0 15px rgba(255,255,255,0.1)'
        }}
      >
        <div 
          className="absolute inset-0 bg-black rounded-full flex items-center justify-center"
        >
          {/* Brain logo SVG in monochrome - consistent in both dark and light mode */}
          <svg width="80%" height="80%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2Z" stroke="white" strokeOpacity="0.7" strokeWidth="1" fill="black" />
            <path d="M12 6C11.1 6 10.3 6.3 9.7 6.9C9.3 7.3 9.1 7.9 9 8.5C8.1 8.9 7.5 9.9 7.5 11C7.5 11.8 7.9 12.6 8.5 13C8.1 13.4 8 14 8 14.5C8 15.9 9.1 17 10.5 17H15C16.7 17 18 15.7 18 14C18 13.1 17.6 12.3 17 11.7C17.6 11.1 18 10.1 18 9C18 7.3 16.7 6 15 6H12Z" stroke="white" strokeWidth="1" fill="#333333" />
            <circle cx="10.5" cy="8.5" r="0.75" fill="white" />
            <circle cx="15" cy="9.5" r="0.75" fill="white" />
            <circle cx="14" cy="14" r="0.75" fill="white" />
            <path d="M10.5 12C10.5 11.4477 10.0523 11 9.5 11C8.94772 11 8.5 11.4477 8.5 12C8.5 12.5523 8.94772 13 9.5 13C10.0523 13 10.5 12.5523 10.5 12Z" fill="white" />
          </svg>
        </div>
      </div>
      
      {withText && (
        <span className={`font-light ${textSizes[size]} tracking-widest ${textSizes[size]} text-current uppercase`}>
          Neura
        </span>
      )}
    </div>
  );
};

export default Logo;
