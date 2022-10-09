import Vector from "../utils/vector";
import Euler from "../utils/euler";
import { clamp } from "../utils/helpers";
import { RIGHT, LEFT } from "./../constants";
import { PI } from "./../constants";
export const offsets = {
    upperLeg: {
        z: 0.1,
    },
};
/**
 * Calculates leg rotation angles
 * @param {Results} lm : array of 3D pose vectors from tfjs or mediapipe
 */
 // 11: Left Shoulder
 // 12: Right Shoulder
 // 23: Left  Hip
 // 24: Right Hip
 // 25: Left  Knee
 // 26: Right Knee
 // 27: Left  Ankle
 // 28: Right Ankle
 // 29: Left  Heel
 // 30: Right Heel
 // 31: Left  Foot Index
 // 32: Right Foot Index
export const calcLegs = (lm, debug) => {
    const mp = {
        lShould:lm[11],
        rShould:lm[12],
        lHip:   lm[23],
        rHip:   lm[24],
        lKnee:  lm[25],
        rKnee:  lm[26],
        lAnkle: lm[27],
        rAnkle: lm[28],
        lHeel:  lm[29],
        rHeel:  lm[30],
        lFoot:  lm[31],
        rFoot:  lm[32]
    }
    const rightUpperLegSphericalCoords  = Vector.getSphericalCoords(lm[23], lm[25], { x: "y", y: "z", z: "x" });
    const leftUpperLegSphericalCoords   = Vector.getSphericalCoords(lm[24], lm[26], { x: "y", y: "z", z: "x" });
    const rightLowerLegSphericalCoords  = Vector.getRelativeSphericalCoords(lm[23], lm[25], lm[27], {
        x: "y",
        y: "z",
        z: "x",
    });
    const leftLowerLegSphericalCoords   = Vector.getRelativeSphericalCoords(lm[24], lm[26], lm[28], {
        x: "y",
        y: "z",
        z: "x",
    });
    const hipRotation = Vector.findRotation(lm[23], lm[24]);

    //KILLME
    hipRotation.x = 0;
    hipRotation.y = 0;
    hipRotation.z = 0;
    //END
    
    const calc = {
        rU: rightUpperLegSphericalCoords,
        lU: leftUpperLegSphericalCoords,
        rL: rightLowerLegSphericalCoords,
        lL: leftLowerLegSphericalCoords,
        hip: hipRotation
    }
    const UpperLeg = {
        r: new Vector({
            x: rightUpperLegSphericalCoords.theta,
            y: rightLowerLegSphericalCoords.phi,
            z: rightUpperLegSphericalCoords.phi - hipRotation.z,
        }),
        l: new Vector({
            x: leftUpperLegSphericalCoords.theta,
            y: leftLowerLegSphericalCoords.phi,
            z: leftUpperLegSphericalCoords.phi - hipRotation.z,
        }),
    };
    const LowerLeg = {
        r: new Vector({
            x: -Math.abs(rightLowerLegSphericalCoords.theta),
            y: 0,
            z: 0, // not relevant
        }),
        l: new Vector({
            x: -Math.abs(leftLowerLegSphericalCoords.theta),
            y: 0,
            z: 0, // not relevant
        }),
    };
    //Modify Rotations slightly for more natural movement
    const rightLegRig   = rigLeg(UpperLeg.r, LowerLeg.r, RIGHT);
    const leftLegRig    = rigLeg(UpperLeg.l, LowerLeg.l, LEFT);
    return {
        //Scaled
        UpperLeg: {
            r: rightLegRig.UpperLeg,
            l: leftLegRig.UpperLeg,
        },
        LowerLeg: {
            r: rightLegRig.LowerLeg,
            l: leftLegRig.LowerLeg,
        },
        //Unscaled
        Unscaled: {
            UpperLeg,
            LowerLeg,
        },
        mp: mp,
        calc: calc
    };
};
/**
 * Converts normalized rotation values into radians clamped by human limits
 * @param {Object} UpperLeg : normalized rotation values
 * @param {Object} LowerLeg : normalized rotation values
 * @param {Side} side : left or right
 */
export const rigLeg = (UpperLeg, LowerLeg, side = RIGHT) => {
    const invert = side === RIGHT ? 1 : -1;
    const rigedUpperLeg = new Euler({
        x: clamp(UpperLeg.x, 0, 0.5) * PI,
        y: clamp(UpperLeg.y, -0.25, 0.25) * PI,
        z: clamp(UpperLeg.z, -0.5, 0.5) * PI + invert * offsets.upperLeg.z,
        rotationOrder: "XYZ",
    });
    const rigedLowerLeg = new Euler({
        x: LowerLeg.x * PI,
        y: LowerLeg.y * PI,
        z: LowerLeg.z * PI,
    });
    return {
        UpperLeg: rigedUpperLeg,
        LowerLeg: rigedLowerLeg,
    };
};
