
import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTheme } from '../contexts/ThemeContext';
import * as THREE from 'three';

interface ParticleSystemProps {
  count?: number;
  size?: number;
  opacity?: number;
  speed?: number;
  range?: number;
  excludeSphere?: boolean;
}

const ParticleSystem: React.FC<ParticleSystemProps> = ({ 
  count = 1000, 
  size = 0.02, 
  opacity = 0.6,
  speed = 0.05,
  range = 20,
  excludeSphere = true
}) => {
  const mesh = useRef<THREE.Points>(null);
  const { theme } = useTheme();
  
  const particlesPosition = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      let x, y, z, distance;
      
      do {
        x = (Math.random() - 0.5) * range;
        y = (Math.random() - 0.5) * range;
        z = (Math.random() - 0.5) * range;
        distance = Math.sqrt(x * x + y * y + z * z);
      } while (excludeSphere && distance < 2.0);
      
      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
    }
    return positions;
  }, [count, range, excludeSphere]);

  useFrame(({ clock }) => {
    if (mesh.current) {
      mesh.current.rotation.x = clock.getElapsedTime() * speed;
      mesh.current.rotation.y = clock.getElapsedTime() * (speed * 0.6);
    }
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particlesPosition.length / 3}
          array={particlesPosition}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={size}
        color={theme === 'dark' ? '#ffffff' : '#000000'}
        transparent
        opacity={opacity}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

export default ParticleSystem;
