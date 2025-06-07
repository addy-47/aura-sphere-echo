
import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useTheme } from '../contexts/ThemeContext';
import { useMood } from '../contexts/MoodContext';
import ParticleSystem from './ParticleSystem';
import * as THREE from 'three';

interface LoaderComponentProps {
  isLoading: boolean;
}

const AnimatedLoadingOrb: React.FC = () => {
  const orbRef = useRef<THREE.Group>(null);
  const innerOrbRef = useRef<THREE.Mesh>(null);
  const { theme } = useTheme();
  const { moodColor } = useMood();
  
  useFrame(({ clock }) => {
    if (!orbRef.current || !innerOrbRef.current) return;
    
    const time = clock.getElapsedTime();
    
    // Smooth rotation animation
    orbRef.current.rotation.y = time * 0.5;
    orbRef.current.rotation.x = Math.sin(time * 0.3) * 0.2;
    
    // Pulse animation
    const pulse = 1 + Math.sin(time * 2) * 0.1;
    orbRef.current.scale.set(pulse, pulse, pulse);
    
    // Inner orb counter-rotation
    innerOrbRef.current.rotation.x = -time * 0.3;
    innerOrbRef.current.rotation.z = time * 0.2;
  });
  
  return (
    <group ref={orbRef} scale={[0.7, 0.7, 0.7]}>
      {/* Main orb */}
      <mesh>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshBasicMaterial
          color={theme === 'dark' ? '#000000' : '#ffffff'}
          transparent
          opacity={0.8}
        />
      </mesh>
      
      {/* Animated wireframe */}
      <mesh ref={innerOrbRef} scale={[1.1, 1.1, 1.1]}>
        <sphereGeometry args={[0.5, 16, 16]} />
        <meshBasicMaterial
          color={moodColor}
          transparent
          opacity={0.6}
          wireframe
        />
      </mesh>
      
      {/* Outer glow ring */}
      <mesh scale={[1.3, 1.3, 1.3]}>
        <ringGeometry args={[0.4, 0.5, 32]} />
        <meshBasicMaterial
          color={moodColor}
          transparent
          opacity={0.3}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
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
          background: '#000000', // Pure black background
          backdropFilter: 'blur(10px)'
        }}
      >
        <Canvas 
          camera={{ position: [0, 0, 3], fov: 45 }}
          gl={{ alpha: true, antialias: true }}
          dpr={[1, Math.min(window.devicePixelRatio, 2)]}
        >
          <color attach="background" args={['#000000']} />
          <ambientLight intensity={0.3} />
          <pointLight position={[2, 2, 2]} intensity={0.5} />
          
          <ParticleSystem 
            count={300} 
            size={0.015} 
            opacity={0.4} 
            speed={0.08} 
            range={10} 
            excludeSphere={true}
          />
          <AnimatedLoadingOrb />
        </Canvas>
        
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center">
          <div className="animate-pulse">
            <div className="text-sm opacity-70 text-white">Initializing Neural Interface...</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoaderComponent;
