import * as Kalidokit from "./Kalidokit"

class vrmlib {


}

const remap = Kalidokit.Utils.remap;
const clamp = Kalidokit.Utils.clamp;
const lerp  = Kalidokit.Vector.lerp;
/*
export let currentVrm;

export function setVRM(vrm) {
    currentVrm = vrm;
}
*/
export function loadVRM(_scene, vrmPath, onLoaded = null) {
    // Import Character VRM
    const loader = new THREE.GLTFLoader();
    //const loader = new GLTFLoader();
    loader.crossOrigin = "anonymous";
    // Import model from URL, add your own model here
    loader.load(vrmPath,
                (gltf) => {
                    THREE.VRMUtils.removeUnnecessaryJoints(gltf.scene);

                    THREE.VRM.from(gltf).then((vrm) => {
                        //vrm.scene.position.x = 0.5;
                        _scene.add(vrm.scene);
                        //currentVrm = vrm;
                        //setVRM(vrm);
                        if (onLoaded)
                            onLoaded(vrm)
                        //arthur//
                        vrm.scene.rotation.y = Math.PI; // Rotate model 180deg to face camera
                    });
                },
                (progress) => console.log("Loading model...", 100.0 * (progress.loaded / progress.total), "%"),
                (error) => console.error(error)
    );
}

