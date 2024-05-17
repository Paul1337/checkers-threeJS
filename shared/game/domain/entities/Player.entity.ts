import { PointType } from './Matrix.entity';

export class Player {
    points: number = 0;

    constructor(public pointType: PointType) {}
}
