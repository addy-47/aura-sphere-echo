
// Import Three.js first to ensure it's available globally
import * as THREE from 'three';

// Make THREE available globally for drei
window.THREE = THREE;

import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Log that THREE is initialized
console.log("THREE initialized globally:", !!window.THREE, "version:", THREE.REVISION);

createRoot(document.getElementById("root")!).render(<App />);
