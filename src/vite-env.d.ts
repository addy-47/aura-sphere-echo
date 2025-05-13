
/// <reference types="vite/client" />
/// <reference types="@react-three/fiber" />
/// <reference types="@react-three/drei" />
/// <reference types="three" />

// Define THREE on window for global access
declare global {
  interface Window {
    THREE: typeof import('three');
  }
}

export {};
