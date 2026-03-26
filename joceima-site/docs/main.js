import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'; // with npm 
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';

const w = window.innerWidth;
const h = window.innerHeight;

function create3DViewer(containerId, modelPath, texturePath, xOffsetGui = 0)
{
  // initiatlisation 
  const container = document.getElementById(containerId);
  if(!container) {
    console.log(`le container ${containerId} n'existe pas`);
    return;
  }

  // scène et caméra
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, w/h, 0.1, 100);
  camera.position.set(-35,30,-3);
  camera.lookAt(0,10,0);
  const renderer = new THREE.WebGLRenderer({antialias: true});
  renderer.setSize(container.clientWidth, container.clientHeight);
  container.appendChild(renderer.domElement);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1;

  // objets
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

  // lumière et interface
  const couleurInitiale = 0xffffff;
  const ambientLight = new THREE.AmbientLight( couleurInitiale, Math.PI ); // soft white light
  scene.add( ambientLight );

  const gui = new GUI({title: 'Contrôles des lumières', autoPlace: true});
  gui.domElement.style.marginRight = `${xOffsetGui}px`;
  const ambientFolder = gui.addFolder('Ambient');
  ambientFolder.add(ambientLight, "visible");
  ambientFolder.add(ambientLight, "intensity", 0.0, Math.PI);
  ambientFolder.addColor(ambientLight, 'color').name('Couleur');
  ambientFolder.open();

  // chargement modèle 
  const loader = new GLTFLoader();
  //loader.setPath(`public/`);
  const textureLoader = new THREE.TextureLoader();
  const maTexture = textureLoader.load(texturePath, 
      () => console.log("Texture chargée physiquement !"),
      undefined,
      (err) => console.error("Le serveur refuse toujours l'image :", err)
  );
  maTexture.flipY = false;
  loader.load(
      modelPath, 
      (gltf) => {
          const model = gltf.scene;
          model.traverse((child) => {
            if (child.isMesh) {
              child.material.map = maTexture;
              child.material.needsUpdate = true;
              child.geometry.computeVertexNormals();
              if(child.material) {
                child.material.flatShading = false;
              }
            }
          });
          model.rotateX(-Math.PI/2)
          scene.add(model);
          console.log("Le modèle est chargée dans la scène");
      },
      (xhr) => {
          console.log((xhr.loaded / xhr.total * 100) + '% loaded');
      },
      (error) => {
          console.error('Erreur lors du chargement: ', error)
      }
  );

  if(container) {
    container.appendChild(renderer.domElement);
  } else {
    console.error("container3D n'a pas été trouvé dans le DOM !");
    document.body.appendChild(renderer.domElement);
  }

  // Orbit controles 
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.target.set(0,10,0);
  controls.update();

  // rendu de la scène
  function animate() {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
  }
  animate();

  // event listenner resize
  window.addEventListener("resize", function(){
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
  });
}



create3DViewer(
  'container3D_1', 
  'public/oruk_chef_model/oruk_warhammer.glb', 
  'public/oruk_chef_model/oruk_warhammer_u0_v0_diffuse.png',
  0
);
create3DViewer(
  'container3D_2', 
  'public/moon_boss_model/moon_boss.glb', 
  'public/moon_boss_model/moon_boss_u0_v0_diffuse.png', 
  260
);





