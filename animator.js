import * as Kalidokit from "./Kalidokit"
import * as xxx from "./sdk/build/araisdk.prod"
//import * as xxx from "./sdk/build/araisdk.dm"
//import {currentVrm, updateVRM, loadVRM, setVRM}from "./vrmlib"
import {updateVRM, loadVRM}from "./vrmlib"

const url = new URL(window.location);
let detect = url.searchParams.get('video'); // => 'hello'
if (detect) 
    console.log("message is " + detect);
else
    console.log("no message");

let layout = url.searchParams.get('layout'); // => 'hello'
if (layout) 
    console.log("layout is " + layout);
else
    layout = "ra"

let opacity = url.searchParams.get('opacity'); // => 'hello'
if (opacity) 
    console.log("opacity is " + opacity);
else
    opacity = 0.8

let _mirror = url.searchParams.get('mirror'); // => 'hello'
var mirror = false;
if (_mirror) 
    mirror = (_mirror == "1")? true: false;
else
    mirror = false
    //import {GLTFLoader} from "./libs/GLTFLoader.js"

//let x = xxx;
/* THREEJS WORLD SETUP */

//var domAnimator = null;

// renderer
const rendererUser = new THREE.WebGLRenderer({ alpha: true });
const init_width = window.innerWidth / 3;
const init_height = window.innerHeight / 2;
rendererUser.setSize(init_width, init_height);
rendererUser.setPixelRatio(window.devicePixelRatio);
//domAnimator = renderer.domElement;
rendererUser.domElement.style.position = "absolute"
rendererUser.domElement.style.left = 0;
rendererUser.domElement.style.top = window.innerHeight / 2;

document.body.appendChild(rendererUser.domElement);

const rendererTeacher = new THREE.WebGLRenderer({ alpha: true });
const init_width_2 = window.innerWidth;
const init_height_2 = window.innerHeight;
rendererTeacher.setSize(init_width_2, init_height_2);
rendererTeacher.setPixelRatio(window.devicePixelRatio);
//domAnimator = renderer.domElement;
rendererTeacher.domElement.style.position = "absolute"
rendererTeacher.domElement.style.left = 0;
rendererTeacher.domElement.style.top = 0;

document.body.appendChild(rendererTeacher.domElement);

// camera
const orbitCameraUser = new THREE.PerspectiveCamera(35, init_width / init_height, 0.1, 1000);
orbitCameraUser.position.set(0.0, 1.0, 4.0);
//orbitCamera.position.set(0.0, 1.4, 0.7);

const orbitCameraTeacher = new THREE.PerspectiveCamera(35, init_width_2 / init_height_2, 0.1, 1000);
orbitCameraTeacher.position.set(0.0, 1.0, 4.0);

// controls
//arthur
const orbitControls = new THREE.OrbitControls(orbitCameraUser, rendererUser.domElement);
orbitControls.screenSpacePanning = true;
orbitControls.target.set(0.0, 1.0, 0.0);
//orbitControls.target.set(0.0, 1.4, 0.0);
orbitControls.update();

// scene
const sceneUser = new THREE.Scene();
const sceneTeacher = new THREE.Scene();

// light
const lightUser = new THREE.DirectionalLight(0xffffff);
lightUser.position.set(1.0, 1.0, 1.0).normalize();
sceneUser.add(lightUser);

const lightTeacher = new THREE.DirectionalLight(0xffffff);
lightTeacher.position.set(1.0, 1.0, 1.0).normalize();
sceneTeacher.add(lightTeacher);

// Main Render Loop
const clock_1 = new THREE.Clock();
const clock_2 = new THREE.Clock();

let userVrm;
let teacherVrm;

function animate() {
    requestAnimationFrame(animate);
    /*
    if (teacherVrm) {
        // Update model to render physics
        //console.log("update:" + Date.now());
        var delta = clock_2.getDelta()
        //console.log("clock 2=" + delta)
        teacherVrm.update(delta);
    }
    rendererUser.render(sceneUser, orbitCameraUser);
    */
}
//animate();

function addGrid(scene) {
    // each square
    var planeW = 10; // pixels
    var planeH = 10; // pixels 
    var numW = 50; // how many wide (50*50 = 2500 pixels wide)
    var numH = 50; // how many tall (50*50 = 2500 pixels tall)
    var plane = new THREE.Mesh(
        new THREE.PlaneGeometry( planeW*numW, planeH*numH, planeW, planeH ),
        new THREE.MeshBasicMaterial( {
            color: 0x000000,
            wireframe: true
        } )
    );
    var grid = new THREE.GridHelper(100, 2);

    //scene.add(grid);
    scene.add(plane);
}
/* VRM CHARACTER SETUP */

