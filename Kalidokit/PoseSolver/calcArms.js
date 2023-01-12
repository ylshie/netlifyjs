import Vector from "../utils/vector";
import { clamp } from "../utils/helpers";
import { RIGHT, LEFT } from "./../constants";
import { PI } from "./../constants";
import {qRotate, RotateMatrix, dotM} from "./transform"
import { fakeU, fakeL } from "./testdata";
import {inv} from './math.js'
/**
 * Calculates arm rotation as euler angles
 * @param {Array} lm : array of 3D pose vectors from tfjs or mediapipe
 */
/*
 // 11: Left Shoulder
 // 12: Right Shoulder
 // 13: Left Elbow
 // 14: Right Elbow
 // 15: Left Wrist
 // 16: Right Wrist
 // 17: Left Pinky
 // 18: Right Pinky
 // 19: Left Index
 // 20: Right Index
 // 23: Left Hip
 // 24: Right Hip
 */

function A(rad) { return ""+rad+"/"+parseInt(rad*180/Math.PI) };
function P(pt)  { return parseInt(pt * 100) };
function V(pt)  { return new Vector(pt.x, pt.y, pt.z) };
    
const calcArms_Orig =(lm) => {
    //Pure Rotation Calculations
   const UpperArm = {
        r: Vector.findRotation(lm[11], lm[13]), // Left Shoulder,  Left Elbow
        l: Vector.findRotation(lm[12], lm[14]), // Right Shoulder, Right Elbow
    };

    UpperArm.r.y = Vector.angleBetween3DCoords(lm[12], lm[11], lm[13]);
    UpperArm.l.y = Vector.angleBetween3DCoords(lm[11], lm[12], lm[14]);

    const LowerArm = {
        r: Vector.findRotation(lm[13], lm[15]),
        l: Vector.findRotation(lm[14], lm[16]),
    };
    LowerArm.r.y = Vector.angleBetween3DCoords(lm[11], lm[13], lm[15]);
    LowerArm.l.y = Vector.angleBetween3DCoords(lm[12], lm[14], lm[16]);
    LowerArm.r.z = clamp(LowerArm.r.z, -2.14, 0);
    LowerArm.l.z = clamp(LowerArm.l.z, -2.14, 0);

    const Hand = {
        r: Vector.findRotation(Vector.fromArray(lm[15]), Vector.lerp(Vector.fromArray(lm[17]), Vector.fromArray(lm[19]), 0.5)),
        l: Vector.findRotation(Vector.fromArray(lm[16]), Vector.lerp(Vector.fromArray(lm[18]), Vector.fromArray(lm[20]), 0.5)),
    };
    //Modify Rotations slightly for more natural movement
    const rightArmRig = rigArm(UpperArm.r, LowerArm.r, Hand.r, RIGHT);
    const leftArmRig = rigArm(UpperArm.l, LowerArm.l, Hand.l, LEFT);
    
    return {
        //Scaled
        UpperArm: {
            r: rightArmRig.UpperArm,
            l:  leftArmRig.UpperArm,
        },
        LowerArm: {
            r: rightArmRig.LowerArm,
            l:  leftArmRig.LowerArm,
        },
        Hand: {
            r: rightArmRig.Hand,
            l:  leftArmRig.Hand,
        },
        //Unscaled
        Unscaled: {
            UpperArm: UpperArm,
            LowerArm: LowerArm,
            Hand: Hand,
        },
    };
};
/**
 * Converts normalized rotation values into radians clamped by human limits
 * @param {Object} UpperArm : normalized rotation values
 * @param {Object} LowerArm : normalized rotation values
 * @param {Object} Hand : normalized rotation values
 * @param {Side} side : left or right
 */
export const rigArm = (UpperArm, LowerArm, Hand, side = RIGHT) => {
    // Invert modifier based on left vs right side
    const invert = side === RIGHT ? 1 : -1;
    UpperArm.z *= -2.3 * invert;
    //Modify UpperArm rotationY by LowerArm X and Z rotations
    UpperArm.y *= PI * invert;
    UpperArm.y -= Math.max(LowerArm.x);
    UpperArm.y -= -invert * Math.max(LowerArm.z, 0);
    UpperArm.x -= 0.3 * invert;
    LowerArm.z *= -2.14 * invert;
    LowerArm.y *= 2.14 * invert;
    LowerArm.x *= 2.14 * invert;
    //Clamp values to human limits
    UpperArm.x = clamp(UpperArm.x, -0.5, PI);
    LowerArm.x = clamp(LowerArm.x, -0.3, 0.3);
    Hand.y = clamp(Hand.z * 2, -0.6, 0.6); //side to side
    Hand.z = Hand.z * -2.3 * invert; //up down
    return {
        //Returns Values in Radians for direct 3D usage
        UpperArm: UpperArm,
        LowerArm: LowerArm,
        Hand: Hand,
    };
};

