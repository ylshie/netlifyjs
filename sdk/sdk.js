
//import {Holistic,POSE_CONNECTIONS, FACEMESH_TESSELATION, HAND_CONNECTIONS} from "./libs/mediapipe/holistic"
import {Pose, POSE_CONNECTIONS, FACEMESH_TESSELATION, HAND_CONNECTIONS} from "./libs/mediapipe/pose"
import {Camera} from "./libs/mediapipe/camera_utils";
import {drawConnectors, drawLandmarks} from "./libs/mediapipe/drawing_utils"
import {loadModel, getSourceVideo} from "./sdk_ar.js"

const modelPath = "./assets/models/musicband-raccoon/scene.gltf";

const mirrorMap = [
  0, //  0: Nose same
  4, //  1: Left Eye Inner
  5, //  2: Left Eye
  6, //  3: Left Eye Outer
  1, //  4: Right Eye Inner
  2, //  5: Right Eye
  3, //  6: Right Eye Outer
  8, //  7: Left Ear
  7, //  8: Right Ear
 10, //  9: Left Month
  9, // 10: Right Month
 12, // 11: Left Shoulder
 11, // 12: Right Shoulder
 14, // 13: Left Elbow
 13, // 14: Right Elbow
 16, // 15: Left Wrist
 15, // 16: Right Wrist
 18, // 17: Left Pinky
 17, // 18: Right Pinky
 20, // 19: Left Index
 19, // 20: Right Index
 22, // 21: Left Thumb
 21, // 22: Right Thumb
 24, // 23: Left Hip
 23, // 24: Right Hip
 26, // 25: Left Knee
 25, // 26: Right Knee
 28, // 27: Left Ankle
 27, // 28: Right Ankle
 30, // 29: Left Heel
 29, // 30: Right Heel
 32, // 31: Left Foot Index
 31, // 32: Right Foot Index
]

