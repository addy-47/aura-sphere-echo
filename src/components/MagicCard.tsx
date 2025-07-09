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
        group relative overflow-hidden
        transition-all duration-500 ease-out
        hover:scale-[1.03] active:scale-[0.98]
        backdrop-blur-xl
        ${theme === 'dark' 
          ? 'border-white/20 bg-black/60 hover:bg-black/70 hover:border-white/30' 
          : 'border-gray-200/50 bg-white/80 hover:bg-white/90 hover:border-gray-300/60'
        }
        hover:shadow-2xl hover:shadow-black/20
        before:absolute before:inset-0 
        before:bg-gradient-to-br before:from-white/10 before:via-transparent before:to-black/5
        before:opacity-0 before:transition-all before:duration-500
        hover:before:opacity-100
        after:absolute after:inset-0 after:rounded-lg
        after:bg-gradient-to-r after:from-transparent after:via-white/5 after:to-transparent
        after:translate-x-[-100%] after:transition-transform after:duration-700
        hover:after:translate-x-[100%]
        ${className}
      `}
      {...props}
    >
      <div className="relative z-10 transition-transform duration-300 group-hover:translate-y-[-1px]">
        {children}
      </div>
    </Card>
  );
};

export default MagicCard;