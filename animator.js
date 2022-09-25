import * as Kalidokit from "./Kalidokit"
import * as xxx from "./sdk/build/araisdk.prod"
//import {currentVrm, updateVRM, loadVRM, setVRM}from "./vrmlib"
import {updateVRM, loadVRM}from "./vrmlib"
//import * as xxx from "./sdk/build/araisdk.dm"

const url = new URL(window.location);
let msg = url.searchParams.get('message'); // => 'hello'
if (msg) 
    console.log("message is " + msg);
else
    console.log("no message");

//import {GLTFLoader} from "./libs/GLTFLoader.js"
//Import Helper Functions from Kalidokit
//const remap = Kalidokit.Utils.remap;
//const clamp = Kalidokit.Utils.clamp;
//const lerp = Kalidokit.Vector.lerp;

let x = xxx;
/* THREEJS WORLD SETUP */

//var domAnimator = null;

// renderer
const rendererUser = new THREE.WebGLRenderer({ alpha: true });
const init_width = window.innerWidth * 2 / 3;
const init_height = window.innerHeight;
rendererUser.setSize(init_width, init_height);
rendererUser.setPixelRatio(window.devicePixelRatio);
//domAnimator = renderer.domElement;
rendererUser.domElement.style.position = "absolute"
rendererUser.domElement.style.left = 0;
rendererUser.domElement.style.top = 0;

document.body.appendChild(rendererUser.domElement);

const rendererTeacher = new THREE.WebGLRenderer({ alpha: true });
const init_width_2 = window.innerWidth / 3;
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
orbitCameraUser.position.set(0.0, 0.0, 4.0);
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
const clock = new THREE.Clock();

let userVrm;
let teacherVrm;

function animate() {
    requestAnimationFrame(animate);
    /*
    if (currentVrm) {
        // Update model to render physics
        console.log("update:" + Date.now());
        currentVrm.update(clock.getDelta());
    }
    renderer.render(scene, orbitCamera);
    */
}
animate();

/* VRM CHARACTER SETUP */

const ashtraPath = "https://cdn.glitch.com/29e07830-2317-4b15-a044-135e73c7f840%2FAshtra.vrm?v=1630342336981";
//const teacherPath = "./assets/models/girl-Avatar-ok.vrm";
const teacherPath = "https://cdn.glitch.com/29e07830-2317-4b15-a044-135e73c7f840%2FAshtra.vrm?v=1630342336981";

loadVRM(sceneUser, ashtraPath, (vrm) => userVrm = vrm )
loadVRM(sceneTeacher, teacherPath, (vrm) => teacherVrm = vrm )

var played = false;
var sdk = new araiSDK();
var teacherSkeleton = null;

sdk.loadVideoSkeleton("./assets/mock-videos/dance.json",(json) => {
    teacherSkeleton = json;
});

function playTeacherVideo() {
    if (! played) {
        played = true;
        var videoElement = document.querySelector("#teacher_video");

        if (videoElement)
            videoElement.play()
        else
            console.log("no teacher video found")
    }
}

function playTeacherAnimator() {
    if (! teacherSkeleton) return;

    var videoElement = document.querySelector("#teacher_video");
    sdk.playResult(videoElement, teacherSkeleton, (results) => {
        animateVRM(teacherVrm, results);
    }) 
}
sdk.onCallback = (results) => {
    playTeacherVideo();
    adjustPanel();
    animateVRM(userVrm, results);
    playTeacherAnimator()
    rendererUser.render(sceneUser, orbitCameraUser);
    rendererTeacher.render(sceneTeacher, orbitCameraTeacher);
}
function adjustPos(elm, pos)  {
    elm.style.position = 'absolute';
    if (screen.width > screen.height) {
        elm.style.top = "0px";
        elm.style.left = pos; //window.innerWidth / 3;
        elm.style.width = "320px";
        elm.style.height = "240px";
    } else {
        elm.style.top = "0px"
        elm.style.left = pos; //window.innerWidth / 3;
        elm.style.width = "240px";
        elm.style.height = "320px";
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

function adjustPanel() {
    //let videoElement = document.querySelector("video");
    let videoElement = findMindARVideo();
    let videoCanvas = document.querySelector(".output_canvas");

    adjustPos(videoElement, window.innerWidth / 3);
    adjustPos(videoCanvas,  window.innerWidth / 3);
    rendererUser.domElement.style.left = window.innerWidth / 3;
    rendererTeacher.domElement.style.left = 0;
    
    if (   ((3 * rendererUser.domElement.style.width / 2) != window.innerWidth)
        || (rendererUser.domElement.style.height != window.innerHeight)) 
    {
        rendererUser.setSize(window.innerWidth * 2 / 3, window.innerHeight);
    }
}
/* VRM Character Animator */
const animateVRM = (vrm, results) => {
    if (null == vrm) return;

    //let videoElement = document.querySelector("video");
    let videoElement = findMindARVideo();
    
    //adjustPanel();
    
///*
    if (vrm) {
        updateVRM(vrm, videoElement, results);
        // Update model to render physics
        vrm.update(clock.getDelta());
    }
    //renderer.render(scene, orbitCamera);
//*/
};

/*
window.animateVRM = (vrm, results) => {
    //console.log("xxxx")
    animateVRM(currentVrm, results)
}
*/

