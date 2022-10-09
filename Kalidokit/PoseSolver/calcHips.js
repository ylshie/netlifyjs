import Vector from "../utils/vector";
import { clamp, remap } from "../utils/helpers";
import { PI } from "./../constants";
/**
 * Calculates Hip rotation and world position
 * @param {Array} lm3d : array of 3D pose vectors from tfjs or mediapipe
 * @param {Array} lm2d : array of 2D pose vectors from tfjs or mediapipe
 */
 // 11: Left Shoulder
 // 12: Right Shoulder
 // 23: Left Hip
 // 24: Right Hip
export const calcHips = (lm3d, lm2d, debug=false) => {
    //Find 2D normalized Hip and Shoulder Joint Positions/Distances
    const hipLeft2d         = Vector.fromArray(lm2d[23]);
    const hipRight2d        = Vector.fromArray(lm2d[24]);
    const shoulderLeft2d    = Vector.fromArray(lm2d[11]);
    const shoulderRight2d   = Vector.fromArray(lm2d[12]);
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

    const spine = Vector.rollPitchYaw(lm3d[11], lm3d[12]);
    const rawspine = Object.assign({}, spine)
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
    
    return rigHips(hips, spine, rawhip, rawspine);
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
    return {
        Hips: hips,
        Spine: spine,
        rawhip: rawhip,
        rawspine: rawspine,
    };
};
