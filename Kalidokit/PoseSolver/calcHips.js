import Vector from "../utils/vector";
import { clamp, remap } from "../utils/helpers";
import { PI } from "./../constants";
import {HipRotate, RotateMatrix, dotM} from "./transform"
import {inv} from './math.js'
/**
 * Calculates Hip rotation and world position
 * @param {Array} lm3d : array of 3D pose vectors from tfjs or mediapipe
 * @param {Array} lm2d : array of 2D pose vectors from tfjs or mediapipe
 */
 function A(rad)  { return parseInt(rad*180/Math.PI) };
 function N(norm) { return parseInt(norm*180) };
 function AA(ang) { return {x:A(ang.x),y:A(ang.y),z:A(ang.z)}}
 function NN(ang) { return {x:N(ang.x),y:N(ang.y),z:N(ang.z)}}
 function P(pt)   { return parseInt(pt * 100) };
 function PP(pt)  { return {x:P(pt.x),y:P(pt.y),z:P(pt.z)} };
 function V(pt)   { return new Vector(pt.x, pt.y, pt.z) };
 // 11: Left Shoulder
 // 12: Right Shoulder
 // 23: Left Hip
 // 24: Right Hip
export const calcHips = calcHips_New; //calcHips_New;

function calcHips_Orig(lm3d, lm2d, debug=false)  {
    //Find 2D normalized Hip and Shoulder Joint Positions/Distances
    const hipLeft2d         = Vector.fromArray(lm2d[23]); // 23: Left Hip
    const hipRight2d        = Vector.fromArray(lm2d[24]); // 24: Right Hip
    const shoulderLeft2d    = Vector.fromArray(lm2d[11]); // 11: Left Shoulder
    const shoulderRight2d   = Vector.fromArray(lm2d[12]); // 12: Right Shoulder
    const hipCenter2d       = hipLeft2d.lerp(hipRight2d, 1);
    const shoulderCenter2d  = shoulderLeft2d.lerp(shoulderRight2d, 1);
    const spineLength       = hipCenter2d.distance(shoulderCenter2d);
    const hips = {
        position: {
            x: clamp(hipCenter2d.x - 0.4, -1, 1),
            y: 0,
            z: clamp(spineLength - 1, -2, 0),
        },
    };
    hips.worldPosition = {
        x: hips.position.x,
        y: 0,
        z: hips.position.z * Math.pow(hips.position.z * -2, 2),
    };
    hips.worldPosition.x *= hips.worldPosition.z;
    hips.rotation = Vector.rollPitchYaw(lm3d[23], lm3d[24]);
    const rawhip = {
        position:       Object.assign({}, hips.position),
        rotation:       Object.assign({}, hips.rotation),
        worldPosition:  Object.assign({}, hips.worldPosition),
    }
    //fix -PI, PI jumping
    if (hips.rotation.y > 0.5) {
        hips.rotation.y -= 2;
        if (debug) console.log("hips.rotation.y -= 2")
    }
    hips.rotation.y += 0.5;
    //Stop jumping between left and right shoulder tilt
    if (hips.rotation.z > 0) {
        hips.rotation.z = 1 - hips.rotation.z;
        if (debug) console.log("hips.rotation.z = 1 - hips.rotation.z")
    }
    if (hips.rotation.z < 0) {
        hips.rotation.z = -1 - hips.rotation.z;
        if (debug) console.log("hips.rotation.z = -1 - hips.rotation.z")
    }
    const turnAroundAmountHips = remap(Math.abs(hips.rotation.y), 0.2, 0.4);
    hips.rotation.z *= 1 - turnAroundAmountHips;
    hips.rotation.x = 0; //temp fix for inaccurate X axis
    if (debug) console.log("hips.rotation.z *= 1 - turnAroundAmountHips and hips.rotation.x = 0 " + turnAroundAmountHips)

    var spine     = Vector.rollPitchYaw(lm3d[11], lm3d[12]); // 11: Left Shoulder, Right Shoulder
    //const spine     = {x:0, y: 0, z: 0};
    const rawspine  = Object.assign({}, spine)
    //fix -PI, PI jumping
    if (spine.y > 0.5) {
        spine.y -= 2;
        if (debug) console.log("spine.y -= 2")
    }
    spine.y += 0.5;
    
    //Stop jumping between left and right shoulder tilt
    
    if (spine.z > 0) {
        spine.z = 1 - spine.z;
        if (debug) console.log("spine.z = 1 - spine.z")
    }
    if (spine.z < 0) {
        spine.z = -1 - spine.z;
        if (debug) console.log("spine.z = -1 - spine.z")
    }
    
    //fix weird large numbers when 2 shoulder points get too close    
    const turnAroundAmount = remap(Math.abs(spine.y), 0.2, 0.4);
    spine.z *= 1 - turnAroundAmount;
    spine.x = 0; //temp fix for inaccurate X axis
    if (debug) console.log("spine.z *= 1 - turnAroundAmount and spine.x = 0 " + turnAroundAmountHips)

    //hips.rotation = {x: 0, y:0, z: 0};
    //spine   = {x: 0, y:0, z: 0};
    if (debug) console.log("lm11",PP(lm2d[11]),"lm12",PP(lm2d[12]),"lm23",PP(lm2d[23]),"lm24",PP(lm2d[24]))
    if (debug) console.log("hip","position",PP(hips.position),"rotation",NN(hips.rotation))
    if (debug) console.log("spine","rotation",NN(spine))

    return rigHips(hips, spine, rawhip, rawspine);
};

