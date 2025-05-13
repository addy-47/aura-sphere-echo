
import React, { useRef, useEffect, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useMood } from '../contexts/MoodContext';
import * as THREE from 'three';

interface SphereProps {
  isProcessing: boolean;
}

// This is the actual 3D sphere component within the Canvas
const AnimatedSphere = ({ isProcessing }: SphereProps) => {
  const sphereRef = useRef<THREE.Mesh>(null);
  const { moodColor, mood } = useMood();
  
  // Animation logic for the sphere
  useFrame(({ clock }) => {
    if (!sphereRef.current) return;
    
    // Base subtle rotation
    sphereRef.current.rotation.x = clock.getElapsedTime() * 0.1;
    sphereRef.current.rotation.y = clock.getElapsedTime() * 0.15;
    
    // If processing, add pulsing effect
    if (isProcessing) {
      const pulse = Math.sin(clock.getElapsedTime() * 5) * 0.05 + 1;
      sphereRef.current.scale.set(pulse, pulse, pulse);
    } else {
      // Subtle breathing animation when idle
      const breathe = Math.sin(clock.getElapsedTime() * 0.5) * 0.02 + 1;
      sphereRef.current.scale.set(breathe, breathe, breathe);
    }
  });

  // Determine emission intensity based on mood and processing state
  const getEmissiveIntensity = () => {
    if (isProcessing) return 1.5;
    
    switch(mood) {
      case 'excited': return 1.2;
      case 'happy': return 0.8;
      case 'angry': return 1.0;
      case 'sad': return 0.4;
      default: return 0.6;
    }
  };

  return (
    <mesh ref={sphereRef}>
      <sphereGeometry args={[1, 64, 64]} />
      <meshStandardMaterial 
        color={moodColor}
        emissive={moodColor}
        emissiveIntensity={getEmissiveIntensity()}
        roughness={0.2}
        metalness={0.8}
        wireframe={mood === 'sad' || mood === 'neutral'}
      />
    </mesh>
  );
};

// This is the main component that wraps the Canvas and the sphere
const Sphere3D: React.FC<SphereProps> = ({ isProcessing }) => {
  // Use effect to initialize THREE globally
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.THREE = THREE;
      // Force initialization of THREE modules
      console.log("THREE initialized:", !!window.THREE);
    }
  }, []);
  
  return (
    <div className="w-full h-full min-h-[300px]">
      <Suspense fallback={<div className="text-center p-4">Loading 3D scene...</div>}>
        <Canvas 
          camera={{ position: [0, 0, 3.5], fov: 50 }}
          dpr={[1, 2]} 
          gl={{ 
            antialias: true,
            powerPreference: 'default',
            failIfMajorPerformanceCaveat: false
          }}
          onCreated={({ gl }) => {
            gl.setClearColor(0x000000, 0);
          }}
        >
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          <pointLight position={[-10, -10, -5]} intensity={0.5} />
          
          <AnimatedSphere isProcessing={isProcessing} />
          
          <OrbitControls 
            enableZoom={false}
            enablePan={false}
            rotateSpeed={0.5}
            autoRotate
            autoRotateSpeed={0.5}
          />
        </Canvas>
      </Suspense>
    </div>
  );
};

export default Sphere3D;
