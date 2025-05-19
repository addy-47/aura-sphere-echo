
import React, { useRef, useEffect, useState, useMemo } from 'react';
import { Canvas, useFrame, extend } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useMood } from '../contexts/MoodContext';
import * as THREE from 'three';

// Explicitly extend Three.js with R3F
extend({ THREE });

interface SphereProps {
  isProcessing: boolean;
}

// The actual 3D sphere component within the Canvas
const AnimatedSphere = ({ isProcessing }: SphereProps) => {
  const sphereRef = useRef<THREE.Mesh>(null);
  const { moodColor, mood } = useMood();
  
  // Create animated gradients using shader materials
  const uniforms = useMemo(() => ({
    time: { value: 0 },
    resolution: { value: new THREE.Vector2(1, 1) },
    baseColor: { value: new THREE.Color(moodColor) },
    pulseIntensity: { value: isProcessing ? 1.0 : 0.5 },
    isDark: { value: true }
  }), [moodColor, isProcessing]);
  
  // Custom vertex and fragment shaders for gradient effects
  const vertexShader = `
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vPosition;
    
    void main() {
      vUv = uv;
      vNormal = normalize(normalMatrix * normal);
      vPosition = position;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

  const fragmentShader = `
    uniform float time;
    uniform vec2 resolution;
    uniform vec3 baseColor;
    uniform float pulseIntensity;
    uniform bool isDark;
    
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vPosition;
    
    // Simple noise function
    float noise(vec3 p) {
      return fract(sin(dot(p, vec3(12.9898, 78.233, 45.5432))) * 43758.5453);
    }
    
    void main() {
      // Create a sleek, glass-like sphere with subtle refraction
      vec3 normal = normalize(vNormal);
      
      // Create reflection effect
      float fresnel = pow(1.0 - max(dot(normal, vec3(0.0, 0.0, 1.0)), 0.0), 5.0);
      
      // Create glossy effect
      vec3 viewDir = normalize(vec3(0.0, 0.0, 1.0) - vPosition);
      vec3 lightDir = normalize(vec3(1.0, 1.0, 1.0));
      vec3 halfwayDir = normalize(lightDir + viewDir);
      float specular = pow(max(dot(normal, halfwayDir), 0.0), 64.0);
      
      // Create subtle environment texture
      float noiseVal = noise(vNormal * 5.0 + time * 0.1) * 0.1;
      
      // Create colorful bands based on angle
      float angle = atan(vPosition.y, vPosition.x);
      float rings = sin(angle * 10.0 + time) * 0.1 + 0.9;
      
      // Create subtle waves
      float waves = sin(vPosition.y * 20.0 + time) * 0.05 + 0.95;
      
      // Create gradient based on position
      float yGradient = vPosition.y * 0.5 + 0.5;
      
      // Final color calculation
      vec3 glassColor = vec3(0.9, 0.95, 1.0); // Slight blue tint for glass
      
      // Blend black and white with slight color tint
      vec3 finalColor;
      if (isDark) {
        // Dark mode (like image)
        finalColor = mix(
          vec3(0.1, 0.1, 0.15), // Deep blue-black
          vec3(0.9, 0.95, 1.0), // Bright white-blue
          fresnel * rings * waves
        );
      } else {
        // Light mode
        finalColor = mix(
          vec3(0.8, 0.85, 0.9), // Light gray-blue
          vec3(1.0, 1.0, 1.0), // Pure white
          fresnel * rings * waves
        );
      }
      
      // Add subtle color tint based on mood
      finalColor = mix(finalColor, baseColor, 0.05);
      
      // Add specular highlight
      finalColor += vec3(specular) * 0.3;
      
      // Add subtle noise texture
      finalColor *= (1.0 - noiseVal);
      
      // Create a smooth glass edge effect
      float edge = 1.0 - abs(dot(normal, vec3(0.0, 0.0, 1.0)));
      edge = smoothstep(0.3, 1.0, edge);
      
      // Create glow around the edge
      vec3 edgeGlow = mix(baseColor, vec3(1.0), 0.5) * edge * 0.5;
      finalColor += edgeGlow;
      
      // Final output
      gl_FragColor = vec4(finalColor, 0.9); // Slightly transparent
    }
  `;

  // Update the time uniform on each frame
  useFrame(({ clock }) => {
    if (!sphereRef.current) return;
    
    // Base subtle rotation
    sphereRef.current.rotation.x = clock.getElapsedTime() * 0.1;
    sphereRef.current.rotation.y = clock.getElapsedTime() * 0.15;
    
    // Update shader uniforms
    uniforms.time.value = clock.getElapsedTime();
    uniforms.pulseIntensity.value = isProcessing 
      ? 0.8 + Math.sin(clock.getElapsedTime() * 5) * 0.2 
      : 0.5 + Math.sin(clock.getElapsedTime() * 0.5) * 0.1;
    
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

  return (
    <mesh ref={sphereRef}>
      <sphereGeometry args={[1, 128, 128]} />
      <shaderMaterial 
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent={true}
      />
      
      {/* Additional outer glow sphere */}
      <mesh>
        <sphereGeometry args={[1.02, 32, 32]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#ffffff"
          emissiveIntensity={0.2}
          transparent={true}
          opacity={0.1}
        />
      </mesh>
    </mesh>
  );
};

// Fallback component for when the 3D scene is loading
const Fallback = () => (
  <div className="w-full h-full flex items-center justify-center">
    <div className="text-center p-4">Loading 3D visualization...</div>
  </div>
);

// Simple error boundary for Three.js rendering issues
class ThreeErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean}> {
  constructor(props: {children: React.ReactNode}) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <div className="text-center p-4 text-red-500">Failed to load 3D visualization</div>;
    }
    return this.props.children;
  }
}

// Main component that wraps the Canvas and the sphere
const Sphere3D: React.FC<SphereProps> = ({ isProcessing }) => {
  // Make sure THREE is accessible on window
  useEffect(() => {
    if (!window.THREE) {
      window.THREE = THREE;
      console.log("THREE initialized in component:", THREE.REVISION);
    }
  }, []);

  return (
    <div className="w-full h-full min-h-[300px]">
      <ThreeErrorBoundary>
        <Canvas 
          camera={{ position: [0, 0, 3.5], fov: 50 }}
          dpr={[1, 2]} 
          gl={{ 
            antialias: true,
            powerPreference: 'default',
            failIfMajorPerformanceCaveat: false,
            alpha: true
          }}
        >
          {/* Dark environment for reflection */}
          <color attach="background" args={['#000000']} />
          
          {/* Subtle lighting */}
          <ambientLight intensity={0.2} />
          <pointLight position={[10, 10, 10]} intensity={0.5} />
          <pointLight position={[-10, -10, -5]} intensity={0.2} color="#3366ff" />
          
          <AnimatedSphere isProcessing={isProcessing} />
          
          <OrbitControls 
            enableZoom={false}
            enablePan={false}
            rotateSpeed={0.5}
            autoRotate
            autoRotateSpeed={0.5}
          />
        </Canvas>
      </ThreeErrorBoundary>
    </div>
  );
};

export default Sphere3D;
