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
  
  // Advanced shader uniforms for holographic effect
  const uniforms = useMemo(() => ({
    time: { value: 0 },
    isDark: { value: theme === 'dark' },
    glowColor: { value: new THREE.Color(moodColor) },
    rimColor: { value: new THREE.Color('#1a3366') },
    baseColor: { value: new THREE.Color(theme === 'dark' ? '#000510' : '#f0f8ff') },
    centerColor: { value: new THREE.Color('#000000') },
    edgeColor: { value: new THREE.Color('#404040') },
    opacity: { value: theme === 'dark' ? 0.25 : 0.9 },
    rimPower: { value: 1.5 },
    glowIntensity: { value: isProcessing ? 1.2 : 0.6 },
    isHovered: { value: isHovered ? 1.0 : 0.0 },
    hologramStrength: { value: 0.3 },
    scanlineSpeed: { value: 2.0 },
    distortionStrength: { value: 0.1 }
  }), [theme, isProcessing, isHovered, moodColor]);
  
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
      
      // Add holographic distortion
      float noise = snoise(position * 3.0 + time * 0.5) * distortionStrength;
      vec3 distortedPosition = position + normal * noise;
      vDistortion = noise;
      
      vNormal = normalize(normalMatrix * normal);
      vec4 mvPosition = modelViewMatrix * vec4(distortedPosition, 1.0);
      vViewPosition = -mvPosition.xyz;
      vWorldPosition = (modelMatrix * vec4(distortedPosition, 1.0)).xyz;
      gl_Position = projectionMatrix * mvPosition;
    }
  `;

  // Advanced fragment shader with holographic effects
  const fragmentShader = `
    uniform float time;
    uniform bool isDark;
    uniform vec3 glowColor;
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
      
      // Enhanced fresnel with holographic edge enhancement
      float fresnel = 1.0 - abs(dot(normal, viewDir));
      fresnel = pow(fresnel, rimPower);
      
      // Holographic scanlines
      float scanlines = sin(vUv.y * 100.0 + time * scanlineSpeed) * 0.04;
      float scanlineAlpha = sin(vUv.y * 50.0 + time * scanlineSpeed * 1.5) * 0.03;
      
      // Distance-based gradient (center to edge)
      float distanceFromCenter = length(vPosition);
      float normalizedDistance = distanceFromCenter;
      
      // Advanced gradient with blackish blue tones
      vec3 gradientColor;
      if (isDark) {
        // Dark mode: pure black center to darker blue edges
        vec3 darkCenter = vec3(0.0, 0.0, 0.0);
        vec3 darkEdge = vec3(0.02, 0.06, 0.15);
        gradientColor = mix(darkCenter, darkEdge, normalizedDistance);
      } else {
        // Light mode: black center to darker blue edges
        vec3 lightCenter = vec3(0.0, 0.0, 0.0);
        vec3 lightEdge = vec3(0.05, 0.1, 0.25);
        gradientColor = mix(lightCenter, lightEdge, normalizedDistance);
      }
      
      // Add holographic color shifting
      vec3 hologramShift = vec3(
        sin(time * 2.0 + vUv.x * 10.0) * 0.1,
        cos(time * 1.5 + vUv.y * 8.0) * 0.1,
        sin(time * 2.5 + normalizedDistance * 5.0) * 0.15
      );
      
      gradientColor += hologramShift * hologramStrength;
      
      // Enhanced rim lighting with color cycling
      vec3 rimLightColor = mix(rimColor, glowColor, sin(time * 1.5) * 0.5 + 0.5);
      vec3 rimLight = rimLightColor * fresnel * (glowIntensity + isHovered * 0.4);
      
      // Pulsing core energy
      float coreEnergy = (1.0 - normalizedDistance) * 0.3;
      coreEnergy *= (sin(time * 4.0) * 0.3 + 0.7);
      
      // Data stream effect
      float dataStream = sin(vUv.y * 20.0 + time * 8.0) * 0.02;
      dataStream *= smoothstep(0.8, 1.0, fresnel);
      
      // Final color composition
      vec3 finalColor = gradientColor;
      finalColor += rimLight;
      finalColor += vec3(coreEnergy * 0.2, coreEnergy * 0.8, coreEnergy);
      finalColor += vec3(dataStream * 0.0, dataStream * 1.0, dataStream * 0.8);
      finalColor += scanlines * vec3(0.0, 0.8, 1.0);
      finalColor += vDistortion * vec3(0.1, 0.3, 0.5);
      
      // Enhanced opacity with holographic flicker
      float flicker = sin(time * 15.0) * 0.02 + 0.98;
      float finalOpacity = opacity + fresnel * 0.8 + isHovered * 0.3 + scanlineAlpha;
      finalOpacity *= flicker;
      
      gl_FragColor = vec4(finalColor, finalOpacity);
    }
  `;

  // Animation with advanced motion
  useFrame(({ clock }) => {
    if (!sphereRef.current || !groupRef.current) return;
    
    const time = clock.getElapsedTime();
    
    // Complex rotation with multiple axes
    groupRef.current.rotation.x = Math.sin(time * 0.2) * 0.1;
    groupRef.current.rotation.y = time * 0.08 + Math.cos(time * 0.15) * 0.05;
    groupRef.current.rotation.z = Math.sin(time * 0.25) * 0.08;
    
    // Floating motion
    groupRef.current.position.y = Math.sin(time * 0.8) * 0.1;
    
    
    // Update shader uniforms
    uniforms.time.value = time;
    uniforms.isDark.value = theme === 'dark';
    uniforms.glowIntensity.value = isProcessing 
      ? 1.2 + Math.sin(time * 4) * 0.3 
      : 0.6;
    uniforms.isHovered.value = isHovered ? 1.0 : 0.0;
    uniforms.glowColor.value.setHex(parseInt(moodColor.replace('#', ''), 16));
  });

  return (
    <>
      {/* Particle field background */}
      <ParticleSystem count={800} size={0.02} opacity={0.6} speed={0.05} range={20} />
      
      {/* Sparkles around the sphere */}
      <Sparkles
        count={100}
        scale={[4, 4, 4]}
        size={2}
        speed={0.4}
        color={theme === 'dark' ? '#00ffff' : '#0066cc'}
      />
      
      {/* Main sphere group */}
      <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.3}>
        <group 
          ref={groupRef}
          onPointerEnter={() => setIsHovered(true)}
          onPointerLeave={() => setIsHovered(false)}
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
          
          
          {/* Outer energy rings */}
          {[1.1, 1.2, 1.3].map((scale, index) => (
            <mesh key={index} scale={[scale, scale, scale]}>
              <ringGeometry args={[0.98, 1.02, 64]} />
              <meshBasicMaterial
                color={theme === 'dark' ? '#00ffff' : '#0066cc'}
                transparent={true}
                opacity={0.1 - index * 0.02}
                side={THREE.DoubleSide}
                blending={THREE.AdditiveBlending}
              />
            </mesh>
          ))}
          
          {/* Transmission material sphere for refractions */}
          <mesh scale={[1.05, 1.05, 1.05]}>
            <sphereGeometry args={[1, 64, 64]} />
            <MeshTransmissionMaterial
              transmission={0.9}
              thickness={0.2}
              roughness={0.1}
              envMapIntensity={1}
              color={moodColor}
              transparent={true}
              opacity={0.15}
              distortionScale={0}
              temporalDistortion={0}
            />
          </mesh>
        </group>
      </Float>
      
      {/* Contact shadows for grounding */}
      <ContactShadows
        position={[0, -2, 0]}
        opacity={0.3}
        scale={8}
        blur={2}
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

// Main component with enhanced rendering
const GlassSphere: React.FC<GlassSphereProps> = ({ isProcessing = false }) => {
  const { theme } = useTheme();

  useEffect(() => {
    if (typeof window !== 'undefined' && !window.THREE) {
      window.THREE = THREE;
    }
  }, []);

  return (
    <div className="w-full h-full min-h-[clamp(200px,40vh,400px)] relative overflow-hidden">
      <ThreeErrorBoundary>
        <Canvas 
          camera={{ 
            position: [0, 0, 4], 
            fov: window.innerWidth < 768 ? 55 : 45 
          }}
          dpr={[1, 2]} 
          shadows={false}
          gl={{ 
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance',
            stencil: false,
            depth: true,
            logarithmicDepthBuffer: true
          }}
          onCreated={({ gl, scene }) => {
            gl.shadowMap.enabled = false;
            gl.toneMapping = THREE.ACESFilmicToneMapping;
            gl.toneMappingExposure = 1.2;
            scene.fog = new THREE.FogExp2(theme === 'dark' ? 0x000005 : 0xf8f9fa, 0.02);
          }}
        >
          {/* Advanced lighting setup */}
          <color attach="background" args={[theme === 'dark' ? '#000005' : '#f8f9fa']} />
          
          <ambientLight intensity={theme === 'dark' ? 0.05 : 0.2} color="#ffffff" />
          
          <pointLight 
            position={[3, 3, 3]} 
            intensity={theme === 'dark' ? 0.4 : 0.6} 
            color="#00ffff"
          />
          
          <pointLight 
            position={[-3, -3, 2]} 
            intensity={0.2} 
            color="#ff3366"
          />
          
          <spotLight
            position={[0, 5, 0]}
            angle={0.3}
            penumbra={1}
            intensity={0.3}
            color="#66ccff"
          />
          
          <Stars 
            radius={50}
            depth={50}
            count={2000}
            factor={4}
            saturation={0.8}
            fade
            speed={0.5}
          />
          
          <Environment preset="dawn" />
          
          <HolographicSphere isProcessing={isProcessing} />
          
          <OrbitControls 
            enableZoom={false}
            enablePan={false}
            rotateSpeed={0.2}
            autoRotate={false}
            enableDamping
            dampingFactor={0.05}
          />
        </Canvas>
      </ThreeErrorBoundary>
      
      {/* Futuristic overlay UI */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-4 left-4 text-xs font-mono opacity-60">
          NEURAL_INTERFACE_v2.1
        </div>
        <div className="absolute bottom-4 right-4 text-xs font-mono opacity-60">
          {isProcessing ? 'PROCESSING...' : 'READY'}
        </div>
        <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
      </div>
    </div>
  );
};

export default GlassSphere;
