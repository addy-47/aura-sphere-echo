
import React, { useCallback, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
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
  const meshRef = React.useRef<THREE.Group>(null);
  
  // Rotation animation with useFrame
  useFrame(({ clock }) => {
    if (meshRef.current) {
      const time = clock.getElapsedTime();
      meshRef.current.rotation.y = time * 0.8;
      meshRef.current.rotation.x = Math.sin(time * 0.5) * 0.3;
      // Pulsing scale animation
      const scale = 1 + Math.sin(time * 2) * 0.1;
      meshRef.current.scale.setScalar(scale);
    }
  });
  
  return (
    <group ref={meshRef}>
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
    </group>
  );
};

const LoaderComponent: React.FC<LoaderComponentProps> = ({ isLoading }) => {
  const { theme } = useTheme();

  // Slow fade transition - extended duration for smoother transition
  const containerClasses = useMemo(() => 
    `absolute inset-0 z-10 flex items-center justify-center
     transition-opacity duration-[3000ms] ease-out ${isLoading ? 'opacity-100' : 'opacity-0 pointer-events-none'}`,
    [isLoading]
  );

  // Black background for seamless transition
  const backgroundStyle = useMemo(() => ({
    background: '#000000',
    backdropFilter: 'blur(10px)'
  }), []);

  if (!isLoading) return null;

  return (
    <div className={containerClasses}>
      <div 
        className="w-full h-full rounded-xl transition-all duration-500"
        style={backgroundStyle}
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
