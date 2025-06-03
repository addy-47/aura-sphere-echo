
import React, { useRef, useEffect, useMemo, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { 
  OrbitControls, 
  Environment, 
  ContactShadows,
  Float,
  MeshTransmissionMaterial,
  Sparkles,
  Stars
} from '@react-three/drei';
import { useTheme } from '../contexts/ThemeContext';
import { useMood } from '../contexts/MoodContext';
import * as THREE from 'three';

interface GlassSphereProps {
  isProcessing?: boolean;
}

// Minimal particle system with mostly white/grey particles and few blue ones
const ParticleField = ({ count = 500 }: { count?: number }) => {
  const mesh = useRef<THREE.Points>(null);
  
  const { particlesPosition, particlesColors } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      // Position particles around the sphere
      positions[i * 3] = (Math.random() - 0.5) * 8;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 8;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 8;
      
      // 90% white/grey particles, 10% subtle blue
      if (Math.random() < 0.1) {
        // Subtle blue particles
        colors[i * 3] = 0.4;     // R
        colors[i * 3 + 1] = 0.6; // G  
        colors[i * 3 + 2] = 0.8; // B
      } else {
        // White/grey particles
        const grey = 0.7 + Math.random() * 0.3;
        colors[i * 3] = grey;
        colors[i * 3 + 1] = grey;
        colors[i * 3 + 2] = grey;
      }
    }
    return { particlesPosition: positions, particlesColors: colors };
  }, [count]);

  useFrame(({ clock }) => {
    if (mesh.current) {
      mesh.current.rotation.x = clock.getElapsedTime() * 0.02;
      mesh.current.rotation.y = clock.getElapsedTime() * 0.015;
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
        <bufferAttribute
          attach="attributes-color"
          count={particlesColors.length / 3}
          array={particlesColors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.01}
        transparent
        opacity={0.8}
        sizeAttenuation
        vertexColors
      />
    </points>
  );
};

// Dark sphere matching the reference image
const DarkSphere = ({ isProcessing = false }: GlassSphereProps) => {
  const sphereRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const [isHovered, setIsHovered] = useState(false);
  const { theme } = useTheme();
  
  // Shader uniforms for the dark sphere effect
  const uniforms = useMemo(() => ({
    time: { value: 0 },
    opacity: { value: 0.95 },
    rimIntensity: { value: isProcessing ? 0.8 : 0.4 },
    isHovered: { value: isHovered ? 1.0 : 0.0 },
    isLightMode: { value: theme === 'light' ? 1.0 : 0.0 }
  }), [isProcessing, isHovered, theme]);
  
  // Vertex shader
  const vertexShader = `
    varying vec3 vNormal;
    varying vec3 vViewPosition;
    varying vec3 vWorldPosition;
    
    void main() {
      vNormal = normalize(normalMatrix * normal);
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      vViewPosition = -mvPosition.xyz;
      vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
      gl_Position = projectionMatrix * mvPosition;
    }
  `;

  // Fragment shader for dark sphere with rim lighting
  const fragmentShader = `
    uniform float time;
    uniform float opacity;
    uniform float rimIntensity;
    uniform float isHovered;
    uniform float isLightMode;
    
    varying vec3 vNormal;
    varying vec3 vViewPosition;
    varying vec3 vWorldPosition;
    
    void main() {
      vec3 normal = normalize(vNormal);
      vec3 viewDir = normalize(vViewPosition);
      
      // Fresnel effect for rim lighting
      float fresnel = 1.0 - abs(dot(normal, viewDir));
      fresnel = pow(fresnel, 2.0);
      
      // Distance from center for gradient
      float distanceFromCenter = length(vWorldPosition);
      float radialGradient = smoothstep(0.0, 1.0, distanceFromCenter);
      
      vec3 baseColor;
      vec3 rimColor;
      
      if (isLightMode > 0.5) {
        // Light mode - pure white center, light grey to darker grey on edges
        baseColor = mix(vec3(1.0, 1.0, 1.0), vec3(0.3, 0.3, 0.3), radialGradient);
        rimColor = vec3(0.5, 0.55, 0.6);
      } else {
        // Dark mode - pure black center with subtle rim
        baseColor = vec3(0.0, 0.0, 0.0);
        rimColor = mix(vec3(0.8, 0.85, 0.9), vec3(0.6, 0.7, 0.9), 0.3);
      }
      
      vec3 rim = rimColor * fresnel * rimIntensity;
      
      // Subtle pulsing for processing state
      float pulse = sin(time * 2.0) * 0.1 + 0.9;
      
      // Final color
      vec3 finalColor = baseColor + rim * pulse;
      
      // Add slight brightness on hover
      finalColor += vec3(0.1, 0.1, 0.15) * isHovered * 0.3;
      
      gl_FragColor = vec4(finalColor, opacity);
    }
  `;

  // Animation loop
  useFrame(({ clock }) => {
    if (!sphereRef.current || !groupRef.current) return;
    
    const time = clock.getElapsedTime();
    
    // Subtle rotation
    groupRef.current.rotation.y = time * 0.08;
    groupRef.current.position.y = Math.sin(time * 0.6) * 0.05;
    
    // Update uniforms
    uniforms.time.value = time;
    uniforms.rimIntensity.value = isProcessing 
      ? 0.6 + Math.sin(time * 3) * 0.2 
      : 0.4;
    uniforms.isHovered.value = isHovered ? 1.0 : 0.0;
    uniforms.isLightMode.value = theme === 'light' ? 1.0 : 0.0;
  });

  return (
    <>
      {/* Enhanced particle field */}
      <ParticleField count={300} />
      
      {/* More sparkles for better animation */}
      <Sparkles
        count={25}
        scale={[4, 4, 4]}
        size={1}
        speed={0.3}
        color="#ffffff"
        opacity={0.3}
      />
      
      {/* Main sphere group */}
      <Float speed={1.2} rotationIntensity={0.1} floatIntensity={0.15}>
        <group 
          ref={groupRef}
          scale={[0.7, 0.7, 0.7]}
          onPointerEnter={() => setIsHovered(true)}
          onPointerLeave={() => setIsHovered(false)}
        >
          {/* Main sphere with gradient */}
          <mesh ref={sphereRef} castShadow>
            <sphereGeometry args={[1, 128, 128]} />
            <shaderMaterial 
              vertexShader={vertexShader}
              fragmentShader={fragmentShader}
              uniforms={uniforms}
              transparent={true}
              side={THREE.DoubleSide}
            />
          </mesh>
          
          {/* Subtle transmission layer for glass effect */}
          <mesh scale={[1.01, 1.01, 1.01]}>
            <sphereGeometry args={[1, 64, 64]} />
            <MeshTransmissionMaterial
              transmission={0.05}
              thickness={0.03}
              roughness={0.9}
              envMapIntensity={0.1}
              color="#000000"
              transparent={true}
              opacity={0.05}
              distortionScale={0.01}
              temporalDistortion={0.01}
            />
          </mesh>
        </group>
      </Float>
      
      {/* Subtle contact shadows */}
      <ContactShadows
        position={[0, -0.8, 0]}
        opacity={0.1}
        scale={3}
        blur={2}
        far={0.8}
      />
    </>
  );
};

// Error boundary component
class ThreeErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean}> {
  constructor(props: {children: React.ReactNode}) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.log('Three.js Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center h-full text-center p-4">
          <div className="text-muted-foreground">
            <div className="text-lg mb-2">Sphere Loading...</div>
            <div className="text-sm">Initializing visualization</div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// Main component
const GlassSphere: React.FC<GlassSphereProps> = ({ isProcessing = false }) => {
  const { theme } = useTheme();

  useEffect(() => {
    if (typeof window !== 'undefined' && !window.THREE) {
      window.THREE = THREE;
    }
  }, []);

  return (
    <div className="w-full h-full min-h-[300px] relative overflow-hidden">
      <ThreeErrorBoundary>
        <Canvas 
          camera={{ position: [0, 0, 2.2], fov: 45 }}
          dpr={[1, 1.5]} 
          shadows
          gl={{ 
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance'
          }}
          onCreated={({ gl, scene }) => {
            gl.shadowMap.enabled = true;
            gl.shadowMap.type = THREE.PCFSoftShadowMap;
            gl.toneMapping = THREE.ACESFilmicToneMapping;
            gl.toneMappingExposure = 0.8;
            scene.background = new THREE.Color(theme === 'light' ? '#f8f9fa' : '#0a0a0a');
          }}
        >
          <color attach="background" args={[theme === 'light' ? '#f8f9fa' : '#0a0a0a']} />
          
          {/* Minimal lighting */}
          <ambientLight intensity={theme === 'light' ? 0.2 : 0.05} />
          
          {/* Key light for rim effect */}
          <pointLight 
            position={[3, 3, 3]} 
            intensity={theme === 'light' ? 0.6 : 0.3} 
            color="#ffffff"
          />
          
          {/* Subtle blue accent light */}
          <pointLight 
            position={[-2, -1, 2]} 
            intensity={0.15} 
            color="#4a90e2"
          />
          
          {/* Enhanced stars */}
          <Stars 
            radius={50}
            depth={30}
            count={500}
            factor={1.5}
            saturation={0}
            fade
            speed={0.2}
          />
          
          <Environment preset={theme === 'light' ? 'dawn' : 'night'} />
          
          <DarkSphere isProcessing={isProcessing} />
          
          <OrbitControls 
            enableZoom={false}
            enablePan={false}
            rotateSpeed={0.3}
            autoRotate={false}
            enableDamping
            dampingFactor={0.05}
          />
        </Canvas>
      </ThreeErrorBoundary>
      
      {/* UI overlay */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-4 left-4 text-xs font-mono opacity-30" style={{ color: theme === 'light' ? '#666' : '#fff' }}>
          NEURAL_CORE_v1.0
        </div>
        <div className="absolute bottom-4 right-4 text-xs font-mono opacity-30" style={{ color: theme === 'light' ? '#666' : '#fff' }}>
          {isProcessing ? 'PROCESSING...' : 'ONLINE'}
        </div>
        <div className={`absolute top-4 right-4 w-2 h-2 rounded-full animate-pulse ${theme === 'light' ? 'bg-gray-600' : 'bg-white'} opacity-40`}></div>
      </div>
    </div>
  );
};

export default GlassSphere;
