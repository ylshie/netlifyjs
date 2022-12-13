import * as Kalidokit from "./Kalidokit"
//import * as xxx from "./sdk/build/araisdk.prod"
import * as xxx from "./sdk/build/araisdk.dm"
//import {currentVrm, updateVRM, loadVRM, setVRM}from "./vrmlib"
import {checkNodes, updateVRM, loadVRM, addChildItem}from "./vrmlib"
//import {loadVideo} from './sdk/libs/camera-mock.js';
import {createChromaMaterial} from './sdk/libs/chroma-video.js';
import {loadGLTF} from "./sdk/libs/camera-mock.js"
import { sqrt } from "mathjs";


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

var config = {
    showTeacherVideo:   true,
    showTeacherAvatar:  false,
    showTeacherSkeleton: false,
    playAtStart: true,
    showGlass: false,
    showHat: false,
    skeletonAlignVideo: false,
    specialMode: false,
    useAssistant: false,
}
var DumpMode = false;

var teacherVideo = null;
var teacherPlane = null;

var assistVideo = null;
var assistPlane = null;

//let x = xxx;
/* THREEJS WORLD SETUP */

//var domAnimator = null;

// renderer
const rendererVideo = new THREE.WebGLRenderer({ alpha: true });
rendererVideo.setSize(window.innerWidth, window.innerWidth);
rendererVideo.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(rendererVideo.domElement);
var globalPlane = new THREE.Plane( new THREE.Vector3( 0, 0, 1 ), 0.3 );

rendererVideo.clippingPlanes = [ globalPlane ];

const rendererUser = new THREE.WebGLRenderer({ alpha: true });
const init_width    = window.innerWidth / 3;
const init_height   = window.innerHeight / 2;
rendererUser.setSize(init_width, init_height);
rendererUser.setPixelRatio(window.devicePixelRatio);
//domAnimator = renderer.domElement;
rendererUser.domElement.style.position = "absolute"
rendererUser.domElement.style.left = 0;
rendererUser.domElement.style.top = window.innerHeight / 2;

document.body.appendChild(rendererUser.domElement);

const rendererTeacher = new THREE.WebGLRenderer({ alpha: true });
const init_width_2  = window.innerWidth / 2;
const init_height_2 = window.innerHeight;
rendererTeacher.setSize(init_width_2, init_height_2);
rendererTeacher.setPixelRatio(window.devicePixelRatio);
//domAnimator = renderer.domElement;
rendererTeacher.domElement.style.position = "absolute"
rendererTeacher.domElement.style.left = window.innerWidth / 2;
rendererTeacher.domElement.style.top = 0;

document.body.appendChild(rendererTeacher.domElement);

const rendererAssist= new THREE.WebGLRenderer({ alpha: true });
const init_width_3  = window.innerWidth / 2;
const init_height_3 = window.innerHeight;
rendererAssist.setSize(init_width_3, init_height_3);
rendererAssist.setPixelRatio(window.devicePixelRatio);
rendererAssist.domElement.style.position = "absolute"
rendererAssist.domElement.style.left = window.innerWidth / 2;
rendererAssist.domElement.style.top = 0;

document.body.appendChild(rendererAssist.domElement);

// camera
//const cameraVideo = new THREE.PerspectiveCamera(90, init_width / init_height, 0.1, 1000);
const cameraVideo = new THREE.OrthographicCamera(-1, 1, 1, -1 , 0.1, 1000);
cameraVideo.position.set(0.0, 0.0, 1.0);

const orbitCameraUser = new THREE.PerspectiveCamera(35, init_width / init_height, 0.1, 1000);
orbitCameraUser.position.set(0.0, 1.0, 3.5);
//orbitCamera.position.set(0.0, 1.4, 0.7);

const orbitCameraTeacher = new THREE.PerspectiveCamera(35, init_width_2 / init_height_2, 0.1, 1000);
orbitCameraTeacher.position.set(0.0, 1.0, 4.0);

const orbitCameraAssist = new THREE.PerspectiveCamera(35, init_width_2 / init_height_2, 0.1, 1000);
orbitCameraAssist.position.set(0.0, 1.0, 4.0);

// controls
//arthur
const orbitControls = new THREE.OrbitControls(orbitCameraUser, rendererUser.domElement);
orbitControls.screenSpacePanning = true;
orbitControls.target.set(0.0, 1.0, 0.0);
//orbitControls.target.set(0.0, 1.4, 0.0);
orbitControls.update();

// scene
const sceneVideo    = new THREE.Scene();
const sceneUser     = new THREE.Scene();
const sceneTeacher  = new THREE.Scene();
const sceneAssist   = new THREE.Scene();

// light
const lightVideo = new THREE.DirectionalLight(0xffffff);
lightVideo.position.set(1.0, 1.0, 1.0).normalize();
sceneVideo.add(lightVideo);

const lightUser = new THREE.DirectionalLight(0xffffff);
lightUser.position.set(1.0, 1.0, 1.0).normalize();
sceneUser.add(lightUser);

const lightTeacher = new THREE.DirectionalLight(0xffffff);
lightTeacher.position.set(1.0, 1.0, 1.0).normalize();
sceneTeacher.add(lightTeacher);

const lightAssist = new THREE.DirectionalLight(0xffffff);
lightAssist.position.set(1.0, 1.0, 1.0).normalize();
sceneAssist.add(lightAssist);

