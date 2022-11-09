//import {testsets} from "./matrix.js";
//import pkg from "./Kalidokit/utils/vector.js"
//const { Vector } = pkg;
const math = require ("mathjs");

const P  = Math.PI
const P2 = Math.PI/2
const P4 = Math.PI/4

const Q0    = { ul: {x:  0, y:  0, z:  0}, r: [ 1, 0, 0]} //arm still
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
const Q_y2_z2={ ul: {x:  0, y:-P2, z:-P2}, r: [ 0,-1, 0]} //arm up hand front
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
const Q_y4_z4={ ul: {x:  0, y:-P4, z:-P4}, r: [ 0,-1,-1]} //arm front up hand down 
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

const Qy4z2 = { ul: {x:  0, y: P4, z: P2}, r: [ 0, 1, 1]} // arm back down hand front down
const Qy4_z2= { ul: {x:  0, y: P4, z:-P2}, r: [ 0,-1, 0]} // arm up  hand back
const Q_y4z2= { ul: {x:  0, y:-P4, z: P2}, r: [ 0, 1, 0]} // arm down  hand ?
const Q_y4_z2={ ul: {x:  0, y:-P4, z:-P2}, r: [ 0,-1, 0]} // arm up  hand front 4
const Qy2z4 = { ul: {x:  0, y: P2, z: P4}, r: [ 0, 1, 1]} // arm back down hand front down
const Qy2_z4= { ul: {x:  0, y: P2, z:-P4}, r: [ 0,-1, 1]} // arm back up hand back down
const Q_y2z4= { ul: {x:  0, y:-P2, z: P4}, r: [ 0, 1,-1]} // arm front down hand down
const Q_y2_z4={ ul: {x:  0, y:-P2, z:-P4}, r: [ 0,-1,-1]} // arm front up hand down
// XY * 4
const Qx4y2 = { ul: {x: P4, y: P2, z: 0}, r: [ 0, 1, 1]} // arm back down hand down
const Qx4_y2= { ul: {x: P4, y:-P2, z: 0}, r: [ 0,-1,-1]} // arm front up hand down
const Q_x4y2= { ul: {x:-P4, y: P2, z: 0}, r: [ 0,-1, 1]} // arm back up hand back down
const Q_x4_y2={ ul: {x:-P4, y:-P2, z: 0}, r: [ 0, 1,-1]} // arm front down hand down
const Qx2y4 = { ul: {x: P2, y: P4, z: 0}, r: [ 1, 1, 0]} // arm left down hand front
const Qx2_y4= { ul: {x: P2, y:-P4, z: 0}, r: [ 1,-1, 0]} // arm left up hand front
const Q_x2y4= { ul: {x:-P2, y: P4, z: 0}, r: [ 1,-1, 0]} // arm left up hand back
const Q_x2_y4={ ul: {x:-P2, y:-P4, z: 0}, r: [ 1, 1, 0]} // arm left down hand back
// XZ * 4
const Qx4z2 = { ul: {x: P4, y: 0, z: P2}, r: [ 0, 1,-1]} // arm front down hand inner
const Qx4_z2= { ul: {x: P4, y: 0, z:-P2}, r: [ 0,-1, 1]} // arm back up hand inner/outer
const Q_x4z2= { ul: {x:-P4, y: 0, z: P2}, r: [ 0, 1, 1]} // arm back down hand ??
const Q_x4_z2={ ul: {x:-P4, y: 0, z:-P2}, r: [ 0,-1,-1]} // arm front up hand out
const Qx2z4 = { ul: {x: P2, y: 0, z: P4}, r: [ 1, 0,-1]} // arm left front hand front
const Qx2_z4= { ul: {x: P2, y: 0, z:-P4}, r: [ 1, 0, 1]} // arm left back hand front
const Q_x2z4= { ul: {x:-P2, y: 0, z: P4}, r: [ 1, 0, 1]} // arm left back hand bback
const Q_x2_z4={ ul: {x:-P2, y: 0, z:-P4}, r: [ 1, 0,-1]} // arm left front hand back


const testsets = [  Q0,
                    Qx2,Q_x2,Qy2,Q_y2,Qz2,Q_z2,
                    Qx2y2,Qx2_y2,Q_x2y2,Q_x2_y2,Qx2z2,Qx2_z2,Q_x2z2,Q_x2_z2,Qy2z2,Qy2_z2,Q_y2z2,Q_y2_z2,
                    Qx2y2z2,Qx2y2_z2,Qx2_y2z2,Qx2_y2_z2,Q_x2y2z2,Q_x2y2_z2,Q_x2_y2z2,Q_x2_y2_z2,
                    Qx4,Q_x4,Qy4,Q_y4,Qz4,Q_z4,
                    Qx4y2,Qx4_y2,Q_x4y2,Q_x4_y2,Qx4z2,Qx4_z2,Q_x4z2,Q_x4_z2,Qy4z2,Qy4_z2,Q_y4z2,Q_y4_z2,
                    Qx2y4,Qx2_y4,Q_x2y4,Q_x2_y4,Qx2z4,Qx2_z4,Q_x2z4,Q_x2_z4,Qy2z4,Qy2_z4,Q_y2z4,Q_y2_z4]

                    const PI = Math.PI;
