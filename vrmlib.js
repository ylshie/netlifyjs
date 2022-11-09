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
function addQuat0(a, b) {
    return {x: a.x * b.x, y: a.y * b.y, z: a.z * b.z, w: a.w * b.w}
}
function addQuat(a, b) {
    const nw = a.w * b.w - a.x * b.x - a.y * b.y - a.z * b.z;  // 1
    const nx = a.w * b.x + a.x * b.w + a.y * b.z - a.z * b.y;  // i
    const ny = a.w * b.y - a.x * b.z + a.y * b.w + a.z * b.x;  // j
    const nz = a.w * b.z + a.x * b.y - a.y * b.x + a.z * b.w;   // k
    
    return {w:nw,x:nx,y:ny,z:nz}
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

export const checkNodes = (_currentVrm, dumpNode=false) => {
    if (! _currentVrm) return null;
    if (! _currentVrm.humanoid) return null;
    var namelist = THREE.VRMSchema.HumanoidBoneName;
    var ret      = {}

    Object.keys(namelist).forEach(key => {
        const name = namelist[key];
        const part = _currentVrm.humanoid.getBoneNode(name);
        if (part) {  
            if (dumpNode) {console.log(name); console.log(part)}
            ret[name] = {p: part.position, q: part.quaternion};
        }
    });

    return refineNodes(ret);
}

export function addChildItem (vrm, part_name,  object) {
    const part = (vrm) ? vrm.humanoid.getBoneNode(THREE.VRMSchema.HumanoidBoneName[part_name]): null;
    if (!part) return;

    part.children.push(object);
    console.log(part);
}

function A(rad)  { return parseInt(rad*180/Math.PI) };
function P(pt)   { return parseInt(pt * 100) };
function PP(pt)  { return {x:P(pt.x),y:P(pt.y),z:P(pt.z)} };
// Animate Rotation Helper function
export const rigRotation = (_currentVrm, name, rotation = { x: 0, y: 0, z: 0 }, dampener = 1, lerpAmount = 0.3) => {
    if (!_currentVrm) return;
    const Part = _currentVrm.humanoid.getBoneNode(THREE.VRMSchema.HumanoidBoneName[name]);
    if (!Part) return;
    
    //console.log(name, PP(Part.position),Part);

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

const copysign = (x, y) => Math.sign(x) === Math.sign(y) ? x : -x;
function Q2Euler(q) {
    var ang = {};

    // roll (x-axis rotation)
    var sinr_cosp = 2 * (q.w * q.x + q.y * q.z);
    var cosr_cosp = 1 - 2 * (q.x * q.x + q.y * q.y);
    ang.x = Math.atan2(sinr_cosp, cosr_cosp); // roll

    // pitch (y-axis rotation)
    var sinp = 2 * (q.w * q.y - q.z * q.x);
    if (Math.abs(sinp) >= 1) // pitch
        ang.y = copysign(M_PI / 2, sinp); // use 90 degrees if out of range
    else
        ang.y = Math.asin(sinp);

    // yaw (z-axis rotation)
    const siny_cosp = 2 * (q.w * q.z + q.x * q.y);
    const cosy_cosp = 1 - 2 * (q.y * q.y + q.z * q.z);
    ang.z = Math.atan2(siny_cosp, cosy_cosp);

    return ang;
}
const EU = Q2Euler;
function getPoisition(vrm,name) {
    const part = (vrm)? vrm.humanoid.getBoneNode(THREE.VRMSchema.HumanoidBoneName[name]): null;
    if (! part) return null;

    return part.position;
}
function getRotation(vrm,name) {
    const part = (vrm)? vrm.humanoid.getBoneNode(THREE.VRMSchema.HumanoidBoneName[name]): null;
    if (! part) return null;

    return part.rotation;
}
function getNode(vrm,name) {
    return (vrm)? vrm.humanoid.getBoneNode(THREE.VRMSchema.HumanoidBoneName[name]): null;
}
function centerPt(ptA,ptB) {
    const ptR = Object.assign({},ptA);
    ptR.x = (ptA.x+ptB.x) / 2;
    ptR.y = (ptA.y+ptB.y) / 2;
    ptR.z = (ptA.z+ptB.z) / 2;
    return ptR;
}
function calcNodePos(root,nodeseq) {
    var prePos = root.position;
    var preQua = root.quaternion;
    for(let i=0; i<nodeseq.length; i++) {
        var curNode= nodeseq[i];
        var curPos = applyQ(curNode.position,preQua);
        var curQua = addQuat(preQua,curNode.quaternion);
        prePos = addNodes(curPos,prePos);
        preQua = curQua;
    }
    return prePos;
}
function adjustHipPoisition(_currentVrm,data,time,lm2d,lm3d) {
    const fixme = false;
    var logme = false;
    if (! _currentVrm) return;
    if (! _currentVrm.humanoid) return;

    const P = (x) => (x.position);
    const R = (x) => (x.rotation);
    const N = (name) => getNode(_currentVrm,name);
    const Q = applyQ;

    const nodeHP = N("Hips");
    const nodeUL = N("LeftUpperLeg"); 
    const nodeUR = N("RightUpperLeg");
    const nodeLL = N("LeftLowerLeg");
    const nodeLR = N("RightLowerLeg");
    const nodeFL = N("LeftFoot");
    const nodeFR = N("RightFoot");

    if (logme) console.log("Hips",P(nodeHP),R(nodeHP));
    if (logme) console.log("UR",P(nodeUR),R(nodeUR),"UL",P(nodeUL),R(nodeUL));
    if (logme) console.log("LR",P(nodeLR),R(nodeLR),"UL",P(nodeLL),R(nodeLL));
    if (logme) console.log("FR",P(nodeFR),R(nodeFR),"FL",P(nodeFL),R(nodeFL));

    const posUL = applyQ(nodeUL.position,nodeHP.quaternion)
    const posUR = applyQ(nodeUR.position,nodeHP.quaternion)
    const quaUL = addQuat(nodeHP.quaternion,nodeUL.quaternion)
    const quaUR = addQuat(nodeHP.quaternion,nodeUR.quaternion)
    if (logme) console.log("posUR",posUR,"posUL",posUL)
    if (logme) console.log("quaUR",EU(quaUR),"posUL",EU(quaUL))
    const posLL = applyQ(nodeLL.position,nodeUL.quaternion) // nodeUL.quaternion
    const posLR = applyQ(nodeLR.position,nodeUR.quaternion) // nodeUR.quaternion
    const quaLL = addQuat(nodeLL.quaternion,nodeUL.quaternion)
    const quaLR = addQuat(nodeLR.quaternion,nodeUR.quaternion)
    const tmpFL = applyQ(nodeFL.position,quaLL) // LF position relative to LL
    const tmpFR = applyQ(nodeFR.position,quaLR) // LR position relative to LR
    //const posFL = addNodes(posLL,tmpFL)
    //const posFR = addNodes(posLR,tmpFR)
    const posFL = { x: posLL.x + tmpFL.x,
                    y: posLL.y + tmpFL.y,
                    z: posLL.z + tmpFL.z}
    const posFR = { x: posLR.x + tmpFL.x,
                    y: posLR.y + tmpFR.y,
                    z: posLR.z + tmpFR.z}
    const difYL = P(nodeLL).y + P(nodeFL).y - posFL.y;
    const difYR = P(nodeLR).y + P(nodeFR).y - posFR.y;
    const difXL = P(nodeLL).x + P(nodeFL).x - posFL.x;
    const difXR = P(nodeLR).x + P(nodeFR).x - posFR.x;
    const difZL = P(nodeLL).z + P(nodeFL).z - posFL.z;
    const difZR = P(nodeLR).z + P(nodeFR).z - posFR.z;
    const posFM = centerPt(posFL,posFR);
    // Hip + (XL,YL) => P of L
    // Hip + (XR,YR) => P of R
    const calFL = calcNodePos(nodeHP,[nodeUL,nodeLL,nodeFL]);
    const calFR = calcNodePos(nodeHP,[nodeUR,nodeLR,nodeFR]);
//    console.log("calFR",calFR,"calFL",calFL); 
    function decideRefPoint(data, lm2d) { // none, left, right, both
        if (!data || !data.lm29 || !data.lm30) return "none";

        const dta  = 0.01
        const dX29 = Math.abs(lm2d[29].x - data.lm29.x);
        const dY29 = Math.abs(lm2d[29].y - data.lm29.y);
        const dX30 = Math.abs(lm2d[30].x - data.lm30.x);
        const dY30 = Math.abs(lm2d[30].y - data.lm30.y);
        const fx29 = ((dX29 < dta) && (dY29 < dta)) ? "fixed" : "moved";
        const fx30 = ((dX30 < dta) && (dY30 < dta)) ? "fixed" : "moved";
        //console.log("29",fx29,dX29,dY29,"30",fx30,dX30,dY30)

        var res = "none";
        if (fx29 == "fixed") {
            res = (fx30 == "fixed")? "both": "left";
        } else {
            res = (fx30 == "fixed")? "right": "none";
        }
        return {r: res, 
                left: {m: fx29, dx: dX29, dy: dY29},  
                right:{m: fx30, dx: dX30, dy: dY30}};
    }
    //console.log(decideRefPoint(data,lm2d));
 
    //nodeHP.position.x =  difXL;
    //nodeHP.position.y =  difYL + 1; /// 2 + 1;
    //if (_currentVrm)
    // if (lm2d && lm3d) console.log("lm24",lm2d[24],"lm23",lm2d[23]);
    //console.log("difYR",difYR,"difYL",difYL)
    var useL = (Math.abs(difYL) > Math.abs(difYR)) ? false: true;
    var changed = true;
    var difX29L  = 0;
    var difX30R  = 0
    var difY29L  = 0;
    var difY30R  = 0
    if (data && data.lm29 && data.lm30 && lm2d) {
        difX29L = Math.abs(data.lm29.x - lm2d[29].x);
        difX30R = Math.abs(data.lm30.x - lm2d[30].x);
        difY29L = Math.abs(data.lm29.y - lm2d[29].y);
        difY30R = Math.abs(data.lm30.y - lm2d[30].y);
        changed = (data.logt != time);
        if (difX29L < 0.1 && difX30R < 0.1 && difY29L < 0.1 && difY30R < 0.1) {
            const XuseL = (difX29L < difX30R); // LR switch
            const YuseL = (difY29L < difY30R); // LR switch

            if (XuseL && YuseL) {
                useL = true;
            } else if ((! XuseL) && (! YuseL)) {
                useL = false;
            } else {
                useL = useL;
            }
        }
        if (data.time != time) {
            //data.time = time;
            //data.lm29 = Object.assign({},lm2d[29]);
            //data.lm30 = Object.assign({},lm2d[30]);
            //data.calFL= calFL;
            //data.calFR= calFR;
            //data.useL = useL;
        } else {
            useL = data.useL;
        }
        data.logt = time;
    } else {
        if (data && lm2d) { // First time
            data.time = time;
            data.logt = time;
            data.rateX= 1.0 * (posFL.x-posFR.x) / (lm2d[29].x-lm2d[30].x);
            data.rateY= 1.0 * (posFL.y-posFR.y) / (lm2d[29].y-lm2d[30].y);
            data.fstCT= Object.assign({},centerPt(lm2d[29],lm2d[30]));
            data.fstFM= posFM;
            data.calFL= calFL;
            data.calFR= calFR;
            data.lm29 = Object.assign({},lm2d[29]);
            data.lm30 = Object.assign({},lm2d[30]);
        }
    }
    function estimate(orgCT,curCT,orgFM,rateX,rateY) {
        const difSX = curCT.x - orgCT.x;
        const difSY = curCT.y - orgCT.y;
        const estFX = orgFM.x + difSX * rateX;
        const estFY = orgFM.y - difSY * rateY; // cordiaate difference
        return {x: estFX,y: estFY}
    }
    if (! fixme && data && lm2d) {
        const orgCT = data.fstCT;
        const orgFM = data.fstFM;
        const curCT = centerPt(lm2d[29],lm2d[30]);
        const estFM = estimate(orgCT,curCT,orgFM,data.rateX,data.rateY);
        var diffX = 0;
        var diffY = 0;
        var diffZ = 0;
        const updateZ = true;

        //console.log("calFR",calFR,"calFL",calFL);
        //console.log("difX",(calFL.x - calFR.x),"cenY",(calFL.y+calFR.y)/2);
        const ref = decideRefPoint(data,lm2d);
        //console.log(ref)

        if (ref.r == "both") {
            const ctNow = centerPt(calFL,calFR);
            const ctRef = centerPt(data.calFL,data.calFR);
            diffX = ctRef.x - ctNow.x;
            diffY = ctRef.y - ctNow.y;
            diffZ = ctRef.z - ctNow.z;
        } else if (ref.r == "left") {
            diffX = data.calFL.x - calFL.x;
            diffY = data.calFL.y - calFL.y;
            diffZ = data.calFL.z - calFL.z;
        } else if (ref.r == "right") {
            diffX = data.calFR.x - calFR.x;
            diffY = data.calFR.y - calFR.y;
            diffZ = data.calFR.z - calFR.z;
        } else {
            //  Do nothing
            //  TODO
        }

        nodeHP.position.x += diffX;
        nodeHP.position.y += diffY;
        calFL.x += diffX;
        calFL.y += diffY;
        calFR.x += diffX;
        calFR.y += diffY;

        if (updateZ) {
            nodeHP.position.z += diffZ;
            calFL.z += diffZ;
            calFR.z += diffZ;
        }
        
        if (data.time != time) {
            data.time   = time;
            data.lm29   = Object.assign({},lm2d[29]);
            data.lm30   = Object.assign({},lm2d[30]);
            data.calFL  = calFL;
            data.calFR  = calFR;
            data.ref    = ref;
            data.useL   = useL;
            changed     = true;
        } else {
            changed     = false;
        }
    //    if (changed) console.log(ref.r, " shift x",diffX," y ",diffY,"r",ref,
    //                             "r p",data.calFR,"n",calFR,
    //                             "l p",data.calFL,"n",calFL);
    //    nodeHP.position.x += estFM.x - posFM.x;
    //    nodeHP.position.y += estFM.y - posFM.y;
    //    nodeHP.position.x += useL ? difXL: difXR;
    //    nodeHP.position.y += useL ? difYL: difYR;
    //    nodeHP.position.z += useL ? difZL: difZR;
    }
    
    if (logme && changed) {
        if (useL) {
        //    console.log("L shift","t",time,"p",{x:difXL,y:difYL,z:difZL});
            logme = logme || difXL > 0.1 || difYL > 0.1 || difZL > 0.1;
        } else {
        //    console.log("R shift","t",time,"p",{x:difXR,y:difYR,z:difZR});
            logme = logme || difXR > 0.1 || difYR > 0.1 || difZR > 0.1;
        }
        logme = false;
        if (logme) console.log("Q orgLL",nodeLL.quaternion, "quaUL", nodeUL.quaternion, "quaLL", quaLL);
        if (logme) console.log("Q orgLR",nodeLR.quaternion, "quaUR", nodeUR.quaternion, "quaLR", quaLR);
        if (logme) console.log("E orgLL",EU(nodeLL.quaternion), "quaUL", EU(nodeUL.quaternion), "quaLL", EU(quaLL));
        if (logme) console.log("E orgLR",EU(nodeLR.quaternion), "quaUR", EU(nodeUR.quaternion), "quaLR", EU(quaLR));

        if (logme) console.log("rLR", posLR, "rLL", posLL);
        if (logme) console.log("rFR", tmpFR, posFR, "rFL", tmpFL, posFL);
        if (logme) console.log("difXR",difXR,"difXL",difXL);
        if (logme) console.log("difYR",difYR,"difYL",difYL);
    }
    
    //nodeHP.position.x =  (Math.abs(difXL) > Math.abs(difXR)) ? difXL: difXR;
    //nodeHP.position.y = ((Math.abs(difYL) > Math.abs(difYR)) ? difYL: difXR) + 1; /// 2 + 1;
    //nodeHP.position.x = (difXL+difXR) / 2;
    //nodeHP.position.y = (difYL+difYR) / 2 + 1;
}
export function updateVRM (_currentVrm,videoElement, results, data, dump = false) {
    // Take the results from `Holistic` and animate character based on its Face, Pose, and Hand Keypoints.
    let riggedPose, riggedLeftHand, riggedRightHand, riggedFace;

    const time = results.time;
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
        riggedFace = Kalidokit.Face.solve(faceLandmarks, {
            runtime: "mediapipe",
            video: videoElement,
        });
        rigFace(_currentVrm,riggedFace);
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

        //rigRotation(_currentVrm,"LeftHand",  riggedPose.LeftHand,  1, 0.3);
        //rigRotation(_currentVrm,"RightHand", riggedPose.RightHand, 1, 0.3);
        rigRotation(_currentVrm,"LeftHand",  {x:-Math.PI/4,y:0,z:0}, 1, 1);
        rigRotation(_currentVrm,"RightHand", {x:-Math.PI/4,y:0,z:0}, 1, 1);
    }

    // Animate Hands
    if (leftHandLandmarks) {
        riggedLeftHand = Kalidokit.Hand.solve(leftHandLandmarks, "Left");
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
        //console.log("pos right hannd")
        //console.log(rightHandLandmarks)
        riggedRightHand = Kalidokit.Hand.solve(rightHandLandmarks, "Right");
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

    adjustHipPoisition(_currentVrm, data, time, pose2DLandmarks,pose3DLandmarks);
    updateVRMPosPanel(riggedPose, pose2DLandmarks);

    return riggedPose;
}

// 23: Left Hip
// 24: Right Hip
// 25: Left Knee
// 26: Right Knee
// 27: Left Ankle
// 28: Right Ankle
// 29: Left Heel
// 30: Right Heel
const dataPos = [
    {id: "LH",    mp: 23, part: "Hips", index: "rotation"},
    {id: "RH",    mp: 24, part: "Spine"},
    {id: "LULeg", mp: 25, part: "LeftUpperLeg"},
    {id: "RULeg", mp: 26, part: "RightUpperLeg"},
    {id: "LLLeg", mp: 27, part: "LeftUpperLeg"},
    {id: "RLLeg", mp: 28, part: "RightUpperLeg"},
]; 

//const P = (x) => Math.floor(100 * x)
function updateVRMPosPanel(riggedPose,lm) {
    if (!lm) return;

    for (let i=0; i< dataPos.length;i++) {
        const elmX = document.getElementById(dataPos[i].id+"_x");
        const elmY = document.getElementById(dataPos[i].id+"_y");
        const elmZ = document.getElementById(dataPos[i].id+"_z");
        const elmV = document.getElementById(dataPos[i].id+"_v");
        const elmAX = document.getElementById(dataPos[i].id+"_ax");
        const elmAY = document.getElementById(dataPos[i].id+"_ay");
        const elmAZ = document.getElementById(dataPos[i].id+"_az");
        const elmAO = document.getElementById(dataPos[i].id+"_ao");
        //const part = _currentVrm.humanoid.getBoneNode(THREE.VRMSchema.HumanoidBoneName[name]);
        const part  = dataPos[i].part;
        const index = dataPos[i].index;
        const node  = (index)? riggedPose[part][index]: riggedPose[part];

        elmX.innerHTML = P(lm[dataPos[i].mp].x);
        elmY.innerHTML = P(lm[dataPos[i].mp].y);
        elmZ.innerHTML = P(lm[dataPos[i].mp].z);
        elmV.innerHTML = P(lm[dataPos[i].mp].visibility);
        elmAX.innerHTML= A(node.x);
        elmAY.innerHTML= A(node.y);
        elmAZ.innerHTML= A(node.z);
        elmAO.innerHTML= (node.o) ? "Off": "_";
    }
}




