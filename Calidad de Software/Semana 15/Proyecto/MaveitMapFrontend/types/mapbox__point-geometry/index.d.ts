declare module "@mapbox/point-geometry" {
  export default class Point {
    x: number
    y: number
    constructor(x: number, y: number)
    clone(): Point
    add(point: Point): Point
    sub(point: Point): Point
    multByPoint(point: Point): Point
    divByPoint(point: Point): Point
    mult(k: number): Point
    div(k: number): Point
    rotate(a: number): Point
    rotateAround(a: number, p: Point): Point
    matMult(m: number[]): Point
    unit(): Point
    perp(): Point
    round(): Point
    mag(): number
    equals(point: Point): boolean
    dist(point: Point): number
    distSqr(point: Point): number
    angle(): number
    angleTo(point: Point): number
    angleWith(point: Point): number
    angleWithSep(point: Point): number
    angleWithSepTo(point: Point): number
    equalsNear(point: Point, dist?: number): boolean
  }
}

