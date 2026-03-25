import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/libs/loaders/GLTFLoader.js'; // with npm 
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const w = window.innerWidth;
const h = window.innerHeight;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, w/h, 0.1, 100);
camera.position.set(2,2,2);
const renderer = new THREE.WebGLRenderer(antialias=true);
renderer.setSize(w,h);

container.appendChild(renderer.domElement);

// ajouter un objet 
const geo = new THREE.BoxGeometry();
const mat = new THREE.MeshStandardMaterial();
const mesh = new THREE.Mesh(geo, mat);
scene.add(mesh)

// rendu de la scène
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

animate();

// chargement modèle 
const loader = new GLTFLoader();
loader.load('model.glb', (gltf) => {
    scene.add(gltf.scene);
});

