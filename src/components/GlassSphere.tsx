import React, { useRef, useEffect, useMemo, useState } from 'react';
import { Canvas, useFrame, extend } from '@react-three/fiber';
import { 
  OrbitControls, 
  Environment, 
  BakeShadows,
  ContactShadows,
  Float,
  MeshDistortMaterial,
  MeshTransmissionMaterial,
  useTexture,
  Text,
  Sparkles,
  Stars,
  Trail
} from '@react-three/drei';
import { useTheme } from '../contexts/ThemeContext';
import { useMood } from '../contexts/MoodContext';
import * as THREE from 'three';
import { Vector2 } from 'three';
import ParticleSystem from './ParticleSystem';

interface GlassSphereProps {
  isProcessing?: boolean;
}

const HolographicSphere = ({ isProcessing = false }: GlassSphereProps) => {
  const sphereRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const { theme } = useTheme();
  const { moodColor } = useMood();
  const [isHovered, setIsHovered] = useState(false);
  
  const uniforms = useMemo(() => ({
    time: { value: 0 },
    rimPower: { value: 2.0 },
    opacity: { value: 0.15 },
    rimOpacity: { value: 0.4 },
    isProcessing: { value: isProcessing ? 1.0 : 0.0 },
    isLightMode: { value: theme === 'light' ? 1.0 : 0.0 }
  }), [isProcessing, theme]);
  
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

  const fragmentShader = `
    uniform float time;
    uniform float rimPower;
    uniform float opacity;
    uniform float rimOpacity;
    uniform float isProcessing;
    uniform float isLightMode;
    
    varying vec3 vNormal;
    varying vec3 vViewPosition;
    varying vec2 vUv;
    
    void main() {
      vec3 normal = normalize(vNormal);
      vec3 viewDir = normalize(vViewPosition);
      
      // Simple fresnel for rim lighting
      float fresnel = 1.0 - abs(dot(normal, viewDir));
      fresnel = pow(fresnel, rimPower);
      
      // Base sphere color - very subtle
      vec3 baseColor = mix(
        vec3(0.05, 0.05, 0.1), // Dark mode: subtle blue tint
        vec3(0.9, 0.9, 0.95),  // Light mode: very light gray
        isLightMode
      );
      
      // Rim color - consistent blue for both modes
      vec3 rimColor = vec3(0.3, 0.6, 1.0);
      
      // Combine base and rim
      vec3 finalColor = mix(baseColor, rimColor, fresnel * 0.5);
      
      // Final opacity - very transparent base with subtle rim
      float baseOpacity = mix(opacity * 0.3, opacity * 0.8, isLightMode);
      float finalOpacity = baseOpacity + fresnel * rimOpacity;
      
      // Add subtle processing pulse
      if (isProcessing > 0.5) {
        float pulse = sin(time * 3.0) * 0.1 + 1.0;
        finalOpacity *= pulse;
      }
      
      gl_FragColor = vec4(finalColor, finalOpacity);
    }
  `;

  useFrame(({ clock }) => {
    if (!sphereRef.current || !groupRef.current) return;
    
    const time = clock.getElapsedTime();
    
    // Very subtle rotation
    groupRef.current.rotation.y = time * 0.02;
    groupRef.current.position.y = Math.sin(time * 0.4) * 0.02;
    
    uniforms.time.value = time;
    uniforms.isProcessing.value = isProcessing ? 1.0 : 0.0;
    uniforms.isLightMode.value = theme === 'light' ? 1.0 : 0.0;
  });

  return (
    <>
      {/* Reduced particle count for cleaner look */}
      <ParticleSystem 
        count={200} 
        size={0.015} 
        opacity={0.3} 
        speed={0.01} 
        range={15} 
        excludeSphere={true}
      />
      
      <Float speed={0.5} rotationIntensity={0.05} floatIntensity={0.1}>
        <group 
          ref={groupRef}
          onPointerEnter={() => setIsHovered(true)}
          onPointerLeave={() => setIsHovered(false)}
          scale={[1.0, 1.0, 1.0]}
        >
          <mesh ref={sphereRef}>
            <sphereGeometry args={[1, 64, 64]} />
            <shaderMaterial 
              vertexShader={vertexShader}
              fragmentShader={fragmentShader}
              uniforms={uniforms}
              transparent={true}
              side={THREE.DoubleSide}
              blending={THREE.NormalBlending}
            />
          </mesh>
        </group>
      </Float>
      
      <ContactShadows
        position={[0, -2, 0]}
        opacity={0.1}
        scale={3}
        blur={2}
        far={2}
      />
    </>
  );
};

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

const GlassSphere: React.FC<GlassSphereProps> = ({ isProcessing = false }) => {
  const { theme } = useTheme();

  useEffect(() => {
    if (typeof window !== 'undefined' && !window.THREE) {
      window.THREE = THREE;
    }
  }, []);

  const getResponsiveFOV = () => {
    return window.innerWidth < 768 ? 60 : 45;
  };

  return (
    <div className="w-full h-full min-h-[200px] sm:min-h-[300px] md:min-h-[400px] relative overflow-hidden">
      <ThreeErrorBoundary>
        <Canvas 
          camera={{ 
            position: [0, 0, 3], 
            fov: getResponsiveFOV()
          }}
          dpr={[1, Math.min(window.devicePixelRatio, 2)]} 
          shadows={false}
          gl={{ 
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance',
            stencil: false,
            depth: true,
            logarithmicDepthBuffer: false
          }}
          onCreated={({ gl, scene, camera }) => {
            gl.shadowMap.enabled = false;
            gl.toneMapping = THREE.ACESFilmicToneMapping;
            gl.toneMappingExposure = 1.0;
            
            const handleResize = () => {
              if (camera instanceof THREE.PerspectiveCamera) {
                camera.fov = getResponsiveFOV();
                camera.updateProjectionMatrix();
              }
            };
            window.addEventListener('resize', handleResize);
          }}
        >
          {/* Theme-aware background */}
          <color attach="background" args={[theme === 'dark' ? '#000000' : '#ffffff']} />
          
          <ambientLight intensity={0.2} color="#ffffff" />
          
          <pointLight 
            position={[2, 2, 2]} 
            intensity={0.1} 
            color="#ffffff"
          />
          
          <Stars 
            radius={100}
            depth={50}
            count={500}
            factor={1}
            saturation={0}
            fade
            speed={0.1}
          />
          
          <Environment preset="night" />
          
          <HolographicSphere isProcessing={isProcessing} />
          
          <OrbitControls 
            enableZoom={false}
            enablePan={false}
            rotateSpeed={0.05}
            autoRotate={false}
            enableDamping
            dampingFactor={0.05}
          />
        </Canvas>
      </ThreeErrorBoundary>
      
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-2 left-2 text-xs font-mono opacity-40">
          NEURAL_INTERFACE
        </div>
        <div className="absolute bottom-2 right-2 text-xs font-mono opacity-40">
          {isProcessing ? 'PROCESSING...' : 'READY'}
        </div>
        <div className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-blue-400 opacity-60 animate-pulse"></div>
      </div>
    </div>
  );
};

export default GlassSphere;
