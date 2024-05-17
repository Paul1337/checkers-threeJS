export class Point {
    constructor(public x: number, public y: number) {}

    equals(point2: Point) {
        return this.x === point2.x && this.y === point2.y;
    }

    static from(position: { x: number; y: number }) {
        return new Point(position.x, position.y);
    }
}
