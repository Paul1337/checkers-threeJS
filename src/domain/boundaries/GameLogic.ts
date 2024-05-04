import { FieldType, Matrix } from '../entities/Matrix';
import { Point } from '../entities/Point';

export interface GameLogic {
    makeMove(from: Point, to: Point): void;
    get field(): FieldType;
}
