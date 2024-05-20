import { GameMove } from './entities/GameMove.entity';
import { Matrix, PointType } from './entities/Matrix/Matrix.entity';
import { pointTypesOpposite } from './entities/Matrix/pointType.utils';
import { Point } from './entities/Point.entity';

export class GameMoveService {
    constructor(private matrix: Matrix) {}

    getMovingMoves(point: Point): GameMove[] {
        if (this.matrix.isQueen(point)) {
            return this.getQueenCheckerMovingMoves(point);
        } else {
            return this.getStandardCheckerMovingMoves(point);
        }
    }

    getStandardCheckerMovingMoves(point: Point) {
        const pointType = this.matrix.get(point);
        const rowYMove = pointType === PointType.White ? point.y + 1 : point.y - 1;
        const moveToPoints = [new Point(point.x - 1, rowYMove), new Point(point.x + 1, rowYMove)].filter(
            point => this.matrix.includesPoint(point)
        );

        const movingMoves: GameMove[] = [];

        moveToPoints.forEach(movePoint => {
            if (this.matrix.isEmpty(movePoint)) {
                movingMoves.push({
                    capturedPoints: [],
                    path: [movePoint],
                });
            }
        });
        return movingMoves;
    }

    getQueenCheckerMovingMoves(point: Point): GameMove[] {
        const points: Point[] = [
            this.getQueenCheckerMovingPointsDirection(point, 1, 1),
            this.getQueenCheckerMovingPointsDirection(point, -1, 1),
            this.getQueenCheckerMovingPointsDirection(point, 1, -1),
            this.getQueenCheckerMovingPointsDirection(point, -1, -1),
        ].flat();

        return points.map(point => ({
            path: [point],
            capturedPoints: [],
        }));
    }

    getQueenCheckerMovingPointsDirection(point: Point, dx: number, dy: number) {
        const points: Point[] = [];
        for (let i = 1; i < Math.min(this.matrix.width, this.matrix.height); i++) {
            const newPoint = point.clone();
            newPoint.move(dx * i, dy * i);
            if (!this.matrix.includesPoint(newPoint) || !this.matrix.isEmpty(newPoint)) {
                break;
            }
            points.push(newPoint);
        }
        return points;
    }

    getCaptureMoves(from: Point, from0: Point, tail: Point[] = []): GameMove[] {
        let capturesStep: GameMove[] = [];
        const pointType = this.matrix.get(from0);

        if (this.matrix.isQueen(from0)) {
            capturesStep = [
                this.getQueenCheckerCaptureMoves(from, -1, 1, pointType),
                this.getQueenCheckerCaptureMoves(from, 1, 1, pointType),
                this.getQueenCheckerCaptureMoves(from, -1, -1, pointType),
                this.getQueenCheckerCaptureMoves(from, 1, -1, pointType),
            ].flat();
        } else {
            capturesStep = [
                this.getStandardCheckerCaptureMove(from, -1, 1, pointType),
                this.getStandardCheckerCaptureMove(from, 1, 1, pointType),
                this.getStandardCheckerCaptureMove(from, -1, -1, pointType),
                this.getStandardCheckerCaptureMove(from, 1, -1, pointType),
            ].filter(Boolean) as GameMove[];
        }

        capturesStep = capturesStep.filter(
            move => !tail.some(tailPoint => tailPoint.equals(move?.path[move.path.length - 1]))
        );

        return capturesStep
            .map(move => {
                const nextPoint = move.path[move.path.length - 1];
                let innerMoves = this.getCaptureMoves(nextPoint, from0, tail.concat(nextPoint));
                innerMoves = innerMoves.filter(innerMove => {
                    return !move.capturedPoints.some(p =>
                        innerMove.capturedPoints.some(innerPoint => p.equals(innerPoint))
                    );
                });
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

    getStandardCheckerCaptureMove(
        from: Point,
        dx: number,
        dy: number,
        pointType: PointType
    ): GameMove | undefined {
        const capturingPoint = new Point(from.x + dx, from.y + dy);
        const nextPathPoint = new Point(from.x + dx * 2, from.y + dy * 2);
        if (
            this.matrix.includesPoint(nextPathPoint) &&
            this.matrix.isEmpty(nextPathPoint) &&
            pointTypesOpposite(this.matrix.get(capturingPoint), pointType)
        ) {
            return {
                capturedPoints: [capturingPoint],
                path: [nextPathPoint],
            };
        }
    }

    getQueenCheckerCaptureMoves(from: Point, dx: number, dy: number, pointType: PointType): GameMove[] {
        for (let i = 1; i < Math.min(this.matrix.width, this.matrix.height); i++) {
            const newPoint = from.clone();
            newPoint.move(dx * i, dy * i);
            if (!this.matrix.includesPoint(newPoint)) {
                break;
            }
            if (!this.matrix.isEmpty(newPoint)) {
                if (!pointTypesOpposite(this.matrix.get(newPoint), pointType)) {
                    break;
                }
                const availablePoints = this.getQueenCheckerMovingPointsDirection(newPoint, dx, dy);
                if (availablePoints.length > 0) {
                    return availablePoints.map(p => ({
                        capturedPoints: [newPoint],
                        path: [p],
                    }));
                }
            }
        }

        return [];
    }
}
