import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';
import { GLTFLoader } from 'https://unpkg.com/three@0.160.0/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'https://unpkg.com/three@0.160.0/examples/jsm/controls/OrbitControls.js';
import { DRACOLoader } from 'https://unpkg.com/three@0.160.0/examples/jsm/loaders/DRACOLoader.js';




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
  scene.background = new THREE.Color(0x535353)
  //const camera = new THREE.PerspectiveCamera(60, w/h, 0.1, 100);
  //const rect = container.getBoundingClientRect();
  const w = container.clientWidth;
  const h = container.clientHeight;
  const camera = new THREE.PerspectiveCamera(60, w/h, 0.1, 5000);
  camera.position.set(-20,30,-3);
  camera.lookAt(0,10,0);
  const renderer = new THREE.WebGLRenderer({antialias: true});
  renderer.setSize(container.clientWidth, container.clientHeight);
  container.appendChild(renderer.domElement);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1;

  // objets
  //const groundGeometry = new THREE.PlaneGeometry(100, 100, 160, 160);
  //groundGeometry.rotateX(-Math.PI/2);
  //const groundMaterial = new THREE.MeshStandardMaterial({
  //  color : 0x555555,
  //  side : THREE.DoubleSide
  //});
  //const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);
  //scene.add(groundMesh);
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
  const dLoader = new DRACOLoader();
  dLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.7/');
  dLoader.setDecoderConfig({type: 'js'});
  loader.setDRACOLoader(dLoader);

  //loader.setPath(`public/`);
  const textureLoader = new THREE.TextureLoader();
  const maTexture = textureLoader.load(texturePath, 
      () => console.log("Texture chargée physiquement !"),
      undefined,
      (err) => console.error("Le serveur refuse toujours l'image :", err)
  );
  maTexture.flipY = false;
  const model = null;
  loader.load(
      modelPath, 
      (gltf) => {
          model = gltf.scene;
          
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

  let directionnalLight = new THREE.DirectionalLight(couleurInitiale, 1.0);
  directionnalLight.position(-20, 30, 3);
  directionnalLight.position.set(model.position);

  if(container) {
    container.appendChild(renderer.domElement);
  } else {
    console.error("container3D n'a pas été trouvé dans le DOM !");
    document.body.appendChild(renderer.domElement);
  }

  // Orbit controles 
  const controls = new OrbitControls(camera, renderer.domElement);
  //controls.enableDamping = true;
  //controls.enableZoom = false;
  //controls.target.set(0,10,0);
  //controls.update();

  controls.enableDamping = true; // Indispensable pour la fluidité
  controls.dampingFactor = 0.05;
  controls.zoomSpeed = 1.2;      // Augmente un peu la vitesse pour les petits écrans

  // BLOQUE le zoom molette si tu veux utiliser tes futurs boutons, 
  // ou laisse-le à true si tu veux garder la souris.
  controls.enableZoom = true;

  // rendu de la scène
  function animate() {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
  }
  animate();

  // event listenner resize
  window.addEventListener("resize", function(){
    const width = container.clientWidth;
    const height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
  });

}

// creation des 3D viewer
//create3DViewer(
//  'container1', 
//  'public/oruk_chef_model/oruk_warhammer.glb', 
//  'public/oruk_chef_model/oruk_warhammer_u0_v0_diffuse.png',
//  0
//);
//
//create3DViewer(
//  'container2', 
//  'public/moon_boss_model/moon_boss.glb', 
//  'public/moon_boss_model/moon_boss_u0_v0_diffuse.png', 
//  260
//);
//


window.addEventListener('DOMContentLoaded', () => {
    create3DViewer('container1', 'public/oruk_chef_model/oruk_warhammer.glb', 'public/oruk_chef_model/oruk_warhammer_u0_v0_diffuse.webp');
    create3DViewer('container2', 'public/moon_boss_model/moon_boss.glb', 'public/moon_boss_model/moon_boss_u0_v0_diffuse.webp');
});





