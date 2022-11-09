import * as Kalidokit from "./Kalidokit"

const q=Kalidokit.Pose.currentFake();
console.log("fakeU",q.u);
console.log("fakeL",q.l);

//window.fuck = () => Kalidokit.Pose.updateFake(Qy2);

const dummy = {
    a11: {x: 1, y: 0, z: 0},
    a13: {x: 1, y: 1, z: 1}, 
    a15: {x: 2, y: 2, z: 0},
    a12: {x:-1, y: 0, z: 0}, 
    a14: {x:-1, y: 1, z: 1},
    a16: {x:-2, y: 2, z: 0},
    ll: {x:0, y:0, z:  0},
    lr: {x:0, y:0, z:  0}
}
var data = {};
const P = Math.PI
const P2 = Math.PI/2
const P4 = Math.PI/4

data = Object.assign(data, dummy)

const Q0    = { ul: {x:  0, y:  0, z:  0},         // [ 1, 0, 0]
                rl: {x:  0, y:  0, z:  0}}
const Qx2   = { ul: {x: P2, y:  0, z:  0}, // [ 1, 0, 0] arm still hand front
                ur: {x: P2, y:  0, z:  0}}
const Q_x2 =  { ul: {x:-P2, y:  0, z:  0}, // [ 1, 0, 0] arm still hand back
                ur: {x:-P2, y:  0, z:  0}} 
const Qy2 =  {  ul: {x:  0, y: P2, z:  0},  // [ 0, 0, 1] arm back ? back
                ur: {x:  0, y:-P2, z:  0}}
const Q_y2 =  { ul: {x:  0, y:-P2, z:  0},  // [ 0, 0,-1] arm front
                ur: {x:  0, y: P2, z:  0}}
const Qz2 =  {  ul: {x:  0, y:  0, z: P2},  // [ 0, 1, 0] arm down hand ?
                ur: {x:  0, y:  0, z:-P2}}
const Q_z2 =  { ul: {x:  0, y:  0, z:-P2},  // [ 0,-1, 0] arm up hand out
                ur: {x:  0, y:  0, z: P2}}
// YZ * 4
const Qy2z2 = { ul: {x:  0, y: P2, z: P2}, // [ 0, 1, 0] arm down hand front
                ur: {x:  0, y:-P2, z:-P2}}
const Qy2_z2= { ul: {x:  0, y: P2, z:-P2}, // [ 0,-1,0] arm up hand back
                ur: {x:  0, y:-P2, z: P2}}
const Q_y2z2= { ul: {x:  0, y:-P2, z: P2}, // [0,1,0] arm down hand back
                ur: {x:  0, y: P2, z:-P2}} 
const Q_y2z_2={ ul: {x:  0, y:-P2, z:-P2}, // ?[0,1,0] arm up hand front
                ur: {x:  0, y: P2, z: P2}}
// XY * 4
const Qx2y2 = { ul: {x: P2, y: P2, z: 0}, // [ 0, 1, 0] arm down hand front
                ur: {x: P2, y:-P2, z:-0}}
const Qx2_y2= { ul: {x: P2, y:-P2, z: 0}, // [ 0,-1, 0] arm up hand front
                ur: {x: P2, y: P2, z: 0},}
const Q_x2y2= { ul: {x:-P2, y: P2, z: 0}, // [ 0,-1, 0] arm up hand back
                ur: {x:-P2, y:-P2, z:-0}}
const Q_x2_y2={ ul: {x:-P2, y:-P2, z: 0}, // [ 0, 1, 0] arm down hand ?
                ur: {x:-P2, y: P2, z: 0}}
// XZ * 4
const Qx2z2 = { ul: {x: P2, y: 0, z: P2}, // [ 0, 0,-1] arm front hand inner
                ur: {x: P2, y: 0, z:-P2}} 
const Qx2_z2= { ul: {x: P2, y: 0, z:-P2}, // [ 0, 0, 1] arm back hand ? // x down => front * z: up => back
                ur: {x: P2, y: 0, z: P2}}
const Q_x2z2= { ul: {x:-P2, y: 0, z: P2}, // [ 0, 0, 1] arm back hand ?
                ur: {x:-P2, y: 0, z:-P2}} 
const Q_x2_z2={ ul: {x:-P2, y: 0, z:-P2}, // [ 0, 0,-1] arm front hand outer
                ur: {x:-P2, y: 0, z: P2}} // [0,0,1] y: left to front then z: left to up
