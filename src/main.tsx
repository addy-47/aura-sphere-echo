
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Ensure THREE is available globally for compatibility
import * as THREE from 'three';
window.THREE = THREE;

createRoot(document.getElementById("root")!).render(<App />);