// Apply Q formula
// https://www.euclideanspace.com/maths/algebra/realNormedAlgebra/quaternions/transforms/derivations/vectors/index.htm
//
function applyQ(p, q) {
    const nx = p.x*(q.x*q.x+q.w*q.w-q.y*q.y-q.z*q.z) + p.y*(2*q.x*q.y- 2*q.w*q.z) + p.z*( 2*q.x*q.z+ 2*q.w*q.y)
    const ny = p.x*( 2*q.w*q.z + 2*q.x*q.y) + p.y*(q.w*q.w-q.x*q.x+q.y*q.y-q.z*q.z)+ p.z*(-2*q.w*q.x+2*q.y*q.z)
    const nz = p.x*(-2*q.w*q.y + 2*q.x*q.z) + p.y*(2*q.w*q.x+ 2*q.y*q.z)+ p.z*(q.w*q.w-q.x*q.x-q.y*q.y+q.z*q.z)
    return {x: nx, y: ny, z: nz};
}
function addNodes(a, b) {
    return {x: a.x + b.x, y: a.y + b.y, z: a.z + b.z}
}
function addQuat(a, b) {
    return {x: a.x * b.x, y: a.y * b.y, z: a.z * b.z, w: a.w * b.w}
}
export const refineNodes = (bones) => {
    bones["spine"].p =   applyQ(bones["spine"].p, bones[ "hips"].q)
    bones["spine"].p = addNodes(bones["spine"].p, bones[ "hips"].p)
    bones["spine"].q =  addQuat(bones["spine"].q, bones[ "hips"].q)

    bones["chest"].p =   applyQ(bones["chest"].p, bones["spine"].q)
    bones["chest"].p = addNodes(bones["chest"].p, bones["spine"].p)
    bones["chest"].q =  addQuat(bones["chest"].q, bones["spine"].q)

    bones[ "neck"].p =   applyQ(bones[ "neck"].p, bones["chest"].q)
    bones[ "neck"].p = addNodes(bones[ "neck"].p, bones["chest"].p)
    bones[ "neck"].q =  addQuat(bones[ "neck"].q, bones["chest"].q)

    bones[ "head"].p =   applyQ(bones[ "head"].p, bones[ "neck"].q)
    bones[ "head"].p = addNodes(bones[ "head"].p, bones[ "neck"].p)
    bones[ "head"].q =  addQuat(bones[ "head"].q, bones[ "neck"].q)
//  --------------
    bones[ "leftShoulder"].p =   applyQ(bones[ "leftShoulder"].p, bones["chest"].q)
    bones[ "leftShoulder"].p = addNodes(bones[ "leftShoulder"].p, bones["chest"].p)
    bones[ "leftShoulder"].q =  addQuat(bones[ "leftShoulder"].q, bones["chest"].q)

    bones["rightShoulder"].p =   applyQ(bones["rightShoulder"].p, bones["chest"].q)
    bones["rightShoulder"].p = addNodes(bones["rightShoulder"].p, bones["chest"].p)
    bones["rightShoulder"].q =  addQuat(bones["rightShoulder"].q, bones["chest"].q)

    bones[ "leftUpperArm"].p =   applyQ(bones[ "leftUpperArm"].p, bones[ "leftShoulder"].q)
    bones[ "leftUpperArm"].p = addNodes(bones[ "leftUpperArm"].p, bones[ "leftShoulder"].p)
    bones[ "leftUpperArm"].q =  addQuat(bones[ "leftUpperArm"].q, bones[ "leftShoulder"].q)

    bones["rightUpperArm"].p =   applyQ(bones["rightUpperArm"].p, bones["rightShoulder"].q)
    bones["rightUpperArm"].p = addNodes(bones["rightUpperArm"].p, bones["rightShoulder"].p)
    bones["rightUpperArm"].q =  addQuat(bones["rightUpperArm"].q, bones["rightShoulder"].q)

    bones[ "leftLowerArm"].p =   applyQ(bones[ "leftLowerArm"].p, bones[ "leftUpperArm"].q)
    bones[ "leftLowerArm"].p = addNodes(bones[ "leftLowerArm"].p, bones[ "leftUpperArm"].p)
    bones[ "leftLowerArm"].q =  addQuat(bones[ "leftLowerArm"].q, bones[ "leftUpperArm"].q)

    bones["rightLowerArm"].p =   applyQ(bones["rightLowerArm"].p, bones["rightUpperArm"].q)
    bones["rightLowerArm"].p = addNodes(bones["rightLowerArm"].p, bones["rightUpperArm"].p)
    bones["rightLowerArm"].q =  addQuat(bones["rightLowerArm"].q, bones["rightUpperArm"].q)
 // ---------------------------------------   
    bones[ "leftUpperLeg"].p =   applyQ(bones[ "leftUpperLeg"].p, bones["hips"].q)
    bones[ "leftUpperLeg"].p = addNodes(bones[ "leftUpperLeg"].p, bones["hips"].p)
    bones[ "leftUpperLeg"].q =  addQuat(bones[ "leftUpperLeg"].q, bones["hips"].q)

    bones["rightUpperLeg"].p =   applyQ(bones["rightUpperLeg"].p, bones["hips"].q)
    bones["rightUpperLeg"].p = addNodes(bones["rightUpperLeg"].p, bones["hips"].p)
    bones["rightUpperLeg"].q =  addQuat(bones["rightUpperLeg"].q, bones["hips"].q)

    bones[ "leftLowerLeg"].p =   applyQ(bones[ "leftLowerLeg"].p, bones[ "leftUpperLeg"].q)
    bones[ "leftLowerLeg"].p = addNodes(bones[ "leftLowerLeg"].p, bones[ "leftUpperLeg"].p)
    bones[ "leftLowerLeg"].q =  addQuat(bones[ "leftLowerLeg"].q, bones[ "leftUpperLeg"].q)

    bones["rightLowerLeg"].p =   applyQ(bones["rightLowerLeg"].p, bones["rightUpperLeg"].q)
    bones["rightLowerLeg"].p = addNodes(bones["rightLowerLeg"].p, bones["rightUpperLeg"].p)
    bones["rightLowerLeg"].q =  addQuat(bones["rightLowerLeg"].q, bones["rightUpperLeg"].q)
//  -------------------
    bones[ "leftHand"].p =   applyQ(bones[ "leftHand"].p, bones["leftLowerArm"].q)
    bones[ "leftHand"].p = addNodes(bones[ "leftHand"].p, bones["leftLowerArm"].p)
    bones[ "leftHand"].q =  addQuat(bones[ "leftHand"].q, bones["leftLowerArm"].q)

    bones["rightHand"].p =   applyQ(bones["rightHand"].p, bones["rightLowerArm"].q)
    bones["rightHand"].p = addNodes(bones["rightHand"].p, bones["rightLowerArm"].p)
    bones["rightHand"].q =  addQuat(bones["rightHand"].q, bones["rightLowerArm"].q)

    bones[ "leftFoot"].p =   applyQ(bones[ "leftFoot"].p, bones["leftLowerLeg"].q)
    bones[ "leftFoot"].p = addNodes(bones[ "leftFoot"].p, bones["leftLowerLeg"].p)
    bones[ "leftFoot"].q =  addQuat(bones[ "leftFoot"].q, bones["leftLowerLeg"].q)

    bones["rightFoot"].p =   applyQ(bones["rightFoot"].p, bones["rightLowerLeg"].q)
    bones["rightFoot"].p = addNodes(bones["rightFoot"].p, bones["rightLowerLeg"].p)
    bones["rightFoot"].q =  addQuat(bones["rightFoot"].q, bones["rightLowerLeg"].q)

    return bones;
}
export const refineNodes_0 = (bones) => {
    bones["spine"].p =   applyQ(bones["spine"].p, bones["spine"].q)
    bones["spine"].p = addNodes(bones["spine"].p, bones[ "hips"].p)
    bones["chest"].p =   applyQ(bones["chest"].p, bones["chest"].q)
    bones["chest"].p = addNodes(bones["chest"].p, bones["spine"].p)
    bones[ "neck"].p =   applyQ(bones[ "neck"].p, bones[ "neck"].q)
    bones[ "neck"].p = addNodes(bones[ "neck"].p, bones["chest"].p)
    bones[ "head"].p =   applyQ(bones[ "head"].p, bones[ "head"].q)
    bones[ "head"].p = addNodes(bones[ "head"].p, bones[ "neck"].p)

    bones[ "leftShoulder"].p =   applyQ(bones[ "leftShoulder"].p, bones[ "leftShoulder"].q)
    bones[ "leftShoulder"].p = addNodes(bones[ "leftShoulder"].p, bones["chest"].p)
    bones["rightShoulder"].p =   applyQ(bones["rightShoulder"].p, bones["rightShoulder"].q)
    bones["rightShoulder"].p = addNodes(bones["rightShoulder"].p, bones["chest"].p)
    bones[ "leftUpperArm"].p =   applyQ(bones[ "leftUpperArm"].p, bones[ "leftUpperArm"].q)
    bones[ "leftUpperArm"].p = addNodes(bones[ "leftUpperArm"].p, bones[ "leftShoulder"].p)
    bones["rightUpperArm"].p =   applyQ(bones["rightUpperArm"].p, bones["rightUpperArm"].q)
    bones["rightUpperArm"].p = addNodes(bones["rightUpperArm"].p, bones["rightShoulder"].p)
    bones[ "leftLowerArm"].p =   applyQ(bones[ "leftLowerArm"].p, bones[ "leftLowerArm"].q)
    bones[ "leftLowerArm"].p = addNodes(bones[ "leftLowerArm"].p, bones[ "leftUpperArm"].p)
    bones["rightLowerArm"].p =   applyQ(bones["rightLowerArm"].p, bones["rightLowerArm"].q)
    bones["rightLowerArm"].p = addNodes(bones["rightLowerArm"].p, bones["rightUpperArm"].p)
    
    bones[ "leftUpperLeg"].p =   applyQ(bones[ "leftUpperLeg"].p, bones[ "leftUpperLeg"].q)
    bones[ "leftUpperLeg"].p = addNodes(bones[ "leftUpperLeg"].p, bones["hips"].p)
    bones["rightUpperLeg"].p =   applyQ(bones["rightUpperLeg"].p, bones["rightUpperLeg"].q)
    bones["rightUpperLeg"].p = addNodes(bones["rightUpperLeg"].p, bones["hips"].p)
    bones[ "leftLowerLeg"].p =   applyQ(bones[ "leftLowerLeg"].p, bones[ "leftLowerLeg"].q)
    bones[ "leftLowerLeg"].p = addNodes(bones[ "leftLowerLeg"].p, bones[ "leftUpperLeg"].p)
    bones["rightLowerLeg"].p =   applyQ(bones["rightLowerLeg"].p, bones["rightLowerLeg"].q)
    bones["rightLowerLeg"].p = addNodes(bones["rightLowerLeg"].p, bones["rightUpperLeg"].p)

    bones[ "leftHand"].p =   applyQ(bones[ "leftHand"].p, bones[ "leftHand"].q)
    bones[ "leftHand"].p = addNodes(bones[ "leftHand"].p, bones["leftLowerArm"].p)
    bones["rightHand"].p =   applyQ(bones["rightHand"].p, bones[ "rightHand"].q)
    bones["rightHand"].p = addNodes(bones["rightHand"].p, bones["rightLowerArm"].p)
    bones[ "leftFoot"].p =   applyQ(bones[ "leftFoot"].p, bones[ "leftFoot"].q)
    bones[ "leftFoot"].p = addNodes(bones[ "leftFoot"].p, bones["leftLowerLeg"].p)
    bones["rightFoot"].p =   applyQ(bones["rightFoot"].p, bones[ "rightFoot"].q)
    bones["rightFoot"].p = addNodes(bones["rightFoot"].p, bones["rightLowerLeg"].p)

    return bones;
}

