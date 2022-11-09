function find2DAngle_O(cx, cy, ex, ey) {
    const dy = ey - cy;
    const dx = ex - cx;
    const theta = Math.atan2(dy, dx);
    return parseInt(theta*180/Math.PI);
}
const debug=true;
function find2DAngle(cx, cy, ex, ey) {
    const dy = ey - cy; //-1
    const dx = ex - cx; //-1
    const _dx = (dx>0)?dx:-dx;
    const _dy = (dy>0)?dy:-dy;
    var theta = Math.atan2(_dy, _dx);
    theta = (theta>0)? theta: - theta;
    if (dx<0) theta= (theta)? Math.PI -theta: theta;
    if(theta >= Math.PI) theta = theta - Math.PI;
    if (dy<0) theta=-theta;
    if(debug) console.log("["+dx+","+dy+"]["+_dx+","+_dy+"]")
    return parseInt(theta*180/Math.PI);
}
function findRotation(a, b, S={p:1,q:1,w:1,x:1,y:1,z:1}) {
    const r= {
            x: 0, 
            y: S.p * find2DAngle_O( S.w*a.z,S.z*a.x, S.w*b.z,S.z*b.x),    
            z: S.q * find2DAngle_O( S.x*a.x,S.y*a.y, S.x*b.x,S.y*b.y)}
    return r;
}
function findRotationXYZ(a, b, S={p:1,q:1,w:1,x:1,y:1,z:1}) {
    const r= {x:0, 
            y: S.p * find2DAngle( S.w*a.x,S.z*a.z, S.w*b.x,S.z*b.z),    
            z: S.q * find2DAngle( S.x*a.x,S.y*a.y, S.x*b.x,S.y*b.y)}
    return r;
}
function findRotationYXZ(a, b, S={p:1,x:1,y:1,z:1}) {
    const r= {x:0, 
            y: S.p * find2DAngle( S.x*a.x,S.z*a.z, S.x*b.x,S.z*b.z),    
            z: S.p * find2DAngle( S.y*a.y,S.x*a.x, S.y*b.y,S.x*b.x)}
    return r;
}
function findRotationZXY(a, b, S={p:1,x:1,y:1,z:1}) {
    const r= {x:0, 
            y: S.p * find2DAngle( S.z*a.z,S.x*a.x, S.z*b.z,S.x*b.x),    
            z: S.p * find2DAngle( S.x*a.x,S.y*a.y, S.x*b.x,S.y*b.y)}
    return r;
}

function findRotationZYX(a, b, S={p:1,x:1,y:1,z:1}) {
    const r= {x:0, 
            y: S.p * find2DAngle( S.z*a.z,S.x*a.x, S.z*b.z,S.x*b.x),    
            z: S.p * find2DAngle( S.y*a.y,S.x*a.x, S.y*b.y,S.x*b.x)}
    return r;
}

function check(solve, ans) {
    for (let i=0; i<ans.length; i++) {
        if (solve.y == ans[i].y && solve.z == ans[i].z) return true;
    }
    return false;
}
function findMatch (a, b, name, func, ans) {
    let num = 0;
    var match = new Array(32);
    console.log("- " + name + " -----")
    for (let p=1; p>=-1; p-=2) {
        for (let q=1; q>=-1; q-=2) {
            for (let w=1; w>=-1; w-=2) {
                for (let x=1; x>=-1; x-=2) {
                    for (let y=1; y>=-1; y-=2) {
                        for (let z=1; z>=-1; z-=2) {
                            var solve = func(a, b,{p:p,q:q,w:w,x:x,y:y,z:z});
                            var matched = check(solve,ans);
                            if (matched) {
                                console.log("" + num +">> ("+p+")x="+x+"y="+y+"z="+z+"[y="+solve.y+" z="+solve.z+"] match")
                            } else {
                                console.log("" + num +">> ("+p+")x="+x+"y="+y+"z="+z+"[y="+solve.y+" z="+solve.z+"] xxx")
                            }
                            match[num] = (matched)? "V": "_";
                            num++;
                        }
                    }
                }
            }
        }
    }
    return match;
}
function findAllMatch (a, b, ans) {
    var r;
     
    r =  findMatch(a,b, "___", findRotation,    ans)
    //r= findMatch (a, b, "XYZ", findRotationXYZ, ans)
    //a= findMatch (a, b, "YXZ", findRotationYXZ, ans)
    //a= findMatch (a, b, "ZXY", findRotationZXY, ans)
    //a= findMatch (a, b, "ZYX", findRotationZYX, ans)

    return r;
}

