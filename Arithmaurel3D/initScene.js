import * as THREE from './lib/three.module.js';
import { OrbitControls } from './lib/OrbitControls.js';
var camera, controls, scene, renderer;

function initScene() {
    // Scene
    scene = new THREE.Scene();
    // Rendu sur la page
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    //Camera
    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 2000);
    camera.position.set(25, 10, 0);

    // Controles
    controls = new OrbitControls(camera, renderer.domElement);
    //controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
    // controls.dampingFactor = 0.05;
    controls.screenSpacePanning = false;
    controls.minDistance = 5;
    controls.maxDistance = 30;
}

export { camera, controls, scene, renderer, initScene }