function calcCenter (a,b) {
    return new Vector( (a.x + b.x)/2, (a.y + b.y)/2, (a.z + b.z)/2);
}
function calcChest(lm) {
    const S = calcCenter(lm[11],lm[12]);
    const H = calcCenter(lm[23],lm[24]);
    const a = 1;
    const b = 1;
    const z = a+b;

    return new Vector( (a*S.x+b*H.x)/z, (a*S.y+b*H.y)/z, (a*S.z+b*H.z)/z);
}

function swap(V, a, b) {
    const t = V.x;
    V.x = V.z;
    V.z = t;
}
 
const debug=true;
function qRotateL(a, b) {return qRotate(a,b);}
function qRotateR(a, b) {return qRotate(a,b,false);}
function logDistAngle(tag,dst, ang) {
    console.log(""+tag+": P (x:"+P(dst.x)+" y:"+P(dst.y)+" z:"+P(dst.z)
                      +") A (x:"+A(ang.x)+" y:"+A(ang.y)+" z:"+A(ang.z)+")");
}
function PP(a) {
    const tf = (x)=>Math.floor(100 * x)
    return {x: tf(a.x),y: tf(a.y),z: tf(a.z)};
}
function AA(a) {
    const tf = (x)=> Math.floor(x * 180 / Math.PI);
    return {x: tf(a.x),y: tf(a.y),z: tf(a.z)}
}

