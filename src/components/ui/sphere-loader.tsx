
import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { Skeleton } from './skeleton';

interface SphereLoaderProps {
  className?: string;
}

const SphereLoader: React.FC<SphereLoaderProps> = ({ className = '' }) => {
  const { theme } = useTheme();

  return (
    <div className={`w-full h-full min-h-[300px] relative overflow-hidden ${className}`}>
      {/* Background matching the sphere container */}
      <div 
        className="absolute inset-0 rounded-lg"
        style={{ 
          backgroundColor: theme === 'light' ? '#2a2a2a' : '#1a1a1a',
          opacity: 0.8 
        }}
      />
      
      {/* Central loading sphere skeleton */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative">
          {/* Main sphere skeleton */}
          <Skeleton 
            className="w-32 h-32 rounded-full animate-pulse"
            style={{
              backgroundColor: theme === 'light' ? '#404040' : '#333333'
            }}
          />
          
          {/* Pulsing ring effect */}
          <div 
            className="absolute inset-0 rounded-full animate-ping"
            style={{
              border: `2px solid ${theme === 'light' ? '#606060' : '#555555'}`,
              animationDuration: '2s'
            }}
          />
          
          {/* Inner glow */}
          <div 
            className="absolute inset-2 rounded-full animate-pulse"
            style={{
              backgroundColor: theme === 'light' ? '#505050' : '#444444',
              opacity: 0.6,
              animationDelay: '0.5s'
            }}
          />
        </div>
      </div>
      
      {/* Floating particles skeleton */}
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 rounded-full animate-pulse"
          style={{
            backgroundColor: theme === 'light' ? '#606060' : '#555555',
            left: `${20 + (i * 10)}%`,
            top: `${30 + (i % 3) * 20}%`,
            animationDelay: `${i * 0.2}s`,
            animationDuration: '1.5s'
          }}
        />
      ))}
      
      {/* UI overlay matching the sphere */}
      <div className="absolute inset-0 pointer-events-none">
        <div 
          className="absolute top-4 left-4 text-xs font-mono opacity-30"
          style={{ color: theme === 'light' ? '#666' : '#fff' }}
        >
          NEURAL_CORE_v2.0
        </div>
        <div 
          className="absolute bottom-4 right-4 text-xs font-mono opacity-30"
          style={{ color: theme === 'light' ? '#666' : '#fff' }}
        >
          LOADING...
        </div>
        <div 
          className={`absolute top-4 right-4 w-2 h-2 rounded-full animate-pulse ${
            theme === 'light' ? 'bg-gray-600' : 'bg-white'
          } opacity-40`}
        />
      </div>
      
      {/* Loading text */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <div 
          className="text-sm font-medium opacity-70"
          style={{ color: theme === 'light' ? '#666' : '#fff' }}
        >
          Initializing Neural Interface...
        </div>
      </div>
    </div>
  );
};

export { SphereLoader };
