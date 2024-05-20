import { Module } from '@nestjs/common';
import { GameGateway } from './game.gateway';
import { GameService } from '@shared/game/domain/Game.service';
import { GameGlobalService } from './game-global.service';

@Module({
    providers: [GameGateway, GameGlobalService],
})
export class GameModule {}
