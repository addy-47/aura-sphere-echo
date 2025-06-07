
import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

interface MagicCardProps {
  children: React.ReactNode;
  className?: string;
}

const MagicCard: React.FC<MagicCardProps> = ({ children, className = '' }) => {
  const { theme } = useTheme();

  return (
    <div className={`relative group ${className}`}>
      {/* Magic border effect */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 rounded-lg blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
      
      {/* Card content */}
      <div className={`relative ${theme === 'dark' ? 'bg-black/90' : 'bg-white/90'} backdrop-blur-lg border ${theme === 'dark' ? 'border-white/10' : 'border-black/10'} rounded-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl`}>
        {children}
      </div>
    </div>
  );
};

export default MagicCard;
