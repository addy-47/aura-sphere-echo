
import React, { useRef, useEffect, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useTheme } from '../contexts/ThemeContext';
import { useMood } from '../contexts/MoodContext';
import * as THREE from 'three';

interface GlassSphereProps {
  isProcessing?: boolean;
}

// The actual 3D sphere component within the Canvas
const AnimatedGlassSphere = ({ isProcessing = false }: GlassSphereProps) => {
  const sphereRef = useRef<THREE.Mesh>(null);
  const { theme } = useTheme();
  const { moodColor } = useMood();
  
  // Create shader uniforms for the glass effect
  const uniforms = useMemo(() => ({
    time: { value: 0 },
    isDark: { value: theme === 'dark' },
    glowColor: { value: new THREE.Color('#4a9eff') }, // Blue glow like in image
    rimColor: { value: new THREE.Color('#87ceeb') }, // Light blue rim
    opacity: { value: 0.15 },
    rimPower: { value: 2.0 },
    glowIntensity: { value: isProcessing ? 0.8 : 0.4 }
  }), [theme, isProcessing]);
  
  // Custom vertex shader
  const vertexShader = `
    varying vec3 vNormal;
    varying vec3 vViewPosition;
    varying vec2 vUv;
    
    void main() {
      vUv = uv;
      vNormal = normalize(normalMatrix * normal);
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      vViewPosition = -mvPosition.xyz;
      gl_Position = projectionMatrix * mvPosition;
    }
  `;

  // Custom fragment shader for glass effect
  const fragmentShader = `
    uniform float time;
    uniform bool isDark;
    uniform vec3 glowColor;
    uniform vec3 rimColor;
    uniform float opacity;
    uniform float rimPower;
    uniform float glowIntensity;
    
    varying vec3 vNormal;
    varying vec3 vViewPosition;
    varying vec2 vUv;
    
    void main() {
      vec3 normal = normalize(vNormal);
      vec3 viewDir = normalize(vViewPosition);
      
      // Fresnel effect for rim lighting
      float fresnel = 1.0 - abs(dot(normal, viewDir));
      fresnel = pow(fresnel, rimPower);
      
      // Create the glass base color (very dark with slight transparency)
      vec3 baseColor = vec3(0.02, 0.02, 0.05); // Almost black like in image
      
      // Rim lighting effect
      vec3 rimLight = rimColor * fresnel * glowIntensity;
      
      // Subtle internal glow
      float centerGlow = 1.0 - length(vUv - 0.5) * 2.0;
      centerGlow = smoothstep(0.3, 1.0, centerGlow) * 0.1;
      
      // Final color combining base, rim light, and subtle glow
      vec3 finalColor = baseColor + rimLight + (glowColor * centerGlow);
      
      // Enhanced rim opacity
      float finalOpacity = opacity + fresnel * 0.6;
      
      gl_FragColor = vec4(finalColor, finalOpacity);
    }
  `;

  // Update uniforms and animation
  useFrame(({ clock }) => {
    if (!sphereRef.current) return;
    
    // Very subtle rotation
    sphereRef.current.rotation.y = clock.getElapsedTime() * 0.05;
    
    // Update shader uniforms
    uniforms.time.value = clock.getElapsedTime();
    uniforms.isDark.value = theme === 'dark';
    uniforms.glowIntensity.value = isProcessing 
      ? 0.8 + Math.sin(clock.getElapsedTime() * 3) * 0.2 
      : 0.4;
  });

  return (
    <group>
      {/* Main glass sphere */}
      <mesh ref={sphereRef}>
        <sphereGeometry args={[1, 128, 128]} />
        <shaderMaterial 
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={uniforms}
          transparent={true}
          side={THREE.DoubleSide}
        />
      </mesh>
      
      {/* Outer glow ring effect */}
      <mesh scale={[1.02, 1.02, 1.02]}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshBasicMaterial
          color="#4a9eff"
          transparent={true}
          opacity={0.08}
          side={THREE.BackSide}
        />
      </mesh>
      
      {/* Very subtle inner reflection */}
      <mesh scale={[0.98, 0.98, 0.98]}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial
          color="#87ceeb"
          transparent={true}
          opacity={0.03}
        />
      </mesh>
    </group>
  );
};

// Error boundary for Three.js rendering issues
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
      return <div className="text-center p-4 text-red-500">Failed to load sphere visualization</div>;
    }
    return this.props.children;
  }
}

// Main component that wraps the Canvas and the sphere
const GlassSphere: React.FC<GlassSphereProps> = ({ isProcessing = false }) => {
  const { theme } = useTheme();

  useEffect(() => {
    // Ensure THREE is accessible globally
    if (typeof window !== 'undefined' && !window.THREE) {
      window.THREE = THREE;
    }
  }, []);

  return (
    <div className="w-full h-full min-h-[300px]">
      <ThreeErrorBoundary>
        <Canvas 
          camera={{ position: [0, 0, 3], fov: 50 }}
          dpr={[1, 2]} 
          gl={{ 
            antialias: true,
            alpha: true,
            powerPreference: 'default'
          }}
        >
          {/* Dark background like in the image */}
          <color attach="background" args={[theme === 'dark' ? '#0a0a0a' : '#1a1a1a']} />
          
          {/* Minimal lighting to preserve the dark glass effect */}
          <ambientLight intensity={0.1} />
          <pointLight position={[5, 5, 5]} intensity={0.2} color="#4a9eff" />
          
          <AnimatedGlassSphere isProcessing={isProcessing} />
          
          <OrbitControls 
            enableZoom={false}
            enablePan={false}
            rotateSpeed={0.3}
            autoRotate
            autoRotateSpeed={0.2}
          />
        </Canvas>
      </ThreeErrorBoundary>
    </div>
  );
};

export default GlassSphere;