// Main Render Loop
const clock_1 = new THREE.Clock();
const clock_2 = new THREE.Clock();

let userVrm;
let teacherVrm;

function setTeacherOption(showVideo,showAvatar,showSkeleton=false) {
    config.showTeacherVideo     = showVideo;
    config.showTeacherAvatar    = showAvatar;
    config.showTeacherSkeleton  = showSkeleton;

    teacherPlane.visible        = config.showTeacherVideo;
    teacherVrm.scene.visible    = config.showTeacherAvatar;
}
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
//const ashtraPath = "./assets/models/ダクネス.vrm";
//const ashtraPath = "./assets/models/ソーマ.vrm";
//const teacherPath = "./assets/models/ソーマ.vrm";
const teacherPath = "./assets/models/darkness.vrm";
//const teacherPath = "./assets/models/cici.vrm";
//const teacherPath = "./assets/models/Power.vrm";
//const teacherPath = "./assets/models/ash.vrm";
//const ashtraPath = "./assets/models/Ashtra.vrm"
//const teacherPath = "./assets/models/Ashtra.vrm"
//const ashtraPath = "https://cdn.glitch.com/29e07830-2317-4b15-a044-135e73c7f840%2FAshtra.vrm?v=1630342336981";
//const teacherPath = "https://cdn.glitch.com/29e07830-2317-4b15-a044-135e73c7f840%2FAshtra.vrm?v=1630342336981";
/*
loadVRM(sceneVideo, './assets/models/glasses2/scene.gltf', (vrm) => {
    //vrm.scene.position.x     = -0.5;
    //cameraVideo.position.x   = 0;
})
*/
//addGrid(sceneUser)
function get2DAngle(cx, cy, ex, ey) {
    const dy = ey - cy;
    const dx = ex - cx;
    const theta = Math.atan2(dy, dx);
    return theta;
}

function calcRotate(a, b, left=true)
{
    var s = (left)? 1: -1;
    var y = s * get2DAngle(s * a.x,a.z,s * b.x,b.z); 
    
    var dx= Math.abs(b.x-a.x);
    var dz= Math.abs(b.z-a.z);
    var r = Math.sqrt(dx*dx+dz*dz);
    var d = (b.x>a.x) ? r: -r 
    var z = s * get2DAngle(0,a.y,s * d,b.y) //var z = get2DAngle(a.x,a.y,b.x,b.y)
    var x = 0;
    
    if (a.x == b.x && a.y != b.y && a.z != b.z) {
        x = (b.z>a.z) ? get2DAngle(a.z,a.y,b.z,b.y): get2DAngle(b.z,b.y,a.z,a.y);
        y = (b.z>a.z) ? Math.abs(y): -Math.abs(y)
        z = 0;
    }
    
    if (z >  Math.PI/2) y = 0;
    if (z < -Math.PI/2) y = 0;

    if (left) {
        if (y < -Math.PI/2) z = 0;
    } else {     
        if (y >  Math.PI/2) z = 0;
    }

    return {x:x, y:y, z:z};
}

async function wearGlass(vrm) {
    const glasses2 = await loadGLTF('./assets/models/glasses2/scene.gltf');
    glasses2.scene.rotation.set(0, 0, 0);
    glasses2.scene.position.set(0, 0, 0);
    glasses2.scene.scale.set(0.1, 0.1, 0.1);

    //vrm.scene.add(glasses2.scene);
    addChildItem(vrm, "Head", glasses2.scene);
}

loadVRM(sceneUser, ashtraPath, (vrm) => {
    //vrm.scene.position.x = (detect)? -0.8: 0.5;
    if (screen.width > screen.height) {
        vrm.scene.position.x = -1;
    } else {
        vrm.scene.position.x = -0.5;
    }
    
    userVrm = vrm 

    //wearGlass(userVrm);
})
///*
var vrmGlass= new THREE.Object3D;
var vrmHat  = new THREE.Object3D;
const modelGlass= './assets/models/glasses2/scene.gltf'
const modelHat  = './assets/models/hat2/scene.gltf'
async function loadGlasss() {
    const glasses2 = await loadGLTF(modelGlass);
    glasses2.scene.rotation.set( 0, -Math.PI/2, 0);
    glasses2.scene.position.set(0, 0, 0);
    glasses2.scene.scale.set(1, 1, 1);
    glasses2.scene.renderOrder = 1;
    //glasses2.scene.visible = config.showGlass;

    vrmGlass.add(glasses2.scene);
    vrmGlass.visible = config.showGlass;
    sceneVideo.add(vrmGlass);
}
async function loadHat() {
    const model = await loadGLTF(modelHat);
    model.scene.rotation.set( 0.3, 0, 0);
    model.scene.position.set(0, 5, 0);
    model.scene.scale.set(1, 1, 1);
    model.scene.renderOrder = 1;
    //model.scene.visible = config.showHat;

    vrmHat.add(model.scene);
    vrmHat.visible = config.showHat;
    sceneVideo.add(vrmHat);
}

loadGlasss();
loadHat();

