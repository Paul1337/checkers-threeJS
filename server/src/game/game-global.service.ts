import { ForbiddenException, Injectable } from '@nestjs/common';
import { GameService } from '@shared/game/domain/Game.service';
import { GameResult } from '@shared/game/dto/GameEnd.dto';
import { MoveDto } from '@shared/game/dto/MoveDto';

@Injectable()
export class GameGlobalService {
    private gameServices: Map<string, GameService> = new Map();
    private lastTime: Map<string, number> = new Map();

    constructor() {}

    generateUniqueIdRoom(): string {
        let id;
        do {
            id = (Date.now() % 1000000).toString();
        } while (Array.from(this.gameServices.entries()).some(([key, service]) => key === id));
        return id;
    }

    deleteOldGames() {
        for (const [id, game] of this.gameServices) {
            if (Date.now() - this.lastTime.get(id) >= 1000 * 60 * 30) {
                this.gameServices.delete(id);
            }
        }
    }

    createGame() {
        this.deleteOldGames();
        const gameId = this.generateUniqueIdRoom();
        this.gameServices.set(gameId, new GameService());
        this.lastTime.set(gameId, Date.now());
        console.log(`Creating game, games count = ${this.gameServices.size}`);
        return gameId;
    }

    deleteGame(gameId: string) {
        this.gameServices.delete(gameId);
    }

    move(moveDto: MoveDto): GameResult | null {
        const gameService = this.gameServices.get(moveDto.gameId);
        if (!gameService) throw new ForbiddenException('no game with such id');
        if (gameService.gameResult) throw new ForbiddenException('game is finished, you can not move!');
        gameService.makeMove(moveDto.from, moveDto.move);
        this.lastTime.set(moveDto.gameId, Date.now());
        return gameService.gameResult;
    }
}
