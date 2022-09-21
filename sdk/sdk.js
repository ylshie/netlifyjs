
import {Holistic,POSE_CONNECTIONS, FACEMESH_TESSELATION, HAND_CONNECTIONS} from "./libs/mediapipe/holistic"
import {Camera} from "./libs/mediapipe/camera_utils";
import {drawConnectors, drawLandmarks} from "./libs/mediapipe/drawing_utils"
import startMindAR from "./sdk_ar.js"

const model = "./assets/models/musicband-raccoon/scene.gltf";

class araiSDK {
      create_camera(videoElement) {
        const camera = new Camera(videoElement, {
            onFrame: async () => {
                await this.holistic.send({ image: videoElement });
            },
            width: 640,
            height: 480,
        });
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
    
    constructor() {
        this.onCallback = null;
    
        const onResults = (results) => {
        // console.log("onResult")
        // Draw landmark guides
            this.drawResults(results);
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

        this.holistic = new Holistic({
            locateFile: (file) => {
                var real_file = data_file_map[file];

                console.log("load file " + file + " from " + real_file)
                //return `https://cdn.jsdelivr.net/npm/@mediapipe/holistic@0.5.1635989137/${file}`;

                return `./assets/data/${file}`;
            },
        });

        this.holistic.setOptions({
            modelComplexity: 1,
            smoothLandmarks: true,
            minDetectionConfidence: 0.7,
            minTrackingConfidence: 0.7,
            refineFaceLandmarks: true,
        });

        // Pass holistic a callback function
        this.holistic.onResults(onResults);

        this.hook_video()
      };

      drawResults (results) {
        let videoElement = document.querySelector("video");
        let canvasElement = document.querySelector('.output_canvas');
        let canvasCtx = canvasElement.getContext('2d');

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
        canvasCtx.drawImage(
            results.image, 0, 0, canvasElement.width, canvasElement.height);

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

  