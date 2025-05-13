
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Ensure THREE is available globally for compatibility
import * as THREE from 'three';

// Make THREE available globally
window.THREE = THREE;

// Log THREE initialization
console.log("THREE initialized in main:", !!window.THREE);

createRoot(document.getElementById("root")!).render(<App />);