const TWO_PI = Math.PI * 2;
/** Vector Math class. */
class Vector {
    constructor(a, b, c) {
        var _a, _b, _c, _d, _e, _f;
        if (Array.isArray(a)) {
            this.x = (_a = a[0]) !== null && _a !== void 0 ? _a : 0;
            this.y = (_b = a[1]) !== null && _b !== void 0 ? _b : 0;
            this.z = (_c = a[2]) !== null && _c !== void 0 ? _c : 0;
            return;
        }
        if (!!a && typeof a === "object") {
            this.x = (_d = a.x) !== null && _d !== void 0 ? _d : 0;
            this.y = (_e = a.y) !== null && _e !== void 0 ? _e : 0;
            this.z = (_f = a.z) !== null && _f !== void 0 ? _f : 0;
            return;
        }
        this.x = a !== null && a !== void 0 ? a : 0;
        this.y = b !== null && b !== void 0 ? b : 0;
        this.z = c !== null && c !== void 0 ? c : 0;
    }
    // Methods //
    /**
     * Returns the negative of this vector.
     */
    negative() {
        return new Vector(-this.x, -this.y, -this.z);
    }
    /**
     * Add a vector or number to this vector.
     * @param {Vector | number} a: Vector or number to add
     * @returns {Vector} New vector
     */
    add(v) {
        if (v instanceof Vector)
            return new Vector(this.x + v.x, this.y + v.y, this.z + v.z);
        else
            return new Vector(this.x + v, this.y + v, this.z + v);
    }
    /**
     * Substracts a vector or number from this vector.
     * @param {Vector | number} a: Vector or number to subtract
     * @returns {Vector} New vector
     */
    subtract(v) {
        if (v instanceof Vector)
            return new Vector(this.x - v.x, this.y - v.y, this.z - v.z);
        else
            return new Vector(this.x - v, this.y - v, this.z - v);
    }
    /**
     * Multiplies a vector or a number to a vector.
     * @param {Vector | number} a: Vector or number to multiply
     * @param {Vector} b: Vector to multiply
     */
    multiply(v) {
        if (v instanceof Vector)
            return new Vector(this.x * v.x, this.y * v.y, this.z * v.z);
        else
            return new Vector(this.x * v, this.y * v, this.z * v);
    }
    /**
     * Divide this vector by a vector or a number.
     * @param {Vector | number} a: Vector or number to divide
     * @returns {Vector} New vector
     */
    divide(v) {
        if (v instanceof Vector)
            return new Vector(this.x / v.x, this.y / v.y, this.z / v.z);
        else
            return new Vector(this.x / v, this.y / v, this.z / v);
    }
    /**
     * Check if the given vector is equal to this vector.
     * @param {Vector} v: Vector to compare
     * @returns {boolean} True if equal
     */
    equals(v) {
        return this.x == v.x && this.y == v.y && this.z == v.z;
    }
    /**
     * Returns the dot product of this vector and another vector.
     * @param {Vector} v: Vector to dot
     * @returns {number} Dot product
     */
    dot(v) {
        return this.x * v.x + this.y * v.y + this.z * v.z;
    }
    /**
     * Cross product of two vectors.
     * @param {Vector} a: Vector to cross
     * @param {Vector} b: Vector to cross
     */
    cross(v) {
        return new Vector(this.y * v.z - this.z * v.y, this.z * v.x - this.x * v.z, this.x * v.y - this.y * v.x);
    }
    /**
     * Get the length of the Vector
     * @returns {number} Length
     */
    length() {
        return Math.sqrt(this.dot(this));
    }
    /**
     * Find the distance between this and another vector.
     * @param {Vector} v: Vector to find distance to
     * @param {2 | 3} d: 2D or 3D distance
     * @returns {number} Distance
     */
    distance(v, d = 3) {
        //2D distance
        if (d === 2)
            return Math.sqrt(Math.pow(this.x - v.x, 2) + Math.pow(this.y - v.y, 2));
        //3D distance
        else
            return Math.sqrt(Math.pow(this.x - v.x, 2) + Math.pow(this.y - v.y, 2) + Math.pow(this.z - v.z, 2));
    }
    /**
     * Lerp between this vector and another vector.
     * @param {Vector} v: Vector to lerp to
     * @param {number} fraction: Fraction to lerp
     * @returns {Vector}
     */
    lerp(v, fraction) {
        return v.subtract(this).multiply(fraction).add(this);
    }
    /**
     * Returns the unit vector of this vector.
     * @returns {Vector} Unit vector
     */
    unit() {
        return this.divide(this.length());
    }
    min() {
        return Math.min(Math.min(this.x, this.y), this.z);
    }
    max() {
        return Math.max(Math.max(this.x, this.y), this.z);
    }
    /**
     * To Angles
     * @param {AxisMap} [axisMap = {x: "x", y: "y", z: "z"}]
     * @returns {{ theta: number, phi: number }}
     */
    toSphericalCoords(axisMap = { x: "x", y: "y", z: "z" }) {
        return {
            theta: Math.atan2(this[axisMap.y], this[axisMap.x]),
            phi: Math.acos(this[axisMap.z] / this.length()),
        };
    }
    /**
     * Returns the angle between this vector and vector a in radians.
     * @param {Vector} a: Vector
     * @returns {number}
     */
    angleTo(a) {
        return Math.acos(this.dot(a) / (this.length() * a.length()));
    }
    /**
     * Array representation of the vector.
     * @param {number} n: Array length
     * @returns {number[]} Array
     * @example
     * new Vector(1, 2, 3).toArray(); // [1, 2, 3]
     */
    toArray(n) {
        return [this.x, this.y, this.z].slice(0, n || 3);
    }
    /**
     * Clone the vector.
     * @returns {Vector} New vector
     */
    clone() {
        return new Vector(this.x, this.y, this.z);
    }
    /**
     * Init this Vector with explicit values
     * @param {number} x: X value
     * @param {number} y: Y value
     * @param {number} z: Z value
     */
    init(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
        return this;
    }
    // static methods //
    static negative(a, b = new Vector()) {
        b.x = -a.x;
        b.y = -a.y;
        b.z = -a.z;
        return b;
    }
    static add(a, b, c = new Vector()) {
        if (b instanceof Vector) {
            c.x = a.x + b.x;
            c.y = a.y + b.y;
            c.z = a.z + b.z;
        }
        else {
            c.x = a.x + b;
            c.y = a.y + b;
            c.z = a.z + b;
        }
        return c;
    }
    static subtract(a, b, c = new Vector()) {
        if (b instanceof Vector) {
            c.x = a.x - b.x;
            c.y = a.y - b.y;
            c.z = a.z - b.z;
        }
        else {
            c.x = a.x - b;
            c.y = a.y - b;
            c.z = a.z - b;
        }
        return c;
    }
    static multiply(a, b, c = new Vector()) {
        if (b instanceof Vector) {
            c.x = a.x * b.x;
            c.y = a.y * b.y;
            c.z = a.z * b.z;
        }
        else {
            c.x = a.x * b;
            c.y = a.y * b;
            c.z = a.z * b;
        }
        return c;
    }
    static divide(a, b, c = new Vector()) {
        if (b instanceof Vector) {
            c.x = a.x / b.x;
            c.y = a.y / b.y;
            c.z = a.z / b.z;
        }
        else {
            c.x = a.x / b;
            c.y = a.y / b;
            c.z = a.z / b;
        }
        return c;
    }
    static cross(a, b, c = new Vector()) {
        c.x = a.y * b.z - a.z * b.y;
        c.y = a.z * b.x - a.x * b.z;
        c.z = a.x * b.y - a.y * b.x;
        return c;
    }
    static unit(a, b) {
        const length = a.length();
        b.x = a.x / length;
        b.y = a.y / length;
        b.z = a.z / length;
        return b;
    }
    /**
     * Create new vector from angles
     * @param {number} theta: Theta angle
     * @param {number} phi: Phi angle
     * @returns {Vector} New vector
     */
    static fromAngles(theta, phi) {
        return new Vector(Math.cos(theta) * Math.cos(phi), Math.sin(phi), Math.sin(theta) * Math.cos(phi));
    }
    static randomDirection() {
        return Vector.fromAngles(Math.random() * TWO_PI, Math.asin(Math.random() * 2 - 1));
    }
    static min(a, b) {
        return new Vector(Math.min(a.x, b.x), Math.min(a.y, b.y), Math.min(a.z, b.z));
    }
    static max(a, b) {
        return new Vector(Math.max(a.x, b.x), Math.max(a.y, b.y), Math.max(a.z, b.z));
    }
    /**
     * Lerp between two vectors
     * @param {Vector} a: Vector a
     * @param {Vector} b: Vector b
     * @param {number} fraction: Fraction
     */
    static lerp(a, b, fraction) {
        if (b instanceof Vector) {
            return b.subtract(a).multiply(fraction).add(a);
        }
        else {
            return ((b - a) * fraction + a);
        }
    }
    /**
     * Create a new vector from an Array
     * @param {number[]} array: Array
     * @returns {Vector} New vector
     */
    static fromArray(a) {
        if (Array.isArray(a)) {
            return new Vector(a[0], a[1], a[2]);
        }
        return new Vector(a.x, a.y, a.z);
    }
    /**
     * Angle between two vectors
     * @param {Vector} a: Vector a
     * @param {Vector} b: Vector b
     * @returns
     */
    static angleBetween(a, b) {
        return a.angleTo(b);
    }
    static distance(a, b, d) {
        if (d === 2)
            return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
        else
            return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2) + Math.pow(a.z - b.z, 2));
    }
    static toDegrees(a) {
        return a * (180 / PI);
    }
    static normalizeAngle(radians) {
        let angle = radians % TWO_PI;
        angle = angle > PI ? angle - TWO_PI : angle < -PI ? TWO_PI + angle : angle;
        //returns normalized values to -1,1
        return angle / PI;
    }
    static normalizeRadians(radians) {
        if (radians >= PI / 2) {
            radians -= TWO_PI;
        }
        if (radians <= -PI / 2) {
            radians += TWO_PI;
            radians = PI - radians;
        }
        //returns normalized values to -1,1
        return radians / PI;
    }
    static find2DAngle(cx, cy, ex, ey) {
        const dy = ey - cy;
        const dx = ex - cx;
        const theta = Math.atan2(dy, dx);
        return theta;
    }
    /**
     * Find 3D rotation between two vectors
     * @param {Vector} a: First vector
     * @param {Vector} b: Second vector
     * @param {boolean} normalize: Normalize the result
     */
    static findRotation(a, b, normalize = true) {
        if (normalize) {
            return new Vector(Vector.normalizeRadians(Vector.find2DAngle(a.z, a.x, b.z, b.x)), 
                              Vector.normalizeRadians(Vector.find2DAngle(a.z, a.y, b.z, b.y)), 
                              Vector.normalizeRadians(Vector.find2DAngle(a.x, a.y, b.x, b.y)));
        }
        else {
            return new Vector(Vector.find2DAngle(a.z, a.x, b.z, b.x), Vector.find2DAngle(a.z, a.y, b.z, b.y), Vector.find2DAngle(a.x, a.y, b.x, b.y));
        }
    }
    /**
     * Find roll pitch yaw of plane formed by 3 points
     * @param {Vector} a: Vector
     * @param {Vector} b: Vector
     * @param {Vector} c: Vector
     */
    static rollPitchYaw(a, b, c) {
        if (!c) {
            return new Vector(Vector.normalizeAngle(Vector.find2DAngle(a.z, a.y, b.z, b.y)), 
                              Vector.normalizeAngle(Vector.find2DAngle(a.z, a.x, b.z, b.x)), 
                              Vector.normalizeAngle(Vector.find2DAngle(a.x, a.y, b.x, b.y)));
        }
        const qb = b.subtract(a);
        const qc = c.subtract(a);
        const n = qb.cross(qc);
        const unitZ = n.unit();
        const unitX = qb.unit();
        const unitY = unitZ.cross(unitX);
        const beta  = Math.asin(unitZ.x) || 0;
        const alpha = Math.atan2(-unitZ.y, unitZ.z) || 0;
        const gamma = Math.atan2(-unitY.x, unitX.x) || 0;
        return new Vector((alpha), 
                          (beta), 
                          (gamma));
    }
    /**
     * Find angle between 3D Coordinates
     * @param {Vector | number} a: Vector or Number
     * @param {Vector | number} b: Vector or Number
     * @param {Vector | number} c: Vector or Number
     */
    static angleBetween3DCoords(a, b, c) {
        if (!(a instanceof Vector)) {
            a = new Vector(a);
            b = new Vector(b);
            c = new Vector(c);
        }
        // Calculate vector between points 1 and 2
        const v1 = a.subtract(b);
        // Calculate vector between points 2 and 3
        const v2 = c.subtract(b);
        // The dot product of vectors v1 & v2 is a function of the cosine of the
        // angle between them (it's scaled by the product of their magnitudes).
        const v1norm = v1.unit();
        const v2norm = v2.unit();
        // Calculate the dot products of vectors v1 and v2
        const dotProducts = v1norm.dot(v2norm);
        // Extract the angle from the dot products
        const angle = Math.acos(dotProducts);
        // return single angle Normalized to 1
        return Vector.normalizeRadians(angle);
    }
    /**
     * Get normalized, spherical coordinates for the vector bc, relative to vector ab
     * @param {Vector | number} a: Vector or Number
     * @param {Vector | number} b: Vector or Number
     * @param {Vector | number} c: Vector or Number
     * @param {AxisMap} axisMap: Mapped axis to get the right spherical coords
     */
    static getRelativeSphericalCoords(a, b, c, axisMap) {
        if (!(a instanceof Vector)) {
            a = new Vector(a);
            b = new Vector(b);
            c = new Vector(c);
        }
        // Calculate vector between points 1 and 2
        const v1 = b.subtract(a);
        // Calculate vector between points 2 and 3
        const v2 = c.subtract(b);
        const v1norm = v1.unit();
        const v2norm = v2.unit();
        const { theta: theta1, phi: phi1 } = v1norm.toSphericalCoords(axisMap);
        const { theta: theta2, phi: phi2 } = v2norm.toSphericalCoords(axisMap);
        const theta = theta1 - theta2;
        const phi = phi1 - phi2;
        return {
            theta: Vector.normalizeAngle(theta),
            phi: Vector.normalizeAngle(phi),
        };
    }
    /**
     * Get normalized, spherical coordinates for the vector bc
     * @param {Vector | number} a: Vector or Number
     * @param {Vector | number} b: Vector or Number
     * @param {AxisMap} axisMap: Mapped axis to get the right spherical coords
     */
    static getSphericalCoords(a, b, axisMap = { x: "x", y: "y", z: "z" }) {
        if (!(a instanceof Vector)) {
            a = new Vector(a);
            b = new Vector(b);
        }
        // Calculate vector between points 1 and 2
        const v1 = b.subtract(a);
        const v1norm = v1.unit();
        const { theta, phi } = v1norm.toSphericalCoords(axisMap);
        return {
            theta: Vector.normalizeAngle(-theta),
            phi: Vector.normalizeAngle(PI / 2 - phi),
        };
    }
}

