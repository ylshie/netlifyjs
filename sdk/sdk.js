
//import {Holistic,POSE_CONNECTIONS, FACEMESH_TESSELATION, HAND_CONNECTIONS} from "./libs/mediapipe/holistic"
import {Pose, POSE_CONNECTIONS, FACEMESH_TESSELATION, HAND_CONNECTIONS} from "./libs/mediapipe/pose"
import {Camera} from "./libs/mediapipe/camera_utils";
import {drawConnectors, drawLandmarks} from "./libs/mediapipe/drawing_utils"
import {loadModel, getSourceVideo} from "./sdk_ar.js"

const modelPath = "./assets/models/musicband-raccoon/scene.gltf";

var clock_3 = new THREE.Clock();
class araiSDK {
    config = {
        usePos: true,
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

        //  return; // KILLME
        // console.log("onResult")
        // Draw landmark guides
            if (this.mode == "detect") {
              this.drawResults(results);
            } else {
              this.drawSkeleton(results);
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
        let videoElement = document.querySelector("video");
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
          console.log(record.current + " / " +  this.sourceVideo().duration);
        }
      }
      drawResults (results) {
        let videoElement = document.querySelector("video");
        
        this.detectVideo(results);
        this.drawSkeleton(results);
      }
      drawSkeleton(results) {
        let videoElement = document.querySelector("video");
        let canvasElement = document.querySelector('.output_canvas');
        let canvasCtx = canvasElement.getContext('2d');
        //var srcVideo = this.sourceVideo();

        this.currnt_time = Date.now();

        
        canvasElement.style.width = videoElement.style.width;
        canvasElement.style.height = videoElement.style.height;

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

  
