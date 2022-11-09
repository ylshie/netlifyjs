const Q0    = { ul: {x:  0, y:  0, z:  0}} // [ 1, 0, 0] arm still
// * 6
const Qx2   = { ul: {x: P2, y:  0, z:  0}, r: [ 1, 0, 0]} //arm still hand front
const Q_x2 =  { ul: {x:-P2, y:  0, z:  0}, r: [ 1, 0, 0]} //arm still hand back
const Qy2 =   { ul: {x:  0, y: P2, z:  0}, r: [ 0, 0, 1]} //arm back ? back
const Q_y2 =  { ul: {x:  0, y:-P2, z:  0}, r: [ 0, 0,-1]} //arm front
const Qz2  =  { ul: {x:  0, y:  0, z: P2}, r: [ 0, 1, 0]} //arm down hand ?
const Q_z2 =  { ul: {x:  0, y:  0, z:-P2}, r: [ 0,-1, 0]} //arm up hand out
// YZ * 4
const Qy2z2 = { ul: {x:  0, y: P2, z: P2}, r: [ 0, 1, 0]} //arm down hand front
const Qy2_z2= { ul: {x:  0, y: P2, z:-P2}, r: [ 0,-1, 0]} //arm up hand back
const Q_y2z2= { ul: {x:  0, y:-P2, z: P2}, r: [ 0, 1, 0]} //arm down hand back                ur: {x:  0, y: P2, z:-P2}} 
const Q_y2z_2={ ul: {x:  0, y:-P2, z:-P2}, r: [ 0,-1, 0]} //arm up hand front
// XY * 4
const Qx2y2 = { ul: {x: P2, y: P2, z: 0}, r: [ 0, 1, 0]} //arm down hand front
const Qx2_y2= { ul: {x: P2, y:-P2, z: 0}, r: [ 0,-1, 0]} //arm up hand front
const Q_x2y2= { ul: {x:-P2, y: P2, z: 0}, r: [ 0,-1, 0]} //arm up hand back
const Q_x2_y2={ ul: {x:-P2, y:-P2, z: 0}, r: [ 0, 1, 0]} //arm down hand ?
// XZ * 4
const Qx2z2 = { ul: {x: P2, y: 0, z: P2}, r: [ 0, 0,-1]} //arm front hand inner
const Qx2_z2= { ul: {x: P2, y: 0, z:-P2}, r: [ 0, 0, 1]} //arm back hand ? // x down => front * z: up => back
const Q_x2z2= { ul: {x:-P2, y: 0, z: P2}, r: [ 0, 0, 1]} //arm back hand ?
const Q_x2_z2={ ul: {x:-P2, y: 0, z:-P2}, r: [ 0, 0,-1]} //arm front hand outer
// XYZ * 8
const Qx2y2z2= {    ul: {x: P2, y: P2, z: P2}, r: [0, 0,-1]} //arm front hand up
const Qx2y2_z2= {   ul: {x: P2, y: P2, z:-P2}, r: [0, 0, 1]} //arm back hand ??
const Qx2_y2z2= {   ul: {x: P2, y:-P2, z: P2}, r: [0, 0,-1]} //arm front hand down
const Qx2_y2_z2= {  ul: {x: P2, y:-P2, z:-P2}, r: [0, 0, 1]} //arm back hand ??
const Q_x2y2z2= {   ul: {x:-P2, y: P2, z: P2}, r: [0, 0, 1]} //arm back hand ??
const Q_x2y2_z2= {  ul: {x:-P2, y: P2, z:-P2}, r: [0, 0,-1]} //arm front hand up
const Q_x2_y2z2= {  ul: {x:-P2, y:-P2, z: P2}, r: [0, 0, 1]} //arm back hand ??
const Q_x2_y2_z2= { ul: {x:-P2, y:-P2, z:-P2}, r: [0, 0,-1]} //arm front hand down
// Q * 6
const Qx4   = { ul: {x: P4, y:  0, z:  0}, r: [ 1, 0, 0]} //arm still hand front down
const Q_x4 =  { ul: {x:-P4, y:  0, z:  0}, r: [ 1, 0, 0]} //arm still hand back down
const Qy4 =  {  ul: {x:  0, y: P4, z:  0}, r: [ 1, 0, 1]} //arm still back 45 hand down
const Q_y4 =  { ul: {x:  0, y:-P4, z:  0}, r: [ 1, 0,-1]} //arm still front 45 hand down
const Qz4 =  {  ul: {x:  0, y:  0, z: P4}, r: [ 1, 1, 0]} //arm still down 45 hand down
const Q_z4 =  { ul: {x:  0, y:  0, z:-P4}, r: [ 1,-1, 0]} //arm still up 45 hand down
// YZ * 4
const Qy4z4 = { ul: {x:  0, y: P4, z: P4}, r: [ 0, 1, 1]} //arm back down hand down 
const Qy4_z4= { ul: {x:  0, y: P4, z:-P4}, r: [ 0,-1, 1]} //arm back up hand down 
const Q_y4z4= { ul: {x:  0, y:-P4, z: P4}, r: [ 0, 1,-1]} //arm front down hand down 
const Q_y4z_4={ ul: {x:  0, y:-P4, z:-P4}, r: [ 0,-1,-1]} //arm front up hand down 
// XY * 4
const Qx4y4 = { ul: {x: P4, y: P4, z: 0}, r: [ 0, 1, 1]} //arm back down hand front down 
const Qx4_y4= { ul: {x: P4, y:-P4, z: 0}, r: [ 0,-1,-1]} //arm front up hand front down 
const Q_x4y4= { ul: {x:-P4, y: P4, z: 0}, r: [ 0,-1, 1]} //arm back  up hand back down 
const Q_x4_y4={ ul: {x:-P4, y:-P4, z: 0}, r: [ 0, 1,-1]} //arm front downn hand front down 
// XZ * 4
const Qx4z4 = { ul: {x: P4, y: 0, z: P4}, r: [ 0, 1,-1]} //arm front downn hand front down 
const Qx4_z4= { ul: {x: P4, y: 0, z:-P4}, r: [ 0,-1, 1]} //arm back  up hand front down 
const Q_x4z4= { ul: {x:-P4, y: 0, z: P4}, r: [ 0, 1, 1]} //arm back down hand back down 
const Q_x4_z4={ ul: {x:-P4, y: 0, z:-P4}, r: [ 0,-1,-1]} //arm front downn hand back down

export const testsets = [Q0,
                         Qx2,Q_x2,Qy2,Q_y2,Qz2,Q_z2,
                         Qx2y2,Qx2_y2,Qx2z2,Qx2_z2,Qy2z2,Qy2_z2,
                         Qx2y2z2,Qx2y2_z2,Qx2_y2z2,Qx2_y2_z2,Q_x2y2z2,Q_x2y2_z2,Q_x2_y2z2,Q_x2_y2_z2,
                         Qx4,Q_x4,Qy4,Q_y4,Qz4,Q_z4,
                         Qx4y4,Qx4_y4,Qx4z4,Qx4_z4,Qy4z4,Qy4_z4]

