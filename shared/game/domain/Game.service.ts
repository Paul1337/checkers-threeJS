import { GameMove } from './entities/GameMove.entity';
import { Matrix, PointType } from './entities/Matrix/Matrix.entity';
import { Player } from './entities/Player.entity';
import { Point } from './entities/Point.entity';
import { gameConfig } from './Game.config';
import { pointTypesOpposite } from './entities/Matrix/pointType.utils';
import { GameMoveService } from './GameMove.service';
import { GameResult } from '../dto/GameEnd.dto';

export class GameService {
    matrix: Matrix;
    protected player1: Player;
    protected player2: Player;
    protected currentPlayer: Player;

    gameMoveService: GameMoveService;

    constructor() {
        this.matrix = new Matrix(gameConfig.matrix.width, gameConfig.matrix.height);

        this.player1 = new Player(PointType.White);
        this.player2 = new Player(PointType.Black);

        this.currentPlayer = this.player1;

        this.gameMoveService = new GameMoveService(this.matrix);
    }

    get gameResult(): GameResult | null {
        if (this.matrix.all.every(point => point !== PointType.Black)) {
            return GameResult.Player1Winner;
        }
        if (this.matrix.all.every(point => point !== PointType.White)) {
            return GameResult.Player2Winner;
        }
        return null;
    }

    getAvailableDestinationsFrom(point: Point) {
        return this.getMovesFrom(point).map(move => move.path[move.path.length - 1]);
    }

    getMovesFrom(point: Point): GameMove[] {
        const movingMoves = this.gameMoveService.getMovingMoves(point);
        const captureMoves = this.gameMoveService.getCaptureMoves(point, point);
        return movingMoves.concat(captureMoves);
    }

    resetGame() {
        this.matrix.reset();
    }

    makeMove(from: Point, gameMove: GameMove) {
        this.matrix.move(from, gameMove.path[gameMove.path.length - 1]);

        gameMove.capturedPoints.forEach(point => {
            this.matrix.remove(point);
        });
        this.currentPlayer.points += gameMove.capturedPoints.length;
        this.switchTurn();
    }

    switchTurn() {
        console.log('switch turn super');
        this.currentPlayer = this.currentPlayer === this.player1 ? this.player2 : this.player1;
    }
}