export const checkNodes = (_currentVrm) => {
    if (! _currentVrm) return null;
    if (! _currentVrm.humanoid) return null;
    var namelist = THREE.VRMSchema.HumanoidBoneName;
    var ret      = {}

    Object.keys(namelist).forEach(key => {
        const name = namelist[key];
        const part = _currentVrm.humanoid.getBoneNode(name);
        if (part) {  //console.log(name); console.log(part)
            ret[name] = {p: part.position, q: part.quaternion};
        }
    });

    return refineNodes(ret);
}
// Animate Rotation Helper function
export const rigRotation = (_currentVrm, name, rotation = { x: 0, y: 0, z: 0 }, dampener = 1, lerpAmount = 0.3) => {
    if (!_currentVrm) return;
    const Part = _currentVrm.humanoid.getBoneNode(THREE.VRMSchema.HumanoidBoneName[name]);
    if (!Part) return;
    
    dampener = 1;
    lerpAmount = 1;

    let euler = new THREE.Euler(
        rotation.x * dampener,
        rotation.y * dampener,
        rotation.z * dampener,
        rotation.rotationOrder || "XYZ"
    );
    let quaternion = new THREE.Quaternion().setFromEuler(euler);
    Part.quaternion.slerp(quaternion, lerpAmount); // interpolate
};