var clock_3 = new THREE.Clock();
class araiSDK {
    config = {
        usePos: true,
    }
    centerResult(curJson) {
      var  minX   = 10;
      var  maxX   = -10;
      var  minWX  = 10;
      var  maxWX  = -10;

      for (const key in curJson) {
          const record = curJson[key];

          if (record.poseLandmarks == null) continue;
          if (record.poseWorldLandmarks == null) continue;

          for (let i=0; i < record.poseLandmarks.length; i++) {
              minX = (minX > record.poseLandmarks) ? record.poseLandmarks: minX
              maxX = (maxX < record.poseLandmarks) ? record.poseLandmarks: maxX
          }
          for (let i=0; i < record.poseLandmarks.length; i++) {
              minWX = (minWX > record.poseLandmarks) ? record.poseLandmarks: minWX
              maxWX = (maxWX < record.poseLandmarks) ? record.poseLandmarks: maxWX
        }
      }

      this.ref_x  = (minX + maxX) / 2;
      this.ref_wx = (minWX + maxWX) / 2;
    }
    mirrorResults(results, offX=0) {
        var ret = {};
        
        if (results.poseLandmarks) {
          ret.poseLandmarks       = new Array(results.poseLandmarks.length);
        }
        if (results.poseWorldLandmarks) {
          ret.poseWorldLandmarks  = new Array(results.poseWorldLandmarks.length);
        }
        
        ret.image = results.image;
        if (results.poseLandmarks) {
            if (! this.ref_x) {
                this.ref_x = results.poseLandmarks[0].x;
            }
            //const ref_x = results.poseLandmarks[0].x;

            for (let i=0; i < results.poseLandmarks.length; i++) {
                const j = mirrorMap[i];

                ret.poseLandmarks[i] = Object.assign({}, results.poseLandmarks[j])
                ret.poseLandmarks[i].x = 2 * this.ref_x - ret.poseLandmarks[i].x - offX;
            }
        }
        
        if (results.poseWorldLandmarks) {
          //const ref_x = results.poseWorldLandmarks[0].x;
          if (! this.ref_wx) {
              this.ref_wx = results.poseWorldLandmarks[0].x;
          }

          for (let i=0; i < results.poseWorldLandmarks.length; i++) {
              const j = mirrorMap[i];

              ret.poseWorldLandmarks[i] = Object.assign({}, results.poseWorldLandmarks[j])
              ret.poseWorldLandmarks[i].x = 2 * this.ref_wx - ret.poseWorldLandmarks[i].x - offX;
          }
        }
        
        return ret;
    }
    loadVideoSkeleton(path, onLoaded = null) {
        var jsonFile = path; // "http://localhost:3000/dance.json";
        var request = new XMLHttpRequest();
        
        console.log("load json from " + jsonFile)
        request.open("GET", jsonFile, false);
        request.onreadystatechange = function() {
          if ( request.readyState === 4 && request.status === 200 ) {
            console.log("json file ready")
            var json = JSON.parse(request.responseText);
            if (onLoaded)
                onLoaded(json);
            //console.log(request.responseText);
          }
        }
        request.onprogress = (event) => { 
            connsole.log("downloaded " + event.lengthComputable + " of " + event.total)
        }
        request.send(null);
    }
    sourceVideo() {
        return getSourceVideo();  
    }
    create_camera(videoElement) {
      console.log("create camera");
      var self = this;
      const camera = new Camera(videoElement, {
          onFrame: async () => {
              if (self.firstTime) {
                self.firstTime = false;
                if (self.onFirst) {
                  self.onFirst();
                }
              }
              //console.log("on frame")
              //var delta = clock_3.getDelta();
              //console.log("clock 3 FPS=" + 1 / delta);
              //return; // KILLME: Hack for skip detection;
              if (this.mode == "detect") {
                //console.log("frame at " + (Date.now() - this.start_time))
                if (this.config.usePos) {
                    await this.pose.send({ image: videoElement });
                } else {
                    await this.holistic.send({ image: videoElement });
                }
              } else {
                this.playResult(this.sourceVideo(), this.jsonFile, this.onResults)
              }
          },
          width: 640, //640,  //640,
          height: 480,  //480  //480,
      });
      this.start_time = Date.now();
      camera.start();
    }
    hook_video() {
      var self = this;
      setTimeout(function(){
        let videoElement = document.querySelector("video");

        video.crossOrigin = "anonymous";
        if (videoElement) {
          self.create_camera(videoElement)
        } else {
          self.hook_video();
        }
      }, 1000)
    }
    playResult(videoElement, curJson, fResult) {
        var current = videoElement.currentTime;

        //for (const key in this.jsonFile) {
        for (const key in curJson) {
          //console.log("key: " + key);
          if (key < current) continue;

          // console.log("current: " + current + " pick " + key)
          var record = curJson[key];
          var result = {};
          if (record.poseLandmarks) {
            result.poseLandmarks = record.poseLandmarks;
          }
          if (record.poseWorldLandmarks) {
            result.poseWorldLandmarks = record.poseWorldLandmarks;
          }
          if (record.ea) {
            result.ea = record.ea;
          }
          if (record.faceLandmarks) {
            result.faceLandmarks = record.faceLandmarks;
          }
          if (record.rightHandLandmarks) {
            result.rightHandLandmarks = record.rightHandLandmarks;
          }
          if (record.leftHandLandmarks) {
            result.leftHandLandmarks = record.leftHandLandmarks;
          }

          //this.onResults(result);
          fResult(result)
          break;
        }
    }
    constructor() {
        this.onCallback = null;
        this.firstTime = true;
        this.first = true;
        this.jsonFile = null;
        this.tmpFile = {};
        this.mode = "detect"; // "detect" / "playback"
        loadModel(modelPath)
    
        this.onResults = (results) => {
            var delta = clock_3.getDelta();
            //console.log("clock 3 FPS=" + 1 / delta);

            let videoElement = document.querySelector("video");
            let canvasElement = document.querySelector('.output_canvas');
          
            this.adjustCanvas(canvasElement, videoElement);
        //  return; // KILLME
        //   console.log("onResult")
        // Draw landmark guides
            if (this.mode == "detect") {
                //this.drawResults(results);
                this.detectVideo(results);
                this.drawSkeleton(canvasElement, results);
            } else {
                this.drawSkeleton(canvasElement, results);
            }
        // Animate model
        //  animateVRM(results, results);
            if (this.onCallback) {
              this.onCallback(results, results);
            }
         };

        const data_file_map = {
            assets_loader_js: "assets_loader.js", // holistic_solution_packed_assets_loader.js
            assets_data: "assets.data", // holistic_solution_packed_assets.data
            simd_wasm_bin_js: "simd_wasm_bin.js", // holistic_solution_simd_wasm_bin.js
            simd_wasm_bin_wasm: "simd_wasm_bin.wasm", // holistic_solution_simd_wasm_bin.wasm
            wasm_bin_wasm: "wasm_bin.wasm", // holistic_solution_wasm_bin.wasm
            binarypb: "_.binarypb", // holistic.binarypb
            full_tflite: "pose_landmark_full.tflite", // pose_landmark_full.tflite
            heavy_tflite: "pose_landmark_heavy.tflite", // pose_landmark_heavy.tflite
            lite_tflite: "pose_landmark_lite.tflite" // pose_landmark_lite.tflite
        }

        if (this.config.usePos) {
            this.pose = new Pose({
              locateFile: (file) => {
                console.log("load file " + file);
                return `https://cdn.jsdelivr.net/npm/@mediapipe/pose@0.4/${file}`;
              }
            });
        } else {
            this.holistic = new Holistic({
              locateFile: (file) => {
                  var real_file = data_file_map[file];

                  console.log("load file " + file + " from " + real_file)
                  //return `https://cdn.jsdelivr.net/npm/@mediapipe/holistic@0.5.1635989137/${file}`;

                  return `./assets/data/${file}`;
              },
            });
        }
        
        const engine_options = {
            /*
            modelComplexity: 1,
            smoothLandmarks: true,
            minDetectionConfidence: 0.7,
            minTrackingConfidence: 0.7,
            refineFaceLandmarks: true,
          */
            "selfieMode": true, //true,
            "modelComplexity": 1,
            "smoothLandmarks": true,
            "enableSegmentation": false,
            "smoothSegmentation": true,
            "minDetectionConfidence": 0.5,
            "minTrackingConfidence": 0.5,
            "effect": "background"   
        }
        if (this.config.usePos) {
            this.pose.setOptions(engine_options);
        } else {
            this.holistic.setOptions(engine_options);
        }
        
        // Pass holistic a callback function
        //const pose = new mpPose.Pose(options);
        if (this.config.usePos) {
            this.pose.onResults(this.onResults);
        } else {
            this.holistic.onResults(this.onResults);
        }
        this.hook_video()
    };

