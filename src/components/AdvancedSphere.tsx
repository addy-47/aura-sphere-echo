
import React, { useRef, useEffect, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useTheme } from '../contexts/ThemeContext';
import { useMood } from '../contexts/MoodContext';
import { OrbitControls, GradientTexture } from '@react-three/drei';
import * as THREE from 'three';
import { useSpring, animated, config } from '@react-spring/three';
// Using simplex-noise package
import { createNoise3D } from 'simplex-noise';

// Character animation mappings
type AnimationPattern = {
  frequency: number;
  amplitude: number;
  phase: number;
  distortion: number;
  rotation: [number, number, number];
  pulseSpeed: number;
};

interface AdvancedSphereProps {
  text?: string;
  isProcessing?: boolean;
  size?: number;
  intensity?: number;
}

// Custom hook for character-specific animations
const useCharacterAnimations = () => {
  // Create animation patterns for all letters, numbers, and special chars
  const createBaseAnimations = () => {
    const patterns: Record<string, AnimationPattern> = {};
    
    // Letters (a-z)
    for (let i = 97; i <= 122; i++) {
      const char = String.fromCharCode(i);
      patterns[char] = {
        frequency: 0.5 + (i - 97) * 0.1,
        amplitude: 0.2 + (i - 97) * 0.01,
        phase: (i - 97) * 0.2,
        distortion: 0.2 + (i - 97) * 0.03,
        rotation: [0.01 * (i % 5), 0.01 * ((i + 2) % 5), 0.01 * ((i + 4) % 5)],
        pulseSpeed: 0.5 + (i - 97) * 0.1
      };
    }
    
    // Numbers (0-9)
    for (let i = 0; i <= 9; i++) {
      patterns[i.toString()] = {
        frequency: 1 + i * 0.2,
        amplitude: 0.4 + i * 0.02,
        phase: i * 0.3,
        distortion: 0.4 + i * 0.05,
        rotation: [0.02 * (i % 3), 0.02 * ((i + 1) % 3), 0.02 * ((i + 2) % 3)],
        pulseSpeed: 1 + i * 0.2
      };
    }
    
    // Special characters
    const specials = '!@#$%^&*()_+-=[]{}|;:\'",.<>/?\\~`';
    for (let i = 0; i < specials.length; i++) {
      patterns[specials[i]] = {
        frequency: 1.5 + (i % 5) * 0.3,
        amplitude: 0.6 + (i % 5) * 0.03,
        phase: (i % 8) * 0.4,
        distortion: 0.6 + (i % 7) * 0.05,
        rotation: [0.03 * (i % 4), 0.03 * ((i + 2) % 4), 0.03 * ((i + 3) % 4)],
        pulseSpeed: 1.5 + (i % 6) * 0.25
      };
    }
    
    // Space character
    patterns[' '] = {
      frequency: 0.2,
      amplitude: 0.1,
      phase: 0,
      distortion: 0.05,
      rotation: [0.001, 0.001, 0.001],
      pulseSpeed: 0.2
    };

    return patterns;
  };

  return useMemo(() => createBaseAnimations(), []);
};

