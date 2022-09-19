# Metawave Body AR
nvm use 14.17.0
npm init
npm install parcel-bundler --save-dev
npm audit fix
npm install parcel
npm audit fix
npm i mind-ar --save
npm audit fix
npm install three
npm audit fix
npm install http-server
npm audit fix
according to the example you want to deploy, modify the dev and build command
npm run dev
npm run build
-----------
nvm install 16.16.0
nvm use 16.16.0
npm install parcel
npm audit fix --force
-----------
記得把assets folder(gltf, bin file, mp4), 一起放到dist folder下面
facion.ico, png...... 放到dist folder下面



--------------
generate .mind file:
https://hiukim.github.io/mind-ar-js-doc/tools/compile





GLTFLoader
https://www.youtube.com/watch?v=yPA2z7fl4J8
https://stackoverflow.com/questions/64233846/unexpected-token-in-json-at-position-0-gltfloader-in-three-js-and-vue-app
https://discourse.threejs.org/t/syntaxerror-unexpected-token-in-json-at-position-0/13810/5
https://medium.com/geekculture/unexpected-token-in-json-at-position-0-three-js-20e9c4e1aabc
https://stackoverflow.com/questions/57453692/how-to-solve-the-error-three-gltfloader-failed-to-load-buffer-scene-bin

netlify mp4
https://answers.netlify.com/t/videos-disappeared-from-site-but-still-appearing-on-temporary-site/52848/30


=== Summary

1. ./lectures-start directory contains source code at the beginning of the lectures
2. ./lectures directory contains source at the end of the lectures
3. ./assets directory contains all resources used in the examples
4. ./libs contains all libraries used in the examples

=== Lectures and Source Code Mappings:

-- Section 3 --

3D Rendering Basic: 110-threejs 

-- Section 4 --

Quick Start: 200-image-start A
Mock WebCam: 201-camera-mock
Custom Container: 202-custom-container
Import 3D Models: 210-models A
  拿MetaWave Logo會產生3D Model
  3D Models:https://sketchfab.com/features/gltf


Multiple Image Targets: 211-multi-detect
  https://hiukim.github.io/mind-ar-js-doc/tools/compile
  一次上傳兩張要追蹤的target圖
  準備兩個3D models
  一次還是只能追蹤到其中一張target圖

Multiple Targets Tracking: 212-multi-track
  一次追蹤兩張Target圖



Animations: 213-animations
  拿Newave Logo會產生3D動畫


Events Handling: 220-events
  拿Newave Logo會產生console log "on Target Found"


Audio Contents: 221-audio
  拿Newave Logo會產生3D model並出現音樂


User Interactions: 222-user-interactions
  拿Newave Logo會產生3D model, 點擊鼓的部分, 出現音樂


Video Contents: 230-video
  拿MetaWave Logo會出現metawave片尾影片


要改Chroma Videos: 231-chroma-video
  (目前是mock with video)
  拿MetaWave Logo會出現去除掉綠幕的綠幕影片(chroma video)垂直在logo上



Fix Autostart: 232-fix-autostart


CSS Renderer: 240-css-renderer
  拿MetaWave Logo會出現一層CSS DIV


Streaming Vimeo: 241-vimeo


Streaming Youtube: 242-youtube
  拿MetaWave Logo會出現youtube video, 在js中設定要出現的youtube videoId

Custom UI/UX: 250-custom-ui
  拿MetaWave Logo會出現一個平面, 客製化掃描框的UI可以藉由設定uiScanning: "#scanning", 設定特定div tag的id為scanning


Assignment: 260-image-tracking-assignment
  拿MetaWave Logo會產生AR 3D名片

-- Section 5 --
Quick Start: 300-face-start
  人臉追蹤出鼻頭(landmark 1)
  https://github.com/tensorflow/tfjs-models/tree/master/face-landmarks-detection
  最下面圖放大可以顯示出各個追蹤點
  


Import 3D Models: 310-model-accessory
  人臉追蹤出眼睛中間(landmark 168),並放上眼鏡3D model


Occluders: 311-occluder
  解決上面眼鏡掛鉤在頭前面問題

FaceMesh: 320-facemesh
  臉譜

Switch Cameras: 330-switch-camera
  切換手機前後鏡頭

Photo Capure: 331-photo-capture
  照相AR圖片

Web Share: 332-web-share
  分享AR圖片

Assignment: 340-face-tracking-assignment
  人臉追蹤綜合應用


-- Section 6 --
WebXR Quick Start: 400-webxr-start
ARButton: 401-ar-button
Controllers: 410-controller
Place Objects: 411-place-object
HitTests:: 420-hit-test
Assignment: 430-furniture

-- Section 7 --
Sharing Camera Feed: 500-video-feed
  偵測到MetaWave Logo會出現一個css平面, 偵測到有手的出現則css平面會變顏色

Hand Gestures Detection: 501-hand-gesture
  偵測手的Landmark, 並根據Landmark形狀, 可以自行設定特定手勢, 用手勢來控制3D Model

Face Emotions Detection: 502-face-api
  偵測臉的表情, 並顯示表情在臉的特定Landmark(151)上面

-- Section 8 -- 
Introduction to AFRAME: 600-aframe
AFRAME and WebXR: 601-aframe-webxr
AFRAME and MindAR: 602-aframe-mindar
