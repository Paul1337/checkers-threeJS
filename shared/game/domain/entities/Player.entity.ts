import { PointType } from './Matrix/Matrix.entity';

export class Player {
    points: number = 0;

    constructor(public pointType: PointType) {}
}
