
import React, { useRef, useEffect, useMemo, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { 
  OrbitControls, 
  Environment, 
  ContactShadows,
  Float,
  Sparkles,
  Stars
} from '@react-three/drei';
import { useTheme } from '../contexts/ThemeContext';
import { useMood } from '../contexts/MoodContext';
import * as THREE from 'three';

interface GlassSphereProps {
  isProcessing?: boolean;
}

// Particle system component with theme-aware colors
const ParticleField = ({ count = 1000 }: { count?: number }) => {
  const mesh = useRef<THREE.Points>(null);
  const { theme } = useTheme();
  
  const particlesPosition = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    return positions;
  }, [count]);

  useFrame(({ clock }) => {
    if (mesh.current) {
      mesh.current.rotation.x = clock.getElapsedTime() * 0.05;
      mesh.current.rotation.y = clock.getElapsedTime() * 0.03;
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
        size={0.02}
        color={theme === 'dark' ? '#ffffff' : '#000000'}
        transparent
        opacity={0.6}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

// Sphere with pure black/white core and subtle rim lighting
const HolographicSphere = ({ isProcessing = false }: GlassSphereProps) => {
  const sphereRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const { theme } = useTheme();
  const { moodColor } = useMood();
  const [isHovered, setIsHovered] = useState(false);
  
  // Shader uniforms for clean, modern look
  const uniforms = useMemo(() => ({
    time: { value: 0 },
    isDark: { value: theme === 'dark' },
    glowColor: { value: new THREE.Color(moodColor) },
    coreColor: { value: new THREE.Color(theme === 'dark' ? '#000000' : '#ffffff') },
    rimColor: { value: new THREE.Color(theme === 'dark' ? '#666666' : '#333333') },
    opacity: { value: theme === 'dark' ? 0.9 : 0.8 },
    rimPower: { value: 2.0 },
    glowIntensity: { value: isProcessing ? 1.0 : 0.4 },
    isHovered: { value: isHovered ? 1.0 : 0.0 },
    waveSpeed: { value: 1.0 },
    waveAmplitude: { value: 0.02 }
  }), [theme, isProcessing, isHovered, moodColor]);
  
  // Vertex shader with subtle wave distortion
  const vertexShader = `
    varying vec3 vNormal;
    varying vec3 vViewPosition;
    varying vec2 vUv;
    varying vec3 vWorldPosition;
    varying vec3 vPosition;
    
    uniform float time;
    uniform float waveSpeed;
    uniform float waveAmplitude;
    
    float noise(vec3 p) {
      return sin(p.x * 10.0) * sin(p.y * 10.0) * sin(p.z * 10.0) * 0.1;
    }
    
    void main() {
      vUv = uv;
      vPosition = position;
      
      // Subtle wave distortion
      float wave = sin(position.x * 8.0 + time * waveSpeed) * 
                   cos(position.y * 6.0 + time * waveSpeed * 0.8) * 
                   sin(position.z * 7.0 + time * waveSpeed * 1.2) * waveAmplitude;
      
      vec3 distortedPosition = position + normal * wave;
      
      vNormal = normalize(normalMatrix * normal);
      vec4 mvPosition = modelViewMatrix * vec4(distortedPosition, 1.0);
      vViewPosition = -mvPosition.xyz;
      vWorldPosition = (modelMatrix * vec4(distortedPosition, 1.0)).xyz;
      gl_Position = projectionMatrix * mvPosition;
    }
  `;

  // Fragment shader for clean gradient from core to rim
  const fragmentShader = `
    uniform float time;
    uniform bool isDark;
    uniform vec3 glowColor;
    uniform vec3 coreColor;
    uniform vec3 rimColor;
    uniform float opacity;
    uniform float rimPower;
    uniform float glowIntensity;
    uniform float isHovered;
    
    varying vec3 vNormal;
    varying vec3 vViewPosition;
    varying vec2 vUv;
    varying vec3 vWorldPosition;
    varying vec3 vPosition;
    
    void main() {
      vec3 normal = normalize(vNormal);
      vec3 viewDir = normalize(vViewPosition);
      
      // Fresnel for rim lighting
      float fresnel = 1.0 - abs(dot(normal, viewDir));
      fresnel = pow(fresnel, rimPower);
      
      // Distance from center for gradient
      float distanceFromCenter = length(vPosition);
      float gradient = smoothstep(0.0, 1.0, distanceFromCenter);
      
      // Clean gradient from core to rim
      vec3 finalColor = mix(coreColor, rimColor, gradient);
      
      // Subtle rim lighting
      vec3 rimLight = rimColor * fresnel * glowIntensity * 0.3;
      finalColor += rimLight;
      
      // Very subtle hover effect
      finalColor += isHovered * vec3(0.1, 0.1, 0.1);
      
      // Clean opacity
      float finalOpacity = opacity * (0.7 + fresnel * 0.3);
      
      gl_FragColor = vec4(finalColor, finalOpacity);
    }
  `;

  // Simple rotation animation
  useFrame(({ clock }) => {
    if (!sphereRef.current || !groupRef.current) return;
    
    const time = clock.getElapsedTime();
    
    groupRef.current.rotation.y = time * 0.1;
    groupRef.current.position.y = Math.sin(time * 0.8) * 0.05;
    
    uniforms.time.value = time;
    uniforms.isDark.value = theme === 'dark';
    uniforms.glowIntensity.value = isProcessing 
      ? 0.6 + Math.sin(time * 3) * 0.2 
      : 0.4;
    uniforms.isHovered.value = isHovered ? 1.0 : 0.0;
    
    // Parse color safely
    try {
      const color = new THREE.Color(moodColor);
      uniforms.glowColor.value = color;
    } catch (e) {
      uniforms.glowColor.value = new THREE.Color('#666666');
    }
  });

  return (
    <>
      <ParticleField count={800} />
      
      <Sparkles
        count={50}
        scale={[4, 4, 4]}
        size={1}
        speed={0.2}
        color={theme === 'dark' ? '#ffffff' : '#000000'}
      />
      
      <Float speed={1.0} rotationIntensity={0.1} floatIntensity={0.2}>
        <group 
          ref={groupRef}
          onPointerEnter={() => setIsHovered(true)}
          onPointerLeave={() => setIsHovered(false)}
        >
          <mesh ref={sphereRef}>
            <sphereGeometry args={[1, 64, 64]} />
            <shaderMaterial 
              vertexShader={vertexShader}
              fragmentShader={fragmentShader}
              uniforms={uniforms}
              transparent={true}
              side={THREE.DoubleSide}
            />
          </mesh>
        </group>
      </Float>
    </>
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

// Main component with clean, modern rendering
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
          dpr={[1, 2]} 
          gl={{ 
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance'
          }}
          onCreated={({ gl, scene }) => {
            gl.toneMapping = THREE.ACESFilmicToneMapping;
            gl.toneMappingExposure = 1.0;
          }}
        >
          <color attach="background" args={[theme === 'dark' ? '#000000' : '#ffffff']} />
          
          <ambientLight intensity={theme === 'dark' ? 0.1 : 0.3} />
          
          <pointLight 
            position={[2, 2, 2]} 
            intensity={theme === 'dark' ? 0.3 : 0.5} 
            color={theme === 'dark' ? '#ffffff' : '#000000'}
          />
          
          <Stars 
            radius={30}
            depth={20}
            count={1000}
            factor={2}
            saturation={0}
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
      
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-4 left-4 text-xs font-mono opacity-40">
          NEURAL_INTERFACE_v2.1
        </div>
        <div className="absolute bottom-4 right-4 text-xs font-mono opacity-40">
          {isProcessing ? 'PROCESSING...' : 'READY'}
        </div>
        <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-green-400 animate-pulse opacity-60"></div>
      </div>
    </div>
  );
};

export default GlassSphere;