function report(l) {
    var s = "";
    s += l[ 0]+" "+l[ 1]+" "+l[ 2]+" "+l[ 3]+" "+l[ 4]+" "+l[ 5]+" "+l[ 6]+" "+l[ 7]+" "
    s += l[ 8]+" "+l[ 9]+" "+l[10]+" "+l[11]+" "+l[12]+" "+l[13]+" "+l[14]+" "+l[15]+" "
    s += l[16]+" "+l[17]+" "+l[18]+" "+l[19]+" "+l[20]+" "+l[21]+" "+l[22]+" "+l[23]+" "
    s += l[24]+" "+l[25]+" "+l[26]+" "+l[27]+" "+l[28]+" "+l[29]+" "+l[30]+" "+l[31]+" "
    s += l[32]+" "+l[33]+" "+l[34]+" "+l[35]+" "+l[36]+" "+l[37]+" "+l[38]+" "+l[39]+" "
    s += l[40]+" "+l[41]+" "+l[42]+" "+l[43]+" "+l[44]+" "+l[45]+" "+l[46]+" "+l[47]+" "
    s += l[48]+" "+l[49]+" "+l[50]+" "+l[51]+" "+l[52]+" "+l[53]+" "+l[54]+" "+l[55]+" "
    s += l[56]+" "+l[57]+" "+l[58]+" "+l[59]+" "+l[60]+" "+l[61]+" "+l[62]+" "+l[63]+" "

    console.log(s)
}
/*
console.log("-------------")
//const q1=findAllMatch({x:0,y:0,z: 0},{x:1,y:0,z: 0},[{x:0,y:  0,z:0},{x:0,y:180,z:180},{x:0,y:180,z:-180},{x:0,y:-180,z:180},{x:0,y:-180,z:-180}])
const q1=findAllMatch({x:0,y:0,z: 0},{x:1,y:0,z: 0},[{x:0,y:  0,z:0}])
console.log("-------------")
//const q2=findAllMatch({x:0,y:0,z: 0},{x:1,y:0,z:-1},[{x:0,y: -45,z:0},{x:0,y:135,z:180},{x:0,y:135,z:-180}])
const q2=findAllMatch({x:0,y:0,z: 0},{x:1,y:0,z:-1},[{x:0,y: -45,z:0}])
console.log("-------------")
//const q3=findAllMatch({x:1,y:0,z:-1},{x:0,y:0,z:-2},[{x:0,y:-135,z:0},{x:0,y:45,z:180},{x:0,y:45,z:-180}])
const q3=findAllMatch({x:1,y:0,z:-1},{x:0,y:0,z:-2},[{x:0,y:-135,z:0}]) //-1, 0,-1
console.log("-------------")
const q4=findAllMatch({x:0,y:0,z: 0},{x:1,y:-1,z:0},[{x:0,y:0,z:-45}])
console.log("-------------")
const q5=findAllMatch({x:1,y:-1,z: 0},{x:0,y:-2,z:0},[{x:0,y:0,z:-135}])
console.log("-------------")
const q6=findAllMatch({x:1,y:0,z: 0},{x:1,y:0,z:-1},[{x:0,y:-90,z:0},{x:0,y:90,z:180},{x:0,y:90,z:-180}])
console.log("-------------")
//console.log(q1)
//console.log(q2)
//console.log(q3)
report(q1)
report(q2)
report(q3)
report(q4)
report(q5)
report(q6)
*/
const q1=findAllMatch({x: 0,y: 0,z: 0},{x: 1,y:0,z: 0},[{x: 0,y: 0,z: 0}])
console.log("-------------")
const q2=findAllMatch({x: 0,y: 0,z: 0},{x: 0,y:1,z: 0},[{x: 0,y: 0,z:90}])
console.log("-------------")
const q3=findAllMatch({x: 0,y: 0,z: 0},{x: 0,y:0,z: 1},[{x: 0,y:90,z: 0}]) //-1, 0,-1
console.log("-------------")
report(q1)
report(q2)
report(q3)