// XYZ * 8
const Qx2y2z2= {    ul: {x: P2, y: P2, z: P2}, // [0, 0,-1] arm front hand up
                    ur: {x: P2, y:-P2, z:-P2}} 
const Qx2y2_z2= {   ul: {x: P2, y: P2, z:-P2}, // [0, 0, 1] arm back hand ??
                    ur: {x: P2, y:-P2, z: P2}} 
const Qx2_y2z2= {   ul: {x: P2, y:-P2, z: P2}, // [0, 0,-1] arm front hand down
                    ur: {x: P2, y: P2, z:-P2}} 
const Qx2_y2_z2= {  ul: {x: P2, y:-P2, z:-P2}, // [0, 0, 1] arm back hand ??
                    ur: {x: P2, y: P2, z: P2}} 
const Q_x2y2z2= {   ul: {x:-P2, y: P2, z: P2}, // [0, 0, 1] arm back hand ??
                    ur: {x:-P2, y:-P2, z:-P2}} 
const Q_x2y2_z2= {  ul: {x:-P2, y: P2, z:-P2}, // [0, 0,-1] arm front hand up
                    ur: {x:-P2, y:-P2, z: P2}} 
const Q_x2_y2z2= {  ul: {x:-P2, y:-P2, z: P2}, // [0, 0, 1] arm back hand ??
                    ur: {x:-P2, y: P2, z:-P2}} 
const Q_x2_y2_z2= { ul: {x:-P2, y:-P2, z:-P2}, // [0, 0,-1] arm front hand down
                    ur: {x:-P2, y: P2, z: P2}} 
// Q * 6
const Qx4   = { ul: {x: P4, y:  0, z:  0}, // [ 1, 0, 0] arm still hand front down
                ur: {x: P4, y:  0, z:  0}}
const Q_x4 =  { ul: {x:-P4, y:  0, z:  0}, // [ 1, 0, 0] arm still hand back down
                ur: {x:-P4, y:  0, z:  0}} 
const Qy4 =  {  ul: {x:  0, y: P4, z:  0}, // [ 1, 0, 1] arm still back 45 hand down
                ur: {x:  0, y:-P4, z:  0}}
const Q_y4 =  { ul: {x:  0, y:-P4, z:  0}, // [ 1, 0,-1] arm still front 45 hand down
                ur: {x:  0, y: P4, z:  0}}
const Qz4 =  {  ul: {x:  0, y:  0, z: P4}, // [ 1, 1, 0] arm still down 45 hand down
                ur: {x:  0, y:  0, z:-P4}}
const Q_z4 =  { ul: {x:  0, y:  0, z:-P4}, // [ 1,-1, 0] arm still up 45 hand down
                ur: {x:  0, y:  0, z: P4}}
// YZ * 4
const Qy4z4 = { ul: {x:  0, y: P4, z: P4}, // [ 0, 1, 1] arm back down hand down 
                ur: {x:  0, y:-P4, z:-P4}}
const Qy4_z4= { ul: {x:  0, y: P4, z:-P4}, // [ 0,-1, 1] arm back up hand down 
                ur: {x:  0, y:-P4, z: P4}}
const Q_y4z4= { ul: {x:  0, y:-P4, z: P4}, // [ 0, 1,-1] arm front down hand down 
                ur: {x:  0, y: P4, z:-P4}} 
const Q_y4z_4={ ul: {x:  0, y:-P4, z:-P4}, // [ 0,-1,-1] arm front up hand down 
                ur: {x:  0, y: P4, z: P4}}
// XY * 4
const Qx4y4 = { ul: {x: P4, y: P4, z: 0}, // [ 0, 1, 1] arm back down hand front down 
                ur: {x: P4, y:-P4, z:-0}}
const Qx4_y4= { ul: {x: P4, y:-P4, z: 0}, // [ 0,-1,-1] arm front up hand front down 
                ur: {x: P4, y: P4, z: 0},}
const Q_x4y4= { ul: {x:-P4, y: P4, z: 0}, // [ 0,-1, 1] arm back  up hand back down 
                ur: {x:-P4, y:-P4, z:-0}}
const Q_x4_y4={ ul: {x:-P4, y:-P4, z: 0}, // [ 0, 1,-1] arm front downn hand front down 
                ur: {x:-P4, y: P4, z: 0}}
// XZ * 4
const Qx4z4 = { ul: {x: P4, y: 0, z: P4}, // [ 0, 1,-1] arm front downn hand front down 
                ur: {x: P4, y: 0, z:-P4}} 
