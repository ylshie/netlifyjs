//import {loadGLTF} from "./loader.js";
import {GLTFLoader} from "./libs/three/GLTFLoader.js"
//import {CSS3DRenderer} from "./libs/three.js-r132/examples/jsm/renderers/CSS3DRenderer.js";;
import {CSS3DRenderer} from "./libs/three/CSS3DRenderer.js";
import {mockWithVideo} from './libs/camera-mock.js';
//import IMAGE from "./libs/mindar/src/image-target/index"
//import MindARThree from "./libs/mindar/src/image-target/three.js"
import {MindARThree} from "./libs/mindar/mindar-image-three.prod.js"
import {createChromaMaterial} from './libs/chroma-video.js';

//
const configVideo = {
  renderAlpha: false,
  renderVideo: false,
};

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
  //imageTargetSrc: './assets/targets/logo2.mind',
  imageTargetSrc: './assets/targets/shirts.mind',
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

function IsSafari() {
  // Safari 3.0+ "[object HTMLElementConstructor]" 
  var isSafari = /constructor/i.test(window.HTMLElement) || (function (p) { return p.toString() === "[object SafariRemoteNotification]"; })(!window['safari'] || (typeof safari !== 'undefined' && window['safari'].pushNotification));

  console.log("IsSafari=" + (isSafari ? "yes": "no") + " user agent=" + navigator.userAgent)

  return isSafari;
}

function addRaccoon() {
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

    return renderer;
}

function addDemoVideo() {
    const {renderer, scene, camera} = mindarThree;
    const video = document.createElement("video");
      
    video.crossOrigin = "anonymous";
    video.src = "./assets/mock-videos/girl.mp4"
    video.loop = true;
    video.muted = true;
    video.playsInline = true;

    const anchor = mindarThree.addAnchor(1);
    const texture   = new THREE.VideoTexture(video);
    const geometry  = new THREE.PlaneGeometry(1, 990/890);
    const material  = createChromaMaterial(texture, 0x00ff00);
    const plane = new THREE.Mesh(geometry, material);
    
    plane.rotation.x = Math.PI/2;
    plane.position.y = 0.7;
    plane.scale.multiplyScalar(4);

    anchor.group.add(plane);
    
    anchor.onTargetFound = () => {
      video.play();
    }
    anchor.onTargetLost = () => {
      video.pause();
    }

    scene.add(plane);

    return renderer;
}