const ashtraPath = "./assets/models/girl-Avatar-ok.vrm";
//const ashtraPath = "./assets/models/ソーマ.vrm";
const teacherPath = "./assets/models/ソーマ.vrm";
//const ashtraPath = "./assets/models/Ashtra.vrm"
//const teacherPath = "./assets/models/Ashtra.vrm"
//const ashtraPath = "https://cdn.glitch.com/29e07830-2317-4b15-a044-135e73c7f840%2FAshtra.vrm?v=1630342336981";
//const teacherPath = "https://cdn.glitch.com/29e07830-2317-4b15-a044-135e73c7f840%2FAshtra.vrm?v=1630342336981";

//addGrid(sceneUser)
loadVRM(sceneUser, ashtraPath, (vrm) => {
    //vrm.scene.position.x = (detect)? -0.8: 0.5;
    if (screen.width > screen.height) {
        vrm.scene.position.x = -1;
    } else {
        vrm.scene.position.x = -0.5;
    }
    
    userVrm = vrm 
})
///*
loadVRM(sceneTeacher, teacherPath, (vrm) => {
    vrm.scene.position.x = 0.5;
    teacherVrm = vrm;
    animate();
})
//*/
/*
if (! detect) {
    loadVRM(sceneUser, teacherPath, (vrm) => {
        vrm.scene.position.x = -0.5;
        teacherVrm = vrm 
        animate();
    })
}
*/

var played = false;
var sdk = new araiSDK();
var teacherSkeleton = null;

if (detect == null) {
    if (sdk.loadVideoSkeleton) {
        var json_path = "./assets/mock-videos/";
        
        json_path += "dance.mp4.json" // "pressmaster.mp4.json" // 
        //console.log(json_path)
        sdk.loadVideoSkeleton(json_path,(json) => {
            teacherSkeleton = json;
        });
    }
}

function playTeacherVideo() {
    if (! played) {
        var videoElement = document.querySelector("#teacher_video");
        if (null == videoElement) {
            console.log("no teacher video found")
            return; // Need to wait
        }
        //played = true;

        var playok = false;
        try {
            videoElement.play()
            playok = true;
        } catch(e) {
            console.log(e);
        } 
        if (! playok) { // Safari
            videoElement.muted = true;
            videoElement.play()
        }

        played = true;
    }
}

function playTeacherAnimator() {
    var videoElement = document.querySelector("#teacher_video");
    if (! videoElement) return;
    if (! teacherSkeleton) return;

    
    sdk.playResult(videoElement, teacherSkeleton, (results) => {
        var  vrm_results = results;
        if (mirror) {
            vrm_results = sdk.mirrorResults(results)
        }

        var rig = animateVRM(teacherVrm, vrm_results);
    }) 
}
sdk.onFirst = () => {
    //playTeacherVideo();
}
sdk.onCallback = (results) => {
    //return; // KILLME
    adjustPanel();

    playTeacherVideo();
    
    if (detect) {
        animateVRM(teacherVrm, results);
    } else {
        animateVRM(userVrm, results);
    }
    playTeacherAnimator()
    rendererUser.render(sceneUser, orbitCameraUser);
    rendererTeacher.render(sceneTeacher, orbitCameraTeacher);
}
function adjustUserVideo(elm) {
    let video = findMindARVideo();

    var winHeight   = window.innerHeight;
    var winWidth    = window.innerWidth;

    var targetHeight = winHeight;
    var targetWidth = video.videoWidth * targetHeight / video.videoHeight;
    var posLeft = (winWidth - targetWidth) / 2;
    var posTop  = 0;

    if ((layout == "ar") || (layout == "a")) {
        targetHeight = winHeight / 2;
        targetWidth = video.videoWidth * targetHeight / video.videoHeight;
        posLeft = (winWidth / 2 - targetWidth) / 2;
        posTop = winHeight / 2;
    }
    if (layout == "a") {
        elm.style.visibility = "hidden";
    } else {
        if (elm != video) elm.style.visibility = "visible";
    }

    elm.style.position  = 'absolute';
    elm.style.left      = posLeft
    elm.style.top       = posTop;
    elm.style.width     = targetWidth;
    elm.style.height    = targetHeight
}
function adjustPos(elm, pos)  {
    let video = findMindARVideo();

    var winHeight = window.innerHeight;
    var winWidth = window.innerWidth;

    var targetHeight = winHeight;
    var targetWidth = video.videoWidth * winHeight / video.videoHeight;

    pos = (winWidth - targetWidth) / 2;

    elm.style.position = 'absolute';
    if (screen.width > screen.height) {
        //elm.style.top = "0px";
        elm.style.left      = pos; //window.innerWidth / 3;
        elm.style.width     = targetWidth; //window.innerWidth * 0.9; //video.videoWidth ; //"640";//"320px";
        elm.style.height    = targetHeight; //window.innerHeight * 0.9//video.videoHeight ; //"480px"; //"240px";
    } else {
        //elm.style.top = "0px"
        elm.style.left      = pos; //window.innerWidth / 3;
        elm.style.width     = targetWidth; //window.innerWidth * 0.9; //video.videoWidth ; //"640";//"320px";
        elm.style.height    = targetHeight; //window.innerHeight * 0.9//video.videoHeight ; //"480px"; //"240px";
    }
}

