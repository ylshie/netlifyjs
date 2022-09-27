//import {loadGLTF} from "./loader.js";
import {GLTFLoader} from "./libs/three/GLTFLoader.js"
//import {CSS3DRenderer} from "./libs/three.js-r132/examples/jsm/renderers/CSS3DRenderer.js";;
import {CSS3DRenderer} from "./libs/three/CSS3DRenderer.js";
import {mockWithVideo} from './libs/camera-mock.js';
//import IMAGE from "./libs/mindar/src/image-target/index"
//import MindARThree from "./libs/mindar/src/image-target/three.js"
import MindARThree from "./libs/mindar/mindar-image-three.prod.js"

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
export const loadModel = async(path) => {
    raccoon = await loadGLTF(path);
    //raccoon = await loadGLTF('./assets/models/musicband-raccoon/scene.gltf');
}

//loadModel();

// mockWithVideo('./assets/mock-videos/face1.mp4');
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

var sourceVideo = null;
var sourceDuration = 0;
export function getSourceVideo() {
  return sourceVideo;
}
export function getSourceDuration() {
  return sourceDuration;
}

export function startMindAR() {
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

  const url = new URL(window.location);
  let videofile = url.searchParams.get('video'); // => 'hello'
  if (videofile) 
      console.log("from video: " + videofile);
  else
      console.log("from webcam");

  
  const start = async() => {
      if (videofile) {
          //mockWithVideo("./assets/mock-videos/face1.mp4")
          //sourceVideo = mockWithVideo("./assets/mock-videos/" + videofile)
          sourceVideo = mockWithVideo("http://localhost:3000/" + videofile)
          sourceDuration = sourceVideo.duration;
          var jsonFile = "http://localhost:3000/dance.json";
          //var json = JSON.parse(jsonFile);

          var request = new XMLHttpRequest();
          
          request.open("GET", jsonFile, false);
          request.onreadystatechange = function() {
            if ( request.readyState === 4 && request.status === 200 ) {
              console.log("json file ready")
              var json = JSON.parse(request.responseText);
              console.log(request.responseText);
            }
          }
          request.onprogress = (event) => { 
              connsole.log("downloaded " + event.lengthComputable + " of " + event.total)
          }
          request.send(null);
      }
      //} else {
      await mindarThree.start();
      const video = document.createElement("video");
      video.crossOrigin = "anonymous";
      video.id = "teacher_video";
      video.loop = true;
      video.src = "./assets/mock-videos/dance.mp4";
      //video.width = "640px"
      //video.height = "320px"
      document.body.appendChild(video);
    
      renderer.setAnimationLoop(() => {
        try {
          renderer.render(scene, camera);
        } catch(e) {
          console.log("render crash");
        }  
      });
      //}
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

