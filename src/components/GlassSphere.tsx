
import React, { useRef, useEffect, useMemo, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { 
  OrbitControls, 
  Environment, 
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

// Enhanced particle system with mostly white/grey particles and few blue ones
const ParticleField = ({ count = 800 }: { count?: number }) => {
  const mesh = useRef<THREE.Points>(null);
  
  const { particlesPosition, particlesColors } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      // Position particles around the sphere
      positions[i * 3] = (Math.random() - 0.5) * 12;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 12;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 12;
      
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
      mesh.current.rotation.x = clock.getElapsedTime() * 0.03;
      mesh.current.rotation.y = clock.getElapsedTime() * 0.02;
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
        size={0.015}
        transparent
        opacity={0.8}
        sizeAttenuation
        vertexColors
      />
    </points>
  );
};

// Main sphere with wave animations
const WaveSphere = ({ isProcessing = false }: GlassSphereProps) => {
  const sphereRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const [isHovered, setIsHovered] = useState(false);
  const { theme } = useTheme();
  
  // Wave animation uniforms
  const uniforms = useMemo(() => ({
    time: { value: 0 },
    opacity: { value: 0.95 },
    rimIntensity: { value: isProcessing ? 0.8 : 0.4 },
    isHovered: { value: isHovered ? 1.0 : 0.0 },
    isLightMode: { value: theme === 'light' ? 1.0 : 0.0 },
    amplitude: { value: isProcessing ? 0.08 : 0.04 },
    frequency: { value: 2.5 },
    speed: { value: 0.8 },
    waveIntensity: { value: isProcessing ? 1.0 : 0.3 }
  }), [isProcessing, isHovered, theme]);
  
  // Enhanced vertex shader with wave distortions
  const vertexShader = `
    uniform float time;
    uniform float amplitude;
    uniform float frequency;
    uniform float speed;
    uniform float waveIntensity;
    
    varying vec3 vNormal;
    varying vec3 vViewPosition;
    varying vec3 vWorldPosition;
    varying float vWaveHeight;
    
    // Wave function similar to the provided code
    float getWaveHeight(vec3 position) {
      float theta = position.y * frequency + time * speed;
      float phi = position.x * frequency + time * speed * 0.7;
      float zeta = position.z * frequency + time * speed * 0.5;
      
      float wave1 = sin(theta) * 1.0;
      float wave2 = cos(phi) * 0.8;
      float wave3 = sin(theta * 0.5 + phi) * 1.2;
      float wave4 = cos(theta + phi * 0.5) * 0.6;
      float wave5 = sin(theta * 0.7 + phi * 1.3 + zeta) * 0.9;
      float wave6 = cos(zeta * 1.1 + theta * 0.3) * 0.7;
      
      return amplitude * waveIntensity * (wave1 + wave2 + wave3 + wave4 + wave5 + wave6) / 6.0;
    }
    
    void main() {
      vNormal = normalize(normalMatrix * normal);
      
      // Calculate wave height and apply displacement
      float waveHeight = getWaveHeight(position);
      vWaveHeight = waveHeight;
      
      // Apply displacement along normal
      vec3 newPosition = position + normal * waveHeight;
      
      vec4 mvPosition = modelViewMatrix * vec4(newPosition, 1.0);
      vViewPosition = -mvPosition.xyz;
      vWorldPosition = (modelMatrix * vec4(newPosition, 1.0)).xyz;
      
      gl_Position = projectionMatrix * mvPosition;
    }
  `;

  // Enhanced fragment shader with proper light mode colors
  const fragmentShader = `
    uniform float time;
    uniform float opacity;
    uniform float rimIntensity;
    uniform float isHovered;
    uniform float isLightMode;
    
    varying vec3 vNormal;
    varying vec3 vViewPosition;
    varying vec3 vWorldPosition;
    varying float vWaveHeight;
    
    void main() {
      vec3 normal = normalize(vNormal);
      vec3 viewDir = normalize(vViewPosition);
      
      // Fresnel effect for rim lighting
      float fresnel = 1.0 - abs(dot(normal, viewDir));
      fresnel = pow(fresnel, 2.0);
      
      // Distance from center for gradient
      float distanceFromCenter = length(gl_PointCoord - vec2(0.5)) * 2.0;
      
      vec3 baseColor;
      vec3 rimColor;
      
      if (isLightMode > 0.5) {
        // Light mode - pure white center, light grey to darker grey on edges
        float gradientFactor = pow(fresnel, 1.5);
        baseColor = mix(
          vec3(1.0, 1.0, 1.0),           // Pure white center
          mix(
            vec3(0.85, 0.85, 0.85),      // Light grey
            vec3(0.4, 0.4, 0.4),         // Darker grey on edges
            gradientFactor
          ),
          gradientFactor
        );
        rimColor = vec3(0.6, 0.65, 0.7);  // Subtle blue-grey rim
      } else {
        // Dark mode - pure black center with rim
        baseColor = vec3(0.0, 0.0, 0.0);  // Pure black center
        rimColor = mix(vec3(0.8, 0.85, 0.9), vec3(0.6, 0.7, 0.9), 0.3);
      }
      
      // Add wave-based color variation
      float waveInfluence = vWaveHeight * 10.0;
      baseColor += vec3(waveInfluence * 0.1, waveInfluence * 0.05, waveInfluence * 0.15);
      
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
  useFrame(({ clock, viewport }) => {
    if (!sphereRef.current || !groupRef.current) return;
    
    const time = clock.getElapsedTime();
    
    // Responsive scaling based on viewport
    const scale = Math.min(viewport.width, viewport.height) * 0.15;
    groupRef.current.scale.set(scale, scale, scale);
    
    // Subtle rotation
    groupRef.current.rotation.y = time * 0.1;
    groupRef.current.position.y = Math.sin(time * 0.8) * 0.08;
    
    // Update uniforms
    uniforms.time.value = time;
    uniforms.rimIntensity.value = isProcessing 
      ? 0.8 + Math.sin(time * 4) * 0.3 
      : 0.4;
    uniforms.isHovered.value = isHovered ? 1.0 : 0.0;
    uniforms.isLightMode.value = theme === 'light' ? 1.0 : 0.0;
    uniforms.amplitude.value = isProcessing 
      ? 0.08 + Math.sin(time * 3) * 0.02
      : 0.04;
    uniforms.waveIntensity.value = isProcessing ? 1.0 : 0.3;
  });

  return (
    <>
      {/* Enhanced particle field */}
      <ParticleField count={600} />
      
      {/* Enhanced sparkles */}
      <Sparkles
        count={35}
        scale={[6, 6, 6]}
        size={1.5}
        speed={0.4}
        color="#ffffff"
        opacity={0.4}
      />
      
      {/* Main sphere group with responsive scaling */}
      <Float speed={1.5} rotationIntensity={0.15} floatIntensity={0.2}>
        <group 
          ref={groupRef}
          onPointerEnter={() => setIsHovered(true)}
          onPointerLeave={() => setIsHovered(false)}
        >
          {/* Main sphere with wave animations */}
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
          
          {/* Subtle transmission layer for glass effect */}
          <mesh scale={[1.02, 1.02, 1.02]}>
            <sphereGeometry args={[1, 64, 64]} />
            <MeshTransmissionMaterial
              transmission={0.08}
              thickness={0.04}
              roughness={0.85}
              envMapIntensity={0.15}
              color="#000000"
              transparent={true}
              opacity={0.08}
              distortionScale={0.02}
              temporalDistortion={0.02}
            />
          </mesh>
        </group>
      </Float>
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
          camera={{ position: [0, 0, 3], fov: 50 }}
          dpr={[1, 1.5]} 
          gl={{ 
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance'
          }}
          onCreated={({ gl, scene }) => {
            gl.toneMapping = THREE.ACESFilmicToneMapping;
            gl.toneMappingExposure = 0.9;
            scene.background = new THREE.Color(theme === 'light' ? '#f8f9fa' : '#0a0a0a');
          }}
        >
          <color attach="background" args={[theme === 'light' ? '#f8f9fa' : '#0a0a0a']} />
          
          {/* Minimal lighting without shadows */}
          <ambientLight intensity={theme === 'light' ? 0.3 : 0.08} />
          
          {/* Key light for rim effect - no shadows */}
          <pointLight 
            position={[4, 4, 4]} 
            intensity={theme === 'light' ? 0.7 : 0.4} 
            color="#ffffff"
            castShadow={false}
          />
          
          {/* Subtle blue accent light */}
          <pointLight 
            position={[-3, -2, 3]} 
            intensity={0.2} 
            color="#4a90e2"
            castShadow={false}
          />
          
          {/* Enhanced stars */}
          <Stars 
            radius={60}
            depth={40}
            count={800}
            factor={2}
            saturation={0}
            fade
            speed={0.3}
          />
          
          <Environment preset={theme === 'light' ? 'dawn' : 'night'} />
          
          <WaveSphere isProcessing={isProcessing} />
          
          <OrbitControls 
            enableZoom={false}
            enablePan={false}
            rotateSpeed={0.4}
            autoRotate={false}
            enableDamping
            dampingFactor={0.06}
          />
        </Canvas>
      </ThreeErrorBoundary>
      
      {/* UI overlay */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-4 left-4 text-xs font-mono opacity-30" style={{ color: theme === 'light' ? '#666' : '#fff' }}>
          NEURAL_CORE_v2.0
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
