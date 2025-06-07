
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
      {/* Simple single-color glow effect */}
      <div className="absolute -inset-0.5 bg-blue-500/20 rounded-lg blur opacity-0 group-hover:opacity-30 transition-opacity duration-500"></div>
      
      {/* Subtle border glow */}
      <div className="absolute -inset-px bg-gradient-to-r from-blue-500/30 to-blue-400/30 rounded-lg opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
      
      {/* Card content */}
      <div className={`relative ${theme === 'dark' ? 'bg-black/90' : 'bg-white/90'} backdrop-blur-lg border ${theme === 'dark' ? 'border-white/10' : 'border-black/10'} rounded-lg transition-all duration-300 hover:scale-[1.01] hover:shadow-xl`}>
        {children}
      </div>
    </div>
  );
};

export default MagicCard;
