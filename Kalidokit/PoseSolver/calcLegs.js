import Vector from "../utils/vector";
import Euler from "../utils/euler";
import { clamp } from "../utils/helpers";
import { RIGHT, LEFT } from "./../constants";
import { PI } from "./../constants";
import {LegRotate, RotateMatrix, dotM} from "./transform"
import {inv} from './math.js'
import { fakeL, fakeU } from "./testdata";
export const offsets = {
    upperLeg: {
        z: 0.1,
    },
};
/**
 * Calculates leg rotation angles
 * @param {Results} lm : array of 3D pose vectors from tfjs or mediapipe
 */
function A2N(ang){ return ang / 180}
function A2R(ang){ return ang * Math.PI / 180}
function A(rad)  { return parseInt(rad*180/Math.PI) };
function N(norm) { return parseInt(norm*180) };
function AA(ang) { return {x:A(ang.x),y:A(ang.y),z:A(ang.z)}}
function NN(ang) { return {x:N(ang.x),y:N(ang.y),z:N(ang.z)}}
function P(pt)   { return parseInt(pt * 100) };
function PP(pt)  { return {x:P(pt.x),y:P(pt.y),z:P(pt.z)} };
function V(pt)   { return new Vector(pt.x, pt.y, pt.z) };

function logDistAngle(tag,dst, ang) {
    console.log(""+tag+": P (x:"+P(dst.x)+" y:"+P(dst.y)+" z:"+P(dst.z)
                      +") A (x:"+A(ang.x)+" y:"+A(ang.y)+" z:"+A(ang.z)+")");
}

export const calcLegs = calcLegs_New;

