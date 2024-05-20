import { GameMove } from '../domain/entities/GameMove.entity';
import { Point } from '../domain/entities/Point.entity';

export interface MoveDto {
    move: GameMove;
    from: Point;
    gameId: string;
}
