import { Matrix, PointType } from '../game/Matrix';
import { Point } from '../game/Point';

export const tryMoveChecker = (matrix: Matrix, from: Point, to: Point) => {
    if (matrix.get(from) === PointType.Empty) {
        return;
    }
    matrix.set(to, matrix.get(from));
    matrix.set(from, PointType.Empty);
};