// 13: Left Elbow
// 14: Right Elbow
// 15:  Left Wrist
// 16: Right Wrist
// 17:  Left Pinky
// 18: Right Pinky
// 19:  Left Index
// 20: Right Index
// 21:  Left Thumb
// 22: Right Thumb
function logHand(lm) {
    const unit  = new Vector(0,0,0);
    const dWirstL = V(lm[15]).subtract(V(lm[13]));
    const dPinkyL = V(lm[17]).subtract(V(lm[15]));
    const dIndexL = V(lm[19]).subtract(V(lm[15]));
    const dThumbL = V(lm[21]).subtract(V(lm[15]));
    const dWirstR = V(lm[16]).subtract(V(lm[14]));
    const dPinkyR = V(lm[17]).subtract(V(lm[16]));
    const dIndexR = V(lm[19]).subtract(V(lm[16]));
    const dThumbR = V(lm[21]).subtract(V(lm[16]));
    const ang15 = qRotateL(lm[13], lm[15]);
    const ang16 = qRotateR(lm[14], lm[16]);
    const rm15  = RotateMatrix(ang15);
    const rm16  = RotateMatrix(ang16);
    const im15  = inv(rm15);
    const im16  = inv(rm16);
    const tWristL = dotM(im15,dWirstL); // for debug
    const tPinkyL = dotM(im15,dPinkyL); 
    const tIndexL = dotM(im15,dIndexL);
    const tThumbL = dotM(im15,dThumbL);
    const tWristR = dotM(im16,dWirstR); // for debug
    const tPinkyR = dotM(im16,dPinkyR);
    const tIndexR = dotM(im16,dIndexR);
    const tThumbR = dotM(im16,dThumbR);
    const aWristL = qRotateL(unit, tWristL);
    const aPinkyL = qRotateL(unit, tPinkyL);
    const aIndexL = qRotateL(unit, tIndexL);
    const aThumbL = qRotateL(unit, tThumbL);
    const aWristR = qRotateR(unit, tWristR);
    const aPinkyR = qRotateR(unit, tPinkyR);
    const aIndexR = qRotateR(unit, tIndexR);
    const aThumbR = qRotateR(unit, tThumbR);

    //console.log("dThumbL",dThumbL,"dPinkyL",dPinkyL,"dIndexL",dIndexL)
    //console.log("dThumbR",dThumbR,"dPinkyR",dPinkyR,"dIndexR",dIndexR)
    //console.log("aWristL",AA(aWristL),"aThumbL",AA(aThumbL),"aPinkyL",AA(aPinkyL),"aIndexL",AA(aIndexL))
    //console.log("aWristR",AA(aWristR),"aThumbR",AA(aThumbR),"aPinkyR",AA(aPinkyR),"aIndexR",AA(aIndexR))
}
function calcArms_New2 (lm)  {
    const logme = false;
    const fixme = false;
    const real = {  a11: lm[11], a13: lm[13], a15: lm[15],
                    a12: lm[12], a14: lm[14], a16: lm[16]}
    const dataL = real;
    const dataU = real;
    const dst13 = V(dataU.a13).subtract(V(dataU.a11));
    const dst11 = V(dataU.a11).subtract(V(dataU.a12));
    const dst14 = V(dataU.a14).subtract(V(dataU.a12));
    const dst12 = V(dataU.a12).subtract(V(dataU.a11));
    var   ang13 = qRotateL(dataU.a11, dataU.a13);
    const ang11 = qRotateL(dataU.a12, dataU.a11);
    var   ang14 = qRotateR(dataU.a12, dataU.a14);
    const ang12 = qRotateR(dataU.a11, dataU.a12);
    if(logme) console.log("a12",PP(dataU.a12),"a11",PP(dataU.a11));
    if(logme) console.log("a14",PP(dataU.a14),"a13",PP(dataU.a13));
    if(logme) console.log("a16",PP(dataU.a16),"a15",PP(dataU.a15));
    if(logme) logDistAngle("a11",dst11, ang11);
    if(logme) logDistAngle("a13",dst13, ang13);
    if(logme) logDistAngle("a12",dst12, ang12);
    if(logme) logDistAngle("a14",dst14, ang14);
    var UpperArm = {
        l: ang13.clone(), //ang13.subtract(ang11), // Left Shoulder,  Left Elbow
        r: ang14.clone(), //ang14.subtract(ang12), // Right Shoulder, Right Elbow
        //l: V(dataU.ul),
        //r: V(dataL.ur),
    };
    if(logme) console.log("UL",AA(UpperArm.l))
    if(logme) console.log("UR",AA(UpperArm.r))

    logHand(lm);
//  Calculate Lower ARM
    ang13.y     = -ang13.y  // reverse for matrix since VRM Y direction is different
    ang14.y     = -ang14.y
    const unit  = new Vector(0,0,0);
    const dst15 = V(dataL.a15).subtract(V(dataL.a13));
    const dst16 = V(dataL.a16).subtract(V(dataL.a14));
    const rm13  = RotateMatrix(ang13);
    const rm14  = RotateMatrix(ang14);
    const im13  = inv(rm13);
    const im14  = inv(rm14);
    const tran13= dotM(im13,dst13); // for debug
    const tran15= dotM(im13,dst15);
    const tran16= dotM(im14,dst16);
    var ang133  = qRotateL(unit, tran13); // for debug
    var ang15   = qRotateL(unit, tran15); //var ang15 = qRotateL(dataL.a13, dataL.a15);
    var ang16   = qRotateR(unit, tran16); //var ang16 = qRotateR(dataL.a14, dataL.a16);
    
    if(logme) console.log("a13",PP(dst13), "t", PP(tran13), "a", AA(ang133));
    if(logme) console.log("a15",PP(dst15), "t", PP(tran15), "a", AA(ang15));
    if(logme) console.log("a16",PP(dst16), "t", PP(tran16), "a", AA(ang16));
    const LowerArm = {
        l: ang15,   // ang15.subtract(ang13), // Left Shoulder,  Left Elbow
        r: ang16,   // ang16.subtract(ang14), // Right Shoulder, Right Elbow
        //l: V(dataU.ll),
        //r: V(dataL.lr),
    };
    if(logme) console.log("LL A( x:"+A(LowerArm.l.x)+" y:"+A(LowerArm.l.y)+ " z:"+A(LowerArm.l.z)+")")
    if(logme) console.log("LR A( x:"+A(LowerArm.r.x)+" y:"+A(LowerArm.r.y)+ " z:"+A(LowerArm.r.z)+")")
    
    const Hand = {
        r: Vector.findRotation(Vector.fromArray(lm[15]), Vector.lerp(Vector.fromArray(lm[17]), Vector.fromArray(lm[19]), 0.5)),
        l: Vector.findRotation(Vector.fromArray(lm[16]), Vector.lerp(Vector.fromArray(lm[18]), Vector.fromArray(lm[20]), 0.5)),
    //    r: new Vector(0, Math.PI/2,0), l: new Vector(0,-Math.PI/2,0), // front
    //    r: new Vector(Math.PI/2, 0, 0), l: new Vector(Math.PI/2, 0, 0), // palm front
    //    r: new Vector( 0, 0, Math.PI/2), l: new Vector( 0, 0,-Math.PI/2), // palm left right out
    };

//  Should adjust by hand position to avoid hand is behind of head
    UpperArm.l.x =-20 * Math.PI / 180;
    UpperArm.r.x =-20 * Math.PI / 180;
//    LowerArm.l.x = 20 * Math.PI / 180;
//    LowerArm.r.x = 20 * Math.PI / 180;

    if (fixme) {
        UpperArm.r = new Vector(0, 0, 0);
        UpperArm.l = new Vector(0, 0, 0);
        LowerArm.r = new Vector(0, 0, 0);
        LowerArm.l = new Vector(0, 0, 0);
    }

    //Modify Rotations slightly for more natural movement
    //const rightArmRig = rigArm(UpperArm.r, LowerArm.r, Hand.r, RIGHT);
    //const leftArmRig = rigArm(UpperArm.l, LowerArm.l, Hand.l, LEFT);
    const leftArmRig  = {UpperArm: UpperArm.l, LowerArm: LowerArm.l, Hand: Hand.l};
    const rightArmRig = {UpperArm: UpperArm.r, LowerArm: LowerArm.r, Hand: Hand.r};
    
    return {
        //Scaled
        UpperArm: {
            r: rightArmRig.UpperArm,
            l:  leftArmRig.UpperArm,
        },
        LowerArm: {
            r: rightArmRig.LowerArm,
            l:  leftArmRig.LowerArm,
        },
        Hand: {
            r: rightArmRig.Hand,
            l:  leftArmRig.Hand,
        },
        //Unscaled
        Unscaled: {
            UpperArm: UpperArm,
            LowerArm: LowerArm,
            Hand: Hand,
        },
    };
};

export const calcArms = (lm,newver = true) => (newver) ? calcArms_New2(lm): calcArms_Orig(lm);
     