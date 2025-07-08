import React from 'react';
import { Card } from '@/components/ui/card';
import { useTheme } from '../contexts/ThemeContext';

interface MagicCardProps extends React.ComponentProps<typeof Card> {
  children: React.ReactNode;
}

const MagicCard: React.FC<MagicCardProps> = ({ children, className = '', ...props }) => {
  const { theme } = useTheme();

  return (
    <Card 
      className={`
        transition-all duration-300 ease-out
        hover:scale-[1.02] hover:shadow-xl
        hover:shadow-primary/20
        relative overflow-hidden
        backdrop-blur-lg
        ${theme === 'dark' 
          ? 'border-white/10 bg-black/40 hover:bg-black/50 hover:border-white/20' 
          : 'border-black/10 bg-white/90 hover:bg-white/95 hover:border-black/20'
        }
        before:absolute before:inset-0 
        before:bg-gradient-to-br 
        before:from-primary/5 before:to-transparent 
        before:opacity-0 hover:before:opacity-100
        before:transition-opacity before:duration-300
        ${className}
      `}
      {...props}
    >
      <div className="relative z-10">
        {children}
      </div>
    </Card>
  );
};

export default MagicCard;