const Qx4_z4= { ul: {x: P4, y: 0, z:-P4}, // [ 0,-1, 1] arm back  up hand front down 
                ur: {x: P4, y: 0, z: P4}}
const Q_x4z4= { ul: {x:-P4, y: 0, z: P4}, // [ 0, 1, 1] arm back down hand back down 
                ur: {x:-P4, y: 0, z:-P4}} 
const Q_x4_z4={ ul: {x:-P4, y: 0, z:-P4}, // [ 0,-1,-1] arm front downn hand back down
                ur: {x:-P4, y: 0, z: P4}} // 
// XYZ * 8  Skip
const Qx4y4z4= {    ul: {x: P4, y: P4, z: P4}, // [ 0, 1, 1] arm back down hand front down 
                    ur: {x: P4, y:-P4, z:-P4}} 
const Qx4y4_z4= {   ul: {x: P4, y: P4, z:-P4}, // [ 0,-1, 1] arm back  up hand back down 
                    ur: {x: P4, y:-P4, z: P4}} 
const Qx4_y4z4= {   ul: {x: P4, y:-P4, z: P4}, // 
                    ur: {x: P4, y: P4, z:-P4}} 
const Qx4_y4_z4= {  ul: {x: P4, y:-P4, z:-P4}, // 
                    ur: {x: P4, y: P4, z: P4}} 
const Q_x4y4z4= {   ul: {x:-P4, y: P4, z: P4}, // 
                    ur: {x:-P4, y:-P4, z:-P4}} 
const Q_x4y4_z4= {  ul: {x:-P4, y: P4, z:-P4}, // 
                    ur: {x:-P4, y:-P4, z: P4}} 
const Q_x4_y4z4= {  ul: {x:-P4, y:-P4, z: P4}, // 
                    ur: {x:-P4, y: P4, z:-P4}} 
const Q_x4_y4_z4= { ul: {x:-P4, y:-P4, z:-P4}, // 
                    ur: {x:-P4, y: P4, z: P4}} 
// Y4Z2 / Y2Z4 * 4
const Qy4z2 = { ul: {x:  0, y: P4, z: P2}, // [ 0, 1, 1] arm back down hand front down
                ur: {x:  0, y:-P4, z:-P2}}
const Qy4_z2= { ul: {x:  0, y: P4, z:-P2}, // [ 0,-1, 0] arm up  hand back
                ur: {x:  0, y:-P4, z: P2}}
const Q_y4z2= { ul: {x:  0, y:-P4, z: P2}, // [ 0, 1, 0] arm down  hand ?
                ur: {x:  0, y: P4, z:-P2}} 
const Q_y4z_2={ ul: {x:  0, y:-P4, z:-P2}, // [ 0,-1, 0] arm up  hand front 4
                ur: {x:  0, y: P4, z: P2}}
const Qy2z4 = { ul: {x:  0, y: P2, z: P4}, // [ 0, 1, 1] arm back down hand front down
                ur: {x:  0, y:-P2, z:-P4}}
const Qy2_z4= { ul: {x:  0, y: P2, z:-P4}, // [ 0,-1, 1] arm back up hand back down
                ur: {x:  0, y:-P2, z: P4}}
const Q_y2z4= { ul: {x:  0, y:-P2, z: P4}, // [ 0, 1,-1] arm front down hand down
                ur: {x:  0, y: P2, z:-P4}} 
const Q_y2z_4={ ul: {x:  0, y:-P2, z:-P4}, // [ 0,-1,-1] arm front up hand down
                ur: {x:  0, y: P2, z: P4}}
// XY * 4
const Qx4y2 = { ul: {x: P4, y: P2, z: 0}, // [ 0, 1, 1] arm back down hand down
                ur: {x: P4, y:-P2, z:-0}}
const Qx4_y2= { ul: {x: P4, y:-P2, z: 0}, // [ 0,-1,-1] arm front up hand down
                ur: {x: P4, y: P2, z: 0},}
const Q_x4y2= { ul: {x:-P4, y: P2, z: 0}, // [ 0,-1, 1] arm back up hand back down
                ur: {x:-P4, y:-P2, z:-0}}
const Q_x4_y2={ ul: {x:-P4, y:-P2, z: 0}, // [ 0, 1,-1] arm front down hand down
                ur: {x:-P4, y: P2, z: 0}}
const Qx2y4 = { ul: {x: P2, y: P4, z: 0}, // [ 1, 1, 0] arm left down hand front
                ur: {x: P2, y:-P4, z:-0}}
const Qx2_y4= { ul: {x: P2, y:-P4, z: 0}, // [ 1,-1, 0] arm left up hand front
                ur: {x: P2, y: P4, z: 0}}