function findMindARVideo() {
    let elmList = document.querySelectorAll("video");
    let elm = null;

    elmList.forEach((item) => {
        if (item.id != "teacher_video") {
            elm = item;
        }
    });
    
    return elm;
}

function adjustUserAvatar(rendererUser, orbitCameraUser) {
    var posLeft = 0;
    var posTop  = window.innerHeight / 2;
    var targetWidth = window.innerWidth;    //window.innerWidth / 3;
    var targetHeight = window.innerHeight / 2

    if ((layout == "ar") || (layout == "a")) {
        posTop = 0;
        targetHeight = window.innerHeight;
        targetWidth = window.innerWidth;   //window.innerWidth / 2;
    }
    rendererUser.domElement.style.left  = posLeft
    rendererUser.domElement.style.top   = posTop;
    rendererUser.setSize(targetWidth, targetHeight);

    if(userVrm) {
        if (screen.width > screen.height) {
            userVrm.scene.position.x = -1;
        } else {
            userVrm.scene.position.x = -0.5;
        }
    }
    
    orbitCameraUser.aspect  = targetWidth / targetHeight;
    orbitCameraUser.updateProjectionMatrix();
}

function setLayout(newValue) {
    layout = newValue;
}
function setOpacity(newValue) {
    opacity = newValue;
}
function setMirror(newValue) {
    mirror = newValue;
}
function adjustPanel() {
    //let videoElement = document.querySelector("video");
    let videoElement = findMindARVideo();
    let videoCanvas = document.querySelector(".output_canvas");

    videoElement.style.visibility = "hidden"
    videoCanvas.style.opacity = parseFloat(opacity);
    adjustUserVideo(videoElement);
    adjustUserVideo(videoCanvas);
    
    adjustUserAvatar(rendererUser, orbitCameraUser)
    rendererTeacher.domElement.style.left = 0;
    rendererTeacher.domElement.style.top = 0;
    
    //rendererUser.setSize(window.innerWidth / 3, window.innerHeight / 2);
    rendererTeacher.setSize(window.innerWidth, window.innerHeight)

    //orbitCameraUser.aspect      = (window.innerWidth / 3) / (window.innerHeight / 2);
    orbitCameraTeacher.aspect   = window.innerWidth / window.innerHeight;
    //orbitCameraUser.updateProjectionMatrix();
    orbitCameraTeacher.updateProjectionMatrix();
}

window.setLayout = setLayout;
window.adjustPanel = adjustPanel;
window.setOpacity = setOpacity;
window.setMirror = setMirror;

/* VRM Character Animator */
const animateVRM = (vrm, results) => {
    if (null == vrm) return null;

    //let videoElement = document.querySelector("video");
    let videoElement = findMindARVideo();

    var rigPos = updateVRM(vrm, videoElement, results);
    // Update model to render physics
    var delta = clock_1.getDelta();
    //console.log("clock 1=" + delta);
    vrm.update(delta);
    
    return rigPos;
};

/*
window.animateVRM = (vrm, results) => {
    //console.log("xxxx")
    animateVRM(currentVrm, results)
}
*/

