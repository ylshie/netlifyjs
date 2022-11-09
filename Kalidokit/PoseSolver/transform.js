import Vector from "../utils/vector";

//  https://zh.wikipedia.org/wiki/%E6%97%8B%E8%BD%AC%E7%9F%A9%E9%98%B5

function mulM(a,b) {
    var sum = 0;
    for (let i=0; i < a.length; i++) {
        sum += a[i] * b[i];
    }
    return sum;
}

export function dotM(a,b) {
    var r = new Array(3);
    const v = (b instanceof Vector) ? [b.x,b.y,b.z]: b;

    for (let i=0; i < 3; i++) {
        r[i] = mulM(a[i],v)
    }

    return new Vector(r[0],r[1],r[2]);
}

function M(a,axis) {
    const ang = a[axis];
    const s     = Math.sin(ang);
    const c     = Math.cos(ang);
    const mx    = [ [ 1, 0, 0],
                    [ 0, c,-s],
                    [ 0, s, c] ];
    const my    = [ [ c, 0, s],
                    [ 0, 1, 0],
                    [-s, 0, c] ];
    const mz    = [ [ c,-s, 0],
                    [ s, c, 0],
                    [ 0, 0, 1] ];
    
    const m = (axis=="x")?mx:(axis=="y")?my:mz;

    return m;
}
function dot(a,b) {
    var r = new Array(3);
    
    for (let i=0; i < 3; i++) {
        r[i] = a[i]*b[i]
    }

    return r;
}
function MM(ang,r=[1, 0, 0],order=["z","y","x"]) {
    var vct   = Object.assign({},r); 
    const mat = {x: M(ang,"x"),y:M(ang,"y"),z: M(ang,"z")}

    for (let i=0;i<3;i++) {
        vct = dotM(mat[order[i]],vct)
    }

    return (vct); 
}
const u = [1, 0, 0];

function crossM(aM,bM) {
    const res = [[1,0,0],[0,1,0],[0,0,1]]
    for (let i=0;i<3;i++) {
        for (let j=0;j<3;j++) {
            res[i][j]  = aM[i][0]*bM[0][j]
            res[i][j] += aM[i][1]*bM[1][j]
            res[i][j] += aM[i][2]*bM[2][j]
        }
    }
    return res;
}

export function RotateMatrix(ang,r,order=["z","y","x"]) {
    const debugme = true;
    function logRotateMatrix() {
        if (debugme) console.log("---------")
        if (debugme) console.log("angle",AA(ang));
        if (debugme) console.log("vector",r);
        if (debugme) console.log("order",order);
        if (debugme) console.log("matrix",mat);
        if (debugme) console.log("result",vct)
    }
    const mat = {x: M(ang,"x"),y:M(ang,"y"),z: M(ang,"z")}
    var res = [[1,0,0],[0,1,0],[0,0,1]]
    for (let i=0;i<3;i++) {
        res = crossM(mat[order[i]],res)
    }
    //logRotateMatrix();
    return (res); 
}
function get2DAngle(cx, cy, ex, ey) {
    const dy = ey - cy;
    const dx = ex - cx;
    const theta = Math.atan2(dy, dx);
    return theta;
}

export function qRotate(a, b, left=true)
{
    var s = (left)? 1: -1;
    var y = s * get2DAngle(s * a.x,a.z,s * b.x,b.z); 
    
    var dx= Math.abs(b.x-a.x);
    var dz= Math.abs(b.z-a.z);
    var r = Math.sqrt(dx*dx+dz*dz);
    var d = (b.x>a.x) ? r: -r 
    var z = s * get2DAngle(0,a.y,s * d,b.y) //var z = get2DAngle(a.x,a.y,b.x,b.y)
    var x = 0;
    
    if (a.x == b.x && a.y != b.y && a.z != b.z) {
        x = (b.z>a.z) ? get2DAngle(a.z,a.y,b.z,b.y): get2DAngle(b.z,b.y,a.z,a.y);
        y = (b.z>a.z) ? Math.abs(y): -Math.abs(y)
        z = 0;
    }
    
    if (z >  Math.PI/2) y = 0;
    if (z < -Math.PI/2) y = 0;

    if (left) {
        if (y < -Math.PI/2) z = 0;
    } else {     
        if (y >  Math.PI/2) z = 0;
    }

    return new Vector(x,y,z);
}
/*
export function LegRotate(a, b, left=true)
{
    var s = (left)? 1: -1;
    var x = get2DAngle(a.y,a.z,b.y,b.z); 
    
    var dx= Math.abs(b.x-a.x);
    var dz= Math.abs(b.z-a.z);
    var dy= Math.abs(b.y-a.y);
    var r = Math.sqrt(dx*dx+dy*dy);
    var d = (b.z>a.z) ? r: -r 
    var z = - s * get2DAngle(a.y,0,b.y,s * d) //var z = get2DAngle(a.x,a.y,b.x,b.y)
    var y = 0;
    
    if (a.y == b.y && a.x != b.x && a.z != b.z) {
        x = (b.y>a.y) ? get2DAngle(a.y,a.z,b.y,b.z): get2DAngle(b.z,b.y,a.z,a.y);
        z = (b.y>a.y) ? Math.abs(z): -Math.abs(z)
        y = 0;
    }
    

    if (x >  Math.PI/2) y = 0;
    if (x < -Math.PI/2) y = 0;

    if (left) {
        if (y < -Math.PI/2) z = 0;
    } else {     
        if (y >  Math.PI/2) z = 0;
    }

    return new Vector(x,y,z);
}
*/