// The actual 3D sphere component
const AnimatedSphere = ({ text = '', isProcessing = false, intensity = 1 }: AdvancedSphereProps) => {
  const sphereRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);
  const noiseRef = useRef<{ noise3d: (x: number, y: number, z: number) => number }>();
  const { theme } = useTheme();
  const { moodColor, mood } = useMood();
  const characterAnimations = useCharacterAnimations();
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [animationParams, setAnimationParams] = useState<AnimationPattern>({
    frequency: 0.5,
    amplitude: 0.2,
    phase: 0,
    distortion: 0.2,
    rotation: [0.01, 0.01, 0.01],
    pulseSpeed: 0.5
  });

  // Initialize simplex noise for organic movement
  useEffect(() => {
    const noise3D = createNoise3D();
    noiseRef.current = {
      noise3d: (x: number, y: number, z: number) => noise3D(x, y, z)
    };
    
    // Character animation timing
    const interval = setInterval(() => {
      if (text && text.length > 0) {
        setCurrentCharIndex((prevIndex) => (prevIndex + 1) % text.length);
      }
    }, 300);
    
    return () => clearInterval(interval);
  }, [text]);

  // Update animation parameters based on the current character
  useEffect(() => {
    if (!text || text.length === 0) return;
    
    const currentChar = text[currentCharIndex].toLowerCase();
    const params = characterAnimations[currentChar] || characterAnimations['a'];
    
    setAnimationParams(params);
  }, [currentCharIndex, characterAnimations, text]);

  // Calculate emission intensity based on mood
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

  // Spring animation for smooth transitions between states
  const { scale, emissiveIntensity } = useSpring({
    scale: isProcessing ? [1.05, 1.05, 1.05] : [1, 1, 1],
    emissiveIntensity: getEmissiveIntensity(),
    config: config.gentle
  });

  // Frame animation loop
  useFrame(({ clock }) => {
    if (!sphereRef.current || !noiseRef.current) return;
    
    const time = clock.getElapsedTime();
    const { frequency, amplitude, phase, distortion, rotation, pulseSpeed } = animationParams;
    
    // Apply character-specific rotation
    sphereRef.current.rotation.x += rotation[0] * intensity;
    sphereRef.current.rotation.y += rotation[1] * intensity;
    sphereRef.current.rotation.z += rotation[2] * intensity;
    
    // Add slight position jitter based on character
    sphereRef.current.position.x = Math.sin(time * frequency) * amplitude * 0.1;
    sphereRef.current.position.y = Math.cos(time * frequency * 1.3) * amplitude * 0.1;
    
    // Update material properties for glow effect
    if (materialRef.current) {
      materialRef.current.emissiveIntensity = emissiveIntensity.get();
      materialRef.current.needsUpdate = true;
    }
  });

  // Complex gradient colors based on mood
  const sphereColors = useMemo(() => {
    const baseColor = theme === 'dark' ? '#1a1a1a' : '#1a1a1a';
    const gradientColors = [
      moodColor,
      moodColor + '99',
      moodColor + '66',
      moodColor + '33',
      '#000000'
    ];
    
    return {
      baseColor,
      gradientColors
    };
  }, [moodColor, theme]);

  return (
    <animated.mesh 
      ref={sphereRef} 
      scale={scale as any}
    >
      {/* Main sphere */}
      <sphereGeometry args={[1, 64, 64]} />
      
      {/* Advanced material with animated properties */}
      <animated.meshStandardMaterial
        ref={materialRef}
        color={sphereColors.baseColor}
        emissive={moodColor}
        emissiveIntensity={emissiveIntensity}
        wireframe={mood === 'sad'}
        transparent={true}
        opacity={0.9}
      >
        <GradientTexture
          stops={[0, 0.2, 0.4, 0.6, 1]}
          colors={sphereColors.gradientColors}
          size={256}
          attach="emissiveMap"
        />
      </animated.meshStandardMaterial>
      
      {/* Inner glow sphere for depth effect */}
      <mesh scale={[0.96, 0.96, 0.96]}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial 
          color={moodColor}
          opacity={0.2}
          transparent={true}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      
      {/* Atmosphere effect */}
      <mesh scale={[1.2, 1.2, 1.2]}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial 
          color={moodColor}
          opacity={0.05}
          transparent={true}
          blending={THREE.AdditiveBlending}
          side={THREE.BackSide}
        />
      </mesh>
    </animated.mesh>
  );
};

// Main component that wraps the Canvas and the sphere
const AdvancedSphere: React.FC<AdvancedSphereProps> = ({ text = '', isProcessing = false, size = 1, intensity = 1 }) => {
  const { theme } = useTheme();
  const [hasRenderedOnce, setHasRenderedOnce] = useState(false);

  useEffect(() => {
    // Ensure THREE is accessible globally
    if (typeof window !== 'undefined' && !window.THREE) {
      window.THREE = THREE;
      console.log("THREE initialized in AdvancedSphere component:", THREE.REVISION);
    }
    
    // Mark the component as having rendered once
    setHasRenderedOnce(true);
  }, []);

  // Error boundary for Three.js rendering issues
  class ThreeErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean}> {
    constructor(props: {children: React.ReactNode}) {
      super(props);
      this.state = { hasError: false };
    }

    static getDerivedStateFromError() {
      return { hasError: true };
    }

    componentDidCatch(error: any, errorInfo: any) {
      console.error("Three.js Error:", error, errorInfo);
    }

    render() {
      if (this.state.hasError) {
        return <div className="text-center p-4 text-red-500">Failed to load 3D visualization</div>;
      }
      return this.props.children;
    }
  }

  return (
    <div className="w-full h-full min-h-[300px]">
      <ThreeErrorBoundary>
        {hasRenderedOnce && (
          <Canvas 
            camera={{ position: [0, 0, 3.5], fov: 50 }}
            dpr={[1, 2]} 
            gl={{ 
              antialias: true,
              powerPreference: 'default',
              alpha: true,
              depth: true
            }}
          >
            {/* Enhanced lighting setup */}
            <ambientLight intensity={0.4} />
            <pointLight position={[10, 10, 10]} intensity={0.6} />
            <pointLight position={[-10, -10, -10]} intensity={0.4} />
            <spotLight position={[5, 5, 5]} intensity={0.6} angle={0.5} penumbra={1} />
            
            {/* The main animated sphere */}
            <AnimatedSphere text={text} isProcessing={isProcessing} intensity={intensity} />
            
            {/* Enhanced controls with configurable params */}
            <OrbitControls 
              enableZoom={false}
              enablePan={false}
              rotateSpeed={0.4}
              autoRotate
              autoRotateSpeed={0.3}
              maxPolarAngle={Math.PI * 0.7}
              minPolarAngle={Math.PI * 0.3}
            />
          </Canvas>
        )}
        {!hasRenderedOnce && (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center p-4">Loading advanced visualization...</div>
          </div>
        )}
      </ThreeErrorBoundary>
    </div>
  );
};

export default AdvancedSphere;
