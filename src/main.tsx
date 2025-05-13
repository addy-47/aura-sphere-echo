
// Import Three.js first to ensure it's available before any other imports
import * as THREE from 'three';

// Make THREE available globally - CRITICAL for drei compatibility
window.THREE = THREE;
console.log("THREE initialized:", !!window.THREE, THREE.REVISION);

import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById("root")!).render(<App />);
