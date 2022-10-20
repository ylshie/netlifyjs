import Vector from "../utils/vector";
import { clamp } from "../utils/helpers";
import { RIGHT, LEFT } from "./../constants";
import { PI } from "./../constants";
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
export const calcArms = (lm) => {
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
function calcArms_New (lm)  {
    //Pure Rotation Calculations
    const PC  = calcChest(lm)
    const lSS = new Vector(lm[11]).subtract(PC) // left S - right S
    //const lSS = new Vector(lm[11]).subtract(new Vector(lm[12])) // left S - right S
    const lES = new Vector(lm[13]).subtract(new Vector(lm[11])) // left E-S
    //-----------
    const rSS = new Vector(lm[12]).subtract(PC) // left S - right S
    //const rSS = new Vector(lm[12]).subtract(new Vector(lm[11])) // left S - right S
    const rES = new Vector(lm[14]).subtract(new Vector(lm[12])) // left E-S
    //-----------
    const aUL = Vector.angleBetween3DCoords(lm[13],lm[11],lm[12])
    const aUR = Vector.angleBetween3DCoords(lm[14],lm[12],lm[11])
    const UpperArm = {
        //r: Vector.rollPitchYaw(new Vector(PC), new Vector(lm[11]),new Vector(lm[13])), // Left Shoulder,  Left Elbow
        //l: Vector.rollPitchYaw(new Vector(PC), new Vector(lm[12]),new Vector(lm[14])), // Right Shoulder, Right Elbow
        r: Vector.findRotation(lES, lSS), // Left Shoulder,  Left Elbow
        l: Vector.findRotation(rES, rSS), // Right Shoulder, Right Elbow
        //r: Vector.findRotation(lm[11], lm[13]), // Left Shoulder,  Left Elbow
        //l: Vector.findRotation(lm[12], lm[14]), // Right Shoulder, Right Elbow
    };
    //UpperArm.l = swap(UpperArm.l, "x", "z")
    //UpperArm.r = swap(UpperArm.r, "x", "z")
    
    const lWS = new Vector(lm[15]).subtract(new Vector(lm[13])) // left E-S
    const rWS = new Vector(lm[16]).subtract(new Vector(lm[14])) // left E-S
    const aLL = Vector.angleBetween3DCoords(lm[15],lm[13],lm[11])
    const aLR = Vector.angleBetween3DCoords(lm[16],lm[14],lm[12])
    const LowerArm = {
        //r: Vector.rollPitchYaw(new Vector(lm[11]), new Vector(lm[13]),new Vector(lm[15])),
        //l: Vector.rollPitchYaw(new Vector(lm[12]), new Vector(lm[14]),new Vector(lm[16])),
        r: Vector.findRotation(lWS, lES),
        l: Vector.findRotation(rWS, rES),
        //r: Vector.findRotation(lm[13], lm[15]),
        //l: Vector.findRotation(lm[14], lm[16]),
    };
    const lPW = new Vector(lm[17]).subtract(new Vector(lm[15])) // left E-S
    const rPW = new Vector(lm[18]).subtract(new Vector(lm[16])) // left E-S
    const aHL = Vector.angleBetween3DCoords(lm[17],lm[15],lm[13])
    const aHR = Vector.angleBetween3DCoords(lm[18],lm[16],lm[14])
    const Hand = {
        //r: Vector.rollPitchYaw(new Vector(lm[17]),new Vector(lm[15]),new Vector(lm[13])),
        //l: Vector.rollPitchYaw(new Vector(lm[17]),new Vector(lm[15]),new Vector(lm[13])),
        r: Vector.findRotation(lPW, lWS),
        l: Vector.findRotation(rPW, rWS),
        //r: Vector.findRotation(Vector.fromArray(lm[15]), Vector.lerp(Vector.fromArray(lm[17]), Vector.fromArray(lm[19]), 0.5)),
        //l: Vector.findRotation(Vector.fromArray(lm[16]), Vector.lerp(Vector.fromArray(lm[18]), Vector.fromArray(lm[20]), 0.5)),
    };
    const QI = 180; // / Math.PI
    console.log("upper angle")
    console.log(aUL*QI);
    console.log(aUR*QI);
    console.log("lower angle")
    console.log(aLL*QI);
    console.log(aLR*QI);
    console.log("hand angle")
    console.log(aHL*QI);
    console.log(aHR*QI);
    console.log("upper rotation")
    console.log(UpperArm.l);
    console.log(UpperArm.r);
    console.log("upper rotation")
    console.log(LowerArm.l);
    console.log(LowerArm.r);
    console.log("upper rotation")
    console.log(Hand.l);
    console.log(Hand.r);
    //Hand.l.subtract(LowerArm.l);
    //Hand.r.subtract(LowerArm.r);
    //LowerArm.l.subtract(UpperArm.l);
    //LowerArm.r.subtract(UpperArm.r);
    //console.log("---TRANS-----")
    //console.log("upper rotation")
    //console.log(UpperArm.l);
    //console.log(UpperArm.r);
    //console.log("upper rotation")
    //console.log(LowerArm.l);
    //console.log(LowerArm.r);
    //console.log("upper rotation")
    //console.log(Hand.l);
    //console.log(Hand.r);

    //Modify Rotations slightly for more natural movement
    //const rightArmRig = {UpperArm: UpperArm.r, LowerArm: LowerArm.r, Hand: Hand.r};
    //const leftArmRig  = {UpperArm: UpperArm.l, LowerArm: LowerArm.l, Hand: Hand.l};
    const rightArmRig = rigArm(UpperArm.r, LowerArm.r, Hand.r, RIGHT);
    const leftArmRig  = rigArm(UpperArm.l, LowerArm.l, Hand.l, LEFT);
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

function find2DAngle(cx, cy, ex, ey) {
    const dy = ey - cy;
    const dx = ex - cx;
    const theta = Math.atan2(dy, dx);
    return theta;
}

function findRotationL(a, b) {
    var r= new Vector( Vector.find2DAngle(a.y, a.z, b.y, b.z), 
                       Vector.find2DAngle(a.z, a.x, b.z, b.x), 
                       Vector.find2DAngle(a.x, a.y, b.x, b.y))    
    return r;
}
function findRotationYZ_L(a, b) {
    var r= new Vector( 0, 
                       Vector.find2DAngle(a.z, a.x, b.z, b.x), 
                       Vector.find2DAngle(a.x, a.y, b.x, b.y))
    //r.y -= Math.PI;
    r.z -= Math.PI;
    return r;
}
function findRotationYZ_R(a, b) {
    var r= new Vector( 0, 
                       Vector.find2DAngle(a.x,-a.z, b.x,-b.z), 
                       Vector.find2DAngle(a.x, a.y, b.x, b.y))
    return r;
}
function findRotationR(a, b) {
    var r = new Vector(Vector.find2DAngle(a.y, a.z, b.y, b.z), 
                       Vector.find2DAngle(a.x, a.z, b.x, b.z), 
                       Vector.find2DAngle(a.x, a.y, b.x, b.y))
    //r.y -= Math.PI;
    return r;
}
function findRotationRR(a, b) {
    return new Vector( Vector.find2DAngle( a.y,-a.z, b.y,-b.z), 
                       Vector.find2DAngle(-a.z,-a.x,-b.z,-b.x), 
                       Vector.find2DAngle(-a.x, a.y,-b.x, b.y))
}
function findRotationZ(a, b) {
    return new Vector( Vector.find2DAngle( a.y,-a.z, b.y,-b.z), 
                       Vector.find2DAngle(-a.z, a.x,-b.z, b.x), 
                       Vector.find2DAngle( a.x, a.y, b.x, b.y))
}
function calcArms_New2 (lm)  {
    //Pure Rotation Calculations
    /*
    const fake = {  a11: {x:  0,y:  0, z: 0},
                    a13: {x:  1,y: -1, z: 0},
                    a12: {x:  0,y:  0, z: 0},
                    a14: {x: -1,y: -1, z: 0}}
    */
    ///*
    const fake = {  a11: {x:  0,y:  0, z: 0},
                    a13: {x:  1,y:  0, z:-1},
                    a12: {x:  0,y:  0, z: 0},
                    a14: {x: -1,y:  0, z:-1}}
    //*/
   const UpperArm = {
        r: findRotationYZ_L(fake.a13, fake.a11), // Left Shoulder,  Left Elbow
        l: findRotationYZ_R(fake.a14, fake.a12), // Right Shoulder, Right Elbow
        //r: findRotationL(lm[13], lm[11]), // Left Shoulder,  Left Elbow
        //l: findRotationR(lm[14], lm[12]), // Right Shoulder, Right Elbow
        //r: Vector.findRotation(lm[11], lm[13]), // Left Shoulder,  Left Elbow
        //l: Vector.findRotation(lm[12], lm[14]), // Right Shoulder, Right Elbow
    };
    //UpperArm.r.x -= Math.PI;
    //UpperArm.r.z -= Math.PI;
    function toAngle(rad) { return rad*180/Math.PI };
    //const pt= {lS: lm[11], lU: lm[13], rS: lm[12], rU: lm[14]};
    const pt= {lS: fake.a11, lU: fake.a13, rS: fake.a12, rU: fake.a14};
    console.log(" left: x:"+pt.lS.x+" y:"+pt.lS.y+" z:"+pt.lS.z+" to x:"+pt.lU.x+" y:"+pt.lU.y+" z:"+pt.lU.z)
    console.log(" left: x=" + toAngle(UpperArm.l.x)+ " y="+toAngle(UpperArm.l.y) + " z=" + toAngle(UpperArm.l.z))
    console.log("right: x:"+pt.rS.x+" y:"+pt.rS.y+" z:"+pt.rS.z+" to x:"+pt.rU.x+" y:"+pt.rU.y+" z:"+pt.rU.z)
    console.log("right: x=" + toAngle(UpperArm.r.x)+ " y="+toAngle(UpperArm.r.y) + " z=" + toAngle(UpperArm.r.z))

    //UpperArm.r.y = Vector.angleBetween3DCoords(lm[12], lm[11], lm[13]);
    //UpperArm.l.y = Vector.angleBetween3DCoords(lm[11], lm[12], lm[14]);
    //UpperArm.l = new Vector(Math.PI/2, -Math.PI/4, 0);
    //UpperArm.r = new Vector(Math.PI/2,  Math.PI/4, 0);
    /*
    UpperArm.l = new Vector(0, 0,  Math.PI/4);
    UpperArm.r = new Vector(0, 0, -Math.PI/4);          // 左右向下 45 度
    UpperArm.l = new Vector(0,-Math.PI/2,  Math.PI/4);
    UpperArm.r = new Vector(0, Math.PI/2, -Math.PI/4);  // 向前向下 45 度
    UpperArm.l = new Vector(0,-Math.PI/4, 0);
    UpperArm.r = new Vector(0, Math.PI/4, 0);  // 向前 45 度
    UpperArm.l = new Vector( Math.PI/4, 0, 0);
    UpperArm.r = new Vector( Math.PI/4, 0, 0); // hand 向前 45 度
    UpperArm.l = new Vector( 0,-Math.PI/2, Math.PI/4);
    UpperArm.r = new Vector( 0, Math.PI/2,-Math.PI/4);  // 向前 45 度
    //UpperArm.r = new Vector(0, 0, 0);
    //UpperArm.l = new Vector(0, 0, 0);
    */
    console.log("left")
    console.log(UpperArm.l);
    console.log("right")
    console.log(UpperArm.r);
    
    const lES = new Vector(lm[13]).subtract(new Vector(lm[11])) // left E-S
    const rES = new Vector(lm[14]).subtract(new Vector(lm[12])) // left E-S
    const lWE = new Vector(lm[15]).subtract(new Vector(lm[13])) // left E-S
    const rWE = new Vector(lm[16]).subtract(new Vector(lm[14])) // left E-S
    const LowerArm = {
        r: findRotationL(lWE, lES),
        l: findRotationZ(rWE, rES),
        //r: findRotationL(lm[13], lm[15]),
        //l: findRotationR(lm[16], lm[14]),
        //r: Vector.findRotation(lm[13], lm[15]),
        //l: Vector.findRotation(lm[14], lm[16]),
    };
    //LowerArm.r.y = Vector.angleBetween3DCoords(lm[11], lm[13], lm[15]);
    //LowerArm.l.y = Vector.angleBetween3DCoords(lm[12], lm[14], lm[16]);
    //LowerArm.r.z = clamp(LowerArm.r.z, -2.14, 0);
    //LowerArm.l.z = clamp(LowerArm.l.z, -2.14, 0);
    LowerArm.r = new Vector(0, 0, 0);
    LowerArm.l = new Vector(0, 0, 0);

    const Hand = {
        r: Vector.findRotation(Vector.fromArray(lm[15]), Vector.lerp(Vector.fromArray(lm[17]), Vector.fromArray(lm[19]), 0.5)),
        l: Vector.findRotation(Vector.fromArray(lm[16]), Vector.lerp(Vector.fromArray(lm[18]), Vector.fromArray(lm[20]), 0.5)),
    };
    //Modify Rotations slightly for more natural movement
    //const rightArmRig = rigArm(UpperArm.r, LowerArm.r, Hand.r, RIGHT);
    //const leftArmRig = rigArm(UpperArm.l, LowerArm.l, Hand.l, LEFT);
    const rightArmRig = {UpperArm: UpperArm.r, LowerArm: LowerArm.r, Hand: Hand.r};
    const leftArmRig  = {UpperArm: UpperArm.l, LowerArm: LowerArm.l, Hand: Hand.l};
    
    console.log("left rig")
    console.log(leftArmRig.UpperArm);
    console.log("right rig")
    console.log(rightArmRig.UpperArm);
    
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

