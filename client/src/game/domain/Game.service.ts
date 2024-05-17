import { GameMove } from '../../../../shared/game/domain/entities/GameMove.entity';
import { Matrix, PointType } from '../../../../shared/game/domain/entities/Matrix.entity';
import { Player } from '../../../../shared/game/domain/entities/Player.entity';
import { Point } from '../../../../shared/game/domain/entities/Point.entity';
import { gameConfig } from '../../../../shared/game/domain/Game.config';
import { pointTypesOpposite } from '../../../../shared/game/domain/lib/pointType';
import { network } from '../../shared/api/network.api';

export class GameService {
    matrix: Matrix;
    private player1: Player;
    private player2: Player;

    private currentPlayer: Player;
    me: Player;

    constructor() {
        this.matrix = new Matrix(gameConfig.matrix.width, gameConfig.matrix.height);

        this.player1 = new Player(PointType.White);
        this.player2 = new Player(PointType.Black);

        this.currentPlayer = this.player1;
        this.me = this.currentPlayer;

        this.start();
    }

    getAvailableDestinationsFrom(point: Point) {
        return this.getMovesFrom(point)
            .map(move => move.path)
            .flat();
    }

    getMovesFrom(point: Point): GameMove[] {
        const pointType = this.matrix.get(point);
        const rowYMove = pointType === PointType.White ? point.y + 1 : point.y - 1;
        const moveToPoints = [new Point(point.x - 1, rowYMove), new Point(point.x + 1, rowYMove)].filter(
            point => this.matrix.includesPoint(point)
        );

        const movingMoves: GameMove[] = [];

        moveToPoints.forEach(movePoint => {
            if (this.matrix.get(movePoint) === PointType.Empty) {
                movingMoves.push({
                    capturedPoints: [],
                    path: [movePoint],
                });
            }
        });

        return movingMoves.concat(this.getCaptureMoves(point, this.matrix.get(point)));
    }

    getCaptureMoves(from: Point, pointType: PointType, tail: Point[] = []): GameMove[] {
        const capturesStep = (
            [
                this.getCapturePoint(from, -1, 1, pointType),
                this.getCapturePoint(from, 1, 1, pointType),
                this.getCapturePoint(from, -1, -1, pointType),
                this.getCapturePoint(from, 1, -1, pointType),
            ].filter(Boolean) as GameMove[]
        ).filter(move => !tail.some(tailPoint => tailPoint.equals(move?.path[move.path.length - 1])));

        return capturesStep
            .map(move => {
                const nextPoint = move.path[move.path.length - 1];
                const innerMoves = this.getCaptureMoves(nextPoint, pointType, tail.concat(nextPoint));
                const withInnerMoves: GameMove[] = innerMoves.map(inner => ({
                    capturedPoints: move.capturedPoints.concat(inner.capturedPoints),
                    path: move.path.concat(inner.path),
                }));

                const withoutInnerMoves: GameMove = {
                    capturedPoints: move.capturedPoints,
                    path: move.path,
                };

                return withInnerMoves.concat(withoutInnerMoves);
            })
            .flat();
    }

    getCapturePoint(from: Point, dx: number, dy: number, pointType: PointType): GameMove | undefined {
        const capturingPoint = new Point(from.x + dx, from.y + dy);
        const nextPathPoint = new Point(from.x + dx * 2, from.y + dy * 2);
        if (
            this.matrix.includesPoint(nextPathPoint) &&
            this.matrix.get(nextPathPoint) === PointType.Empty &&
            pointTypesOpposite(this.matrix.get(capturingPoint), pointType)
        ) {
            return {
                capturedPoints: [capturingPoint],
                path: [nextPathPoint],
            };
        }
    }

    start() {
        // call api and check the turn

        network.emit('init', (playerPointType: PointType) => {
            console.log('Inited as player', playerPointType);
            this.currentPlayer = this.player1;
            this.me = playerPointType === PointType.White ? this.player1 : this.player2;
            this.matrix.reset();
        });
    }

    makeMove(from: Point, gameMove: GameMove) {
        this.moveChecker(from, gameMove.path[gameMove.path.length - 1]);
        gameMove.capturedPoints.forEach(point => {
            this.matrix.remove(point);
        });
        this.currentPlayer.points += gameMove.capturedPoints.length;
        this.switchTurn();
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

    switchTurn() {
        this.currentPlayer = this.currentPlayer === this.player1 ? this.player2 : this.player1;
    }

    moveChecker(from: Point, to: Point) {
        this.matrix.set(to, this.matrix.get(from));
        this.matrix.set(from, PointType.Empty);
    }
}
