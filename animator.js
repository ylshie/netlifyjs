import * as Kalidokit from "./Kalidokit"
//import * as xxx from "./sdk/build/araisdk.prod"
//import {currentVrm, updateVRM, loadVRM, setVRM}from "./vrmlib"
import {updateVRM, loadVRM}from "./vrmlib"
import * as xxx from "./sdk/build/araisdk.dm"

const url = new URL(window.location);
let msg = url.searchParams.get('message'); // => 'hello'
if (msg) 
    console.log("message is " + msg);
else
    console.log("no message");

//import {GLTFLoader} from "./libs/GLTFLoader.js"

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
const teacherPath = "./assets/models/girl-Avatar-ok.vrm";
//const ashtraPath = "./assets/models/Ashtra.vrm"
//const teacherPath = "./assets/models/Ashtra.vrm"
//const ashtraPath = "https://cdn.glitch.com/29e07830-2317-4b15-a044-135e73c7f840%2FAshtra.vrm?v=1630342336981";
//const teacherPath = "https://cdn.glitch.com/29e07830-2317-4b15-a044-135e73c7f840%2FAshtra.vrm?v=1630342336981";

//addGrid(sceneUser)
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
        var rig = animateVRM(teacherVrm, results);
        if (rig) {
            console.log("teacher")
            console.log(rig)
        }
    }) 
}
sdk.onCallback = (results) => {
    playTeacherVideo();
    adjustPanel();
    var rig = animateVRM(userVrm, results);
    if (rig) {
        console.log("user")
        console.log(rig)
    }
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

    adjustPos(videoElement, "640px");
    adjustPos(videoCanvas,  "640px");
    rendererUser.domElement.style.left = "640px" //window.innerWidth / 3;
    rendererTeacher.domElement.style.left = 0;
    
    if (   ((3 * rendererUser.domElement.style.width / 2) != window.innerWidth)
        || (rendererUser.domElement.style.height != window.innerHeight)) 
    {
        rendererUser.setSize(window.innerWidth * 2 / 3, window.innerHeight);
    }
}
/* VRM Character Animator */
const animateVRM = (vrm, results) => {
    if (null == vrm) return null;

    //let videoElement = document.querySelector("video");
    let videoElement = findMindARVideo();

    var rigPos = updateVRM(vrm, videoElement, results);
    // Update model to render physics
    vrm.update(clock.getDelta());
    
    return rigPos;
};

/*
window.animateVRM = (vrm, results) => {
    //console.log("xxxx")
    animateVRM(currentVrm, results)
}
*/

