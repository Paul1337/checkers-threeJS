export class Point {
    constructor(public x: number, public y: number) {}

    equals(point2: Point) {
        return this.x === point2.x && this.y === point2.y;
    }

    move(dx: number, dy: number) {
        this.x += dx;
        this.y += dy;
    }

    moveTo({ x, y }: Point) {
        this.x = x;
        this.y = y;
    }

    clone() {
        return new Point(this.x, this.y);
    }

    static from(position: { x: number; y: number }) {
        return new Point(position.x, position.y);
    }
}
