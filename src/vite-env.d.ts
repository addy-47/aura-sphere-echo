
/// <reference types="vite/client" />
/// <reference types="@react-three/fiber" />
/// <reference types="@react-three/drei" />
/// <reference types="three" />

// Extend the Window interface to include THREE
interface Window {
  THREE: typeof import('three');
}
