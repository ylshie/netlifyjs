//import {loadGLTF} from "./loader.js";
import {GLTFLoader} from "./GLTFLoader.js"
//import {CSS3DRenderer} from "./libs/three.js-r132/examples/jsm/renderers/CSS3DRenderer.js";;
import {CSS3DRenderer} from "./CSS3DRenderer.js";
//import {mockWithVideo} from './libs/camera-mock.js';
//import IMAGE from "./libs/mindar/src/image-target/index"
//import MindARThree from "./libs/mindar/src/image-target/three.js"
import MindARThree from "./mindar/mindar-image-three.prod.js"

//

const loadGLTF = (path) => {
  return new Promise((resolve, reject) => {
    const loader = new GLTFLoader();
    loader.load(path, (gltf) => {
      resolve(gltf);
    });
  });
}

const THREE = window.MINDAR.IMAGE.THREE;

window.CSS3DRenderer = CSS3DRenderer;

var raccoon = null;
const loadModel = async() => {
    raccoon = await loadGLTF('./assets/models/musicband-raccoon/scene.gltf');
}

loadModel();

const mindarThree = new window.MINDAR.IMAGE.MindARThree({
// const mindarThree = MindARThree({
  container: document.body,
  imageTargetSrc: './assets/targets/logo2.mind',
  filterMinCF: 1,
  filterBeta: 10000,
  missTolerance: 0,
  warmupTolerance: 0,
  uiScanning: "no",
  uiLoading: "no",
});

function startMindAR() {
  //  
  const {renderer, scene, camera} = mindarThree;

  const anchor = mindarThree.addAnchor(0);
  const geometry = new THREE.PlaneGeometry(1, 0.55);
  const material = new THREE.MeshBasicMaterial( {color: 0x00ffff, transparent: true, opacity: 0.5} );
  const plane = new THREE.Mesh( geometry, material );
  anchor.group.add(plane);

  const light = new THREE.HemisphereLight( 0xffffff, 0xbbbbff, 1 );
  scene.add(light);

  if (raccoon) {
    raccoon.scene.scale.set(0.1, 0.1, 0.1);
    raccoon.scene.position.set(0, -0.4, 0);
    anchor.group.add(raccoon.scene);
  }

  const start = async() => {
    // Sample
    if (mindarThree.shouldFaceUser) {
      console.log(mindarThree.shouldFaceUser);
      mindarThree.shouldFaceUser = true;
    } else {
      console.log("no mindarThree.shouldFaceUser existed");
    }
    await mindarThree.start();
    renderer.setAnimationLoop(() => {
      try {
        renderer.render(scene, camera);
      } catch(e) {
        console.log("render crash");
      }  
    });
  }
  start();
}

function startTimer() {
  setTimeout(function () {
      if (raccoon) {
          startMindAR()
      } else {
          setTimeout(startTimer, 100)
      }
  }, 100)
}
document.addEventListener('DOMContentLoaded', () => {
    startTimer();
});