function center(a,b) {
    return Vector.fromArray({x: (a.x+b.x)/2, y: (a.y+b.y)/2, z: (a.z+b.z)/2,});
}

function calcHips_NewOld(lm3d, lm2d, debug=false)  {
    //Find 2D normalized Hip and Shoulder Joint Positions/Distances
    const hipLeft2d         = Vector.fromArray(lm2d[23]); // 23: Left Hip
    const hipRight2d        = Vector.fromArray(lm2d[24]); // 24: Right Hip
    const shoulderLeft2d    = Vector.fromArray(lm2d[11]); // 11: Left Shoulder
    const shoulderRight2d   = Vector.fromArray(lm2d[12]); // 12: Right Shoulder
    const hipCenter2d       = center(hipLeft2d,hipRight2d);
    const shoulderCenter2d  = center(shoulderLeft2d,shoulderRight2d);
    const spineLength       = hipCenter2d.distance(shoulderCenter2d);
    //const hips = { position: {x: hipCenter2d.x, y: hipCenter2d.y, z: hipCenter2d.z} };
    //hips.worldPosition = { x: hipCenter2d.x, y: hipCenter2d.y, z: hipCenter2d.z };
    const hips = {
        position: {
            x: clamp(hipCenter2d.x - 0.4, -1, 1),
            y: 0,
            z: clamp(spineLength - 1, -2, 0),
        }
    }
    hips.worldPosition = {
            x: hips.position.x,
            y: 0,
            z: hips.position.z * Math.pow(hips.position.z * -2, 2),
        }

    hips.worldPosition.x *= hips.worldPosition.z;
    //hips.worldPosition.x *= hips.worldPosition.z;
    //shoulderCenter2d.x = hipCenter2d.x;
    //shoulderCenter2d.z = hipCenter2d.z;
    var a = shoulderCenter2d;
    var b = hipCenter2d;
    var angYZ = Vector.normalizeAngle(Vector.find2DAngle(a.y, a.z, b.y, b.z));
    var angZX = Vector.normalizeAngle(Vector.find2DAngle(a.z, a.x, b.z, b.x));
    var angYX = Vector.normalizeAngle(Vector.find2DAngle(a.y, a.x, b.y, b.x));
    //hips.rotation = Vector.rollPitchYaw(shoulderCenter2d, hipCenter2d);
    //hips.rotation = Vector.rollPitchYaw(lm3d[23], lm3d[24]);
    hips.rotation   = qRotate(lm3d[23], lm3d[24], false);
    //const spine     = qRotate(lm3d[11], lm3d[12], false);
    const spine   = {x: 0, y:0, z: 0}; // 11: Left Shoulder, Right Shoulder
    //hips.rotation = new Vector(angYZ, angZX, angYX);
    if (debug) console.log("hip","position",PP(hips.position),"rotationn",AA(hips.rotation))
    if (debug) console.log("spine","rotation",AA(spine))

    //hips.rotation = {x: 0, y:0, z: 0.3};
    //const spine   = {x: 0, y:0, z: 0}; // 11: Left Shoulder, Right Shoulder
    //return rigHips(hips, spine);
    return {
        Hips: hips,
        Spine: spine
    }
};

