import { PointType } from '@shared/game/domain/entities/Matrix/Matrix.entity';

export interface GameStartDto {
    pointType: PointType;
    gameId: string;
}
