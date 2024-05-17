import { GameMove } from '../domain/entities/GameMove.entity';
import { Point } from '../domain/entities/Point.entity';

export class MoveDto {
    move: GameMove;
    from: Point;
}