const Q_x2y4= { ul: {x:-P2, y: P4, z: 0}, // [ 1,-1, 0] arm left up hand back
                ur: {x:-P2, y:-P4, z:-0}}
const Q_x2_y4={ ul: {x:-P2, y:-P4, z: 0}, // [ 1, 1, 0] arm left down hand back
                ur: {x:-P2, y: P4, z: 0}}
// XZ * 4
const Qx4z2 = { ul: {x: P4, y: 0, z: P2}, // [ 0, 1,-1] arm front down hand inner
                ur: {x: P4, y: 0, z:-P2}} 
const Qx4_z2= { ul: {x: P4, y: 0, z:-P2}, // [ 0,-1, 1] arm back up hand inner/outer
                ur: {x: P4, y: 0, z: P2}}
const Q_x4z2= { ul: {x:-P4, y: 0, z: P2}, // [ 0, 1, 1] arm back down hand ??
                ur: {x:-P4, y: 0, z:-P2}} 
const Q_x4_z2={ ul: {x:-P4, y: 0, z:-P2}, // [ 0,-1,-1] arm front up hand out
                ur: {x:-P4, y: 0, z: P2}} // 
const Qx2z4 = { ul: {x: P2, y: 0, z: P4}, // [ 1, 0,-1] arm left front hand front
                ur: {x: P2, y: 0, z:-P4}} 
const Qx2_z4= { ul: {x: P2, y: 0, z:-P4}, // [ 1, 0, 1] arm left back hand front
                ur: {x: P2, y: 0, z: P4}}
const Q_x2z4= { ul: {x:-P2, y: 0, z: P4}, // [ 1, 0, 1] arm left back hand bback
                ur: {x:-P2, y: 0, z:-P4}} 
const Q_x2_z4={ ul: {x:-P2, y: 0, z:-P4}, // [ 1, 0,-1] arm left front hand back
                ur: {x:-P2, y: 0, z: P4}} // 

