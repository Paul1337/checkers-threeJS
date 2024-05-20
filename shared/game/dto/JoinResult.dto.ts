import { GameStartDto } from './GameStart.dto';

export interface JoinResultDto {
    success: boolean;
    gameStartDto?: GameStartDto;
    // error?: string;
}
