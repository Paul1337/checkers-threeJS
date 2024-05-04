import { Matrix, PointType } from '../entities/Matrix';
import { Point } from '../entities/Point';

export const tryMoveChecker = (matrix: Matrix, from: Point, to: Point) => {
    if (matrix.get(from) === PointType.Empty) {
        return;
    }
    matrix.set(to, matrix.get(from));
    matrix.set(from, PointType.Empty);
};
