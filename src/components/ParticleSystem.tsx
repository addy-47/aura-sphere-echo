
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
}

const ParticleSystem: React.FC<ParticleSystemProps> = ({ 
  count = 1000, 
  size = 0.02, 
  opacity = 0.6,
  speed = 0.05,
  range = 20
}) => {
  const mesh = useRef<THREE.Points>(null);
  const { theme } = useTheme();
  
  const particlesPosition = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * range;
      positions[i * 3 + 1] = (Math.random() - 0.5) * range;
      positions[i * 3 + 2] = (Math.random() - 0.5) * range;
    }
    return positions;
  }, [count, range]);

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
        color={theme === 'dark' ? '#00ffff' : '#333333'}
        transparent
        opacity={opacity}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

export default ParticleSystem;
