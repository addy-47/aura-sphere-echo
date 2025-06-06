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

// Advanced holographic sphere with transmission and distortion
const HolographicSphere = ({ isProcessing = false }: GlassSphereProps) => {
  const sphereRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const { theme } = useTheme();
  const { moodColor } = useMood();
  const [isHovered, setIsHovered] = useState(false);
  
  // Advanced shader uniforms for holographic effect - consistent appearance
  const uniforms = useMemo(() => ({
    time: { value: 0 },
    glowColor: { value: new THREE.Color('#ffffff') }, // White primary glow
    blueGlow: { value: new THREE.Color('#4a9eff') }, // Subtle blue glow
    rimColor: { value: new THREE.Color('#ffffff') }, // White rim
    baseColor: { value: new THREE.Color('#000000') }, // Pure black center
    centerColor: { value: new THREE.Color('#000000') },
    edgeColor: { value: new THREE.Color('#ffffff') }, // White edge
    opacity: { value: 0.4 }, // Same opacity for both modes
    rimPower: { value: 1.2 },
    glowIntensity: { value: isProcessing ? 1.0 : 0.5 },
    isHovered: { value: isHovered ? 1.0 : 0.0 },
    hologramStrength: { value: 0.2 },
    scanlineSpeed: { value: 1.5 },
    distortionStrength: { value: 0.05 }
  }), [isProcessing, isHovered]);
  
  // Enhanced vertex shader with holographic distortion
  const vertexShader = `
    varying vec3 vNormal;
    varying vec3 vViewPosition;
    varying vec2 vUv;
    varying vec3 vWorldPosition;
    varying vec3 vPosition;
    varying float vDistortion;
    
    uniform float time;
    uniform float distortionStrength;
    
    // Noise function for distortion
    vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
    vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
    
    float snoise(vec3 v) {
      const vec2 C = vec2(1.0/6.0, 1.0/3.0);
      const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
      vec3 i = floor(v + dot(v, C.yyy));
      vec3 x0 = v - i + dot(i, C.xxx);
      vec3 g = step(x0.yzx, x0.xyz);
      vec3 l = 1.0 - g;
      vec3 i1 = min(g.xyz, l.zxy);
      vec3 i2 = max(g.xyz, l.zxy);
      vec3 x1 = x0 - i1 + C.xxx;
      vec3 x2 = x0 - i2 + C.yyy;
      vec3 x3 = x0 - D.yyy;
      i = mod289(i);
      vec4 p = permute(permute(permute(i.z + vec4(0.0, i1.z, i2.z, 1.0)) + i.y + vec4(0.0, i1.y, i2.y, 1.0)) + i.x + vec4(0.0, i1.x, i2.x, 1.0));
      float n_ = 0.142857142857;
      vec3 ns = n_ * D.wyz - D.xzx;
      vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
      vec4 x_ = floor(j * ns.z);
      vec4 y_ = floor(j - 7.0 * x_);
      vec4 x = x_ *ns.x + ns.yyyy;
      vec4 y = y_ *ns.x + ns.yyyy;
      vec4 h = 1.0 - abs(x) - abs(y);
      vec4 b0 = vec4(x.xy, y.xy);
      vec4 b1 = vec4(x.zw, y.zw);
      vec4 s0 = floor(b0) * 2.0 + 1.0;
      vec4 s1 = floor(b1) * 2.0 + 1.0;
      vec4 sh = -step(h, vec4(0.0));
      vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
      vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
      vec3 p0 = vec3(a0.xy, h.x);
      vec3 p1 = vec3(a0.zw, h.y);
      vec3 p2 = vec3(a1.xy, h.z);
      vec3 p3 = vec3(a1.zw, h.w);
      vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
      p0 *= norm.x;
      p1 *= norm.y;
      p2 *= norm.z;
      p3 *= norm.w;
      vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
      m = m * m;
      return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
    }
    
    void main() {
      vUv = uv;
      vPosition = position;
      
      // Add subtle holographic distortion
      float noise = snoise(position * 2.0 + time * 0.3) * distortionStrength;
      vec3 distortedPosition = position + normal * noise;
      vDistortion = noise;
      
      vNormal = normalize(normalMatrix * normal);
      vec4 mvPosition = modelViewMatrix * vec4(distortedPosition, 1.0);
      vViewPosition = -mvPosition.xyz;
      vWorldPosition = (modelMatrix * vec4(distortedPosition, 1.0)).xyz;
      gl_Position = projectionMatrix * mvPosition;
    }
  `;

  // Fragment shader - consistent appearance regardless of theme
  const fragmentShader = `
    uniform float time;
    uniform vec3 glowColor;
    uniform vec3 blueGlow;
    uniform vec3 rimColor;
    uniform vec3 baseColor;
    uniform vec3 centerColor;
    uniform vec3 edgeColor;
    uniform float opacity;
    uniform float rimPower;
    uniform float glowIntensity;
    uniform float isHovered;
    uniform float hologramStrength;
    uniform float scanlineSpeed;
    
    varying vec3 vNormal;
    varying vec3 vViewPosition;
    varying vec2 vUv;
    varying vec3 vWorldPosition;
    varying vec3 vPosition;
    varying float vDistortion;
    
    void main() {
      vec3 normal = normalize(vNormal);
      vec3 viewDir = normalize(vViewPosition);
      
      // Enhanced fresnel for rim lighting
      float fresnel = 1.0 - abs(dot(normal, viewDir));
      fresnel = pow(fresnel, rimPower);
      
      // Distance from center for gradient
      float distanceFromCenter = length(vPosition);
      float normalizedDistance = distanceFromCenter;
      
      // Pure black center merging to edge glow
      vec3 gradientColor = mix(vec3(0.0, 0.0, 0.0), edgeColor * 0.1, normalizedDistance);
      
      // Subtle scanlines for holographic effect
      float scanlines = sin(vUv.y * 80.0 + time * scanlineSpeed) * 0.02;
      
      // White rim lighting with subtle blue tint
      vec3 rimLight = mix(rimColor, blueGlow, 0.15) * fresnel * glowIntensity;
      
      // Add subtle blue glow around the sphere
      vec3 blueGlowEffect = blueGlow * fresnel * 0.1 * glowIntensity;
      
      // Final color composition - consistent for both light and dark modes
      vec3 finalColor = gradientColor + rimLight + blueGlowEffect + scanlines * vec3(1.0, 1.0, 1.0);
      
      // Enhance opacity at edges, transparent in center
      float finalOpacity = fresnel * opacity * (0.5 + glowIntensity * 0.5);
      
      gl_FragColor = vec4(finalColor, finalOpacity);
    }
  `;

  // Animation with subtle motion
  useFrame(({ clock }) => {
    if (!sphereRef.current || !groupRef.current) return;
    
    const time = clock.getElapsedTime();
    
    // Gentle rotation
    groupRef.current.rotation.y = time * 0.05;
    
    // Subtle floating motion
    groupRef.current.position.y = Math.sin(time * 0.6) * 0.05;
    
    // Update shader uniforms
    uniforms.time.value = time;
    uniforms.glowIntensity.value = isProcessing 
      ? 0.8 + Math.sin(time * 3) * 0.2 
      : 0.5;
    uniforms.isHovered.value = isHovered ? 1.0 : 0.0;
  });

  return (
    <>
      {/* Enhanced particle field background */}
      <ParticleSystem count={1200} size={0.02} opacity={0.6} speed={0.03} range={25} excludeSphere={true} />
      
      {/* Reduced sparkles around the sphere */}
      <Sparkles
        count={30}
        scale={[4, 4, 4]}
        size={1.2}
        speed={0.3}
        color="#4a9eff"
      />
      
      {/* Main sphere group - reduced size */}
      <Float speed={1.0} rotationIntensity={0.1} floatIntensity={0.2}>
        <group 
          ref={groupRef}
          onPointerEnter={() => setIsHovered(true)}
          onPointerLeave={() => setIsHovered(false)}
          scale={[0.7, 0.7, 0.7]} // Reduced size
        >
          {/* Main holographic sphere */}
          <mesh ref={sphereRef} castShadow>
            <sphereGeometry args={[1, 128, 128]} />
            <shaderMaterial 
              vertexShader={vertexShader}
              fragmentShader={fragmentShader}
              uniforms={uniforms}
              transparent={true}
              side={THREE.DoubleSide}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
          
          {/* Outer energy rings - subtle blue tint */}
          {[1.05, 1.1].map((scale, index) => (
            <mesh key={index} scale={[scale, scale, scale]}>
              <ringGeometry args={[0.98, 1.02, 64]} />
              <meshBasicMaterial
                color="#4a9eff"
                transparent={true}
                opacity={0.03 - index * 0.01}
                side={THREE.DoubleSide}
                blending={THREE.AdditiveBlending}
              />
            </mesh>
          ))}
        </group>
      </Float>
      
      {/* Contact shadows for grounding */}
      <ContactShadows
        position={[0, -2, 0]}
        opacity={0.2}
        scale={4}
        blur={1.5}
        far={2}
      />
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

// Main component with enhanced responsive rendering
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
            scene.fog = new THREE.FogExp2(theme === 'dark' ? 0x000000 : 0xffffff, 0.01);
            
            const handleResize = () => {
              if (camera instanceof THREE.PerspectiveCamera) {
                camera.fov = getResponsiveFOV();
                camera.updateProjectionMatrix();
              }
            };
            window.addEventListener('resize', handleResize);
          }}
        >
          {/* Background color - white in light mode, black in dark mode */}
          <color attach="background" args={[theme === 'dark' ? '#000000' : '#ffffff']} />
          
          <ambientLight intensity={0.1} color="#ffffff" />
          
          <pointLight 
            position={[2, 2, 2]} 
            intensity={0.3} 
            color="#ffffff"
          />
          
          <pointLight 
            position={[-2, -2, 1]} 
            intensity={0.1} 
            color="#4a9eff"
          />
          
          <Stars 
            radius={100}
            depth={50}
            count={1000}
            factor={2}
            saturation={0}
            fade
            speed={0.3}
          />
          
          <Environment preset="night" />
          
          <HolographicSphere isProcessing={isProcessing} />
          
          <OrbitControls 
            enableZoom={false}
            enablePan={false}
            rotateSpeed={0.1}
            autoRotate={false}
            enableDamping
            dampingFactor={0.03}
          />
        </Canvas>
      </ThreeErrorBoundary>
      
      {/* Minimal overlay UI */}
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