function normalizeAngle(radians) {
    let angle = radians % TWO_PI;
    angle = angle > PI ? angle - TWO_PI : angle < -PI ? TWO_PI + angle : angle;
    //returns normalized values to -1,1
    return angle / PI;
}

function find2DAngle(cx,cy,ex,ey) {
    const dy = ey - cy; //-1
    const dx = ex - cx; //-1
    const _dx = (dx>0)?dx:-dx;
    const _dy = (dy>0)?dy:-dy;
    var theta = Math.atan2(_dy, _dx);
    if (dx<0) theta= Math.PI -theta;
    if (dy<0) theta=-theta;
    //if(debug) console.log("["+dx+","+dy+"]["+_dx+","+_dy+"]")
    //return parseInt(theta*180/Math.PI);
    return theta;
}

const myfind2DAngle = find2DAngle; //oldfind2DAngle;
//const myfind2DAngle = (cx, cy, ex, ey) => find2DAngle(ex-cx,ey-cy);

function oldfind2DAngle(cx, cy, ex, ey) {
    const dy = ey - cy; //-1
    const dx = ex - cx; //-1

    var theta = Math.atan2(dy, dx);
    
    return theta;
}

function A(rad) { return parseInt(rad*180/Math.PI) };
function AA(ang) { 
    return {x: parseInt(ang.x*180/Math.PI),
            y: parseInt(ang.y*180/Math.PI),
            z: parseInt(ang.z*180/Math.PI)}
};

