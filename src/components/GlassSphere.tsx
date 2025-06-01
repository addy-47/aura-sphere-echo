
import React, { useRef, useEffect, useMemo, useState } from 'react';
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
  const groupRef = useRef<THREE.Group>(null);
  const { theme } = useTheme();
  const { moodColor } = useMood();
  const [isHovered, setIsHovered] = useState(false);
  
  // Create shader uniforms for the glass effect
  const uniforms = useMemo(() => ({
    time: { value: 0 },
    isDark: { value: theme === 'dark' },
    glowColor: { value: new THREE.Color('#ffffff') }, // White glow
    rimColor: { value: new THREE.Color('#e0e0e0') }, // Light gray rim
    baseColor: { value: new THREE.Color(theme === 'dark' ? '#020205' : '#f5f5f5') },
    opacity: { value: theme === 'dark' ? 0.15 : 0.8 },
    rimPower: { value: 2.0 },
    glowIntensity: { value: isProcessing ? 0.8 : 0.4 },
    isHovered: { value: isHovered ? 1.0 : 0.0 }
  }), [theme, isProcessing, isHovered]);
  
  // Custom vertex shader
  const vertexShader = `
    varying vec3 vNormal;
    varying vec3 vViewPosition;
    varying vec2 vUv;
    varying vec3 vWorldPosition;
    
    void main() {
      vUv = uv;
      vNormal = normalize(normalMatrix * normal);
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      vViewPosition = -mvPosition.xyz;
      vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
      gl_Position = projectionMatrix * mvPosition;
    }
  `;

  // Custom fragment shader for glass effect
  const fragmentShader = `
    uniform float time;
    uniform bool isDark;
    uniform vec3 glowColor;
    uniform vec3 rimColor;
    uniform vec3 baseColor;
    uniform float opacity;
    uniform float rimPower;
    uniform float glowIntensity;
    uniform float isHovered;
    
    varying vec3 vNormal;
    varying vec3 vViewPosition;
    varying vec2 vUv;
    varying vec3 vWorldPosition;
    
    void main() {
      vec3 normal = normalize(vNormal);
      vec3 viewDir = normalize(vViewPosition);
      
      // Fresnel effect for rim lighting
      float fresnel = 1.0 - abs(dot(normal, viewDir));
      fresnel = pow(fresnel, rimPower);
      
      // Enhanced fresnel for hover effect
      float hoverFresnel = fresnel * (1.0 + isHovered * 0.5);
      
      // Subtle noise pattern for glass texture
      float noise = sin(vWorldPosition.x * 10.0 + time) * 0.02 + 
                   sin(vWorldPosition.y * 15.0 + time * 0.8) * 0.02 +
                   sin(vWorldPosition.z * 12.0 + time * 0.6) * 0.02;
      
      // Glass base color with slight variation
      vec3 finalBaseColor = baseColor + vec3(noise);
      
      // Enhanced rim lighting with white glow
      vec3 rimLight = glowColor * hoverFresnel * (glowIntensity + isHovered * 0.3);
      
      // Subtle internal glow
      float centerGlow = 1.0 - length(vUv - 0.5) * 2.0;
      centerGlow = smoothstep(0.3, 1.0, centerGlow) * 0.15;
      
      // Pulsing effect when processing
      float pulse = 1.0 + sin(time * 3.0) * 0.1;
      
      // Final color combining base, rim light, and glow
      vec3 finalColor = finalBaseColor + (rimLight * pulse) + (glowColor * centerGlow);
      
      // Enhanced opacity with hover effect
      float finalOpacity = opacity + hoverFresnel * 0.6 + isHovered * 0.2;
      
      gl_FragColor = vec4(finalColor, finalOpacity);
    }
  `;

  // Update uniforms and animation
  useFrame(({ clock }) => {
    if (!sphereRef.current || !groupRef.current) return;
    
    // Continuous random rotation
    const time = clock.getElapsedTime();
    groupRef.current.rotation.x = Math.sin(time * 0.1) * 0.2;
    groupRef.current.rotation.y = time * 0.05 + Math.cos(time * 0.08) * 0.1;
    groupRef.current.rotation.z = Math.sin(time * 0.12) * 0.1;
    
    // Update shader uniforms
    uniforms.time.value = time;
    uniforms.isDark.value = theme === 'dark';
    uniforms.baseColor.value.setHex(theme === 'dark' ? 0x020205 : 0xf5f5f5);
    uniforms.glowColor.value.setHex(theme === 'dark' ? 0xffffff : 0x2a2a2a);
    uniforms.rimColor.value.setHex(theme === 'dark' ? 0xe0e0e0 : 0x505050);
    uniforms.opacity.value = theme === 'dark' ? 0.15 : 0.8;
    uniforms.glowIntensity.value = isProcessing 
      ? 0.8 + Math.sin(time * 3) * 0.2 
      : 0.4;
    uniforms.isHovered.value = isHovered ? 1.0 : 0.0;
  });

  return (
    <group 
      ref={groupRef}
      onPointerEnter={() => setIsHovered(true)}
      onPointerLeave={() => setIsHovered(false)}
    >
      {/* Main glass sphere */}
      <mesh ref={sphereRef} castShadow receiveShadow>
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
      <mesh scale={[1.02, 1.02, 1.02]} castShadow>
        <sphereGeometry args={[1, 64, 64]} />
        <meshBasicMaterial
          color={theme === 'dark' ? "#ffffff" : "#2a2a2a"}
          transparent={true}
          opacity={theme === 'dark' ? 0.08 : 0.12}
          side={THREE.BackSide}
        />
      </mesh>
      
      {/* Very subtle inner reflection */}
      <mesh scale={[0.98, 0.98, 0.98]}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial
          color={theme === 'dark' ? "#e0e0e0" : "#505050"}
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
          shadows
          gl={{ 
            antialias: true,
            alpha: true,
            powerPreference: 'default',
            shadowMap: true
          }}
        >
          {/* Dynamic background based on theme */}
          <color attach="background" args={[theme === 'dark' ? '#0a0a0a' : '#f8f9fa']} />
          
          {/* Enhanced lighting with shadows */}
          <ambientLight intensity={theme === 'dark' ? 0.1 : 0.3} />
          <pointLight 
            position={[5, 5, 5]} 
            intensity={theme === 'dark' ? 0.3 : 0.5} 
            color={theme === 'dark' ? "#ffffff" : "#2a2a2a"}
            castShadow
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
          />
          <pointLight 
            position={[-5, -5, 2]} 
            intensity={0.1} 
            color={theme === 'dark' ? "#ffffff" : "#666666"}
          />
          
          {/* Ground plane for shadows */}
          <mesh position={[0, -2, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
            <planeGeometry args={[10, 10]} />
            <meshStandardMaterial 
              color={theme === 'dark' ? "#1a1a1a" : "#e0e0e0"} 
              transparent 
              opacity={0.1} 
            />
          </mesh>
          
          <AnimatedGlassSphere isProcessing={isProcessing} />
          
          <OrbitControls 
            enableZoom={false}
            enablePan={false}
            rotateSpeed={0.3}
            autoRotate={false}
          />
        </Canvas>
      </ThreeErrorBoundary>
    </div>
  );
};

export default GlassSphere;
