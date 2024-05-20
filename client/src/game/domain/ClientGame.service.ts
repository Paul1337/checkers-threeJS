import { GameService } from '@shared/game/domain/Game.service';
import { network } from '../../shared/api/network.api';
import { PointType } from '@shared/game/domain/entities/Matrix/Matrix.entity';
import { Player } from '@shared/game/domain/entities/Player.entity';
import { Point } from '@shared/game/domain/entities/Point.entity';
import { GameMove } from '@shared/game/domain/entities/GameMove.entity';
import { GameStartDto } from '@shared/game/dto/GameStart.dto';
import { EventEmitter } from '@shared/game/domain/utils/EventEmmiter';
import { GameEndDto } from '@shared/game/dto/GameEnd.dto';
import { computed, makeAutoObservable, observable } from 'mobx';
import { MoveDto } from '@shared/game/dto/MoveDto';

export class ClientGameService extends GameService {
    readonly eventEmmiter: EventEmitter;

    me: Player;
    private gameId: string = '';

    constructor() {
        super();

        // makeAutoObservable(this);

        this.eventEmmiter = new EventEmitter();
        this.me = this.player1;

        this.handleNetworkEvents();
    }

    handleNetworkEvents() {
        // network.on('game-start', this.handleGameStart.bind(this));
        network.on('game-end', this.handleGameEnd.bind(this));
    }

    start(gameStartDto: GameStartDto) {
        console.log('Game start as player', gameStartDto.pointType);
        this.currentPlayer = this.player1;
        this.me = gameStartDto.pointType === PointType.White ? this.player1 : this.player2;
        this.matrix.reset();
        console.log('emit game-start');
        this.eventEmmiter.emit('game-start');
        this.gameId = gameStartDto.gameId;
    }

    handleGameEnd(gameEndDto: GameEndDto) {}

    switchTurn() {
        super.switchTurn();
        this.eventEmmiter.emit('turn-switch', this.myTurn);
    }

    makeMyMove(from: Point, gameMove: GameMove) {
        this.makeMove(from, gameMove);
        const moveDto: MoveDto = {
            from,
            move: gameMove,
            gameId: this.gameId,
        };
        network.emit('move', moveDto);
    }

    get myTurn() {
        return this.currentPlayer === this.me;
    }
}
