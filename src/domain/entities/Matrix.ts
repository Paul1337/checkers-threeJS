import { Point } from './Point';

export enum PointType {
    Black,
    White,
    Empty,
}

export type FieldType = Array<Array<PointType>>;

export class Matrix {
    field: FieldType;

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
        console.log(this.field);
    }

    set(point: Point, pointType: PointType) {
        this.field[point.y][point.x] = pointType;
    }

    get(point: Point) {
        return this.field[point.y][point.x];
    }
}