function addDemoVideo2() {
    const {renderer, scene, camera} = mindarThree;

    const video = document.createElement("video");
    video.crossOrigin = "anonymous";
    //video.src = "./assets/videos/guitar-player.mp4"
    video.src = "./assets/mock-videos/girl.mp4"
    video.loop = true;
    video.muted = true;
    video.playsInline = true;
    //video.play();
    video.pause();
    const texture   = new THREE.VideoTexture(video);
    const geometry  = new THREE.PlaneGeometry(1, 990/890);
    const material  = createChromaMaterial(texture, 0x00ff00);
    const plane1    = new THREE.Mesh(geometry, material);
    const plane2    = new THREE.Mesh(geometry, material);
    //plane.rotation.x = Math.PI/2;
    //plane.position.y = 0.0;
    //plane1.scale.multiplyScalar(2);

    const anchor1 = mindarThree.addAnchor(0);
    const anchor2 = mindarThree.addAnchor(1);
    anchor1.group.add(plane1);
    anchor2.group.add(plane2);
    
    var count = 0
    function playVideo() {
        count ++
        video.play();
    }
    function stopVideo() {
        count --
        if (count == 0)
          video.pause()
    }
    anchor1.onTargetFound = () => {
    //    video.play();
        console.log("anchor 1 found")
        playVideo()
    }
    anchor2.onTargetFound = () => {
    //  video.play();
        console.log("anchor 2 found")
        playVideo()
    }
    anchor1.onTargetLost = () => {
        //video.pause();
        console.log("anchor 1 lost")
        stopVideo()
    }
    anchor2.onTargetLost = () => {
      //video.pause();
        console.log("anchor 2 lost")
        stopVideo()
    }
}
export function startMindAR(video_file) {
    const {renderer, scene, camera} = mindarThree;
    const url = new URL(window.location);
    
    //addRaccoon();
    addDemoVideo2();

    let videofile = url.searchParams.get('video'); // => 'hello'
    if (videofile) 
        console.log("from video: " + videofile);
    else
        console.log("from webcam");

  
  const start = async() => {
      if (videofile) {
          sourceVideo = mockWithVideo("http://localhost:3000/" + videofile)
          sourceDuration = sourceVideo.duration;
      }
      //} else {
      await mindarThree.start();
      if (! videofile) {
        const video = document.createElement("video");
        video.crossOrigin = "anonymous";
        video.id = "teacher_video";
        video.loop = true;
        video.controls = true;
        if (IsSafari()) {
            video.muted = true;
            video.playsInline = true;
        }
        //video.playsinline = true;
        video.src = "./assets/mock-videos/" + video_file; //dance.mp4";
        //video.width = "640px"
        //video.height = "320px"
        document.body.appendChild(video);
        doLoad();
        video.play() // KILLME: Arthur, should remove
      
        setTimeout(function() {
          //console.log("FUCK Start")
          //video.play(); // KILLME
        }, 100)
      }
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

var playvideo = null;
var c1;
var c2;
var ctx1;
var ctx2;
var video_width;
var video_height;

var clock_v = null; //new THREE.Clock();
function timerCallback() {
  if (playvideo.paused || playvideo.ended) {
    return;
  }
  //return; // KILLME: Skip to drawing
  if (configVideo.renderVideo) {
    if (video_width == 0 || video_height == 0) {
      video_width   = playvideo.videoWidth;
      video_height  = playvideo.videoHeight;
  
      console.log("video size is " + video_width + " x " + video_height)
  
      c1.width  = video_width;
      c2.width  = video_width;
      c1.height = video_height;
      c2.height = video_height;
    }

    if (clock_v == null) {
        clock_v = new THREE.Clock();
    } else {
        var delta = clock_v.getDelta();
        console.log("video FPS=" + 1 / delta);
    }
    computeFrame();
  }
  //let self = this;
  setTimeout(() => timerCallback(), 20);
}

function doLoad() {
  playvideo = document.querySelector("#teacher_video");
  c1 = document.createElement('canvas');; ////document.getElementById("c1"); 
  c2 = document.getElementById("video_canvas");
  ctx1 = c1.getContext("2d");
  ctx2 = c2.getContext("2d");

  //let self = this;
  c1.width  = video_width;
  c2.width  = video_width;
  c1.height = video_height;
  c2.height = video_height;

  playvideo.addEventListener("play", function() {
      video_width   = playvideo.videoWidth;
      video_height  = playvideo.videoHeight;

      console.log("video size is " + video_width + " x " + video_height)

      c1.width  = video_width;
      c2.width  = video_width;
      c1.height = video_height;
      c2.height = video_height;

      timerCallback();
    }, false);
}

function findChromaKey(data) {
  let l = data.length;
  let colors = {};
  var i = 0;

  for (i = 0; i < l; i+=4) {
      var color = "#" + data[i+0] + "" + data[i+1] + "" + data[i+2]
      if (colors[color])
        colors[color].num += 1;
      else
        colors[color] = {num: 1, r: data[i+0], g: data[i+1], b: data[i+2]};
  }

  let sortable = [];
  for (var key in colors) {
      sortable.push(colors[key]);
  }

  sortable.sort(function(a, b) {
      return b.num - a.num;
  });

  const dt = 110;
  var top = sortable[0];
  if (top.r == 0 && top.g == 0 && top.b == 0)
    top = sortable[1];
  var limit = 0; //top.num * 0.0005;
  const upper_r  = (top.r + dt) < 255 ? (top.r + dt): 255;
  const bottom_r = (top.r - dt) >   0 ? (top.r - dt):   0;
  const upper_g  = (top.g + dt) < 255 ? (top.g + dt): 255
  const bottom_g = (top.g - dt) >   0 ? (top.g - dt):   0;
  const upper_b  = (top.b + dt) < 255 ? (top.b + dt): 255;
  const bottom_b = (top.b - dt) >   0 ? (top.g - dt):   0;
  var max_r = top.r
  var min_r = top.r
  var max_g = top.g
  var min_g = top.g
  var max_b = top.b
  var min_b = top.b
  for (var i = 1; i < sortable.length; i++) {
      var current = sortable[i];

      if (current.num < limit) break;
      if (current.r < bottom_r || current.r > upper_r) continue;
      if (current.g < bottom_g || current.g > upper_g) continue;
      if (current.b < bottom_b || current.b > upper_b) continue;
      
      if (current.r > max_r) max_r = current.r;
      if (current.g > max_g) max_g = current.g;
      if (current.b > max_b) max_b = current.b;
      if (current.r < min_r) min_r = current.r;
      if (current.g < min_g) min_g = current.g;
      if (current.b < min_b) min_b = current.b;
  }
  var chroma_range = {max_r: max_r, max_g: max_g, max_b: max_b,
    min_r: min_r, min_g: min_g, min_b: min_b}
  
  console.log(top);
  console.log(sortable)

  return chroma_range;
}

function computeFrame() {
  if (! video_width) return;
  if (! video_height) return;
  
  ctx1.drawImage(playvideo, 0, 0, video_width, video_height);
  let frame = ctx1.getImageData(0, 0, video_width, video_height);

  if (configVideo.renderAlpha) {
    let l = frame.data.length / 4;
    var chroma = findChromaKey(frame.data);

    for (let i = 0; i < l; i++) {
      let r = frame.data[i * 4 + 0];
      let g = frame.data[i * 4 + 1];
      let b = frame.data[i * 4 + 2];

      if (r <= chroma.max_r && g <= chroma.max_g && b <= chroma.max_b &&
          r >= chroma.min_r && g >= chroma.min_g && b >= chroma.min_b )
        frame.data[i * 4 + 3] = 0;
    }
  }
  
  ctx2.putImageData(frame, 0, 0);

  return;
}

function startTimer() {
  setTimeout(function () {
      if (raccoon) {
          startMindAR("avatar.mp4"); //"dance.mp4"  // "pressmaster.mp4"
      } else {
          setTimeout(startTimer, 100)
      }
  }, 100)
}

document.addEventListener('DOMContentLoaded', () => {
    //KILLME
    startTimer();
});

