import { Point } from '../Point.entity';

export enum PointType {
    Black,
    White,
    Empty,
}

export type FieldType = Array<Array<PointType>>;

export interface MatrixEvents {
    onReset?: () => void;
}

export class Matrix {
    private field: FieldType;
    private queens: Point[];

    public events: MatrixEvents = {};

    constructor(width: number, height: number) {
        this.field = [];
        this.queens = [];
        for (let i = 0; i < height; i++) {
            this.field[i] = new Array(width);
            for (let j = 0; j < width; j++) {
                this.field[i][j] = PointType.Empty;
            }
        }
    }

    reset() {
        this.field.forEach((row, i) => row.forEach((el, j) => (this.field[i][j] = PointType.Empty)));

        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 4; j++) {
                this.field[i][1 - (i % 2) + j * 2] = PointType.White;
                this.field[this.field.length - 1 - i][(i % 2) + j * 2] = PointType.Black;
            }
        }

        this.queens = [];
        // this.queens.push(new Point(1, 2));

        this.events.onReset?.();
    }

    includesPoint(point: Point) {
        return point.x >= 0 && point.x < this.width && point.y >= 0 && point.y < this.height;
    }

    get width() {
        return this.field[0]?.length ?? 0;
    }

    get height() {
        return this.field.length;
    }

    set(point: Point, pointType: PointType) {
        this.field[point.y][point.x] = pointType;
    }

    get(point: Point) {
        return this.field[point.y][point.x];
    }

    isEmpty(point: Point) {
        // if (!this.includesPoint(point)) return false;
        return this.field[point.y][point.x] === PointType.Empty;
    }

    isBlack(point: Point) {
        return this.get(point) === PointType.Black;
    }

    isWhite(point: Point) {
        return this.get(point) === PointType.White;
    }

    findQueenPoint(point: Point) {
        return this.queens.find(q => q.equals(point));
    }

    isQueen(point: Point) {
        return Boolean(this.findQueenPoint(point));
    }

    remove(point: Point) {
        this.field[point.y][point.x] = PointType.Empty;
        const queenPoint = this.findQueenPoint(point);
        if (queenPoint) {
            this.queens.splice(this.queens.indexOf(queenPoint), 1);
        }
    }

    move(from: Point, to: Point) {
        this.set(to, this.get(from));
        this.set(from, PointType.Empty);

        const whiteQueenPosition = to.y === this.height - 1;
        const blackQueenPosition = to.y === 0;

        const queenPoint = this.findQueenPoint(from);
        if (queenPoint) {
            queenPoint.moveTo(to);
            return;
        }
        if ((this.isWhite(to) && whiteQueenPosition) || (this.isBlack(to) && blackQueenPosition)) {
            this.queens.push(to.clone());
        }
    }
}