loadVRM(sceneTeacher, teacherPath, (vrm) => {
    teacherVrm = vrm;

    teacherVrm.scene.visible        = config.showTeacherAvatar;
    teacherVrm.scene.position.x     = -0.3;
    teacherVrm.scene.position.y     = 0.1;
    orbitCameraTeacher.position.x   = 0;
    
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
/*
const sizeMap = {
    "dannce.mp4": 1616/1080,
    "tk_1.mp4": 720/960,
    "tk_1.mp4": 720/960,
    "tk_1.mp4": 720/960,
    "tk_1.mp4": 720/960,
}
*/

var currentTeacher = "avatar.mp4";
window.changeTeacher = (video_file) => {
    if (sdk.loadVideoSkeleton == null) return;
    if (teacherVideo == null) return;

    if (video_file == "mindar") {
        config.specialMode = true;
        video_file = "C0029.mp4";
    } else if (video_file == "test") {
        config.specialMode = true;
        video_file = "C0017.mp4";
    } else {
        config.specialMode = false;
    }
    var json_path = "./assets/mock-videos/";
    var height  = (video_file == "avatar.mp4")? 1616/1080: 
                  (video_file == "girl.mp4") ?  990/890:
                  (video_file == "C0029.mp4") ? 2160/3840: 960/1280; // H / W
    var sclaeUp = (video_file == "avatar.mp4")? 1.4: ((video_file == "girl.mp4") ?  2: 3);
    //var height  = (video_file == "avatar.mp4")? 1: ((video_file == "girl.mp4") ?  990/890: 960/1280); // H / W
    //var sclaeUp = (video_file == "avatar.mp4")? 1: ((video_file == "girl.mp4") ?  2: 3);

    //showAssist(config.useAssistant)

    currentTeacher = video_file;
    assistVideo.pause();
    assistVideo.currentTime = 0;
    teacherVideo.pause();
    teacherVideo.src = json_path + video_file
    
    const texture = new THREE.VideoTexture(teacherVideo);
    const material = createChromaMaterial(texture, 0x00ff00);
    const videoMaterial =  new THREE.MeshBasicMaterial( {map: texture, side: THREE.FrontSide, toneMapped: false} );
    const geometry = new THREE.PlaneGeometry(1, height);

    if (video_file == "C0029.mp4") {
        teacherPlane.material = videoMaterial;
    } else {
        teacherPlane.material = material;
    }    
    teacherPlane.geometry = geometry;
    teacherPlane.scale.set(1, 1, 1);
    teacherPlane.scale.multiplyScalar(sclaeUp)
    
    json_path += video_file + ".json" 

    var elmSK   = document.querySelector("#teacherCanvas");
    var elmVRM  = rendererTeacher.domElement;
    var elmAST  = rendererAssist.domElement;
    var elmUser = rendererUser.domElement;
    var elmbat  = document.querySelector("#new_battery_panel")
    var elmVid  = document.querySelector(".output_canvas")

    elmAST.style.visibility     = "visible";
    if (config.specialMode) {
        elmSK.style.visibility      = "visible";
        elmVRM.style.visibility     = "visible";
        elmUser.style.visibility    = "hidden";

        //elmbat.style.visibility    = "hidden";
        elmVid.style.visibility    = "hidden";
    } else {
        //elmbat.style.visibility    = "visible";
        elmVid.style.visibility    = "visible";
        if (video_file == "girl.mp4") {
            elmSK.style.visibility      = "hidden";
            elmVRM.style.visibility     = "hidden";
            elmUser.style.visibility    = "hidden";
        } else {
            elmSK.style.visibility      = "visible";
            elmVRM.style.visibility     = "visible";
            elmUser.style.visibility    = "visible";
        }
    }

    sdk.loadVideoSkeleton(json_path,(json) => {
        teacherSkeleton = json;
        sdk.centerResult(teacherSkeleton);

        if (config.playAtStart) {
            teacherVideo.play();
            assistVideo.play();
        }
    });
}

function IsSafari() {
    // Safari 3.0+ "[object HTMLElementConstructor]" 
    var isSafari = /constructor/i.test(window.HTMLElement) || (function (p) { return p.toString() === "[object SafariRemoteNotification]"; })(!window['safari'] || (typeof safari !== 'undefined' && window['safari'].pushNotification));

    console.log("IsSafari=" + (isSafari ? "yes": "no") + " user agent=" + navigator.userAgent)

    return isSafari;
}

async function addTeacherVideo(scene) {
    //const video = await loadVideo("./assets/mock-videos/avatar.mp4");
    const video = document.createElement("video");
    video.crossOrigin = "anonymous";
    //video.id = "teacher_video";
    video.src = "./assets/mock-videos/avatar.mp4"
    video.loop = true;
    //if (IsSafari()) {
        video.muted = true;
    //}
    video.playsInline = true;

    //video.play();
    video.pause();
    const texture = new THREE.VideoTexture(video);
    const geometry = new THREE.PlaneGeometry(1, 1616/1080);
    //const material = new THREE.MeshBasicMaterial({map: texture});
    const material = createChromaMaterial(texture, 0x00ff00);
    const plane = new THREE.Mesh(geometry, material);
    //plane.rotation.x = Math.PI/2;
    if (config.skeletonAlignVideo || config.specialMode) {
        plane.position.x = 0; //0.6;
    } else {
        plane.position.x = 0.5; //0.6;
    }
    plane.position.y = 1.0;
    plane.scale.multiplyScalar(1.4)
    
    teacherPlane = plane;

    //if (config.showTeacherVideo) 
    {
        plane.visible = config.showTeacherVideo;
        scene.add(plane);
    }
    
    video.play();
    teacherVideo = video;
    setTimeout(() => teacherVideo.muted = false, 5000);
}

function showAssist(show) {
    assistPlane.visible = show;
    //assistVideo.muted = ! show;
    assistVideo.play();
    rendererAssist.domElement.visibility = (show)? "visible": "hidden"
}

async function addAssistVideo(scene) {
    const video = document.createElement("video");
    video.crossOrigin = "anonymous";
    video.src = "./assets/mock-videos/tk_4.mp4"
    video.loop = true;
    video.muted = true;
    video.playsInline = true;

    video.pause();
    const texture = new THREE.VideoTexture(video);
    const geometry = new THREE.PlaneGeometry(1, 720/960);
    const material = createChromaMaterial(texture, 0x00ff00);
    const plane = new THREE.Mesh(geometry, material);
    
    plane.position.x =   0; //0.6;
    plane.position.y = 1.0;
    plane.scale.multiplyScalar(3.0)
    
    assistPlane = plane;
    plane.visible = false;   //config.showTeacherVideo;
    scene.add(plane);
    
    //video.play();
    assistVideo = video;
    setTimeout(() => assistVideo.muted = false, 5000);
}

if (detect == null) {
    setTimeout(() => {
        addTeacherVideo(sceneTeacher);
        addAssistVideo(sceneAssist);
    }, 1000);
}

var played = false;
var sdk = new araiSDK();
var teacherSkeleton = null;

sdk.runAR();

if (detect == null) {
    if (sdk.loadVideoSkeleton) {
        var json_path = "./assets/mock-videos/";
        
        json_path += "avatar.mp4.json" // "pressmaster.mp4.json" // 
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
            //console.log("no teacher video found")
            return;
        }
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
            console.log("play teacher video")
        }
        played = true;
    }
}