const findRotationL = newfindRotationL;
const findRotationR = newfindRotationR;

function oldfindRotationL(a, b) {
    var x = -myfind2DAngle( a.y, a.z, b.y, b.z);
    var y =  myfind2DAngle( a.x, a.z, b.x, b.z);
    var z =  myfind2DAngle( a.x, a.y, b.x, b.y);

    return {x:x, y:y, z:z};
}
function oldfindRotationR(a, b) {
    var x = -myfind2DAngle( a.y, a.z, b.y, b.z);
    var y = -myfind2DAngle(-a.x, a.z,-b.x, b.z);
    var z = -myfind2DAngle(-a.x, a.y,-b.x, b.y);

    return {x:x, y:y, z:z};
}
//  https://zh.wikipedia.org/wiki/%E6%97%8B%E8%BD%AC%E7%9F%A9%E9%98%B5
function mulM(a,b) {
    var sum = 0;
    for (let i=0; i < a.length; i++) {
        sum += a[i] * b[i];
    }
    return sum;
}
function dotM(a,b) {
    var r = new Array(3);
    
    for (let i=0; i < 3; i++) {
        r[i] = mulM(a[i],b)
    }

    return r;
}
function dot(a,b) {
    var r = new Array(3);
    
    for (let i=0; i < 3; i++) {
        r[i] = a[i]*b[i]
    }

    return r;
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

function vrm2Norm(ang) {
    var newA = Object.assign({},ang);
    newA.y += Math.PI / 2
    if (newA.y > Math.PI) {
        newA.y -= 2 * Math.PI; 
    }
    return ang;
}

const u = [1, 0, 0];
function MM(ang,r,order=["z","y","x"]) {
    const debugme = true;
    var vct = Object.assign({},r); 
    const mat = {x: M(ang,"x"),y:M(ang,"y"),z: M(ang,"z")}
    if (debugme) console.log("---------")
    if (debugme) console.log("angle",AA(ang));
    if (debugme) console.log("vector",r);
    if (debugme) console.log("order",order);
    if (debugme) console.log("matrix",mat);
    for (let i=0;i<3;i++) {
        vct = dotM(mat[order[i]],vct)
    }
    if (debugme) console.log("result",vct)

    return (vct); 
}
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
function RotateMatrix(ang,r,order=["z","y","x"]) {
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

function norm(a) {
    var r = new Array(3);
    var t = 0.0001

    for (let i=0; i < 3; i++) {
        r[i] = (a[i] > t)? 1: (a[i] < -t)? -1: 0
    }
    return r;
}
const o  = {x: 0,y: 0, z:0};

const AP= (a) => norm(MM(a));
const L = (a) => findRotationL(o, a);
const R = (a) => findRotationR(o, a);

const d = [
    {x: 0,y: 0, z: 0}, // 1, 0, 0 =>   0,  0,  0
    {x: 0,y: 0, z: 1}, // 0, 0, 1 =>  90,  0,  0
    {x: 0,y: 1, z: 0}, // 0, 1, 0 =>   0,  0, 90
    {x: 0,y: 1, z: 1}, // 0, 1, 1 =>  45,  0, 90
    {x: 1,y: 0, z: 0}, // 0, 0, 0 =>   0,  0,  0
    {x: 1,y: 0, z: 1}, // 0, 0, 1 =>  90,  0,  0
    {x: 1,y: 1, z: 0}, // 0, 1, 0 =>   0,  0, 90
    {x: 1,y: 1, z: 1}, // 0, 1, 1 =>  45,  0, 90
    {x: 0,y: 0, z: 0}, // 1, 0, 0 =>   0,  0,  0
    {x: 0,y: 0, z:-1}, // 0, 0, 1 =>  90,  0,  0
    {x: 0,y:-1, z: 0}, // 0, 1, 0 =>   0,  0, 90
    {x: 0,y:-1, z:-1}, // 0, 1, 1 =>  45,  0, 90
    {x: 1,y: 0, z: 0}, // 0, 0, 0 =>   0,  0,  0
    {x: 1,y: 0, z:-1}, // 0, 0, 1 =>  90,  0,  0
    {x: 1,y:-1, z: 0}, // 0, 1, 0 =>   0,  0, 90
    {x: 1,y:-1, z:-1}, // 0, 1, 1 =>  45,  0, 90
]

function newfindRotationR(a, b) {
    var x =  myfind2DAngle( a.y, a.z, b.y, b.z);
    var y = -myfind2DAngle(-a.x, a.z,-b.x, b.z);
    var z = -myfind2DAngle(-a.x, a.y,-b.x, b.y);

    return {x:x, y:y, z:z};
}

function newfindRotationL(a, b) {
    var x =  myfind2DAngle( a.z, a.y, b.z, b.y);
    var y =  myfind2DAngle( a.x, a.z, b.x, b.z);
    var z =  myfind2DAngle(-a.x, a.y,-b.x, b.y);

    return {x:x, y:y, z:z};
}

function verifyMatrix() {
    const wl =[ {x: Math.PI/2, y: 0, z: 0}, // { 0,-1, 1}
                {x:-Math.PI/2, y: 0, z: 0}, // { 0,-1, 1}
                {x: 0, y: Math.PI/2, z: 0}, // { 0,-1, 1}
                {x: 0, y:-Math.PI/2, z: 0}, // { 0,-1, 1}
                {x: 0, y: 0, z: Math.PI/2}, // { 0,-1, 1}
                {x: 0, y: 0, z:-Math.PI/2}, // { 0,-1, 1}
                {x: Math.PI/4, y: 0, z: 0}, // { 0,-1, 1}
                {x:-Math.PI/4, y: 0, z: 0}, // { 0,-1, 1}
                {x: 0, y: Math.PI/4, z: 0}, // { 0,-1, 1}
                {x: 0, y:-Math.PI/4, z: 0}, // { 0,-1, 1}
                {x: 0, y: 0, z: Math.PI/4}, // { 0,-1, 1}
                {x: 0, y: 0, z:-Math.PI/4}, // { 0,-1, 1}
                {x: 0, y: Math.PI/4, z: Math.PI/2}, // {MM() 0, 1,-1}
                {x: 0, y: Math.PI/4, z:-Math.PI/2}, // { 0,-1, 1}
                {x: 0, y:-Math.PI/4, z: Math.PI/2}, // { 0,-1, 1}
                {x: 0, y:-Math.PI/4, z:-Math.PI/2}, // { 0,-1, 1}
                {x: 0, y: Math.PI/2, z: Math.PI/4}, // {MM() 0, 1,-1}
                {x: 0, y: Math.PI/2, z:-Math.PI/4}, // { 0,-1, 1}
                {x: 0, y:-Math.PI/2, z: Math.PI/4}, // { 0,-1, 1}
                {x: 0, y:-Math.PI/2, z:-Math.PI/4}, // { 0,-1, 1}
                {x: Math.PI/4, y: 0, z: Math.PI/2}, // {MM() 0, 1,-1}
                {x: Math.PI/4, y: 0, z:-Math.PI/2}, // { 0,-1, 1}
                {x:-Math.PI/4, y: 0, z: Math.PI/2}, // { 0,-1, 1}
                {x:-Math.PI/4, y: 0, z:-Math.PI/2}, // { 0,-1, 1}
                {x: Math.PI/2, y: 0, z: Math.PI/4}, // {MM() 0, 1,-1}
                {x: Math.PI/2, y: 0, z:-Math.PI/4}, // { 0,-1, 1}
                {x:-Math.PI/2, y: 0, z: Math.PI/4}, // { 0,-1, 1}
                {x:-Math.PI/2, y: 0, z:-Math.PI/4}, // { 0,-1, 1}
                {x: Math.PI/4, y: Math.PI/2, z: 0}, // { 0, 1, 1}
                {x: Math.PI/4, y:-Math.PI/2, z: 0}, // { 0,-1,-1}
                {x:-Math.PI/4, y: Math.PI/2, z: 0}, // { 0,-1, 1}
                {x:-Math.PI/4, y:-Math.PI/2, z: 0}, // { 0,-1, 1}
                {x: Math.PI/2, y: Math.PI/4, z: 0}, // { 0, 1, 1}
                {x: Math.PI/2, y:-Math.PI/4, z: 0}, // { 0,-1,-1}
                {x:-Math.PI/2, y: Math.PI/4, z: 0}, // { 0,-1, 1}
                {x:-Math.PI/2, y:-Math.PI/4, z: 0}] // { 0,-1, 1}

    const od = ["x","y","z"]
    /*
    for(let i=0;i<wl.length;i++) {
        console.log(u,AA(wl[i]),MM(wl[i]))
    }
    */
    const A2R   = (x) => x * Math.PI/180;
    const v0     = [ 1,0, 0];
    const v1     = [ 1,0,-1];
    const v2     = [-1,0,-1];
    const v3     = [ 1,25,5];
    const v5     = [ 3,22,-9];
    const ang   = {x:0,y:-Math.PI/4,z:0}
    const rng   = {x:0,y: Math.PI/4,z:0}
    //const xxx   = {x:0,y:-A2R(78),z:-A2R(87)}
    const xxx   = {x:-A2R(78),y:-A2R(90),z:-A2R(0)}
    //console.log(v0,AA(ang),MM(ang,v0))
    //console.log(v1,AA(rng),MM(ang,v1))
    //console.log(v2,AA(rng),MM(ang,v2))
    console.log(v3,AA(xxx),MM(xxx,v3))
    console.log(v5,AA(xxx),MM(xxx,v5))
    const q3 = qRotate({x:1,y:0,z:0},{x:v3[0],y:v3[1],z:v3[2]})
    console.log("q3",AA(q3))
    const r3 = MM(xxx,v3);
    const y3 = qRotate({x:1,y:0,z:0},{x:r3[0],y:r3[1],z:r3[2]})
    const r5 = MM(xxx,v5);
    const y5 = qRotate({x:1,y:0,z:0},{x:r5[0],y:r5[1],z:r5[2]})
    console.log("y3",AA(y3),"y5",AA(y5));
}
//verifyMatrix();
function verifyConversion() {
    for (let i=0; i < d.length; i++) {
        const l = L(d[i]);
        const r = R(d[i]);
        console.log("" + i + " p:", d[i], "r:", AA(r), "l:", AA(l), AP(l))      
    }
}
//verifyConversion()

function verifyTestset() {
    const data = testsets;
    const od = ["x","y","z"]
    const match = (cal,ans) => (cal.x == ans.x && cal.y == ans.y && cal.z == ans.z)

    for (let i=0;i < data.length; i++) {
        const que = data[i].ul;
        const cal = AP(que,od);
        const ans = data[i].r;
        const res = match(cal,ans)? "V":"_"
        console.log(AA(que),cal,ans,res);
    }
}

function expandO(ol) {
    const logme = false;
    var ret = new Array();
    var item = ol.pop();
    
    if(logme) console.log(item)
    for (let i=0;i< item.d.length;i++) {
        var more = new Array();
        
        if (ol.length >0) {
            const cl = ol.map((x) => x);
            more = expandO(cl);
            if(logme) console.log(more)

            for (let j =0;j< more.length;j++) {
                var newO = {}

                newO[item.n] = item.d[i];
                if(logme) console.log("assign", newO, more[j])
                newO = Object.assign(newO, more[j]);
                
                ret.push(newO);
            }
        } else {
            var newO = {}

            newO[item.n] = item.d[i];
            if(logme) console.log("put one", newO)
            
            ret.push(newO);
        }
    }
    if(logme) console.log("--------")
    if(logme) console.log(ret)
    return ret;
}

const opt=[ {n:"Sx", d:[1,-1]},
            {n:"Sy", d:[1,-1]},
            {n:"Sz", d:[1,-1]},
            {n:"Xyz",d:[true,false]},
            {n:"Yxz",d:[true,false]},
            {n:"Zxy",d:[true,false]},
            {n:"SXy",d:[1,-1]},
            {n:"SXz",d:[1,-1]},
            {n:"SYx",d:[1,-1]},
            {n:"SYz",d:[1,-1]},
            {n:"SZx",d:[1,-1]},
            {n:"SZy",d:[1,-1]}]

const fAngle = find2DAngle; //myfind2DAngle;
function fRotate(a, b, o={Sx:1,Sy:1,Sz:1,Xyz:true,Yxz:true,Zxy:true,SXy:1,SXz:1,SYx:1,SYz:1,SZx:1,SZy:1}) {
    var AXy = (o.Xyz) ? o.SXy * a.y: o.SXz * a.z;
    var AXz = (o.Xyz) ? o.SXz * a.z: o.SXy * a.y;
    var AYx = (o.Yxz) ? o.SYx * a.x: o.SYz * a.z;
    var AYz = (o.Yxz) ? o.SYz * a.z: o.SYx * a.x;
    var AZx = (o.Zxy) ? o.SZx * a.x: o.SZy * a.y;
    var AZy = (o.Zxy) ? o.SZy * a.y: o.SZx * a.x;
    var BXy = (o.Xyz) ? o.SXy * b.y: o.SXz * b.z;
    var BXz = (o.Xyz) ? o.SXz * b.z: o.SXy * b.y;
    var BYx = (o.Yxz) ? o.SYx * b.x: o.SYz * b.z;
    var BYz = (o.Yxz) ? o.SYz * b.z: o.SYx * b.x;
    var BZx = (o.Zxy) ? o.SZx * b.x: o.SZy * b.y;
    var BZy = (o.Zxy) ? o.SZy * b.y: o.SZx * b.x;
    var x   = o.Sx * fAngle( AXy, AXz, BXy, BXz);
    var y   = o.Sy * fAngle( AYx, AYz, BYx, BYz);
    var z   = o.Sz * fAngle( AZx, AZy, BZx, BZy);

    return {x:x, y:y, z:z};
}
         
function get2DAngle(cx, cy, ex, ey) {
    const dy = ey - cy;
    const dx = ex - cx;
    const theta = Math.atan2(dy, dx);
    return theta;
}

var r = expandO(opt);
//fRotate(a,b,r[0]);
//verifyTestset();


const optD = {  SZy:1,SZx:1,SYz:1,SYx:1,SXz:1,SXy:1,
                Zxy:true,Yxz:true,Xyz:true,Sz:1,Sy:1,Sx:1}
//const myRotate = (a, b) => fRotate(a,b,r[0]);
//applyOpt(myRotate,true);

function applyOpt(opt,logme = false) {
    const data  = testsets;
    const od    = ["x","y","z"]
    const mV    = (a,b) => ((a.x == b.x) && (a.y == b.y) && (a.z == b.z))
    const mA    = (a,b) => ((a[0] == b[0]) && (a[1] == b[1]) && (a[2] == b[2]))
    var  count = 0;
    var  cR = 0;
    var  cA = 0;

    for (let i=0;i < data.length; i++) {
        const que = data[i].ul;
        const ans = data[i].r;
        const from= {x:0, y:0, z:0};
        const to  = {x:ans[0], y:ans[1], z:ans[2]}
        const ang = fRotate(from,to,opt);
        const res1= mV(AA(que),AA(ang))? "V":"_"
        const cal = AP(ang,od);
        const res2= mA(ans,cal)? "V":"_"

        count ++;
        if (res1 == "V") cA ++;
        if (res2 == "V") cR ++;
        if (logme) console.log("a:",AA(que),"r:",AA(ang),res1,"a:",ans,"r:",cal,res2);
    }
    return {t: count, a: cA, r: cR};
}

function findByRPY(from, to) {
    const ref = {x:-1, y:0, z:0};
    const a = new Vector(ref.x, ref.y, ref.z);
    const b = new Vector(from.x, from.y, from.z);
    const c = new Vector(to.x, to.y, to.z);

    return Vector.rollPitchYaw(a,b,c);
}
function applyRPY(logme = false) {
    const data  = testsets;
    const od    = ["x","y","z"]
    const mV    = (a,b) => ((a.x == b.x) && (a.y == b.y) && (a.z == b.z))
    const mA    = (a,b) => ((a[0] == b[0]) && (a[1] == b[1]) && (a[2] == b[2]))
    var  count = 0;
    var  cR = 0;
    var  cA = 0;

    for (let i=0;i < data.length; i++) {
        const que = data[i].ul;
        const ans = data[i].r;
        const from= {x:0, y:0, z:0};
        const to  = {x:ans[0], y:ans[1], z:ans[2]}
        const ang = qRotate(from,to);    ; //findByRPY(from,to);
        const res1= mV(AA(que),AA(ang))? "V":"_"
        const cal = AP(ang,od);
        const res2= mA(ans,cal)? "V":"_"

        count ++;
        if (res1 == "V") cA ++;
        if (res2 == "V") cR ++;
        if (logme) console.log("a:",AA(que),"r:",AA(ang),res1,"a:",ans,"r:",cal,res2);
    }
    return {t: count, a: cA, r: cR};
}
/*
const a = {x:0,y:0,z:0}
const b = {x:1,y:0,z:0}
const c = {x:1,y:1,z:0}
const aV = new Vector(a.x,a.y,a.z)
const bV = new Vector(b.x,b.y,b.z)
const cV = new Vector(c.x,c.y,c.z)
const ang = Vector.rollPitchYaw(aV,bV,cV)
console.log(AA(ang))
*/
//applyRPY(true);
//const a11 = {x:   1, y:  0, z:  0};
//const a13 = {x:   2, y: 24, z:  5};
//const a15 = {x:   3, y: 46, z: -3};
//const d15 = {x: a15.x-a13.x,y:a15.y-a13.y,z:a15.z-a15.z}
//const a11 = {x: 1, y: 0, z: 0};
//const a13 = {x: 2, y: 0, z:-1};  //                   o  o
//const a15 = {x: 1, y: 0, z:-2};  //                    oo
//const r13 = qRotate(a11,a13)
//const r15 = qRotate(a13,a15)
//const d15 = {x: r15.x-r13.x,y:r15.y-r13.y,z:r15.z-r13.z}
//console.log("r13",AA(r13)) 
//console.log("r15",AA(r15)) 
//console.log("d15",AA(d15)) 
const f45 = {x:0,y: Math.PI/4, z: 0};
const r45 = {x:0,y:-Math.PI/4, z: 0};
const fl  = (a) => {return (a < 0.1) ? 0: a;}
const cA  = (a) => {return [fl(a.x), fl(a.y), fl(a.z)]};
const cV  = (a) => { return {x:a[0], y:a[1], z:a[2]};}
//const w11 = MM(f45,cV(a13))
//console.log("w11",w11);
//const r11 = MM(r45,w11)
//console.log("r11",r11);
//const w13 = MM(f45,cV(d15))
//console.log("w13",w13);
//const r13 = MM(r45,w13)
//console.log("r13",r13);
//const a11 = {x:   1, y:  0, z:  0};
//const a13 = {x:   2, y: 24, z:  5};
//const a15 = {x:   3, y: 46, z: -3};
const a11 = {x:   0, y:  0, z:  0};
const a13 = {x:   1, y:  1, z:  0};
const a15 = {x:   1, y:  1, z:  Math.sqrt(2)};
const a12 = {x:   1, y:  1, z:  0};
const ang = qRotate(a11,a13)
const rng = {x:-ang.x,y:-ang.y,z:-ang.z}
//console.log("11/13 angle",AA(ang),"reverse",AA(rng));
const r13 = MM(rng,cA(a13))
//console.log("a13",a13,"projected",r13);
const r15 = MM(rng,cA(a15))
//console.log("a15",a15,"projected",r15);
const ang2 = qRotate(a11,cV(r15))
//console.log("13/15 angle",AA(ang2));
//console.log(r15[1] * 1000, r15[1] < 0.0001)
//applyOpt(optD,true);

/*
for (let i=0;i<r.length;i++) {
    const ret = applyOpt(r[i])
    if (ret.r > 21) console.log(i,ret,r[i]);
}
*/
//verifyTestset2();
//console.log(r);

//verifyTestset();
//verifyMatrix();
//verifyConversion();

//ul: {x: Math.PI/4, y: 0, z:+Math.PI/2}, => { 0, 1,-1}
//ul: {x: Math.PI/4, y: 0, z:-Math.PI/2}, => { 0,-1, 1}
//ul: {x:-Math.PI/4, y: 0, z:+Math.PI/2}, => { 0, 1, 1}
//ul: {x:-Math.PI/4, y: 0, z:-Math.PI/2}, => { 0,-1,-1}
//ul: {x:-Math.PI/4, y:+Math.PI/2, z: 0}, => { 0,-1, 1}

/*
a12 {x: -13, y: -43, z: -12} a11 {x: 17, y: -43, z: -7}
a14 {x: -19, y: -21, z: -8} a13 {x: 24, y: -21, z: 2}
a16 {x: -33, y: -6, z: -14} a15 {x: 40, y: -5, z: -7}
a11: P (x:30 y:0 z:5) A (x:0/0 y:0.18152299692348006/10 z:-0.010637613758205046/0)
a13: P (x:6 y:21 z:8) A (x:0/0 y:0.9097019219634052/52 z:1.2693441507220762/72)
a12: P (x:-30 y:0 z:-5) A (x:0/0 y:0.18152299692348006/10 z:-0.010637613758205046/0)
a14: P (x:-6 y:22 z:4) A (x:0/0 y:-0.5780335522638413/-33 z:-1.3001850611452288/-74)
UL {x: 0, y: 52.12208074344249, z: 72.72806258599282}
UR {x: 0, y: -33.118882961672796, z: -74.49511658958049}
a13 {x: 6, y: 21, z: 8} t {x: 20, y: 9, z: 10} a {x: 0, y: 28.13523405701682, z: 24.374683412211535}
a15 {x: 15, y: 16, z: -10} t {x: 20, y: -12, z: 6} a {x: 0, y: 18.46123449630414, z: -28.8572429505819}
a16 {x: -15, y: 14, z: -6} t {x: -19, y: -11, z: 3} a {x: 0, y: -9.571653506886044, z: 30.099561911584725}
LL A( x:0/0 y:0.3222093259432642/18 z:-0.5036539025355774/-28)
LR A( x:0/0 y:-0.1670568685552232/-9 z:0.5253364587650318/30)
*/
const A2R   = (x) => x * Math.PI/180;
function checkIssues() {
    const a11   = [ 17,-43, -7];
    const a13   = [ 24,-21,  2];
    const a15   = [ 40, -5, -7];
    const d13   = [a13[0]-a11[0],a13[1]-a11[1],a13[2]-a11[2]]
    const d15   = [a15[0]-a13[0],a15[1]-a13[1],a15[2]-a13[2]]
    const ang13 = {x:0,y:A2R(52),z:A2R(72)}
    const rm13  = RotateMatrix(ang13)
    const im13  = math.inv(rm13)
    const ng13  = qRotate({x:a11[0],y:a11[1],z:a11[2]},{x:a13[0],y:a13[1],z:a13[2]},true)
    const rm13_ = RotateMatrix(ng13)
    const im13_ = math.inv(rm13_)
    const t13   = dotM( im13,d13);
    const t15   = dotM( im13,d15);
    const t13_  = dotM(im13_,d13);
    const t15_  = dotM(im13_,d15);
    
    console.log("------")
    console.log("ang13",ang13,"q3",AA(ng13))
    console.log("d13",d13,"ang13",AA(ang13), "t13",t13)
    console.log("d15",d15,"ang13",AA(ang13), "t15",t15)
    console.log("d13",d13, "ng13",AA(ng13), "t13_",t13_)
    console.log("d15",d15, "ng13",AA(ng13), "t15_",t15_)
    
    const u11   = [  0,  0,  0];
    const u13   = [  1,  1,  1];
    const q13   = [u13[0]-u11[0],u13[1]-u11[1],u13[2]-u11[2]]
    //const ung13 = qRotate({x:u11[0],y:u11[1],z:u11[2]},{x:u13[0],y:u13[1],z:u13[2]},true)
    //const ung13 = {x:0, y:A2R(45), z:A2R(54.73)}
    const ung13 = qRotate({x:u11[0],y:u11[1],z:u11[2]},{x:u13[0],y:u13[1],z:u13[2]},true)
    //const ung13 = {x:0, y:A2R(-45), z:A2R(35)}
    ung13.y = -ung13.y;
    const um13  = RotateMatrix(ung13)
    const jm13  = math.inv(um13)
    console.log()
    const l13   = dotM( jm13,q13);
    const e13   = [Math.sqrt(3),0,0]
    const f13   = MM(ung13,e13)
    const g13   = dotM(um13,e13)
    const h13   = crossM(jm13,um13);
    console.log(h13)
    console.log("q13",q13,"ung13",AA(ung13), "l13",l13)
    console.log("e13",e13,"ung13",AA(ung13), "f13",f13,"g13",g13)
    //const y3 = qRotate({x:1,y:0,z:0},{x:r3[0],y:r3[1],z:r3[2]})
    //const y5 = qRotate({x:1,y:0,z:0},{x:r5[0],y:r5[1],z:r5[2]})
    //console.log("y3",AA(y3),"y5",AA(y5));
}
//checkIssues();

function qRotate(a, b, logme=false)
{
    var y = get2DAngle(a.x,a.z,b.x,b.z);
    var dx= Math.abs(b.x-a.x);
    var dz= Math.abs(b.z-a.z);
    var r = Math.sqrt(dx*dx+dz*dz);
    var d = (b.x>a.x) ? r: -r 
    //var z = get2DAngle(a.x,a.y,b.x,b.y)
    var z = get2DAngle(0,a.y,d,b.y)
    var x = 0;
    
    if (logme) console.log("angle=x",A(x),"y",A(y),"z",A(z));
    if (a.x == b.x && a.y != b.y && a.z != b.z) {
        x = (b.z>a.z) ? get2DAngle(a.z,a.y,b.z,b.y): get2DAngle(b.z,b.y,a.z,a.y);
        y = (b.z>a.z) ? Math.abs(y): -Math.abs(y)
        z = 0;
        if (logme) console.log("adjusted=x",x,"y",y,"z",z);
    }
    if (y < -Math.PI/2) z = 0;
    
    return {x:x, y:y, z:z};
}

// (0, 0, 90) l,r  right down 90; <-  ( 1, 0, 0)
// (0, 0, 45) l,r  right down 45; <-  ( 1, 1, 0)
// (0, 0,-90) l,r   left down 90; ->  (-1, 0, 0)
// (0, 0,-45) l,r   left down 45; ->  (-1, 1, 0)
// ( 90,0, 0) l,r  front down 90: V   ( 0, 0,-1)  z
// ( 45,0 ,0) l,r  front down 45: V   ( 0, 1,-1) yz
// (-45,0, 0) l,r   back down-45: A   ( 0, 1, 1) yz ###
// (-90,0, 0) l,r   back down-90: A   ( 0, 0, 1)  z ###
// (0, 90, 0) l,r f left 90; ->  ( 0, 0, 0)
// (0, 45, 0) l,r f left 45; ->  ( 0, 0, 0)
// (0,-90, 0) l,r fright-90; <-  ( 0, 0, 0)
// (0,-45, 0) l,r fright-45; <-  ( 0, 0, 0)
function LegRotate(a, b, logme=false)
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

const zz    = {x: 0, y: 0, z: 0}
const w100  = {x: 1, y: 0, z: 0} 
const w110  = {x: 1, y: 1, z: 0}
const w_100 = {x:-1, y: 0, z: 0}
const w_110 = {x:-1, y: 1, z: 0}
const w001  = {x: 0, y: 0, z: 1}
const w011  = {x: 0, y: 1, z: 1}  
const w00_1 = {x: 0, y: 0, z:-1}
const w01_1 = {x: 0, y: 1, z:-1}  
const a100  = LegRotate(zz, w100)
const a110  = LegRotate(zz, w110)
const a_100 = LegRotate(zz,w_100)
const a_110 = LegRotate(zz,w_110)
const a001  = LegRotate(zz, w001)
const a011  = LegRotate(zz, w011)
const a00_1 = LegRotate(zz, w00_1)
const a01_1 = LegRotate(zz, w01_1)
console.log(  "w100",  w100,  "a100",  AA(a100))  // ( 1, 0, 0) => (0, 0, 90)
console.log(  "w110",  w110,  "a110",  AA(a110))  // ( 1, 1, 0) => (0, 0, 45)
console.log( "w_100", w_100, "a_100", AA(a_100))  // (-1, 0, 0) => (0, 0,-90)
console.log( "w_110", w_110, "a_110", AA(a_110))  // (-1, 1, 0) => (0, 0,-45)
console.log(  "w001",  w001,  "a001",  AA(a001))  // ( 0, 0, 1) => (-90,0, 0)
console.log(  "w011",  w011,  "a011",  AA(a011))  // ( 0, 1, 1) => (-45,0, 0)
console.log( "w00_1", w00_1, "a00_1",  AA(a00_1)) // ( 0, 0,-1) => ( 90,0, 0)
console.log( "w01_1", w01_1, "a01_1",  AA(a01_1)) // ( 0, 1,-1) => ( 45,0, 0)



