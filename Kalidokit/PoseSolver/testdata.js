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

//  X = Math.PI/4
//
//ul: {x: Math.PI/4, y: 0, z:+Math.PI/2}, => { 0, 1,-1}
//ur: {x: Math.PI/4, y: 0, z:-Math.PI/2}, => { 0, 1,-1}
//
//ul: {x: Math.PI/4, y: 0, z:-Math.PI/2}, => { 0,-1, 1}
//ur: {x: Math.PI/4, y: 0, z:+Math.PI/2}, => { 0,-1, 1}
//
//ul: {x:-Math.PI/4, y: 0, z:+Math.PI/2}, => { 0, 1, 1}
//ur: {x:-Math.PI/4, y: 0, z:-Math.PI/2}, => { 0, 1, 1}
//
//ul: {x:-Math.PI/4, y: 0, z:-Math.PI/2}, => { 0,-1,-1}
//ur: {x:-Math.PI/4, y: 0, z:+Math.PI/2}, => { 0,-1,-1}
//
//ul: {x:-Math.PI/4, y:+Math.PI/2, z: 0}, => { 0,-1, 1}
//ur: {x:-Math.PI/4, y:-Math.PI/2, z: 0}, => { 0,-1, 1}

//  atan (dx,dy,dx)
//  atan ( 0, 0, 0) ->    0
//  atan ( 0, 1, 0) ->   90
//  atan ( 0,-1, 0) ->  -90
//  atan ( 1, 0, 1) ->    0
//  atan (-1, 0,-1) -> -180
// atan(dy,dx): (1, 0)-> 0, (-1, 0)->-180, ( 0,1)-> 90, ( 0,-1)->-90
// atan(dy,dx): (1, 1)->45, (-1, 1)-> -45, (-1,1)->135, (-1,-1)->-135
// x@@x
// o  o
//
const fakeFF=  {a11: {x: 1, y: 0, z: 0}, //zx -1 1 xy 1 0: -45 0
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
const fakeF2=  {a11: {x: 1, y: 0, z: 0},  //
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
const fakeBB=  {a11: {x: 1, y: 0, z: 0},                        //  o  o
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
const fakeB2=  {a11: {x: 1, y: 0, z: 0},  // xxxx               ww
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
const fakeFU=  {a11: {x: 1, y: 0, z: 0},
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

//Pure Rotation Calculations
    ///*
    // R x -1 L x 1, y 1
    //              // X: Right, Y: Down, Z Front // X: Right, Y: Down, Z: Back    // X: Right, Y: Up, Z: Back
    const fakeXY = {a11: {x:  0,y:  0, z: 0},   // a11: {x:  0,y:  0, z: 0},   // a11: {x:  0,y:  0, z: 0},
                    a13: {x:  1,y:  1, z: 0},   // a13: {x:  1,y:  1, z: 0},   // a13: {x:  1,y: -1, z: 0},
                    a12: {x:  0,y:  0, z: 0},   // a12: {x:  0,y:  0, z: 0},   // a12: {x:  0,y:  0, z: 0},
                    a14: {x: -1,y:  1, z: 0}}   // a14: {x: -1,y:  1, z: 0},   // a14: {x: -1,y: -1, z: 0}
    //*/
    ///*           // X: Right, Y: Down, Z Front  // X: Right, Y: Down, Z: Back    // X: Right, Y: Up, Z: Back
    const fakeXZ = {a11: {x:  0,y:  0, z: 0},   //a11: {x:  0,y:  0, z: 0},   // a11: {x:  0,y:  0, z: 0},
                    a13: {x:  1,y:  0, z: 1},   //a13: {x:  1,y:  0, z:-1},   // a13: {x:  1,y:  0, z:-1},
                    a12: {x:  0,y:  0, z: 0},   //a12: {x:  0,y:  0, z: 0},   // a12: {x:  0,y:  0, z: 0},
                    a14: {x: -1,y:  0, z: 1}}   //a14: {x: -1,y:  0, z:-1}}   // a14: {x: -1,y:  0, z:-1}
    //*/ 
    ///*            // X: Right, Y: Up, Z Front // X: Right, Y: Down, Z: Back    // X: Right, Y: Up, Z: Back
    const fakeXYZ= {a11: {x:  0,y:  0, z:  0},  //a11: {x:  0,y:  0, z:  0},  // a11: {x:  0,y:  0, z:  0},
                    a13: {x:  1,y:  1, z:  1},  //a13: {x:  1,y:  1, z: -1},  // a13: {x:  1,y: -1, z: -1},
                    a12: {x:  0,y:  0, z:  0},  //a12: {x:  0,y:  0, z:  0},  // a12: {x:  0,y:  0, z:  0},
                    a14: {x: -1,y:  1, z:  1}}  //a14: {x: -1,y:  1, z: -1}}  // a14: {x: -1,y: -1, z: -1}
    //*/
    ///*           // X: Right, Y: Down, Z Front  // X: Right, Y: Down, Z: Back    // X: Right, Y: Up, Z: Back
    const fakeZZ = {a11: {x:  0,y:  0, z: 0},   //a11: {x:  0,y:  0, z: 0},   // a11: {x:  0,y:  0, z: 0},
                    a13: {x:  0,y:  0, z: 1},   //a13: {x:  1,y:  0, z:-1},   // a13: {x:  1,y:  0, z:-1},
                    a12: {x:  0,y:  0, z: 0},   //a12: {x:  0,y:  0, z: 0},   // a12: {x:  0,y:  0, z: 0},
                    a14: {x:  0,y:  0, z: 1}}   //a14: {x: -1,y:  0, z:-1}}   // a14: {x: -1,y:  0, z:-1}
    //*/
    const fakeKK=  {a11: {x: 1, y: 0, z: 0},
                    a13: {x: 2, y: 1, z: 0},
                    a15: {x: 3, y: 0, z: 0},
                    a12: {x:-1, y: 0, z: 0},
                    a14: {x:-2, y: 1, z: 0},
                    a16: {x:-3, y: 0, z: 0}
                    } 
    const fakeLL=  {a11: {x: 1, y: 0, z: 0},
                    a13: {x: 2, y: 0, z:-1},
                    a15: {x: 3, y: 0, z: 0},
                    a12: {x:-1, y: 0, z: 0},
                    a14: {x:-2, y: 0, z:-1},
                    a16: {x:-3, y: 0, z: 0}
                    }
    const fakeMM=  {a11: {x: 1, y: 0, z: 0},
                    a13: {x: 2, y: 0, z:-1},
                    a15: {x: 1, y: 0, z:-2},
                    a12: {x:-1, y: 0, z: 0},
                    a14: {x:-2, y: 0, z:-1},
                    a16: {x:-1, y: 0, z:-2}
                    }
    const fakeUP=  {a11: {x: 1, y: 0, z: 0},
                    a13: {x: 1, y:-1, z: 0},
                    a12: {x:-1, y: 0, z: 0}, // r z:-90, l z: 90
                    a14: {x:-1, y:-1, z: 0},
                    } 
const fakeDN=  {a11: {x: 1, y: 0, z: 0},
                a13: {x: 1, y: 1, z: 0},
                a12: {x:-1, y: 0, z: 0}, // r z:-90, l z: 90
                a14: {x:-1, y: 1, z: 0},
                } 
const fakeFT=  {a11: {x: 1, y: 0, z: 0},
                a13: {x: 1, y: 0, z:-1},
                a12: {x:-1, y: 0, z: 0}, // r z:-90, l z: 90
                a14: {x:-1, y: 0, z:-1},
                } 
const fakeBK=  {a11: {x: 1, y: 0, z: 0},
                a13: {x: 1, y: 0, z: 1},
                a12: {x:-1, y: 0, z: 0}, // r z:-90, l z: 90
                a14: {x:-1, y: 0, z: 1},
                }

const Qx2 =  { 
    a11: {x: 1, y: 0, z: 0},
    a13: {x: 1, y: 1, z: 1}, 
    a15: {x: 2, y: 2, z: 0},
    a12: {x:-1, y: 0, z: 0}, 
    a14: {x:-1, y: 1, z: 1},
    a16: {x:-2, y: 2, z: 0},
    ul: {x: Math.PI/2, y: 0, z: 0},
    ur: {x:-Math.PI/2, y: 0, z: 0},
    ll: {x:0, y:0, z:  0},
    lr: {x:0, y:0, z:  0}
}
const Qx_2 =  {
    a11: {x: 1, y: 0, z: 0},
    a13: {x: 1, y: 1, z: 1}, 
    a15: {x: 2, y: 2, z: 0},
    a12: {x:-1, y: 0, z: 0}, 
    a14: {x:-1, y: 1, z: 1},
    a16: {x:-2, y: 2, z: 0},
    ul: {x:-Math.PI/2, y: 0, z: 0},
    ur: {x: Math.PI/2, y: 0, z: 0},
    ll: {x:0, y:0, z:  0},
    lr: {x:0, y:0, z:  0}
} 
const Qy2 =  {
    a11: {x: 1, y: 0, z: 0},
    a13: {x: 1, y: 1, z: 1}, 
    a15: {x: 2, y: 2, z: 0},
    a12: {x:-1, y: 0, z: 0}, 
    a14: {x:-1, y: 1, z: 1},
    a16: {x:-2, y: 2, z: 0},
    //  [0,0,1]
    ul: {x:0, y: Math.PI/2, z: 0},
    ur: {x:0, y:-Math.PI/2, z: 0},
    ll: {x:0, y:0, z:  0},
    lr: {x:0, y:0, z:  0}
}
const Qy_2 =  {
    a11: {x: 1, y: 0, z: 0},
    a13: {x: 1, y: 1, z: 1}, 
    a15: {x: 2, y: 2, z: 0},
    a12: {x:-1, y: 0, z: 0}, 
    a14: {x:-1, y: 1, z: 1},
    a16: {x:-2, y: 2, z: 0},
    ul: {x:0, y:-Math.PI/2, z: 0},
    ur: {x:0, y: Math.PI/2, z: 0},
    ll: {x:0, y:0, z:  0},
    lr: {x:0, y:0, z:  0}
}

export function changeFake(dataU,dataL) {
    fakeU = dataU;
    fakeL = dataL;
}
export var fakeU = Qy_2;
export var fakeL = Qy_2;

