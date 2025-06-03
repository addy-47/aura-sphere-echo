
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

// Simplified particle system component
const ParticleField = ({ count = 500 }: { count?: number }) => {
  const mesh = useRef<THREE.Points>(null);
  const { theme } = useTheme();
  
  const particlesPosition = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 15;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 15;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 15;
    }
    return positions;
  }, [count]);

  useFrame(({ clock }) => {
    if (mesh.current) {
      mesh.current.rotation.x = clock.getElapsedTime() * 0.02;
      mesh.current.rotation.y = clock.getElapsedTime() * 0.01;
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
        size={0.015}
        color={theme === 'dark' ? '#00ffff' : '#0066cc'}
        transparent
        opacity={0.4}
        sizeAttenuation
      />
    </points>
  );
};

// Simplified holographic sphere
const HolographicSphere = ({ isProcessing = false }: GlassSphereProps) => {
  const sphereRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const innerSphereRef = useRef<THREE.Mesh>(null);
  const { theme } = useTheme();
  const { moodColor } = useMood();
  const [isHovered, setIsHovered] = useState(false);
  
  // Simplified shader uniforms
  const uniforms = useMemo(() => ({
    time: { value: 0 },
    isDark: { value: theme === 'dark' },
    glowColor: { value: new THREE.Color(moodColor) },
    rimColor: { value: new THREE.Color('#00ffff') },
    opacity: { value: theme === 'dark' ? 0.3 : 0.8 },
    glowIntensity: { value: isProcessing ? 1.0 : 0.5 },
    isHovered: { value: isHovered ? 1.0 : 0.0 }
  }), [theme, isProcessing, isHovered, moodColor]);
  
  // Simplified vertex shader
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

  // Simplified fragment shader
  const fragmentShader = `
    uniform float time;
    uniform bool isDark;
    uniform vec3 glowColor;
    uniform vec3 rimColor;
    uniform float opacity;
    uniform float glowIntensity;
    uniform float isHovered;
    
    varying vec3 vNormal;
    varying vec3 vViewPosition;
    varying vec2 vUv;
    varying vec3 vWorldPosition;
    
    void main() {
      vec3 normal = normalize(vNormal);
      vec3 viewDir = normalize(vViewPosition);
      
      // Fresnel effect
      float fresnel = 1.0 - abs(dot(normal, viewDir));
      fresnel = pow(fresnel, 1.5);
      
      // Distance-based gradient
      float distanceFromCenter = length(vWorldPosition) * 0.5;
      
      // Base color
      vec3 baseColor;
      if (isDark) {
        baseColor = mix(vec3(0.0, 0.0, 0.1), vec3(0.0, 0.4, 0.6), distanceFromCenter);
      } else {
        baseColor = mix(vec3(0.9, 0.95, 1.0), vec3(0.3, 0.5, 0.8), distanceFromCenter);
      }
      
      // Rim lighting
      vec3 rimLight = rimColor * fresnel * glowIntensity;
      
      // Pulsing effect
      float pulse = sin(time * 3.0) * 0.1 + 0.9;
      
      // Final color
      vec3 finalColor = baseColor + rimLight * pulse;
      finalColor += glowColor * 0.2 * (isHovered + 0.5);
      
      // Final opacity
      float finalOpacity = opacity + fresnel * 0.4 + isHovered * 0.2;
      
      gl_FragColor = vec4(finalColor, finalOpacity);
    }
  `;

  // Animation
  useFrame(({ clock }) => {
    if (!sphereRef.current || !groupRef.current) return;
    
    const time = clock.getElapsedTime();
    
    // Rotation
    groupRef.current.rotation.y = time * 0.1;
    groupRef.current.position.y = Math.sin(time * 0.6) * 0.1;
    
    // Inner sphere rotation
    if (innerSphereRef.current) {
      innerSphereRef.current.rotation.x = -time * 0.2;
      innerSphereRef.current.rotation.y = time * 0.3;
    }
    
    // Update uniforms
    uniforms.time.value = time;
    uniforms.isDark.value = theme === 'dark';
    uniforms.glowIntensity.value = isProcessing 
      ? 1.0 + Math.sin(time * 3) * 0.2 
      : 0.5;
    uniforms.isHovered.value = isHovered ? 1.0 : 0.0;
    uniforms.glowColor.value.setHex(parseInt(moodColor.replace('#', '0x'), 16));
  });

  return (
    <>
      {/* Particle field background */}
      <ParticleField count={400} />
      
      {/* Sparkles */}
      <Sparkles
        count={50}
        scale={[3, 3, 3]}
        size={1.5}
        speed={0.3}
        color={theme === 'dark' ? '#00ffff' : '#0066cc'}
      />
      
      {/* Main sphere group */}
      <Float speed={1.0} rotationIntensity={0.1} floatIntensity={0.2}>
        <group 
          ref={groupRef}
          onPointerEnter={() => setIsHovered(true)}
          onPointerLeave={() => setIsHovered(false)}
        >
          {/* Main sphere */}
          <mesh ref={sphereRef} castShadow>
            <sphereGeometry args={[1, 64, 64]} />
            <shaderMaterial 
              vertexShader={vertexShader}
              fragmentShader={fragmentShader}
              uniforms={uniforms}
              transparent={true}
              side={THREE.DoubleSide}
            />
          </mesh>
          
          {/* Inner energy core */}
          <mesh ref={innerSphereRef} scale={[0.2, 0.2, 0.2]}>
            <sphereGeometry args={[1, 16, 16]} />
            <meshBasicMaterial
              color={moodColor}
              transparent={true}
              opacity={0.6}
            />
          </mesh>
          
          {/* Transmission sphere for glass effect */}
          <mesh scale={[1.02, 1.02, 1.02]}>
            <sphereGeometry args={[1, 32, 32]} />
            <MeshTransmissionMaterial
              transmission={0.8}
              thickness={0.1}
              roughness={0.2}
              envMapIntensity={0.8}
              color={new THREE.Color(moodColor)}
              transparent={true}
              opacity={0.2}
            />
          </mesh>
        </group>
      </Float>
      
      {/* Contact shadows */}
      <ContactShadows
        position={[0, -1.5, 0]}
        opacity={0.2}
        scale={6}
        blur={1.5}
        far={1.5}
      />
    </>
  );
};

// Simplified error boundary
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
            <div className="text-sm">Initializing 3D visualization</div>
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
          shadows
          gl={{ 
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance',
            preserveDrawingBuffer: false,
            stencil: false,
            depth: true
          }}
          onCreated={({ gl, scene }) => {
            gl.shadowMap.enabled = true;
            gl.shadowMap.type = THREE.PCFSoftShadowMap;
            gl.toneMapping = THREE.ACESFilmicToneMapping;
            gl.toneMappingExposure = 1.0;
            scene.background = new THREE.Color(theme === 'dark' ? '#000008' : '#f8f9fa');
          }}
        >
          <color attach="background" args={[theme === 'dark' ? '#000008' : '#f8f9fa']} />
          
          <ambientLight intensity={theme === 'dark' ? 0.1 : 0.3} />
          
          <pointLight 
            position={[2, 2, 2]} 
            intensity={0.5} 
            color="#00aaff"
          />
          
          <pointLight 
            position={[-2, -1, 1]} 
            intensity={0.3} 
            color="#ff3366"
          />
          
          <Stars 
            radius={30}
            depth={20}
            count={1000}
            factor={2}
            saturation={0.5}
            fade
            speed={0.3}
          />
          
          <Environment preset="dawn" />
          
          <HolographicSphere isProcessing={isProcessing} />
          
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
        <div className="absolute top-4 left-4 text-xs font-mono opacity-50">
          NEURAL_CORE_v1.0
        </div>
        <div className="absolute bottom-4 right-4 text-xs font-mono opacity-50">
          {isProcessing ? 'PROCESSING...' : 'ONLINE'}
        </div>
        <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-green-400 animate-pulse opacity-60"></div>
      </div>
    </div>
  );
};

export default GlassSphere;
