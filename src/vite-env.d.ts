
/// <reference types="vite/client" />
/// <reference types="@react-three/fiber" />
/// <reference types="@react-three/drei" />
/// <reference types="three" />

// Explicitly define THREE on window for global access
declare global {
  interface Window {
    THREE: typeof import('three');
  }
}

// Make sure to export something to make this a module
export {};
