
import React, { useState, useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { useMood } from '../contexts/MoodContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Check, Plus, X } from 'lucide-react';

// Animation for particles going into or out of sphere
const AnimatedParticle = ({ position, targetPosition, onComplete, isRemoval = false }) => {
  const meshRef = useRef<THREE.Mesh>();
  const startTime = useRef(Date.now());
  const duration = 1000; // Animation duration in ms
  
  useFrame(() => {
    if (!meshRef.current) return;
    
    const elapsed = Date.now() - startTime.current;
    const progress = Math.min(elapsed / duration, 1);
    
    // Simple easing function
    const easeOutQuart = 1 - Math.pow(1 - progress, 4);
    
    if (isRemoval) {
      // When removing, reverse the animation - start from center, go outward
      meshRef.current.position.x = THREE.MathUtils.lerp(targetPosition[0], position[0], easeOutQuart);
      meshRef.current.position.y = THREE.MathUtils.lerp(targetPosition[1], position[1], easeOutQuart);
      meshRef.current.position.z = THREE.MathUtils.lerp(targetPosition[2], position[2], easeOutQuart);
      
      // Scale up as it moves away from center
      const scale = THREE.MathUtils.lerp(0.1, 1, easeOutQuart);
      meshRef.current.scale.set(scale, scale, scale);
    } else {
      // Adding - start from outside, move to center
      meshRef.current.position.x = THREE.MathUtils.lerp(position[0], targetPosition[0], easeOutQuart);
      meshRef.current.position.y = THREE.MathUtils.lerp(position[1], targetPosition[1], easeOutQuart);
      meshRef.current.position.z = THREE.MathUtils.lerp(position[2], targetPosition[2], easeOutQuart);
      
      // Scale down as it approaches center
      const scale = THREE.MathUtils.lerp(1, 0.1, easeOutQuart);
      meshRef.current.scale.set(scale, scale, scale);
    }
    
    // Animation complete
    if (progress === 1) {
      onComplete();
    }
  });
  
  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[0.2, 16, 16]} />
      <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.5} />
    </mesh>
  );
};

// Mini sphere for personality traits visualization
const MiniSphere = ({ traits, removedTrait }) => {
  const { moodColor } = useMood();
  const sphereRef = useRef<THREE.Mesh>();
  const [particles, setParticles] = useState([]);
  const previousTraitsCount = useRef(traits.length);
  
  // Handle traits change - either addition or removal
  useEffect(() => {
    // Addition of a trait
    if (traits.length > previousTraitsCount.current) {
      const id = Date.now().toString();
      // Generate random position outside sphere
      const randomPosition = [
        (Math.random() - 0.5) * 5,
        (Math.random() - 0.5) * 5,
        (Math.random() - 0.5) * 5
      ];
      setParticles(prev => [...prev, { id, position: randomPosition, isRemoval: false }]);
    }
    
    // Removal of a trait
    if (removedTrait && traits.length < previousTraitsCount.current) {
      const id = Date.now().toString();
      // Generate random position outside sphere for the particle to travel to
      const randomDestination = [
        (Math.random() - 0.5) * 5,
        (Math.random() - 0.5) * 5,
        (Math.random() - 0.5) * 5
      ];
      setParticles(prev => [...prev, { id, position: randomDestination, isRemoval: true }]);
    }
    
    previousTraitsCount.current = traits.length;
  }, [traits, removedTrait]);
  
  // Remove particle when animation completes
  const removeParticle = (id) => {
    setParticles(prev => prev.filter(p => p.id !== id));
  };
  
  // Animate sphere
  useFrame(({ clock }) => {
    if (!sphereRef.current) return;
    
    sphereRef.current.rotation.y = clock.getElapsedTime() * 0.2;
    sphereRef.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.5) * 0.2;
    
    // Pulse effect based on number of traits
    const pulse = Math.sin(clock.getElapsedTime() * 2) * 0.03 + 1;
    
    // Dynamic size based on number of traits - more traits = larger sphere
    const baseScale = 0.5 + (traits.length * 0.1); // Increased scaling factor for more noticeable effect
    sphereRef.current.scale.set(
      baseScale * pulse, 
      baseScale * pulse, 
      baseScale * pulse
    );
  });

  return (
    <>
      <mesh ref={sphereRef}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshStandardMaterial 
          color={moodColor}
          emissive={moodColor}
          emissiveIntensity={0.3}
          transparent
          opacity={0.8}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>
      
      {/* Particle animations */}
      {particles.map(particle => (
        <AnimatedParticle 
          key={particle.id}
          position={particle.position}
          targetPosition={[0, 0, 0]}
          onComplete={() => removeParticle(particle.id)}
          isRemoval={particle.isRemoval}
        />
      ))}
      
      {/* Ambient light for overall illumination */}
      <ambientLight intensity={0.3} />
      
      {/* Point light in the center */}
      <pointLight position={[0, 0, 0]} intensity={1} distance={5} color={moodColor} />
      
      {/* Directional light for shadows */}
      <directionalLight position={[5, 5, 5]} intensity={0.5} />
    </>
  );
};

// Tree node component
interface TreeNodeProps {
  trait: string;
  onRemove: () => void;
}

const TreeNode: React.FC<TreeNodeProps> = ({ trait, onRemove }) => {
  return (
    <div className="flex items-center gap-2 bg-secondary/20 p-2 rounded-lg">
      <span className="flex-1">{trait}</span>
      <Button 
        variant="ghost" 
        size="icon" 
        className="h-6 w-6" 
        onClick={onRemove}
      >
        <X className="h-3 w-3" />
      </Button>
    </div>
  );
};

// Main component
const PersonalityTree: React.FC = () => {
  const [traits, setTraits] = useState<string[]>([
    "Creative", "Analytical", "Empathetic"
  ]);
  const [newTrait, setNewTrait] = useState("");
  const [removedTrait, setRemovedTrait] = useState<string | null>(null);
  
  const handleAddTrait = () => {
    if (newTrait.trim() && !traits.includes(newTrait.trim())) {
      setTraits([...traits, newTrait.trim()]);
      setNewTrait("");
    }
  };
  
  const removeTrait = (index: number) => {
    // Set the removed trait to trigger the outgoing animation
    setRemovedTrait(traits[index]);
    
    // Then remove it from the array
    setTraits(traits.filter((_, i) => i !== index));
    
    // Reset after a moment so we can track new removals
    setTimeout(() => {
      setRemovedTrait(null);
    }, 100);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Personality Traits
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="min-h-[300px] bg-black/5 dark:bg-white/5 rounded-lg overflow-hidden">
            <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
              <MiniSphere traits={traits} removedTrait={removedTrait} />
              <OrbitControls 
                enableZoom={false}
                enablePan={false}
                rotateSpeed={0.5}
              />
            </Canvas>
          </div>
          
          <div>
            <div className="flex gap-2 mb-4">
              <Input
                value={newTrait}
                onChange={(e) => setNewTrait(e.target.value)}
                placeholder="Add personality trait"
                className="flex-1"
                onKeyPress={(e) => e.key === 'Enter' && handleAddTrait()}
              />
              <Button onClick={handleAddTrait}>
                <Plus className="h-4 w-4 mr-1" />
                Add
              </Button>
            </div>
            
            <div className="space-y-2 max-h-[240px] overflow-y-auto scrollbar-none pr-2">
              {traits.map((trait, index) => (
                <TreeNode 
                  key={index} 
                  trait={trait} 
                  onRemove={() => removeTrait(index)}
                />
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PersonalityTree;