    sendFormData(data) {
      const formData = new FormData();

      formData.append("name", "dance");
      
      // HTML file input, chosen by user
      //formData.append("userfile", fileInputElement.files[0]);
      
      // JavaScript file-like object
      const content = '<q id="a"><span id="b">hey!</span></q>'; // the body of the new file…
      const blob = new Blob([JSON.stringify(data)], { type: "text/json"});
      
      formData.append("file", blob);
      
      const request = new XMLHttpRequest();
      request.open("POST", "http://localhost:3000/upload");
      request.send(formData);
    }

    detectVideo(results) {
      //let videoElement = document.querySelector("video");
      var srcVideo = this.sourceVideo();
      if (srcVideo == null) return;

      if (this.first) {
        this.first = false;
        
        srcVideo.pause();
        srcVideo.currentTime = 0; // if this is far enough away from current, it implies a "play" call as well...oddly. I mean seriously that is junk.
        // however if it close enough, then we need to call play manually
        // some shenanigans to try and work around this:
        var timer = setInterval(function() {
            if (srcVideo.paused && srcVideo.readyState ==4 || !srcVideo.paused) {
              this.start_time = Date.now();
              srcVideo.play();
              clearInterval(timer);
            }       
        }, 50);
      }
    
      // TO_DO
      if (srcVideo.currentTime >= (srcVideo.duration - 0.1)) {
        if (this.jsonFile == null) {
          this.jsonFile = this.tmpFile;
          this.tmpFile = null;
          console.log(this.jsonFile);
          this.sendFormData(this.jsonFile);
          srcVideo.pause();
          this.mode = "playback";
          srcVideo.currentTime = 0;
          //srcVideo.play(); // KILLME
          const playButton = document.createElement("button");
          playButton.innerHTML = "start";
          playButton.style.position = 'fixed';
          playButton.style.zIndex = 10000;
          document.body.appendChild(playButton);

          playButton.addEventListener('click', () => {
            srcVideo.play();
            document.body.removeChild(playButton);
          });
        }
        return;
      }

      var offset = this.currnt_time - this.start_time;
      var record = {offset: offset}

      if (srcVideo)
        record.current = srcVideo.currentTime; //videoElement.currentTime;
      if (results.poseLandmarks) {
        record.poseLandmarks = results.poseLandmarks;
      }
      if (results.poseWorldLandmarks) {
        record.poseWorldLandmarks = results.poseWorldLandmarks;
      }
      if (results.ea) {
        record.ea = results.ea;
      }
      if (results.faceLandmarks) {
        record.faceLandmarks = results.faceLandmarks;
      }
      if (results.rightHandLandmarks) {
        record.rightHandLandmarks = results.rightHandLandmarks;
      }
      if (results.leftHandLandmarks) {
        record.leftHandLandmarks = results.leftHandLandmarks;
      }
      if (this.mode == "detect") {
        this.tmpFile[record.current] = record;
        //console.log(record.current + " / " +  this.sourceVideo().duration);
      }
    }