function find_angle(A,B,C) {
    var AB = Math.sqrt(Math.pow(B.x-A.x,2)+ Math.pow(B.y-A.y,2) + Math.pow(B.z-A.z,2));
    var BC = Math.sqrt(Math.pow(B.x-C.x,2)+ Math.pow(B.y-C.y,2) + Math.pow(B.z-C.z,2));
    var AC = Math.sqrt(Math.pow(C.x-A.x,2)+ Math.pow(C.y-A.y,2) + Math.pow(C.z-A.z,2));
    
    var angle = Math.acos((BC*BC+AB*AB-AC*AC)/(2*BC*AB));

    return Math.floor(angle * 180 / Math.PI);
}

// 11: Left Shoulder
// 12: Right Shoulder
// 13: Left Elbow
// 14: Right Elbow
// 15: Left Wrist
// 16: Right Wrist
// 23: Left Hip
// 24: Right Hip
// 1  2  3
// 4  5  6
// 7  8  9
var delta = 25;
function IsMatched(angleSH, numSH, angleSS, numSS) {
    if (angleSH < (numSH - delta)) return false;
    if (angleSH > (numSH + delta)) return false;
    if (angleSS && angleSS < (numSS - delta)) return false;
    if (angleSS && angleSS > (numSS + delta)) return false;
    return true;
}
// 1  2   3        3  2   1
// 4  5   6        6  5   4
// 7  8   9        9  8   7
const user_left     = ["#ul1", "#ul2", "#ul3", "#ul4", "#ul5", "#ul6", "#ul7", "#ul8", "#ul9"];
const user_right    = ["#ur1", "#ur2", "#ur3", "#ur4", "#ur5", "#ur6", "#ur7", "#ur8", "#ur9"];
const teacher_left  = ["#tl1", "#tl2", "#tl3", "#tl4", "#tl5", "#tl6", "#tl7", "#tl8", "#tl9"];
const teacher_right = ["#tr1", "#tr2", "#tr3", "#tr4", "#tr5", "#tr6", "#tr7", "#tr8", "#tr9"];
//const Wrist = results.poseLandmarks[15];
//const Elbow = results.poseLandmarks[13];
//const Shoulder = results.poseLandmarks[11];
//const ShoulderO = results.poseLandmarks[12];
//const Hip = results.poseLandmarks[23];

// handShoulderHip = 135  left, handShoulder = 135
// handShoulderHip = 180
// handShoulderHip = 135 right, handShoulder = 45
// handShoulderHip = 90  left, handShoulder = 180
// handShoulderHip = 90 front, handShoulder = 90
// handShoulderHip = 90 right, handShoulder = 0
// handShoulderHip = 45 left , handShoulder = 135
// handShoulderHip =  0  
// handShoulderHip = 45 right , handShoulder = 45
function updateAngle(elmList, angList) {
    var elmHand     = document.querySelector(elmList.hand);
    var elmShoulder = document.querySelector(elmList.shoulder);
    var elmHip      = document.querySelector(elmList.hip);
    
    elmHand.innerText       = angList.hand + "";
    elmShoulder.innerText   = angList.shoulder + ""
    elmHip.innerText        = angList.hip + ""
}

const user_angle_left   = {hand: "#lAngleHand", shoulder: "#lAngleShoulder", hip: "#lAngleHip"};
const user_angle_right  = {hand: "#rAngleHand", shoulder: "#rAngleShoulder", hip: "#rAngleHip"};
function playLeftHand(results, uiMark, uiAngle) {
    if (results.poseLandmarks == null) return;

    var res = playGrid( uiMark, 
                        results.poseLandmarks[15], // Wrist
                        results.poseLandmarks[13], // Elbow
                        results.poseLandmarks[11], // Shoulder
                        results.poseLandmarks[12], // Shoulder Otherside
                        results.poseLandmarks[23]) // Hip

    if (uiAngle) updateAngle(uiAngle, res);

    return res.ans;
}