const fakeUU=  {
    a11: {x: 1, y: 0, z: 0},
    a13: {x: 2, y: 0, z: 0}, 
    a15: {x: 2, y:-1, z: 0},
    a12: {x:-1, y: 0, z: 0}, // r z:-90, l z: 90
    a14: {x:-2, y: 0, z: 0},
    a16: {x:-2, y:-1, z: 0},
    ul: {x:0, y:0, z: 0},
    ur: {x:0, y:0, z: 0},
    ll: {x:0, y:0, z: -Math.PI/2},
    lr: {x:0, y:0, z:  Math.PI/2}
} 
const fakeU2=  {
    a11: {x: 1, y: 0, z: 0},                       //     xx
    a13: {x: 2, y:-1, z: 0},                       //    x  x
    a15: {x: 1, y:-2, z: 0},                       //     xx
    a12: {x:-1, y: 0, z: 0}, // r z:-90, l z: 90
    a14: {x:-2, y:-1, z: 0},
    a16: {x:-1, y:-2, z: 0},
    ul: {x:0, y:0, z: -Math.PI/4},
    ur: {x:0, y:0, z:  Math.PI/4},
    ll: {x:0, y:0, z: -Math.PI/2},
    lr: {x:0, y:0, z:  Math.PI/2}
} 
const fakeDD=  {
    a11: {x: 1, y: 0, z: 0},
    a13: {x: 2, y: 0, z: 0},
    a15: {x: 2, y: 1, z: 0},
    a12: {x:-1, y: 0, z: 0}, // r z:-90, l z: 90
    a14: {x:-2, y: 0, z: 0},
    a16: {x:-2, y: 1, z: 0},
    ul: {x:0, y:0, z: 0},
    ur: {x:0, y:0, z: 0},
    ll: {x:0, y:0, z:  Math.PI/2},
    lr: {x:0, y:0, z: -Math.PI/2}
} 
const fakeD2=  {
    a11: {x: 1, y: 0, z: 0},
    a13: {x: 2, y: 1, z: 0},
    a15: {x: 1, y: 2, z: 0},
    a12: {x:-1, y: 0, z: 0}, // r z:-90, l z: 90
    a14: {x:-2, y: 1, z: 0},
    a16: {x:-1, y: 2, z: 0},
    ul: {x:0, y:0, z:  Math.PI/4},
    ur: {x:0, y:0, z: -Math.PI/4},
    ll: {x:0, y:0, z:  Math.PI/2},
    lr: {x:0, y:0, z: -Math.PI/2}
} 
const fakeD3=  {a11: {x: 1, y: 0, z: 0},
a13: {x: 1, y: 1, z: 0},
a15: {x: 1, y: 2, z: 0},
a12: {x:-1, y: 0, z: 0}, // r z:-90, l z: 90
a14: {x:-1, y: 1, z: 0},
a16: {x:-1, y: 2, z: 0},
ul: {x:0, y:0, z:  Math.PI/4},
ur: {x:0, y:0, z: -Math.PI/4},
ll: {x:0, y:0, z:  Math.PI/2},
lr: {x:0, y:0, z: -Math.PI/2}
} 
const fakeD4=  {a11: {x: 1, y: 0, z: 0},
a13: {x: 1, y: 1, z: 0},
a15: {x: 2, y: 2, z: 0},
a12: {x:-1, y: 0, z: 0}, // r z:-90, l z: 90
a14: {x:-1, y: 1, z: 0},
a16: {x:-2, y: 2, z: 0},
ul: {x:0, y:0, z:  Math.PI/4},
ur: {x:0, y:0, z: -Math.PI/4},
ll: {x:0, y:0, z:  Math.PI/2},
lr: {x:0, y:0, z: -Math.PI/2}
} 
const fakeD5=  {
    a11: {x: 1, y: 0, z: 0},
    a13: {x: 1, y: 1, z: 1},
    a15: {x: 2, y: 2, z: 0},
    a12: {x:-1, y: 0, z: 0}, // r z:-90, l z: 90
    a14: {x:-1, y: 1, z: 1},
    a16: {x:-2, y: 2, z: 0},
    ul: {x:0, y: Math.PI/4, z:  Math.PI/4},
    ur: {x:0, y:-Math.PI/4, z: -Math.PI/4},
    ll: {x:0, y:0, z:  Math.PI/2},
    lr: {x:0, y:0, z: -Math.PI/2}
} 
const fakeXX=  {
    a11: {x: 1, y: 0, z: 0},
    a13: {x: 1, y: 1, z: 1}, // {0, 1, 1} => {-P, P/2, P/2}
    a15: {x: 2, y: 2, z: 0},
    a12: {x:-1, y: 0, z: 0}, // r z:-90, l z: 90
    a14: {x:-1, y: 1, z: 1},
    a16: {x:-2, y: 2, z: 0},
    ul: {x:-Math.PI/4, y:+Math.PI/2, z: 0},
    ur: {x:-Math.PI/4, y:-Math.PI/2, z: 0},
    ll: {x:0, y:0, z:  0},
    lr: {x:0, y:0, z:  0}
}