    adjustCanvas(canvasElement, videoElement) {
        canvasElement.style.width = videoElement.style.width;
        canvasElement.style.height = videoElement.style.height;
    }
      /*
      drawResults (results) {
        //let videoElement = document.querySelector("video");
        let videoElement  = document.querySelector("video");
        let canvasElement = document.querySelector('.output_canvas');
        
        //this.adjustCanvas(canvasElement, videoElement);
        this.detectVideo(results);
        this.drawSkeleton(canvasElement, videoElement, results);
      }
      */

    vrmSkeleton(canvas, vrm) {
    }
    applyQ(p, q) {
        const nx = p.x*(q.x*q.x+q.w*q.w-q.y*q.y-q.z*q.z) + p.y*(2*q.x*q.y- 2*q.w*q.z) + p.z*( 2*q.x*q.z+ 2*q.w*q.y)
        const ny = p.x*( 2*q.w*q.z + 2*q.x*q.y) + p.y*(q.w*q.w-q.x*q.x+q.y*q.y-q.z*q.z)+ p.z*(-2*q.w*q.x+2*q.y*q.z)
        const nz = p.x*(-2*q.w*q.y + 2*q.x*q.z) + p.y*(2*q.w*q.x+ 2*q.y*q.z)+ p.z*(q.w*q.w-q.x*q.x-q.y*q.y+q.z*q.z)
        return {x: nx, y: ny, z: nz};
    }
    drawLine = (ctx, bones, name_a, name_b) => {
        if (bones[name_a] == null) {console.log("lack " + name_a); return}
        if (bones[name_b] == null) {console.log("lack " + name_b); return}
        //const a     = (name_a == "spine" && name_b == "hips")
        //            ? this.applyQ(bones[name_a].p, bones[name_a].q)
        //              : bones[name_a].p;
        const a     = bones[name_a].p;
        const b     = bones[name_b].p;
        const width = parseInt(ctx.canvas.width);
        const height= parseInt(ctx.canvas.height);
        const from  = {x: Math.floor(a.x * width / 2 + 100), y: height - Math.floor(a.y * height / 2)}
        const to    = {x: Math.floor(b.x * width / 2 + 100), y: height - Math.floor(b.y * height / 2 )}
        ctx.moveTo( from.x,  from.y);
        ctx.lineTo(   to.x,    to.y);
        // console.log("draw from " + name_a + " (" + from.x + "x" + from.y + ") to " + name_b + " (" + to.x + "x" + to.y + ")")
    }