function playRightHand(results, uiMark, uiAngle) {
    if (results.poseLandmarks == null) return;

    var res = playGrid(uiMark, 
        results.poseLandmarks[16], // Wrist
        results.poseLandmarks[14], // Elbow
        results.poseLandmarks[12], // Shoulder
        results.poseLandmarks[11], // Shoulder Otherside
        results.poseLandmarks[24]) // Hip

    if (uiAngle) updateAngle(uiAngle, res);

    return res.ans;
}

function playGrid(cells, wrist, elbow, shoulder, shoulderO, hip) {
    var elmList = new Array(9);
    var ansList = new Array(9);

    for (let i =0; i < 9; i++) {
        elmList[i] = document.querySelector(cells[i]);
    }
    
    // Right
    var handSelf        = find_angle(wrist, elbow, shoulder);
    var handShoulder    = find_angle(elbow, shoulder, shoulderO);
    var handShoulderHip = find_angle(elbow, shoulder, hip);

    //console.log("HAND " + handSelf + " Shoulder " + handShoulder + " Hip " + handShoulderHip)


    ansList[0]  = IsMatched(handShoulderHip, 135, handShoulder, 135)
    ansList[1]  = IsMatched(handShoulderHip, 180)
    ansList[2]  = IsMatched(handShoulderHip, 135, handShoulder,  45)
    ansList[3]  = IsMatched(handShoulderHip,  90, handShoulder, 180)
    ansList[4]  = IsMatched(handShoulderHip,  90, handShoulder,  90)
    ansList[5]  = IsMatched(handShoulderHip,  90, handShoulder,   0)
    ansList[6]  = IsMatched(handShoulderHip,  45, handShoulder, 135)
    ansList[7]  = IsMatched(handShoulderHip,   0)
    ansList[8]  = IsMatched(handShoulderHip,  45, handShoulder,  45)

    for (let i=0; i <9; i++) {
        if (ansList[i]) {
            elmList[i].className = "cellON"
        } else {
            elmList[i].className = "cell"
        }
    }

    return {hand: handSelf, shoulder: handShoulder, hip: handShoulderHip, ans: ansList}
}

window.changeTeacherSpeed = (speed) => {
    if (null == teacherVideo) return;

    teacherVideo.playbackRate = speed;
};

var score_teacher_left = null;
var score_teacher_right = null;

var teacherData = {};
function playTeacherAnimator() {
    //var videoElement = document.querySelector("#teacher_video");
    var videoElement = teacherVideo;
    if (! videoElement) return;
    if (! teacherSkeleton) return;

    var height  = (currentTeacher == "avatar.mp4")? 1616/1080: ((currentTeacher == "girl.mp4") ?  990/890: 960/1280); // H / W
    var sclaeUp = (currentTeacher == "avatar.mp4")? 1.4: ((currentTeacher == "girl.mp4") ?  2: 3);
    
    //console.log("play teacher")
    sdk.playResult(videoElement, teacherSkeleton, (results) => {
        var  vrm_results= results;
        var  sk_results = sdk.mirrorResults(results)  // -0.2
        if (mirror) {
            vrm_results = sdk.mirrorResults(results)
            sk_results  = results;
        }

        score_teacher_left  = playLeftHand(vrm_results, teacher_left)
        score_teacher_right = playRightHand(vrm_results, teacher_right)
        let teacherCanvas = document.querySelector('#teacherCanvas');

        if (config.skeletonAlignVideo || config.specialMode) {
            const videoWidth    = parseInt(rendererTeacher.domElement.style.width);
            const videoHeight   = parseInt(rendererTeacher.domElement.style.height);
            const videoLeft     = parseInt(rendererTeacher.domElement.style.left);
            const videoTop      = parseInt(rendererTeacher.domElement.style.top);
            const skWidth       = (videoWidth / height) * 0.85;   
            const skHeight      = (videoHeight) * 0.85;         
            const skLeft        = videoLeft + (videoWidth  - skWidth) / 2;
            const skTop         = videoTop  + (videoHeight - skHeight) / 2;

            teacherCanvas.style.left     = skLeft;
            teacherCanvas.style.top      = skTop;
            teacherCanvas.style.width    = skWidth;
            teacherCanvas.style.height   = skHeight;
            
            teacherCanvas.style.zIndex  = 1;
            teacherPlane.position.x     = 0;
            teacherCanvas.width     = parseInt(teacherCanvas.style.width);
            teacherCanvas.height    = parseInt(teacherCanvas.style.height);
        } 
        else {
            teacherCanvas.style.zIndex  = 0;
            teacherPlane.position.x     = 0.5;
            teacherCanvas.width     = 400;
            teacherCanvas.height    = 600;

            if (layout == "n") {
                teacherCanvas.style.left = "35%";
            } else {
                teacherCanvas.style.left = "70%";
            }
        }

        if (teacherCanvas && teacherVideo) { 
            if (! config.skeletonAlignVideo && (! config.specialMode)) {
                if (teacherVideo.videoWidth > 1000) {
                    teacherCanvas.style.width  = teacherVideo.videoWidth / 4;
                    teacherCanvas.style.height = teacherVideo.videoHeight / 4;
                } else {
                    teacherCanvas.style.width  = teacherVideo.videoWidth / 2;
                    teacherCanvas.style.height = teacherVideo.videoHeight / 2;
                }
            }
            //console.log(sk_results);
            //sdk.drawSkeleton(teacherCanvas, sk_results);
            sdk.drawSkeleton(teacherCanvas, vrm_results);
        } else {
            console.log("canvase or video is null, fail to play teacher skeleton")
        }
        
        animateVRM(teacherVrm, vrm_results, teacherData);
        if (config.showTeacherSkeleton) {
            var bones = checkNodes(teacherVrm);
            if (bones) { //console.log(bones); //console.log(results);
                sdk.drawBones(teacherCanvas, bones);
            }
        }
    }) 
}