// Animate Position Helper Function
export const rigPosition = (_currentVrm, name, position = { x: 0, y: 0, z: 0 }, dampener = 1, lerpAmount = 0.3) => {
    if (!_currentVrm) {
        return;
    }
    const Part = _currentVrm.humanoid.getBoneNode(THREE.VRMSchema.HumanoidBoneName[name]);
    if (!Part) {
        return;
    }
    dampener = 1;   // Arthur
    lerpAmount = 1; // Arthur
    let vector = new THREE.Vector3(position.x * dampener, position.y * dampener, position.z * dampener);
    Part.position.lerp(vector, lerpAmount); // interpolate
};

let oldLookTarget = new THREE.Euler();
export const rigFace = (_currentVrm, riggedFace) => {
    if (!_currentVrm) {
        return;
    }
    //arthur// 
    rigRotation(_currentVrm, "Neck", riggedFace.head, 0.7);
    //rigRotation("Neck", riggedFace.head);

    // Blendshapes and Preset Name Schema
    const Blendshape = _currentVrm.blendShapeProxy;
    const PresetName = THREE.VRMSchema.BlendShapePresetName;

    // Simple example without winking. Interpolate based on old blendshape, then stabilize blink with `Kalidokit` helper function.
    // for VRM, 1 is closed, 0 is open.
    riggedFace.eye.l = lerp(clamp(1 - riggedFace.eye.l, 0, 1), Blendshape.getValue(PresetName.Blink), 0.5);
    riggedFace.eye.r = lerp(clamp(1 - riggedFace.eye.r, 0, 1), Blendshape.getValue(PresetName.Blink), 0.5);
    riggedFace.eye = Kalidokit.Face.stabilizeBlink(riggedFace.eye, riggedFace.head.y);
    Blendshape.setValue(PresetName.Blink, riggedFace.eye.l);

    // Interpolate and set mouth blendshapes
    Blendshape.setValue(PresetName.I, lerp(riggedFace.mouth.shape.I, Blendshape.getValue(PresetName.I), 0.5));
    Blendshape.setValue(PresetName.A, lerp(riggedFace.mouth.shape.A, Blendshape.getValue(PresetName.A), 0.5));
    Blendshape.setValue(PresetName.E, lerp(riggedFace.mouth.shape.E, Blendshape.getValue(PresetName.E), 0.5));
    Blendshape.setValue(PresetName.O, lerp(riggedFace.mouth.shape.O, Blendshape.getValue(PresetName.O), 0.5));
    Blendshape.setValue(PresetName.U, lerp(riggedFace.mouth.shape.U, Blendshape.getValue(PresetName.U), 0.5));

    //PUPILS
    //interpolate pupil and keep a copy of the value
    let lookTarget = new THREE.Euler(
        lerp(oldLookTarget.x, riggedFace.pupil.y, 0.4),
        lerp(oldLookTarget.y, riggedFace.pupil.x, 0.4),
        0,
        "XYZ"
    );
    oldLookTarget.copy(lookTarget);
    _currentVrm.lookAt.applyer.lookAt(lookTarget);
};
///*
var old_faceLandmarks = null;
var old_pose3DLandmarks = null;
var old_pose2DLandmarks = null;
var old_leftHandLandmarks = null;
var old_rightHandLandmarks = null;
//*/

