import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'; // with npm 
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';

const w = window.innerWidth;
const h = window.innerHeight;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, w/h, 0.1, 100);
camera.position.set(-35,30,-3);
camera.lookAt(0,10,0);

const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(w,h);

renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1;

let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;

const gui = new GUI({title: 'Contrôles des lumières'});

//container.appendChild(renderer.domElement);

// ajouter un objet 
const groundGeometry = new THREE.PlaneGeometry(100, 100, 160, 160);
groundGeometry.rotateX(-Math.PI/2);
const groundMaterial = new THREE.MeshStandardMaterial({
  color : 0x555555,
  side : THREE.DoubleSide
});
const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);
scene.add(groundMesh);

const axesHelper = new THREE.AxesHelper( 5 );
scene.add( axesHelper );

// add light
const couleurInitiale = 0xffffff;
const ambientLight = new THREE.AmbientLight( couleurInitiale, Math.PI ); // soft white light
scene.add( ambientLight );

// Ambient light GUI params
const ambientFolder = gui.addFolder('Ambient');
ambientFolder.add(ambientLight, "visible");
ambientFolder.add(ambientLight, "intensity", 0.0, Math.PI);
ambientFolder.addColor(ambientLight, 'color').name('Couleur');
ambientFolder.open();

//const camFolder = gui.addFolder('Caméra position');
//camFolder.add(camera.position, 'x', -100,100,0.1).name('Gauche/Droite(X)');
//camFolder.add(camera.position, 'y', -100,100,0.1).name('haut/Bas(Y)');
//camFolder.add(camera.position, 'z', -100,100,0.1).name('Prodondeur(Z)');


// chargement modèle 
const loader = new GLTFLoader();
loader.setPath(`public/`);

const textureLoader = new THREE.TextureLoader();
// On charge l'image SANS le préfixe public/
const maTexture = textureLoader.load('./public/oruk_warhammer_u0_v0_diffuse.png', 
    () => console.log("Texture chargée physiquement !"),
    undefined,
    (err) => console.error("Le serveur refuse toujours l'image :", err)
);
maTexture.flipY = false;

loader.load(
    `oruk_warhammer.glb`, 
    (gltf) => {
        const model_oruk = gltf.scene;
        model_oruk.traverse((child) => {
          if (child.isMesh) {
            child.material.map = maTexture;
            child.material.needsUpdate = true;

            child.geometry.computeVertexNormals();
            if(child.material) {
              child.material.flatShading = false;
            }
          }
        });
        model_oruk.rotateX(-Math.PI/2)
        scene.add(model_oruk);
        console.log("Le modèle est chargée dans la scène");

       
    },
    (xhr) => {
        console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    },
    (error) => {
        console.error('Erreur lors du chargement: ', error)
    }

);

const container = document.getElementById("container3D");

if(container) {
  container.appendChild(renderer.domElement);
} else {
  console.error("container3D n'a pas été trouvé dans le DOM !");
  document.body.appendChild(renderer.domElement);
}

const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0,10,0);
controls.update();

// rendu de la scène
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

// event listenner
window.addEventListener("resize", function(){
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
});

document.onmousemove = (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
}

animate();