function findScore(results) {
    if (results == null) return -1;
    var match = -1;
    
    for (let i=0; i < 9; i++) {
        if (results[i]) {
            //KILLME if (match != -1) console.log("warn, duplicate mactch")
            match = i;
        }
    }

    return match;
}

// 0 1 2
// 3 4 5
// 6 7 8
var scoreMap = [
//   0  1  2  3  4  5  6  7  8
    [3, 1, 0, 1, 1, 0, 0, 0, 0], // 0
    [1, 3, 1, 1, 1, 1, 0, 0, 0], // 1
    [0, 1, 3, 0, 1, 1, 0, 0, 0], // 2
    [1, 1, 0, 3, 1, 0, 1, 1, 0], // 3
    [1, 1, 1, 1, 3, 1, 1, 1, 1], // 4
    [0, 1, 1, 0, 1, 3, 0, 1, 1], // 5
    [0, 0, 0, 1, 1, 0, 3, 1, 0], // 6
    [0, 0, 0, 1, 1, 1, 1, 3, 1], // 7
    [0, 0, 0, 0, 1, 1, 0, 1, 3], // 8
]
function countScore(userScore, teacherScore) {
    if (userScore == null) return 0;
    if (teacherScore == null) return 0;

    var teacher = findScore(teacherScore);
    var user    = findScore(userScore);

    if (teacher == -1) return 0;
    if (user == -1) return 0;

    return scoreMap[teacher][user];
}

//  0: Nose same
//  1: Left Eye Inner
//  2: Left Eye
//  3: Left Eye Outer
//  4: Right Eye Inner
//  5: Right Eye
//  6: Right Eye Outer
//  7: Left Ear
//  8: Right Ear
function updateWear(results, wear, ratio, visible, shift={x:0,y:0,z:0}) {
    if (! vrmGlass) return;
    if (! results) return;
    if (! results.poseLandmarks) return;

    var helper = new THREE.BoxHelper(wear, 0xff0000);
    helper.update();
    helper.geometry.computeBoundingBox()
    const lm    = results.poseLandmarks;
    const max   = helper.geometry.boundingBox.max;
    const min   = helper.geometry.boundingBox.min;
    const n     = lm[0];
    const lEar  = lm[7];
    const rEar  = lm[8];
    const wlen  = sqrt((max.x - min.x)*(max.x - min.x)+(max.y - min.y)*(max.y - min.y));
    const flen  = ratio * sqrt((lEar.x - rEar.x)*(lEar.x - rEar.x)+(lEar.y - rEar.y)*(lEar.y - rEar.y));
    const scale = Math.abs(wear.scale.x * flen / wlen);
    const angle = calcRotate(rEar,lEar);
    const show  = visible && (lEar.visibility > 0.3 && rEar.visibility > 0.3) && (lEar.y < 0.95) && (rEar.y < 0.95)
    
    const x = n.x - 0.5 + shift.x;
    const y = 0.5 - n.y + shift.y;
    const z = shift.z;
    wear.position.set(2 * x, 2.1 * y, 2 * z);
    wear.rotation.set( 0 , 0 ,-angle.z);
    wear.scale.set(scale,scale,scale);
    wear.visible = show;
}

