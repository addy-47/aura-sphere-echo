
import React from 'react';
import { useMood } from '../contexts/MoodContext';
import { useTheme } from '../contexts/ThemeContext';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  withText?: boolean;
  monochrome?: boolean;
}

const Logo: React.FC<LogoProps> = ({ size = 'md', withText = true, monochrome = false }) => {
  const { moodColor } = useMood();
  const { theme } = useTheme();
  
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
      <div className={`${sizeClasses[size]}`}>
        {/* Updated brain logo SVG in black and white */}
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M50 95C74.8528 95 95 74.8528 95 50C95 25.1472 74.8528 5 50 5C25.1472 5 5 25.1472 5 50C5 74.8528 25.1472 95 50 95Z" 
                fill={theme === 'dark' ? '#111111' : '#f8f8f8'} 
                stroke={theme === 'dark' ? '#ffffff' : '#000000'} 
                strokeWidth="2" />
          <path d="M39 30C39 27.2386 41.2386 25 44 25H56C58.7614 25 61 27.2386 61 30V70C61 72.7614 58.7614 75 56 75H44C41.2386 75 39 72.7614 39 70V30Z" 
                fill={theme === 'dark' ? '#222222' : '#f1f1f1'} 
                stroke={theme === 'dark' ? '#ffffff' : '#000000'} 
                strokeWidth="2" />
          <path d="M30 40C27.2386 40 25 42.2386 25 45C25 47.7614 27.2386 50 30 50H39V40H30Z" 
                fill={theme === 'dark' ? '#222222' : '#f1f1f1'} 
                stroke={theme === 'dark' ? '#ffffff' : '#000000'} 
                strokeWidth="2" />
          <path d="M30 60C27.2386 60 25 57.7614 25 55C25 52.2386 27.2386 50 30 50H39V60H30Z" 
                fill={theme === 'dark' ? '#222222' : '#f1f1f1'} 
                stroke={theme === 'dark' ? '#ffffff' : '#000000'} 
                strokeWidth="2" />
          <path d="M70 40C72.7614 40 75 42.2386 75 45C75 47.7614 72.7614 50 70 50H61V40H70Z" 
                fill={theme === 'dark' ? '#222222' : '#f1f1f1'} 
                stroke={theme === 'dark' ? '#ffffff' : '#000000'} 
                strokeWidth="2" />
          <path d="M70 60C72.7614 60 75 57.7614 75 55C75 52.2386 72.7614 50 70 50H61V60H70Z" 
                fill={theme === 'dark' ? '#222222' : '#f1f1f1'} 
                stroke={theme === 'dark' ? '#ffffff' : '#000000'} 
                strokeWidth="2" />
          <path d="M25 35C22.2386 35 20 32.7614 20 30C20 27.2386 22.2386 25 25 25H35C35 25 35 35 25 35Z" 
                fill={theme === 'dark' ? '#222222' : '#f1f1f1'} 
                stroke={theme === 'dark' ? '#ffffff' : '#000000'} 
                strokeWidth="2" />
          <path d="M25 75C22.2386 75 20 72.7614 20 70C20 67.2386 22.2386 65 25 65H35C35 65 35 75 25 75Z" 
                fill={theme === 'dark' ? '#222222' : '#f1f1f1'} 
                stroke={theme === 'dark' ? '#ffffff' : '#000000'} 
                strokeWidth="2" />
          <path d="M75 35C77.7614 35 80 32.7614 80 30C80 27.2386 77.7614 25 75 25H65C65 25 65 35 75 35Z" 
                fill={theme === 'dark' ? '#222222' : '#f1f1f1'} 
                stroke={theme === 'dark' ? '#ffffff' : '#000000'} 
                strokeWidth="2" />
          <path d="M75 75C77.7614 75 80 72.7614 80 70C80 67.2386 77.7614 65 75 65H65C65 65 65 75 75 75Z" 
                fill={theme === 'dark' ? '#222222' : '#f1f1f1'} 
                stroke={theme === 'dark' ? '#ffffff' : '#000000'} 
                strokeWidth="2" />
        </svg>
      </div>
      
      {withText && (
        <span className={`font-light ${textSizes[size]} tracking-widest ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          Neura
        </span>
      )}
    </div>
  );
};

export default Logo;