    drawBones(canvas, bones) {
        var ctx = canvas.getContext("2d")
        
        //ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        ctx.save();
        ///ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle   = "#FFFF00";
        ctx.strokeStyle = "#FFFF00";
        ctx.lineWidth   = 4;
        ctx.beginPath();  
        ctx.strokeStyle = "#FFFFFF";
        this.drawLine(ctx, bones, "head",  "neck")
        ctx.closePath();
        ctx.stroke();

        ctx.beginPath();  
        ctx.strokeStyle = "#FF0000";
        this.drawLine(ctx, bones, "neck",  "chest")
        ctx.closePath();
        ctx.stroke();

        ctx.beginPath();
        ctx.strokeStyle = "#000000";
        this.drawLine(ctx, bones, "chest", "spine")
        ctx.closePath();
        ctx.stroke();

        ctx.beginPath();
        ctx.strokeStyle = "#00FF00";
        this.drawLine(ctx, bones, "spine", "hips")
        ctx.closePath();
        ctx.stroke();

        ctx.beginPath();
        ctx.strokeStyle = "#777777";
        this.drawLine(ctx, bones, "chest", "leftShoulder")
        this.drawLine(ctx, bones, "chest", "rightShoulder")
        ctx.closePath();
        ctx.stroke();

        ctx.beginPath();
        ctx.strokeStyle = "#333333"; // Low Gray => Upper ARM
        this.drawLine(ctx, bones, "leftShoulder",  "leftUpperArm")
        this.drawLine(ctx, bones, "rightShoulder", "rightUpperArm")
        ctx.closePath();
        ctx.stroke();

        ctx.beginPath();
        ctx.strokeStyle = "#FFFF00";  // Red => Lower Arm
        this.drawLine(ctx, bones, "leftUpperArm",  "leftLowerArm")
        this.drawLine(ctx, bones, "rightUpperArm", "rightLowerArm")
        
        ctx.closePath();
        ctx.stroke();

        ctx.beginPath();
        ctx.strokeStyle = "#FF0000";  // Yellow => Hand
        this.drawLine(ctx, bones, "leftLowerArm",  "leftHand")
        this.drawLine(ctx, bones, "rightLowerArm", "rightHand")
        ctx.closePath();
        ctx.stroke();

        ctx.beginPath();
        ctx.strokeStyle = "#FF00FF";  // Purple => hips to Upper Leg
        this.drawLine(ctx, bones, "hips",   "leftUpperLeg")
        this.drawLine(ctx, bones, "hips",   "rightUpperLeg")
        ctx.closePath();
        ctx.stroke();

        ctx.beginPath();
        ctx.strokeStyle = "#0000FF";  // Blue => Upper to Lower Leg
        this.drawLine(ctx, bones, "leftUpperLeg",  "leftLowerLeg")
        this.drawLine(ctx, bones, "rightUpperLeg", "rightLowerLeg")
        ctx.closePath();
        ctx.stroke();

        ctx.beginPath();
        ctx.strokeStyle = "#00FFFF";  // Magen => Lower Leg to Foot
        this.drawLine(ctx, bones, "leftLowerLeg",  "leftFoot")
        this.drawLine(ctx, bones, "rightLowerLeg", "rightFoot")
        ctx.closePath();
        ctx.stroke();

        ctx.restore();
    }
    drawSkeleton(canvasElement, results) {
        let canvasCtx = canvasElement.getContext('2d');
        
        this.currnt_time = Date.now();
        
        canvasCtx.save();
        canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
        //canvasCtx.drawImage(results.segmentationMask, 0, 0,
        //                    canvasElement.width, canvasElement.height);

        // Only overwrite existing pixels.
        canvasCtx.globalCompositeOperation = 'source-in';
        canvasCtx.fillStyle = '#00FF00';
        canvasCtx.fillRect(0, 0, canvasElement.width, canvasElement.height);

        // Only overwrite missing pixels.
        canvasCtx.globalCompositeOperation = 'destination-atop';
        if (results.image) {
          canvasCtx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height);
        }
        canvasCtx.globalCompositeOperation = 'source-over';
          drawConnectors(canvasCtx, results.poseLandmarks, POSE_CONNECTIONS,
                        {color: '#00FF00', lineWidth: 4});
          drawLandmarks(canvasCtx, results.poseLandmarks,
                        {color: '#FF0000', lineWidth: 2});
          drawConnectors(canvasCtx, results.faceLandmarks, FACEMESH_TESSELATION,
                        {color: '#C0C0C070', lineWidth: 1});
          drawConnectors(canvasCtx, results.leftHandLandmarks, HAND_CONNECTIONS,
                        {color: '#CC0000', lineWidth: 5});
          drawLandmarks(canvasCtx, results.leftHandLandmarks,
                        {color: '#00FF00', lineWidth: 2});
          drawConnectors(canvasCtx, results.rightHandLandmarks, HAND_CONNECTIONS,
                        {color: '#00CC00', lineWidth: 5});
          drawLandmarks(canvasCtx, results.rightHandLandmarks,
                        {color: '#FF0000', lineWidth: 2});
        canvasCtx.restore();
    };
}

window.araiSDK = araiSDK;

  
