import { Point } from './Point.entity';

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

    public events: MatrixEvents = {};

    constructor(width: number, height: number) {
        this.field = [];
        for (let i = 0; i < height; i++) {
            this.field[i] = new Array(width);
            for (let j = 0; j < width; j++) {
                this.field[i][j] = PointType.Empty;
            }
        }
    }

    reset() {
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 4; j++) {
                this.field[i][1 - (i % 2) + j * 2] = PointType.White;
                this.field[this.field.length - 1 - i][(i % 2) + j * 2] = PointType.Black;
            }
        }

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

    remove(point: Point) {
        this.field[point.y][point.x] = PointType.Empty;
    }
}