function calcLegs_Org(lm, ref, debug) {
    const mp = {
        lShould:lm[11], // 11: Left Shoulder
        rShould:lm[12], // 12: Right Shoulder
        lHip:   lm[23], // 23: Left  Hip
        rHip:   lm[24], // 24: Right Hip
        lKnee:  lm[25], // 25: Left  Knee
        rKnee:  lm[26], // 26: Right Knee
        lAnkle: lm[27], // 27: Left  Ankle
        rAnkle: lm[28], // 28: Right Ankle
        lHeel:  lm[29], // 29: Left  Heel
        rHeel:  lm[30], // 30: Right Heel
        lFoot:  lm[31], // 31: Left  Foot Index
        rFoot:  lm[32]  // 32: Right Foot Index
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
    //hipRotation.x = 0;
    //hipRotation.y = 0;
    //hipRotation.z = 0;
    //END
    
    const calc = {
        rU: rightUpperLegSphericalCoords,
        lU: leftUpperLegSphericalCoords,
        rL: rightLowerLegSphericalCoords,
        lL: leftLowerLegSphericalCoords,
        hip: hipRotation
    }
    var UpperLeg = {
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
    var LowerLeg = {
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
    //UpperLeg = { l:{x:0, y:0, z:0}, r:{x:0, y:0, z:0}};
    //LowerLeg = { l:{x:0, y:0, z:0}, r:{x:0, y:0, z:0}}
    //Modify Rotations slightly for more natural movement
    const rightLegRig   = rigLeg(UpperLeg.r, LowerLeg.r, RIGHT);
    const leftLegRig    = rigLeg(UpperLeg.l, LowerLeg.l, LEFT);
    console.log("lm11",PP(lm2d[11]),"lm12",PP(lm2d[12]),"lm23",PP(lm2d[23]),"lm24",PP(lm2d[24]))
    console.log("hip","position",PP(hips.position),"rotation",NN(hips.rotation))
    console.log("spine","rotation",NN(spine))
    
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

function qRotateL(a, b) { return LegRotate(a,b);}
function qRotateR(a, b) { return LegRotate(a,b,false);}

var counter = 0;
function calcLegs_New(lm, ref, debug) {
    const logme = false;
    const fixme = false;
    const mp = {
        lShould:lm[11], // 11: Left Shoulder
        rShould:lm[12], // 12: Right Shoulder
        lHip:   lm[23], // 23: Left  Hip
        rHip:   lm[24], // 24: Right Hip
        lKnee:  lm[25], // 25: Left  Knee
        rKnee:  lm[26], // 26: Right Knee
        lAnkle: lm[27], // 27: Left  Ankle
        rAnkle: lm[28], // 28: Right Ankle
        lHeel:  lm[29], // 29: Left  Heel
        rHeel:  lm[30], // 30: Right Heel
        lFoot:  lm[31], // 31: Left  Foot Index
        rFoot:  lm[32]  // 32: Right Foot Index
    }
    const real = {  a23: lm[23], a25: lm[25], a27: lm[27],
                    a24: lm[24], a26: lm[26], a28: lm[28]}
    const dataL = real;
    const dataU = real;
    const dst25 = V(dataU.a25).subtract(V(dataU.a23));
    const dst23 = V(dataU.a23).subtract(V(dataU.a24));
    const dst26 = V(dataU.a26).subtract(V(dataU.a24));
    const dst24 = V(dataU.a24).subtract(V(dataU.a23));
    var ang25 = qRotateL(dataU.a23, dataU.a25);
    var ang23 = qRotateL(dataU.a24, dataU.a23);
    var ang26 = qRotateR(dataU.a24, dataU.a26);
    var ang24 = qRotateR(dataU.a23, dataU.a24);
    if(logme) console.log("a24",PP(dataU.a24),"a23",PP(dataU.a23));
    if(logme) console.log("a26",PP(dataU.a26),"a25",PP(dataU.a25));
    if(logme) console.log("a28",PP(dataU.a28),"a15",PP(dataU.a27));
    if(logme) logDistAngle("a23",dst23, ang23);
    if(logme) logDistAngle("a25",dst25, ang25);
    if(logme) logDistAngle("a24",dst24, ang24);
    if(logme) logDistAngle("a26",dst26, ang26);

    const unit  = new Vector(0,0,0);
    const dst27 = V(dataL.a27).subtract(V(dataL.a25));
    const dst28 = V(dataL.a28).subtract(V(dataL.a26));
    // reverse to calculate matrix since VRM Y direction is different
    const rm25  = RotateMatrix(new Vector(ang25.x,ang25.y,-ang25.z)); 
    const rm26  = RotateMatrix(new Vector(ang26.x,ang26.y,-ang26.z));
    const im25  = inv(rm25);
    const im26  = inv(rm26);
    const tran25= dotM(im25,dst25); // for debug
    const tran26= dotM(im26,dst26); // for debug
    const tran27= dotM(im25,dst27);
    const tran28= dotM(im26,dst28);
    var ang255  = qRotateL(unit, tran25); // for debug
    var ang266  = qRotateL(unit, tran26); // for debug
    var ang277  = qRotateL(unit, tran27); //var ang15 = qRotateL(dataL.a13, dataL.a15);
    var ang288  = qRotateR(unit, tran28); //var ang16 = qRotateR(dataL.a14, dataL.a16);
    var ang27   = ang277.subtract(ang255);
    var ang28   = ang288.subtract(ang266);

    if(logme) console.log("a25",PP(dst25), "t", PP(tran25), "a", AA(ang255));
    if(logme) console.log("a25",PP(dst26), "t", PP(tran26), "a", AA(ang266));
    if(logme) console.log("a27",PP(dst27), "t", PP(tran27), "a", AA(ang27));
    if(logme) console.log("a28",PP(dst28), "t", PP(tran28), "a", AA(ang28));

    const rightUpperLegSphericalCoords  = Vector.getSphericalCoords(lm[23], lm[25], { x: "y", y: "z", z: "x" });
    const leftUpperLegSphericalCoords   = Vector.getSphericalCoords(lm[24], lm[26], { x: "y", y: "z", z: "x" });
    const rightLowerLegSphericalCoords  = Vector.getRelativeSphericalCoords(lm[23], lm[25], lm[27], {x: "y",y: "z",z: "x"});
    const leftLowerLegSphericalCoords   = Vector.getRelativeSphericalCoords(lm[24], lm[26], lm[28], {x: "y",y: "z",z: "x"});
    const hipRotation = Vector.findRotation(lm[23], lm[24]);
    
    const calc = {
        rU: rightUpperLegSphericalCoords,
        lU: leftUpperLegSphericalCoords,
        rL: rightLowerLegSphericalCoords,
        lL: leftLowerLegSphericalCoords,
        hip: hipRotation
    }
    var UpperLeg = {
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
    var LowerLeg = {
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
    // (0, 0, 90) l,r  right 90; <-  ( 1, 0, 0)
    // (0, 0, 45) l,r  right 45; <-  ( 1, 1, 0)
    // (0, 0,-90) l,r   left 90; ->  (-1, 0, 0)
    // (0, 0,-45) l,r   left 45; ->  (-1, 1, 0)
    // ( 90,0, 0) l,r  front 90: V   ( 0, 0,-1)
    // ( 45,0 ,0) l,r  front 45: V   ( 0, 1,-1)
    // (-45,0, 0) l,r   back-45: A  ( 0, 1, 1)
    // (-90,0, 0) l,r   back-90: A  ( 0, 0, 1)
    // (0, 90, 0) l,r f left 90; ->  ( 0, 0, 0)
    // (0, 45, 0) l,r f left 45; ->  ( 0, 0, 0)
    // (0,-90, 0) l,r fright-90; <-  ( 0, 0, 0)
    // (0,-45, 0) l,r fright-45; <-  ( 0, 0, 0)
    //UpperLeg = { l: new Vector(0, A2R(-90), 0), 
    //             r: new Vector(0, A2R(-90), 0) };
    //LowerLeg = { l: new Vector(0, 0, 0), 
    //             r: new Vector(0, 0, 0) };
    //Modify Rotations slightly for more natural movement
    //const rightLegRig   = rigLeg(UpperLeg.r, LowerLeg.r, RIGHT);
    //const leftLegRig    = rigLeg(UpperLeg.l, LowerLeg.l, LEFT);

    //const leftLegRig    = {UpperLeg: UpperLeg.l,LowerLeg: LowerLeg.l}
    //const rightLegRig   = {UpperLeg: UpperLeg.r,LowerLeg: LowerLeg.r}
    //const leftLegRig    = {UpperLeg: V(ang26),LowerLeg: V(ang28)}
    //const rightLegRig   = {UpperLeg: V(ang25),LowerLeg: V(ang27)}
    const leftLegRig    = {UpperLeg: V(ang25),LowerLeg: V(ang27)}
    const rightLegRig   = {UpperLeg: V(ang26),LowerLeg: V(ang28)}
    if (fixme) {
        const test = Math.floor(counter / 10);
        leftLegRig.UpperLeg     = new Vector(0,0,0);
        rightLegRig.UpperLeg    = new Vector(0,0,0);
        leftLegRig.LowerLeg     = new Vector(0,0,0);
        rightLegRig.LowerLeg    = new Vector(0,0,0);
        /*
        if (test % 3 == 1) {
            leftLegRig.UpperLeg     = new Vector(0,0,-Math.PI/4);
            rightLegRig.UpperLeg    = new Vector(0,0,-Math.PI/4);
            leftLegRig.LowerLeg     = new Vector(0,0,0);
            rightLegRig.LowerLeg    = new Vector(0,0,0);
        } else if (test % 3 == 2) {
            leftLegRig.UpperLeg     = new Vector(0,0,0);
            rightLegRig.UpperLeg    = new Vector(0,0,0);
            leftLegRig.LowerLeg     = new Vector(0,0,0);
            rightLegRig.LowerLeg    = new Vector(0,0,0);
        } else {
            leftLegRig.UpperLeg     = new Vector(0,0, Math.PI/4);
            rightLegRig.UpperLeg    = new Vector(0,0, Math.PI/4);
            leftLegRig.LowerLeg     = new Vector(0,0,0);
            rightLegRig.LowerLeg    = new Vector(0,0,0);
        }
        */
        counter++;
    }

    if(logme) console.log( "ULeg R", AA(UpperLeg.r),"L",AA(UpperLeg.l))
    if(logme) console.log( "LLeg R", AA(LowerLeg.r),"L",AA(LowerLeg.l))
    if(logme) console.log("realU R", AA(rightLegRig.UpperLeg),"L",AA(leftLegRig.UpperLeg))
    if(logme) console.log("realL R", AA(rightLegRig.LowerLeg),"L",AA(leftLegRig.LowerLeg))

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