const fakeFF=  {
    a11: {x: 1, y: 0, z: 0}, //zx -1 1 xy 1 0: -45 0
    a13: {x: 2, y: 0, z: 0}, //zx 0 1 xy 1 0:  90  0
    a15: {x: 2, y: 0, z:-1}, //zx-1 0 xy 1 0: 180  0
    a12: {x:-1, y: 0, z: 0}, // r z:-90, l z: 90
    a14: {x:-2, y: 0, z: 0},
    a16: {x:-2, y: 0, z:-1}, // -1, 0
    ul: {x:0, y:0, z: 0},
    ur: {x:0, y:0, z: 0},
    ll: {x:0, y:-Math.PI/2, z:0},
    lr: {x:0, y: Math.PI/2, z:0}
} 
// atan(dy,dx): (1, 0)-> 0, (-1, 0)->-180, ( 0,1)-> 90, ( 0,-1)->-90
// atan(dy,dx): (1, 1)->45, (-1, 1)-> -45, (-1,1)->135, (-1,-1)->-135
//  @@
// o  o
//  oo
const fakeF2=  {
    a11: {x: 1, y: 0, z: 0},  // Need Check
    a13: {x: 2, y: 0, z:-1},  // zx-1 1 xy 1 0: -45   0                   
    a15: {x: 1, y: 0, z:-2},  // xz-1-1 xy-1 0:-135 180 
    a12: {x:-1, y: 0, z: 0}, // r z:-90, l z: 90
    a14: {x:-2, y: 0, z:-1}, //z x
    a16: {x:-1, y: 0, z:-2},
    ul: {x:0, y:-Math.PI/4, z: 0},
    ur: {x:0, y: Math.PI/4, z: 0},
    ll: {x:0, y:-Math.PI/2, z:0},
    lr: {x:0, y: Math.PI/2, z:0}
} 
// atan(dy,dx): (1, 0)-> 0, (-1,0)->+90, (0,-1)->-90, (-1,-1)->180
const fakeBB=  {
    a11: {x: 1, y: 0, z: 0},                        //  o  o
    a13: {x: 2, y: 0, z: 0},                        //  xwwx 
    a15: {x: 2, y: 0, z: 1},                        // 
    a12: {x:-1, y: 0, z: 0}, // r z:-90, l z: 90    //
    a14: {x:-2, y: 0, z: 0},
    a16: {x:-2, y: 0, z: 1},
    ul: {x:0, y:0, z: 0},
    ur: {x:0, y:0, z: 0},
    ll: {x:0, y: Math.PI/2, z:0},
    lr: {x:0, y:-Math.PI/2, z:0}
} 
// atan(dy,dx): (1, 0)-> 0, (-1,0)->+90, (0,-1)->-90, (-1,-1)->180
const fakeB2=  {
    a11: {x: 1, y: 0, z: 0},  // xxxx               ww
    a13: {x: 2, y: 0, z: 1},  //                   o  o
    a15: {x: 1, y: 0, z: 2},  //                    oo
    a12: {x:-1, y: 0, z: 0}, // r z:-90, l z: 90
    a14: {x:-2, y: 0, z: 1},
    a16: {x:-1, y: 0, z: 2},
    ul: {x:0, y: Math.PI/4, z: 0},
    ur: {x:0, y:-Math.PI/2, z: 0},
    ll: {x:0, y: Math.PI/4, z: 0},
    lr: {x:0, y:-Math.PI/2, z: 0}
} 
// atan(dy,dx): (1, 0)-> 0, (-1,0)->+90, (0,-1)->-90, (-1,-1)->180
const fakeFU=  {
    a11: {x: 1, y: 0, z: 0},
    a13: {x: 1, y: 0, z:-1},
    a15: {x: 1, y:-1, z:-1},
    a12: {x:-1, y: 0, z: 0}, // r z:-90, l z: 90
    a14: {x:-1, y: 0, z:-1},
    a16: {x:-1, y:-1, z:-1},
    ul: {x:0, y:-Math.PI/2, z: 0},
    ur: {x:0, y: Math.PI/2, z: 0},
    ll: {x:0, y:0, z:-Math.PI/2},
    lr: {x:0, y:0, z: Math.PI/2}
}
// atan(dy,dx): (1, 0)-> 0, (-1,0)->+90, (0,-1)->-90, (-1,-1)->180
const fakeQQ=  {
    a11: {x: 1, y: 0, z: 0},
    a13: {x: 2, y: 0, z: 0},
    a15: {x: 2, y: 0, z:-1},
    a12: {x:-1, y: 0, z: 0}, // r z:-90, l z: 90
    a14: {x:-2, y: 0, z: 0},
    a16: {x:-2, y: 0, z:-1},
    ul: {x:0, y:-Math.PI/4, z:-Math.PI/4},
    ur: {x:0, y: Math.PI/4, z: Math.PI/4},
    ll: {x:0, y:-Math.PI/2, z:-Math.PI/2},
    lr: {x:0, y: Math.PI/2, z: Math.PI/2}
}
function R(a) {
    return a * Math.PI / 180;
}
const fakeF3=  {
    a11: {x: 1, y: 0, z: 0}, //zx -1 1 xy 1 0: -45 0
    a13: {x: 2, y: 0, z: 0}, //zx 0 1 xy 1 0:  90  0
    a15: {x: 2, y: 1, z: 0}, //zx-1 0 xy 1 0: 180  0
    a12: {x:-1, y: 0, z: 0}, // r z:-90, l z: 90
    a14: {x:-2, y: 0, z: 0},
    a16: {x:-2, y: 1, z: 0}, // -1, 0
    ul: {x:0, y:0, z: 0},
    ur: {x:0, y:0, z: 0},
    ll: {x:0, y:-Math.PI/2, z:0},
    lr: {x:0, y: Math.PI/2, z:0}
}
const fakeDB=  {
    a11: {x: 13, y:-46, z:-11},
    a13: {x: 14, y:-21, z: -6},
    a15: {x: 17, y:  1, z:-15},
    a12: {x:-17, y:-45, z:-14}, // r z:-90, l z: 90
    a14: {x:-19, y:-19, z: -8},
    a16: {x:-21, y:  2, z:-16},
    ul: {x:0, y:R(68), z: R(85)},
    ur: {x:0, y:    0, z: R(-83)},
    ll: {x:0, y: R(-30), z: R(2)}, 
    lr: {x:0, y:R(74), z: R(1)}
}  
const fakeW2=  { // OK
    a11: {x: 1, y: 0, z: 0},
    a13: {x: 2, y: 1, z: 0},
    a15: {x: 2, y: 0, z: 0},
    a12: {x:-1, y: 0, z: 0}, // r z:-90, l z: 90
    a14: {x:-2, y: 1, z: 0},
    a16: {x:-2, y: 0, z: 0},
    ul: {x:0, y:R(68), z: R(85)},
    ur: {x:0, y:    0, z: R(-83)},
    ll: {x:0, y: R(-30), z: R(2)}, 
    lr: {x:0, y:R(74), z: R(1)}
}  
const fakeVV=  { // OK
    a11: {x: 1, y: 0, z: 0},
    a13: {x: 2, y: 1, z: 0},
    a15: {x: 3, y: 0, z: 0},
    a12: {x:-1, y: 0, z: 0}, // r z:-90, l z: 90
    a14: {x:-2, y: 1, z: 0},
    a16: {x:-3, y: 0, z: 0},
    ul: {x:0, y:R(68), z: R(85)},
    ur: {x:0, y:    0, z: R(-83)},
    ll: {x:0, y: R(-30), z: R(2)}, 
    lr: {x:0, y:R(74), z: R(1)}
}  
const fakeLL=  { // OK
    a11: {x: 1, y: 0, z: 0},
    a13: {x: 2, y: 1, z: 0},
    a15: {x: 3, y: 1, z: 0},
    a12: {x:-1, y: 0, z: 0}, // r z:-90, l z: 90
    a14: {x:-2, y: 1, z: 0},
    a16: {x:-3, y: 1, z: 0},
    ul: {x:0, y:R(68), z: R(85)},
    ur: {x:0, y:    0, z: R(-83)},
    ll: {x:0, y: R(-30), z: R(2)}, 
    lr: {x:0, y:R(74), z: R(1)}
}
const fakeSS=  { // OK
    a11: {x: 1, y: 0, z: 0},
    a13: {x: 2, y: 1, z: 0},
    a15: {x: 3, y: 2, z: 0},
    a12: {x:-1, y: 0, z: 0}, // r z:-90, l z: 90
    a14: {x:-2, y: 1, z: 0},
    a16: {x:-3, y: 2, z: 0},
    ul: {x:0, y:R(68), z: R(85)},
    ur: {x:0, y:    0, z: R(-83)},
    ll: {x:0, y: R(-30), z: R(2)}, 
    lr: {x:0, y:R(74), z: R(1)}
}
const fakeTT=  { // OK
    a11: {x: 1, y: 0, z: 0},
    a13: {x: 2, y: 1, z: 0},
    a15: {x: 2, y: 2, z: 0},
    a12: {x:-1, y: 0, z: 0}, // r z:-90, l z: 90
    a14: {x:-2, y: 1, z: 0},
    a16: {x:-2, y: 2, z: 0},
    ul: {x:0, y:R(68), z: R(85)},
    ur: {x:0, y:    0, z: R(-83)},
    ll: {x:0, y: R(-30), z: R(2)}, 
    lr: {x:0, y:R(74), z: R(1)}
}
const fakeST=  { // OK
    a11: {x: 1, y: 0, z: 0},
    a13: {x: 2, y: 1, z: 0},
    a15: {x: 2, y: 2, z: 1},
    a12: {x:-1, y: 0, z: 0}, // r z:-90, l z: 90
    a14: {x:-2, y: 1, z: 0},
    a16: {x:-2, y: 2, z: 1},
    ul: {x:0, y:R(68), z: R(85)},
    ur: {x:0, y:    0, z: R(-83)},
    ll: {x:0, y: R(-30), z: R(2)}, 
    lr: {x:0, y:R(74), z: R(1)}
}
const fakeWU=  { // OK
    a11: {x: 1, y: 0, z: 0},
    a13: {x: 2, y: 1, z: 0},
    a15: {x: 3, y:-1, z: 0},
    a12: {x:-1, y: 0, z: 0}, // r z:-90, l z: 90
    a14: {x:-2, y: 1, z: 0},
    a16: {x:-3, y:-1, z: 0},
    ul: {x:0, y:R(68), z: R(85)},
    ur: {x:0, y:    0, z: R(-83)},
    ll: {x:0, y: R(-30), z: R(2)}, 
    lr: {x:0, y:R(74), z: R(1)}
}
const fakeMM=  { // OK
    a11: {x: 1, y: 0, z: 0},
    a13: {x: 2, y:-1, z: 0},
    a15: {x: 3, y: 0, z: 0},
    a12: {x:-1, y: 0, z: 0}, // r z:-90, l z: 90
    a14: {x:-2, y:-1, z: 0},
    a16: {x:-3, y: 0, z: 0},
    ul: {x:0, y:R(68), z: R(85)},
    ur: {x:0, y:    0, z: R(-83)},
    ll: {x:0, y: R(-30), z: R(2)}, 
    lr: {x:0, y:R(74), z: R(1)}
}
const fakeMm=  { // OK
    a11: {x: 1, y: 0, z: 0},
    a13: {x: 2, y:-1, z: 0},
    a15: {x: 2, y: 0, z: 0},
    a12: {x:-1, y: 0, z: 0}, // r z:-90, l z: 90
    a14: {x:-2, y:-1, z: 0},
    a16: {x:-2, y: 0, z: 0},
    ul: {x:0, y:R(68), z: R(85)},
    ur: {x:0, y:    0, z: R(-83)},
    ll: {x:0, y: R(-30), z: R(2)}, 
    lr: {x:0, y:R(74), z: R(1)}
}
const fakeUT=  { // XXX
    a11: {x: 1, y: 0, z: 0},
    a13: {x: 2, y:-1, z: 0},
    a15: {x: 3, y:-1, z: 0},
    a12: {x:-1, y: 0, z: 0}, // r z:-90, l z: 90
    a14: {x:-2, y:-1, z: 0},
    a16: {x:-3, y:-1, z: 0},
    ul: {x:0, y:R(68), z: R(85)},
    ur: {x:0, y:    0, z: R(-83)},
    ll: {x:0, y: R(-30), z: R(2)}, 
    lr: {x:0, y:R(74), z: R(1)}
}
const fakeZL=  { // XXX
    a11: {x: 1, y: 0, z: 0},
    a13: {x: 2, y: 0, z: 1},
    a15: {x: 3, y: 0, z: 1},
    a12: {x:-1, y: 0, z: 0}, // r z:-90, l z: 90
    a14: {x:-2, y: 0, z: 1},
    a16: {x:-3, y: 0, z: 1},
    ul: {x:0, y:R(68), z: R(85)},
    ur: {x:0, y:    0, z: R(-83)},
    ll: {x:0, y: R(-30), z: R(2)},  
    lr: {x:0, y:R(74), z: R(1)}
}
const fakeZW=  { // XXX
    a11: {x: 1, y: 0, z: 0},
    a13: {x: 2, y: 0, z: 1},
    a15: {x: 3, y: 0, z: 0},
    a12: {x:-1, y: 0, z: 0}, // r z:-90, l z: 90
    a14: {x:-2, y: 0, z: 1},
    a16: {x:-3, y: 0, z: 0},
    ul: {x:0, y:R(68), z: R(85)},
    ur: {x:0, y:    0, z: R(-83)},
    ll: {x:0, y: R(-30), z: R(2)}, 
    lr: {x:0, y:R(74), z: R(1)}
}

