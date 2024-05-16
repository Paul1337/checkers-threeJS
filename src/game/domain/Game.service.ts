import { Matrix, PointType } from './entities/Matrix.entity';
import { Player } from './entities/Player.entity';
import { Point } from './entities/Point.entity';
import { gameConfig } from '../Game.config';
import { pointTypesOpposite } from './lib/pointType';
import { GameMove } from './entities/GameMove.entity';
import { Game } from '../Game.assembly';

export class GameService {
    matrix: Matrix;
    player1: Player;
    player2: Player;

    currentPlayer: Player;

    constructor() {
        this.matrix = new Matrix(gameConfig.matrix.width, gameConfig.matrix.height);

        this.player1 = new Player(PointType.White);
        this.player2 = new Player(PointType.Black);

        this.currentPlayer = this.player1;
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
        const rnd = Math.floor(Math.random() * 2);
        // this.currentPlayer = rnd === 0 ? this.player1 : this.player2;
        this.currentPlayer = this.player1;
        this.matrix.reset();
    }

    makeMove(from: Point, gameMove: GameMove) {
        this.moveChecker(from, gameMove.path[gameMove.path.length - 1]);
        gameMove.capturedPoints.forEach(point => {
            this.matrix.remove(point);
        });
        this.currentPlayer.points += gameMove.capturedPoints.length;
        this.switchTurn();

        console.log(this.matrix);
    }

    moveChecker(from: Point, to: Point) {
        this.matrix.set(to, this.matrix.get(from));
        this.matrix.set(from, PointType.Empty);
    }

    switchTurn() {
        this.currentPlayer = this.currentPlayer === this.player1 ? this.player2 : this.player1;
    }
}
