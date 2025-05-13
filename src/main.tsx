
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Import Three.js first to ensure it's available before any other imports
import * as THREE from 'three';

// Make THREE available globally
window.THREE = THREE;

// Log THREE initialization
console.log("THREE initialized in main:", !!window.THREE);

createRoot(document.getElementById("root")!).render(<App />);
