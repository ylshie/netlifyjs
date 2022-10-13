import * as Kalidokit from "./Kalidokit"
import * as xxx from "./sdk/build/araisdk.prod"
//import * as xxx from "./sdk/build/araisdk.dm"
//import {currentVrm, updateVRM, loadVRM, setVRM}from "./vrmlib"
import {updateVRM, loadVRM}from "./vrmlib"
//import {loadVideo} from './sdk/libs/camera-mock.js';
import {createChromaMaterial} from './sdk/libs/chroma-video.js';

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
    showTeacherVideo: true,
    showTeacherAvatar: false,
}
var DumpMode = false;

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
//const orbitCameraTeacher = new THREE.PerspectiveCamera(35, 1, 0.1, 1000);
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

if (config.showTeacherAvatar) {
    loadVRM(sceneTeacher, teacherPath, (vrm) => {
        vrm.scene.position.x = 0.5;
        teacherVrm = vrm;
        animate();
    })
}
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

var teacherVideo = null;
async function addTeacherVideo(scene) {
    //const video = await loadVideo("./assets/mock-videos/avatar.mp4");
    const video = document.createElement("video");
    video.crossOrigin = "anonymous";
    //video.id = "teacher_video";
    video.src = "./assets/mock-videos/avatar.mp4"
    video.loop = true;
    video.muted = true;
    video.playsInline = true;

    //video.play();
    video.pause();
    const texture = new THREE.VideoTexture(video);

    const geometry = new THREE.PlaneGeometry(1, 1616/1080);
    //const material = new THREE.MeshBasicMaterial({map: texture});
    const material = createChromaMaterial(texture, 0x00ff00);
    const plane = new THREE.Mesh(geometry, material);
    //plane.rotation.x = Math.PI/2;
    plane.position.x = 0.4; //0.6;
    plane.position.y = 1.0;
    plane.scale.multiplyScalar(1.4)
    

    if (config.showTeacherVideo) {
        scene.add(plane);
    }
    
    video.play();
    teacherVideo = video;
}

if (detect == null) {
    setTimeout(() => addTeacherVideo(sceneTeacher), 1000);
}

var played = false;
var sdk = new araiSDK();
var teacherSkeleton = null;

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
}

var score_teacher_left = null;
var score_teacher_right = null;

function playTeacherAnimator() {
    //var videoElement = document.querySelector("#teacher_video");
    var videoElement = teacherVideo;
    if (! videoElement) return;
    if (! teacherSkeleton) return;

    //console.log("play teacher")
    sdk.playResult(videoElement, teacherSkeleton, (results) => {
        var  vrm_results = results;
        var  sk_results = sdk.mirrorResults(results)
        if (mirror) {
            vrm_results = sdk.mirrorResults(results)
            sk_results = results;
        }

        score_teacher_left  = playLeftHand(vrm_results, teacher_left)
        score_teacher_right = playRightHand(vrm_results, teacher_right)
        let canvas = document.querySelector('#teacherCanvas');

        if (canvas && teacherVideo) {
            canvas.style.width  = teacherVideo.videoWidth / 4;
            canvas.style.height = teacherVideo.videoHeight / 4;

            sdk.drawSkeleton(canvas, sk_results);
        } else {
            console.log("canvase or video is null, fail to play teacher skeleton")
        }
        
        var rig = animateVRM(teacherVrm, vrm_results);
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

var curScore = 0;
var pre_user_left   = -1;
var pre_user_right  = -1;
var pre_teacher_left    = -1;
var pre_teacher_right   = -1;
sdk.onCallback = (results) => {
    //return; // KILLME
    //console.log("enter callack");
    adjustPanel();

    playTeacherVideo();
    
    var vrm_results = sdk.mirrorResults(results, 0.5)
    if (detect) {
        animateVRM(teacherVrm, vrm_results);
    } else {
        animateVRM(userVrm, vrm_results);
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
    
    if (score_left > 0) score_left -= 1;
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

    if (userVrm) {
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
    let videoElement    = findMindARVideo();
    let videoCanvas     = document.querySelector(".output_canvas");
    let videoControls   = document.querySelector("#video_controls")

    //videoElement.style.visibility = "hidden"
    videoElement.style.zIndex = -3
    videoCanvas.style.opacity = parseFloat(opacity);
    adjustUserVideo(videoElement);
    adjustUserVideo(videoCanvas);
    //adjustUserVideo(videoControls);
    
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
window.bindVideoControl = bindVideoControl;

function bindVideoControl(type, elm) {
    var video = sdk.sourceVideo();

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
    if (detect) {
        bindVideoControl("play",  elmPlay)
        bindVideoControl("time",  elmTime)
        bindVideoControl("range", elmRange)
        bindVideoControl("back",  elmBack)
        bindVideoControl("next",  elmNext)
        bindVideoControl("dump",  elmDump)
    }
}


/* VRM Character Animator */
const animateVRM = (vrm, results) => {
    if (null == vrm) return null;

    //let videoElement = document.querySelector("video");
    let videoElement = findMindARVideo();

    var rigPos = updateVRM(vrm, videoElement, results, DumpMode);
    if (DumpMode) DumpMode = !DumpMode; // Keep One Stop Dump
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

