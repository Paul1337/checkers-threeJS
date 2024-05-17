import { Module } from '@nestjs/common';
import { GameGateway } from './game.gateway';
import { GameService } from '@shared/game/domain/Game.service';

@Module({
    providers: [
        {
            provide: GameService,
            useValue: new GameService(),
        },
        GameGateway,
    ],
})
export class GameModule {}
