import { GameService } from '@shared/game/domain/Game.service';
import { network } from '../../shared/api/network.api';
import { PointType } from '@shared/game/domain/entities/Matrix/Matrix.entity';
import { Player } from '@shared/game/domain/entities/Player.entity';
import { Point } from '@shared/game/domain/entities/Point.entity';
import { GameMove } from '@shared/game/domain/entities/GameMove.entity';

export interface ClientGameServiceEvents {
    onTurnUpdate?: (myTurn: boolean) => void;
    onGameStart: (() => void)[];
}

export class ClientGameService extends GameService {
    public events: ClientGameServiceEvents = {
        onGameStart: [],
    };
    me: Player;

    constructor() {
        super();

        this.me = this.player1;
        this.start();
    }

    start() {
        network.emit('init', (playerPointType: PointType) => {
            console.log('Inited as player', playerPointType);
            this.currentPlayer = this.player1;
            this.me = playerPointType === PointType.White ? this.player1 : this.player2;
            this.matrix.reset();
            this.events.onGameStart.forEach(ev => ev());
        });
    }

    switchTurn() {
        super.switchTurn();
        this.events.onTurnUpdate?.(this.myTurn);
    }

    makeMyMove(from: Point, gameMove: GameMove) {
        this.makeMove(from, gameMove);
        network.emit('move', {
            from,
            move: gameMove,
        });
    }

    get myTurn() {
        return this.currentPlayer === this.me;
    }
}