const LL = {
    a23: {x: 1, y: 0, z: 0},
    a25: {x: 2, y: 1, z: 0}, 
    a27: {x: 1, y: 2, z: 0},
    a24: {x:-1, y: 0, z: 0}, 
    a26: {x:-1, y: 1, z: 0}, 
    a28: {x:-1, y: 2, z: 0},
}
const RR = {
    a23: {x: 1, y: 0, z: 0},
    a25: {x: 0, y: 1, z: 0}, 
    a27: {x: 1, y: 2, z: 0},
    a24: {x:-1, y: 0, z: 0}, 
    a26: {x:-1, y: 1, z: 0}, 
    a28: {x:-1, y: 2, z: 0},
}
const F2 = {
    a23: {x: 1, y: 0, z: 0},
    a25: {x: 1, y: 0, z:-1}, 
    a27: {x: 1, y: 1, z:-1},
    a24: {x:-1, y: 0, z: 0}, 
    a26: {x:-1, y: 1, z: 0}, 
    a28: {x:-1, y: 2, z: 0},
}
const FF = {
    a23: {x: 1, y: 0, z: 0},
    a25: {x: 1, y: 0, z:-1}, 
    a27: {x: 1, y: 0, z:-2},
    a24: {x:-1, y: 0, z: 0}, 
    a26: {x:-1, y: 1, z: 0}, 
    a28: {x:-1, y: 2, z: 0},
}
data = Object.assign(data, FF);
 

Kalidokit.Pose.fakePose(data);