function cvAngle(props) {
    if (null == props) return props;

    var ret = {}
    Object.keys(props).forEach(key => {
        var obj = props[key];
        var newvalue = {};
        Object.keys(obj).forEach(objkey => {
            var objval = obj[objkey];
            newvalue[objkey] = objval * 180 / Math.PI;
        });
        ret[key] = newvalue
        //var check = props[key];
        //var value = parseFloat(check);
        //var convert = value * 180 / Math.PI
        //ret[key] =  convert;
        //console.log(key, obj[key]);
    }); 
    return ret;
}
export function updateVRM (_currentVrm,videoElement, results, dump = false) {
    // Take the results from `Holistic` and animate character based on its Face, Pose, and Hand Keypoints.
    let riggedPose, riggedLeftHand, riggedRightHand, riggedFace;

    const faceLandmarks      = results.faceLandmarks;
    // Pose 3D Landmarks are with respect to Hip distance in meters
    const pose3DLandmarks    = results.ea ? results.ea: results.poseWorldLandmarks;
    // Pose 2D landmarks are with respect to videoWidth and videoHeight
    const pose2DLandmarks    = results.poseLandmarks;
    // Be careful, hand landmarks may be reversed
    const leftHandLandmarks  = results.rightHandLandmarks;
    const rightHandLandmarks = results.leftHandLandmarks;

    // Animate Face
    if (faceLandmarks) {
        old_faceLandmarks = faceLandmarks;
    }
    if (old_faceLandmarks) {
        riggedFace = Kalidokit.Face.solve(old_faceLandmarks, {
            runtime: "mediapipe",
            video: videoElement,
        });
        rigFace(_currentVrm,riggedFace);
    }
    if (pose2DLandmarks) {
        old_pose2DLandmarks = pose2DLandmarks;
    }
    if (pose3DLandmarks) {
        old_pose3DLandmarks = pose3DLandmarks;
    }
    // Animate Pose
    //if (old_pose2DLandmarks && old_pose3DLandmarks) {
    if (pose2DLandmarks && pose3DLandmarks) {
        //riggedPose = Kalidokit.Pose.solve(old_pose3DLandmarks, old_pose2DLandmarks, {
        riggedPose = Kalidokit.Pose.solve(pose3DLandmarks, pose2DLandmarks, {
            runtime: "mediapipe",
            video: videoElement,
            debug: dump
        });
        if (dump) {
            riggedPose.Debug.leg_calc = cvAngle(riggedPose.Debug.leg_calc)
            console.log(riggedPose.Hips);
            console.log(riggedPose.Spine);
            console.log(riggedPose.Debug);
        }
        
        rigRotation(_currentVrm,"Hips", riggedPose.Hips.rotation, 0.7);
        ///*
        rigPosition(_currentVrm,"Hips",
            {
                x: riggedPose.Hips.position.x, // Reverse direction
                y: riggedPose.Hips.position.y + 1, // Add a bit of height
                z: -riggedPose.Hips.position.z, // Reverse direction
            },
            1,
            0.07
        );
        //*/
        rigRotation(_currentVrm,"Chest", riggedPose.Spine, 0.25, 0.3);
        rigRotation(_currentVrm,"Spine", riggedPose.Spine, 0.45, 0.3);

        rigRotation(_currentVrm,"RightUpperArm", riggedPose.RightUpperArm, 1, 0.3);
        rigRotation(_currentVrm,"RightLowerArm", riggedPose.RightLowerArm, 1, 0.3);
        rigRotation(_currentVrm,"LeftUpperArm",  riggedPose.LeftUpperArm,  1, 0.3);
        rigRotation(_currentVrm,"LeftLowerArm",  riggedPose.LeftLowerArm,  1, 0.3);

        rigRotation(_currentVrm,"LeftUpperLeg",  riggedPose.LeftUpperLeg,  1, 0.3);
        rigRotation(_currentVrm,"LeftLowerLeg",  riggedPose.LeftLowerLeg,  1, 0.3);
        rigRotation(_currentVrm,"RightUpperLeg", riggedPose.RightUpperLeg, 1, 0.3);
        rigRotation(_currentVrm,"RightLowerLeg", riggedPose.RightLowerLeg, 1, 0.3);
    }

    // Animate Hands
    if (leftHandLandmarks) {
        old_leftHandLandmarks = leftHandLandmarks;
    }
    if (old_leftHandLandmarks) {
        riggedLeftHand = Kalidokit.Hand.solve(old_leftHandLandmarks, "Left");
        rigRotation(_currentVrm,"LeftHand", {
            // Combine pose rotation Z and hand rotation X Y
            z: riggedPose.LeftHand.z,
            y: riggedLeftHand.LeftWrist.y,
            x: riggedLeftHand.LeftWrist.x,
        });
        rigRotation(_currentVrm,"LeftRingProximal", riggedLeftHand.LeftRingProximal);
        rigRotation(_currentVrm,"LeftRingIntermediate", riggedLeftHand.LeftRingIntermediate);
        rigRotation(_currentVrm,"LeftRingDistal", riggedLeftHand.LeftRingDistal);
        rigRotation(_currentVrm,"LeftIndexProximal", riggedLeftHand.LeftIndexProximal);
        rigRotation(_currentVrm,"LeftIndexIntermediate", riggedLeftHand.LeftIndexIntermediate);
        rigRotation(_currentVrm,"LeftIndexDistal", riggedLeftHand.LeftIndexDistal);
        rigRotation(_currentVrm,"LeftMiddleProximal", riggedLeftHand.LeftMiddleProximal);
        rigRotation(_currentVrm,"LeftMiddleIntermediate", riggedLeftHand.LeftMiddleIntermediate);
        rigRotation(_currentVrm,"LeftMiddleDistal", riggedLeftHand.LeftMiddleDistal);
        rigRotation(_currentVrm,"LeftThumbProximal", riggedLeftHand.LeftThumbProximal);
        rigRotation(_currentVrm,"LeftThumbIntermediate", riggedLeftHand.LeftThumbIntermediate);
        rigRotation(_currentVrm,"LeftThumbDistal", riggedLeftHand.LeftThumbDistal);
        rigRotation(_currentVrm,"LeftLittleProximal", riggedLeftHand.LeftLittleProximal);
        rigRotation(_currentVrm,"LeftLittleIntermediate", riggedLeftHand.LeftLittleIntermediate);
        rigRotation(_currentVrm,"LeftLittleDistal", riggedLeftHand.LeftLittleDistal);
    }
    if (rightHandLandmarks) {
        old_rightHandLandmarks = rightHandLandmarks;
    }
    if (old_rightHandLandmarks) {
        //console.log("pos right hannd")
        //console.log(rightHandLandmarks)
        riggedRightHand = Kalidokit.Hand.solve(old_rightHandLandmarks, "Right");
        rigRotation(_currentVrm,"RightHand", {
            // Combine Z axis from pose hand and X/Y axis from hand wrist rotation
            z: riggedPose.RightHand.z,
            y: riggedRightHand.RightWrist.y,
            x: riggedRightHand.RightWrist.x,
        });
        rigRotation(_currentVrm,"RightRingProximal", riggedRightHand.RightRingProximal);
        rigRotation(_currentVrm,"RightRingIntermediate", riggedRightHand.RightRingIntermediate);
        rigRotation(_currentVrm,"RightRingDistal", riggedRightHand.RightRingDistal);
        rigRotation(_currentVrm,"RightIndexProximal", riggedRightHand.RightIndexProximal);
        rigRotation(_currentVrm,"RightIndexIntermediate", riggedRightHand.RightIndexIntermediate);
        rigRotation(_currentVrm,"RightIndexDistal", riggedRightHand.RightIndexDistal);
        rigRotation(_currentVrm,"RightMiddleProximal", riggedRightHand.RightMiddleProximal);
        rigRotation(_currentVrm,"RightMiddleIntermediate", riggedRightHand.RightMiddleIntermediate);
        rigRotation(_currentVrm,"RightMiddleDistal", riggedRightHand.RightMiddleDistal);
        rigRotation(_currentVrm,"RightThumbProximal", riggedRightHand.RightThumbProximal);
        rigRotation(_currentVrm,"RightThumbIntermediate", riggedRightHand.RightThumbIntermediate);
        rigRotation(_currentVrm,"RightThumbDistal", riggedRightHand.RightThumbDistal);
        rigRotation(_currentVrm,"RightLittleProximal", riggedRightHand.RightLittleProximal);
        rigRotation(_currentVrm,"RightLittleIntermediate", riggedRightHand.RightLittleIntermediate);
        rigRotation(_currentVrm,"RightLittleDistal", riggedRightHand.RightLittleDistal);
    }

    return riggedPose;
}