function LegRotateC(a, b, logme=false)
{
    var dy= Math.abs(b.y-a.y);
    var dz= Math.abs(b.z-a.z);
    var r = Math.sqrt(dy*dy+dz*dz);
    var d = r; //(b.x>a.x) ? r: -r 

    var x =-get2DAngle(a.y,a.z,b.y,b.z);
    var z = get2DAngle(0, a.x, d, b.x)
    var y = 0;
    
    if (logme) console.log("angle=x",A(x),"y",A(y),"z",A(z));
    if (a.y == b.y && a.x != b.x && a.z != b.z) {
        console.log("####trap#####")
        y = (b.z>a.z) ? get2DAngle(a.z,a.x,b.z,b.x): get2DAngle(b.z,b.x,a.z,a.x);
        z = (b.z>a.z) ? Math.abs(z): -Math.abs(z)
        x = 0;
        if (logme) console.log("adjusted=x",x,"y",y,"z",z);
    }
    
    return {x:x, y:y, z:z};
}

export function LegRotate(a, b, logme=false)
{
    var dy= Math.abs(b.y-a.y);
    var dz= Math.abs(b.z-a.z);
    var r = Math.sqrt(dy*dy+dz*dz);
    var d = r; //(b.x>a.x) ? r: -r 
    var n = get2DAngle(0, a.x, d, b.x);

    var x =-get2DAngle(a.y,a.z,b.y,b.z);
    var z = (b.x>a.x) ? -Math.abs(n): Math.abs(n);
    var y = 0;
    
    if (logme) console.log("angle=x",A(x),"y",A(y),"z",A(z));
    if (a.y == b.y && a.x != b.x && a.z != b.z) {
        console.log("####trap#####")
        y = (b.z>a.z) ? get2DAngle(a.z,a.x,b.z,b.x): get2DAngle(b.z,b.x,a.z,a.x);
        z = (b.z>a.z) ? Math.abs(z): -Math.abs(z)
        x = 0;
        if (logme) console.log("adjusted=x",x,"y",y,"z",z);
    }
    
    return new Vector(x, y, z);
}

export function HipRotate(a, b, logme=false)
{
    var dx= Math.abs(b.x-a.x);
    var dz= Math.abs(b.z-a.z);
    var r = Math.sqrt(dx*dx+dz*dz);
    var d = (b.x>a.x) ? r: -r 

    var y = get2DAngle(a.x,a.z,b.x,b.z);  // OK
    var z = get2DAngle(  0,a.y, d,b.y) //var z = get2DAngle(a.x,a.y,b.x,b.y)
    var x = 0;
    
    if (a.x == b.x && a.y != b.y && a.z != b.z) {
        x = (b.z>a.z) ? get2DAngle(a.z,a.y,b.z,b.y): get2DAngle(b.z,b.y,a.z,a.y);
        y = (b.z>a.z) ? Math.abs(y): -Math.abs(y)
        z = 0;
    }

    return new Vector(x,y,z);
}

export function transformVector(angle,vector,order=["z","y","x"]) {
    const debugme = false;
    const list = {x: M(angle,"x"), y: M(angle,"y"), z: M(angle,"z")}
    var   r  = [vector.x, vector.y, vector.z];
    const delta = 0.0000000001;
    if (debugme) console.log("---------")
    if (debugme) console.log("angle",angle);
    if (debugme) console.log("vecotr",vector);
    if (debugme) console.log("order",order);
    if (debugme) console.log("matrix",list);
    for (let i=0;i<3;i++) {
        r = dotM(list[order[i]],r)
    }
    if (debugme) console.log("result",r)
    
    for (let i=0;i<3;i++) {
        if (Math.abs(r[i]) < delta) r[i] = 0;
    }

    return new Vector(r[0],r[1],r[2]); 
}