var userData = {};
var curScore = 0;
var pre_user_left   = -1;
var pre_user_right  = -1;
var pre_teacher_left    = -1;
var pre_teacher_right   = -1;
sdk.onCallback = (results) => {
    var ar = sdk.getAR();
    //return; // KILLME
    //console.log("enter callack");
    adjustPanel();
    updateWear(results, vrmGlass, 3, config.showGlass);
    updateWear(results, vrmHat,   6, config.showHat, {x: 0, y:0.1, z: -0.2});

    playTeacherVideo();
    
    var vrm_results = sdk.mirrorResults(results)
    if (detect) {
        animateVRM(teacherVrm, vrm_results,userData);
    } else {
        animateVRM(userVrm, vrm_results,userData);
    }
    var score_user_left  = playLeftHand(vrm_results, user_left, user_angle_left)
    var score_user_right = playRightHand(vrm_results, user_right, user_angle_right)

    var scoreUserLeft    = findScore(score_user_left)
    var scoreUserRight   = findScore(score_user_right)
    var scoreTeacherLeft = findScore(score_teacher_left)
    var scoreTeacherRight= findScore(score_teacher_right)
    var score_left  = countScore(score_user_left, score_teacher_left);
    var score_right = countScore(score_user_right, score_teacher_right);
    var elmLeft     = document.querySelector("#matchLeft")
    var elmRight    = document.querySelector("#matchRight")
    var elmScore    = document.querySelector("#scoreNum")
    var elmHead     = document.querySelector(".battery_head")

    if (score_left > 1) {
        elmLeft.style.backgroundColor = "red"
    } else {
        elmLeft.style.backgroundColor = "white"
    }
    if (score_right > 1) {
        elmRight.style.backgroundColor = "red"
    } else {
        elmRight.style.backgroundColor = "white"
    }
    
    if (score_left > 0)  score_left -= 1;
    if (score_right > 0) score_right -= 1;

    if ((score_left > 0) && (score_right > 0)) {
        elmHead.style.backgroundColor = "#00FF00"
    } else if ((score_left > 0) || (score_right > 0)) {
        elmHead.style.backgroundColor = "#007F00"
    } else {
        elmHead.style.backgroundColor = "#FFD03F" //"#7F7F7F" //gray
    }
    if ((pre_user_left != scoreUserLeft) || (pre_teacher_left != scoreTeacherLeft )) {
        curScore += score_left;
        pre_user_left       = scoreUserLeft;
        pre_teacher_left    = scoreTeacherLeft
    }
    if ((pre_user_right != scoreUserRight) || (pre_teacher_right != scoreTeacherRight )) {
        curScore += score_right;
        pre_user_right      = scoreUserRight;
        pre_teacher_right   = scoreTeacherRight;
    }
    elmScore.innerHTML = Math.round(curScore/10) + ""
    battery(curScore/10)
    playTeacherAnimator()
    rendererUser.render(sceneUser, orbitCameraUser);
    rendererTeacher.render(sceneTeacher, orbitCameraTeacher);
    rendererAssist.render(sceneAssist, orbitCameraAssist);
    rendererVideo.render(sceneVideo, cameraVideo);
}

