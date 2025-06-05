
import React from 'react';
import { Canvas } from '@react-three/fiber';
import { useTheme } from '../contexts/ThemeContext';
import { useMood } from '../contexts/MoodContext';
import ParticleSystem from './ParticleSystem';
import * as THREE from 'three';

interface LoaderComponentProps {
  isLoading: boolean;
}

const LoadingOrb: React.FC = () => {
  const { theme } = useTheme();
  const { moodColor } = useMood();
  
  return (
    <mesh>
      <sphereGeometry args={[0.5, 32, 32]} />
      <meshBasicMaterial
        color={theme === 'dark' ? '#000000' : '#ffffff'}
        transparent
        opacity={0.8}
      />
      <mesh scale={[1.1, 1.1, 1.1]}>
        <sphereGeometry args={[0.5, 16, 16]} />
        <meshBasicMaterial
          color={moodColor}
          transparent
          opacity={0.3}
          wireframe
        />
      </mesh>
    </mesh>
  );
};

const LoaderComponent: React.FC<LoaderComponentProps> = ({ isLoading }) => {
  const { theme } = useTheme();

  if (!isLoading) return null;

  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center">
      <div 
        className="w-full h-full rounded-xl transition-all duration-500"
        style={{ 
          background: theme === 'dark' ? 'rgba(0, 0, 0, 0.9)' : 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(10px)'
        }}
      >
        <Canvas 
          camera={{ position: [0, 0, 3], fov: 45 }}
          gl={{ alpha: true, antialias: true }}
        >
          <color attach="background" args={[theme === 'dark' ? '#000005' : '#f8f9fa']} />
          <ambientLight intensity={0.3} />
          <pointLight position={[2, 2, 2]} intensity={0.5} />
          
          <ParticleSystem count={300} size={0.015} opacity={0.4} speed={0.08} range={10} />
          <LoadingOrb />
        </Canvas>
        
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center">
          <div className="animate-pulse">
            <div className="text-sm opacity-70">Initializing Neural Interface...</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoaderComponent;
