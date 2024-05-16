import { Point } from './Point.entity';

export interface GameMove {
    capturedPoints: Point[];
    path: Point[];
}