function adjustUserVideo(elm) {
    let video = findMindARVideo();

    var winHeight   = window.innerHeight;
    var winWidth    = window.innerWidth;

    var targetHeight = winHeight;
    var targetWidth  = video.videoWidth * targetHeight / video.videoHeight;
    var posLeft = 0; //(winWidth - targetWidth) / 2; // Video set to left 
    var posTop  = 0;

    if ((layout == "ar") || (layout == "a")) {
        targetHeight = winHeight / 2;
        targetWidth = video.videoWidth * targetHeight / video.videoHeight;
        posLeft = (winWidth / 2 - targetWidth) / 2;
        posTop = winHeight / 2;
    }

    if (config.specialMode) {
        elm.style.visibility = "hidden";
    } else if (layout == "a" || layout == "n") {
        elm.style.visibility = "hidden";
    } else {
        if (elm != video) elm.style.visibility = "visible";
    }

    elm.style.position  = 'absolute';
    elm.style.left      = posLeft
    elm.style.top       = posTop;
    elm.style.width     = targetWidth;
    elm.style.height    = targetHeight

    return {left: posLeft, top: posTop, width: targetWidth, height: targetHeight}
}
/*
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
*/
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
    var targetWidth  = window.innerWidth / 2;    //window.innerWidth / 3;
    var targetHeight = window.innerHeight / 2

    if ((layout == "ar") || (layout == "a")) {
        posTop = 0;
        targetHeight    = window.innerHeight;
        targetWidth     = window.innerWidth / 2;   //window.innerWidth / 2;
    }
    rendererUser.domElement.style.left  = posLeft
    rendererUser.domElement.style.top   = posTop;
    rendererUser.setSize(targetWidth, targetHeight);

    if (config.specialMode) {
        rendererUser.domElement.style.visibility = "hidden";
    } else {
        if (layout == "n") {
            rendererUser.domElement.style.visibility = "hidden";
        } else {
            rendererUser.domElement.style.visibility = "visible";
        }
    }
    if (userVrm) {
        if (screen.width > screen.height) {
            userVrm.scene.position.x = -2;
            orbitCameraUser.position.x = -2;
        } else {
            userVrm.scene.position.x    =    0;
            orbitCameraUser.position.x  = -0.2;
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

function setBackImage(value) {
    let elm = document.querySelector("#right_panel");
    var image;
    
         if (value == "1") image = "url('./assets/1129BG-1.jpg')";
    else if (value == "2") image = "url('./assets/1129BG-2.jpg')"
    else if (value == "3") image = "url('./assets/1129BG-3.png')"
    else if (value == "4") image = "url('./assets/1129BG-4.png')"
    else if (value == "5") image = "url('./assets/1129BG-5.jpg')"
    else if (value == "g") image = "url('./assets/greenBG.jpeg')"
    else if (value == "b") image = "url('./assets/blueBG.jpeg')"
    else if (value == "l") image = "url('./assets/concert_stage_2.jpg')"
    else if (value == "m") image = "url('./assets/map.jpeg')"
                      else image = "url('./assets/map.jpeg')"
    
    elm.style.backgroundImage = image;
}

function useGlass(use) {
    config.showGlass = use;
};
function useSkeletonOnVideo(use) {
    config.skeletonAlignVideo = use;
};
function useAssistannt(use) {
    config.useAssistant = use;
    showAssist(config.useAssistant)
};
function useHat(use) {
    config.showHat = use;
};
function useCutOut(use) {
   sdk.setMaskOption(use);
};

//const rendererVideo = new THREE.WebGLRenderer({ alpha: true });
function adjustPanel() {
    //let videoElement = document.querySelector("video");
    let videoElement    = findMindARVideo();
    let videoCanvas     = document.querySelector(".output_canvas");
    let videoControls   = document.querySelector("#video_controls");
    let elmSkeletonT    = document.querySelector("#teacherCanvas")

    //videoElement.style.visibility = "hidden"
    videoElement.style.zIndex = -3
    videoCanvas.style.opacity = parseFloat(opacity);
    adjustUserVideo(videoElement);
    adjustUserVideo(videoCanvas);
    var info = adjustUserVideo(rendererVideo.domElement);
    rendererVideo.setSize(info.width,info.height);
    cameraVideo.aspect  = info.width / info.height;
    cameraVideo.updateProjectionMatrix();

    //adjustUserVideo(videoControls);
    
    adjustUserAvatar(rendererUser, orbitCameraUser)
    
    const teacherLeft   = (layout == "n" || config.specialMode) 
                          ? (config.useAssistant)? window.innerWidth / 10: window.innerWidth / 4
                          : window.innerWidth / 2;
    const teacherTop    = (config.specialMode) ? window.innerHeight * 0.1: 0;
    const teacherWidth  = (config.specialMode) ?  window.innerWidth * 0.3: window.innerWidth / 2;
    const teacherHeight = (config.specialMode) ? window.innerHeight * 0.6: window.innerHeight;
    //rendererUser.setSize(window.innerWidth / 3, window.innerHeight / 2);
    rendererTeacher.domElement.style.left   = teacherLeft;
    rendererTeacher.domElement.style.top    = teacherTop;
    rendererTeacher.setSize(teacherWidth, teacherHeight)

    //orbitCameraUser.aspect      = (window.innerWidth / 3) / (window.innerHeight / 2);
    orbitCameraTeacher.aspect   = teacherWidth / teacherHeight;
    //orbitCameraUser.updateProjectionMatrix();
    orbitCameraTeacher.updateProjectionMatrix();
}

window.setTeacherOption = setTeacherOption;
window.setLayout = setLayout;
window.adjustPanel = adjustPanel;
window.setOpacity = setOpacity;
window.setMirror = setMirror;
window.setBackImage = setBackImage;
window.bindVideoControl = bindVideoControl;
window.useGlass = useGlass;
window.useHat = useHat;
window.useCutOut = useCutOut;
window.useSkeletonOnVideo = useSkeletonOnVideo;
window.useAssistannt = useAssistannt;

function bindVideoControl(type, elm) {
    var video = sdk.sourceVideo();

    if (detect) {
        video = sdk.sourceVideo();
    } else {
        var elmVideo = document.querySelector("#teacher_video");
        video = teacherVideo;
    }

    if (type == "play") {
        console.log("bind play " + elm)
        elm.onclick = () => {
            if (video.paused) {
                var speed = elmSpeed.value;
                video.playbackRate = speed;
                video.play();
                elm.innerText = "Pause"
            } else {
                video.pause();
                elm.innerText = "Play"
            }
        }
    } else if (type == "time") {
            var timeLoop = () => {
                setTimeout(() => {
                    elm.value       = video.currentTime;
                    elmRange.value  = video.currentTime * 10;
                    timeLoop();
                }, 300);
            }
            timeLoop();
    } else if (type == "range") {
            elm.min = 0;
            elm.max = video.duration * 10;
            elm.oninput = () => {
                video.currentTime = parseInt(elm.value) / 10.0;
            }
    } else if (type == "back") {
            elm.onclick = () => {
                video.currentTime = (parseInt(elmRange.value) - 1) / 10.0;
            }
    } else if (type == "next") {
            elm.onclick = () => {
                video.currentTime = (parseInt(elmRange.value) + 1) / 10.0;
            }
    } else if (type == "dump") {
            elm.onclick = () => {
                DumpMode = !DumpMode;
                if (DumpMode) {
                    elm.innerText = "O"
                } else {
                    elm.innerText = "V"
                }
            }
    }
}

var elmPlay  = document.querySelector("#btnPlay");
var elmTime  = document.querySelector("#btnTime");
var elmRange = document.querySelector("#btnRange");
var elmSpeed = document.querySelector("#btnSpeed");
var elmBack  = document.querySelector("#btnBack");
var elmNext  = document.querySelector("#btnNext");
var elmDump  = document.querySelector("#btnDump");

sdk.onFirst = () => {
    //return;
    //if (detect) 
    {
        bindVideoControl("play",  elmPlay)
        bindVideoControl("time",  elmTime)
        bindVideoControl("range", elmRange)
        bindVideoControl("back",  elmBack)
        bindVideoControl("next",  elmNext)
        bindVideoControl("dump",  elmDump)
    }
}


/* VRM Character Animator */
const animateVRM = (vrm, results, data) => {
    if (null == vrm) return null;

    //let videoElement = document.querySelector("video");
    let videoElement = findMindARVideo();

    var rigPos = updateVRM(vrm, videoElement, results, data, DumpMode);
    if (DumpMode) DumpMode = !DumpMode; // Keep One Stop Dump
    // Update model to render physics
    var delta = clock_1.getDelta();
    //console.log("clock 1=" + delta);
    vrm.update(delta);
    
    //var ret = checkNodes(vrm);
    //console.log(ret);
    //console.log(vrm.humanoid.humanBones)

    return rigPos;
};

/*
window.animateVRM = (vrm, results) => {
    //console.log("xxxx")
    animateVRM(currentVrm, results)
}
*/

