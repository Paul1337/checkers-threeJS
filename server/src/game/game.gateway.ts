import {
    ConnectedSocket,
    MessageBody,
    OnGatewayConnection,
    OnGatewayDisconnect,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets';
import { PointType } from '@shared/game/domain/entities/Matrix/Matrix.entity';
import { GameEndDto, GameResult } from '@shared/game/dto/GameEnd.dto';
import { JoinResultDto } from '@shared/game/dto/JoinResult.dto';
import { MoveDto } from '@shared/game/dto/MoveDto';
import { Server, Socket } from 'socket.io';

import { GameStartDto } from '@shared/game/dto/GameStart.dto';
import { GameGlobalService } from './game-global.service';

const getRoomByGameId = (gameId: string) => `game:${gameId}`;

@WebSocketGateway({
    cors: {
        origin: '*',
    },
})
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    private server: Server;

    constructor(private gameGlobalService: GameGlobalService) {}

    handleConnection(client: Socket) {
        console.log('new connection');
    }

    handleDisconnect(client: Socket) {
        console.log('disconnection');
    }

    @SubscribeMessage('reset')
    resetGame() {}

    @SubscribeMessage('move')
    handleMove(@MessageBody() moveDto: MoveDto, @ConnectedSocket() client: Socket) {
        const result = this.gameGlobalService.move(moveDto);
        const roomId = getRoomByGameId(moveDto.gameId);
        client.to(roomId).emit('move', moveDto);
        if (result) {
            const gameEndDto: GameEndDto = { result };
            this.server.to(roomId).emit('game-end', gameEndDto);
            this.server.socketsLeave(roomId);
            this.gameGlobalService.deleteGame(moveDto.gameId);
        }
    }

    @SubscribeMessage('new-game')
    handleNewGame(@ConnectedSocket() client: Socket) {
        const gameId = this.gameGlobalService.createGame();
        client.join(getRoomByGameId(gameId));
        return gameId;
    }

    @SubscribeMessage('join-game')
    async handleJoinGame(
        @MessageBody() gameId: string,
        @ConnectedSocket() client: Socket,
    ): Promise<JoinResultDto> {
        const roomId = getRoomByGameId(gameId);
        client.join(roomId);
        const sockets = await this.server.in(roomId).fetchSockets();
        if (sockets.length === 2) {
            const rnd = Math.random();
            const gameStartDto: GameStartDto = {
                pointType: rnd > 0.5 ? PointType.White : PointType.Black,
                gameId,
            };
            client.to(roomId).emit('game-start', gameStartDto);
            return {
                success: true,
                gameStartDto: { pointType: rnd > 0.5 ? PointType.Black : PointType.White, gameId },
            };
        }
        return {
            success: false,
        };
    }

    @SubscribeMessage('finish-game')
    handleFinishGame(@MessageBody() gameId: string, @ConnectedSocket() client: Socket) {
        this.gameGlobalService.deleteGame(gameId);
        const gameEndDto: GameEndDto = {
            result: GameResult.PlayerEndedGame,
        };
        const roomId = getRoomByGameId(gameId);
        this.server.to(roomId).emit('game-end', gameEndDto);
        this.server.socketsLeave(roomId);
    }
}
