import {
    ConnectedSocket,
    MessageBody,
    OnGatewayConnection,
    OnGatewayDisconnect,
    SubscribeMessage,
    WebSocketGateway,
} from '@nestjs/websockets';
import { Socket } from 'net';
import { PointType } from '@shared/game/domain/entities/Matrix/Matrix.entity';
import { MoveDto } from '@shared/game/dto/MoveDto';
import { GameService } from '@shared/game/domain/Game.service';

@WebSocketGateway({
    cors: {
        origin: '*',
    },
})
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
    connected: Socket[];

    constructor(private gameService: GameService) {
        this.connected = [];
    }

    handleConnection(client: Socket) {
        if (this.connected.length < 2) {
            this.connected.push(client);
        } else {
            // this.connected = [client];
        }
        console.log('connected list', this.connected.length);
    }

    handleDisconnect(client: Socket) {
        const disconnectedIndex = this.connected.indexOf(client);
        if (disconnectedIndex > -1) {
            this.connected.splice(disconnectedIndex, 1);
        }
        console.log('connected list', this.connected.length);
    }

    @SubscribeMessage('reset')
    resetGame() {
        this.gameService.resetGame();
    }

    @SubscribeMessage('init')
    initPlayer(@ConnectedSocket() client: Socket) {
        const playerIndex = this.connected.indexOf(client);
        return playerIndex === 0 ? PointType.White : PointType.Black;
    }

    @SubscribeMessage('move')
    handleMove(@MessageBody() data: MoveDto, @ConnectedSocket() client: Socket) {
        if (this.connected.length < 2) {
            console.warn('Not enough players for the game');
            return;
        }
        const playerIndex = this.connected.indexOf(client);
        const oppositePlayerIndex = 1 - playerIndex;
        this.connected[oppositePlayerIndex].emit('move', data);
    }
}