// 23: Left  Hip
// 24: Right Hip
// 25: Left  Knee
// 26: Right Knee
// 27: Left  Ankle
// 28: Right Ankle
// 29: Left  Heel
// 30: Right Heel
function calcHips_New(lm3d, lm2d, debug=false)  {
    const logme = false;
    const fixme = false;
    //Find 2D normalized Hip and Shoulder Joint Positions/Distances
    const hipLeft2d         = Vector.fromArray(lm2d[23]); // 23: Left Hip
    const hipRight2d        = Vector.fromArray(lm2d[24]); // 24: Right Hip
    const kneeLeft2d        = Vector.fromArray(lm2d[25]); // 23: Left Hip
    const kneeRight2d       = Vector.fromArray(lm2d[26]); // 24: Right Hip
    const ankleLeft2d       = Vector.fromArray(lm2d[27]); // 23: Left Hip
    const ankleRight2d      = Vector.fromArray(lm2d[28]); // 24: Right Hip
    const heelLeft2d        = Vector.fromArray(lm2d[29]); // 23: Left Hip
    const heelRight2d       = Vector.fromArray(lm2d[30]); // 24: Right Hip
    const shoulderLeft2d    = Vector.fromArray(lm2d[11]); // 11: Left Shoulder
    const shoulderRight2d   = Vector.fromArray(lm2d[12]); // 12: Right Shoulder
    const hipCenter2d       = hipLeft2d.lerp(hipRight2d, 0.5); //hipLeft2d.lerp(hipRight2d, 1);
    const heelCenter2d      = heelLeft2d.lerp(heelRight2d, 0.5);
    const shoulderCenter2d  = shoulderLeft2d.lerp(shoulderRight2d, 1);
    const spineLength       = hipCenter2d.distance(shoulderCenter2d);
    const hipkneeLeft       = hipLeft2d.distance(kneeLeft2d);
    const hipkneeRight      = hipRight2d.distance(kneeRight2d);
    const kneeakleLeft      = kneeLeft2d.distance(ankleLeft2d);
    const kneeankleRight    = kneeRight2d.distance(ankleRight2d);
    const hipLeftY          = ankleLeft2d.y  - hipLeft2d.y;
    const hipRightY         = ankleRight2d.y - hipRight2d.y;
    const lenLeft           = hipkneeLeft + kneeakleLeft;
    const lenRight          = hipkneeRight + kneeankleRight;
    const hipLeft           = hipLeftY  - lenLeft;
    const hipRight          = hipRightY - lenRight;
    const hips = {
        /* KILLME
        position: {
            x: 3 * (hipCenter2d.x - heelCenter2d.x),  //clamp(hipCenter2d.x - 0.4, -1, 1),
            y: 0, //(hipLeft + hipRight) / 2, //0,   
            z: clamp(spineLength - 1, -2, 0),
        },
        */
       position: {x:0, y:0, z:0}
    };
    //if (logme) console.log("hipCenter2d",PP(hipCenter2d),"heelCenter2d",PP(heelCenter2d));
    //if (logme) console.log("Y dist l",P(hipLeftY),"Y dist r", P(hipRightY),
    //                        "Full l", P(lenLeft),  "Full r",  P(lenRight));
    hips.worldPosition = {
        x: hips.position.x,
        y: 0,
        z: hips.position.z * Math.pow(hips.position.z * -2, 2),
    };
    hips.worldPosition.x *= hips.worldPosition.z;
    //hips.rotation = Vector.rollPitchYaw(lm3d[23], lm3d[24]);
    const ang23 = HipRotate(lm2d[24], lm2d[23]);
    hips.rotation = ang23;
    //hips.rotation = qRotate(lm2d[23],lm2d[24]); // change right 90%
    //hips.rotation = Vector.rollPitchYaw(lm3d[24], lm3d[23]); // 280 change
 
    /*
    //fix -PI, PI jumping
    if (hips.rotation.y > 0.5) {
        hips.rotation.y -= 2;
        if (debug) console.log("hips.rotation.y -= 2")
    }
    hips.rotation.y += 0.5;
    //Stop jumping between left and right shoulder tilt
    if (hips.rotation.z > 0) {
        hips.rotation.z = 1 - hips.rotation.z;
        if (debug) console.log("hips.rotation.z = 1 - hips.rotation.z")
    }
    if (hips.rotation.z < 0) {
        hips.rotation.z = -1 - hips.rotation.z;
        if (debug) console.log("hips.rotation.z = -1 - hips.rotation.z")
    }
    const turnAroundAmountHips = remap(Math.abs(hips.rotation.y), 0.2, 0.4);
    hips.rotation.z *= 1 - turnAroundAmountHips;
    hips.rotation.x = 0; //temp fix for inaccurate X axis
    if (debug) console.log("hips.rotation.z *= 1 - turnAroundAmountHips and hips.rotation.x = 0 " + turnAroundAmountHips)
    */
    //var spine     = Vector.rollPitchYaw(lm3d[11], lm3d[12]); // 11: Left Shoulder, Right Shoulder
    const unit  = new Vector(0,0,0);
    const dst11 = V(lm2d[11]).subtract(V(lm2d[12]));
    const dst23 = V(lm2d[23]).subtract(V(lm2d[24]));
    const rm23  = RotateMatrix(ang23); 
    const im23  = inv(rm23);
    const tran23= dotM(im23,dst23); // for debug
    const tran11= dotM(im23,dst11); // for debug
   //const ang11 = HipRotate(unit, tran11);
    
    //const spine = ang11;
    var ang11     = HipRotate(lm2d[12], lm2d[11])
    var spine = ang11.subtract(hips.rotation);
    /*
    //fix -PI, PI jumping
    if (spine.y > 0.5) {
        spine.y -= 2;
        if (debug) console.log("spine.y -= 2")
    }
    spine.y += 0.5;
    
    //Stop jumping between left and right shoulder tilt
    
    if (spine.z > 0) {
        spine.z = 1 - spine.z;
        if (debug) console.log("spine.z = 1 - spine.z")
    }
    if (spine.z < 0) {
        spine.z = -1 - spine.z;
        if (debug) console.log("spine.z = -1 - spine.z")
    }
    
    //fix weird large numbers when 2 shoulder points get too close    
    const turnAroundAmount = remap(Math.abs(spine.y), 0.2, 0.4);
    spine.z *= 1 - turnAroundAmount;
    spine.x = 0; //temp fix for inaccurate X axis
    if (debug) console.log("spine.z *= 1 - turnAroundAmount and spine.x = 0 " + turnAroundAmountHips)
    */
    //spine     = {x:0, y: 0, z: 0};
    //hips.rotation = {x: 0, y:0, z: 0};
    if (fixme) {
        hips.position   = {x: 0, y: 0, z: 0};
        hips.rotation   = {x: 0, y: 0, z: 0};
        spine           = {x: 0, y: 0, z: 0};
    }
    //console.log("hips",AA(hips.rotation),"spine",AA(spine));
    //if (logme) console.log("lm11",PP(lm2d[11]),"lm12",PP(lm2d[12]),"lm23",PP(lm2d[23]),"lm24",PP(lm2d[24]))
    //if (logme) console.log("hip","position",PP(hips.position),"rotation",NN(hips.rotation))
    //if (logme) console.log("spine","rotation",NN(spine))

    //return rigHips(hips, spine);
    return {Hips:hips, Spine: spine};
};

/**
 * Converts normalized rotations to radians and estimates world position of hips
 * @param {Object} hips : hip position and rotation values
 * @param {Object} spine : spine position and rotation values
 */
export const rigHips = (hips, spine, rawhip, rawspine) => {
    //convert normalized values to radians
    if (hips.rotation) {
        hips.rotation.x *= Math.PI;
        hips.rotation.y *= Math.PI;
        hips.rotation.z *= Math.PI;
    }
    spine.x *= PI;
    spine.y *= PI;
    spine.z *= PI;
    // debug
    if (rawhip && rawspine) {
        rawhip.rotationAngle = {
            x: rawhip.rotation.x * 180,
            y: rawhip.rotation.y * 180,
            z: rawhip.rotation.z * 180,
        }
        rawspine.Angle = {
            x: rawspine.x * 180,
            y: rawspine.y * 180,
            z: rawspine.z * 180,
        }
    }

    return {
        Hips: hips,
        Spine: spine,
        rawhip: rawhip,
        rawspine: rawspine,
    };
};
