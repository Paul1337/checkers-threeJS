import { tryMoveChecker } from '../usecases/tryMoveChecker';
import { DragControl } from './DragControl';
import { Figure, FigureType } from './Figure';
import { GameBoard } from './GameBoard';
import { FieldType, Matrix, PointType } from './Matrix';
import { Player } from './Player';
import { Point } from './Point';
import { presenterConfig } from './presenterConfig';
import { world } from './World';

export enum currentPlayer {
    Player1,
    Player2,
}

export interface GameConfig {
    MatrixWidth: number;
    MatrixHeight: number;
}

export class Game {
    matrix: Matrix;
    player1: Player;
    player2: Player;
    currentPlayer: Player;

    private board?: GameBoard;
    private figures: Figure[] = [];
    private selectedFigure?: Figure;

    private dragControls?: DragControl;

    constructor(private readonly config: GameConfig) {
        this.matrix = new Matrix(config.MatrixWidth, config.MatrixHeight);

        this.player1 = new Player();
        this.player2 = new Player();

        this.currentPlayer = this.player1;

        this.start();
    }

    createBoard() {
        const board = new GameBoard({
            height: this.matrix.field.length,
            width: this.matrix.field[0].length,
        });
        return board;
    }

    createFigures() {
        const figures: Figure[] = [];
        const field = this.matrix.field;
        for (let i = 0; i < field.length; i++) {
            for (let j = 0; j < field[i].length; j++) {
                const pointType = field[i][j];
                if (pointType === PointType.Empty) continue;
                const figure = new Figure(
                    pointType === PointType.White ? FigureType.White : FigureType.Black,
                    {
                        height: presenterConfig.figure.height,
                        radius: presenterConfig.figure.radius,
                    }
                );
                figure.object.position.z = 0.5 + i * presenterConfig.figure.radius * 2;
                figure.object.position.x = 0.5 + j * presenterConfig.figure.radius * 2;
                figure.object.position.y = presenterConfig.figure.height / 2;

                world.scene.add(figure.object);
                figures.push(figure);
            }
        }

        return figures;
    }

    start() {
        const rnd = Math.floor(Math.random() * 2);
        this.currentPlayer = rnd === 0 ? this.player1 : this.player2;
        this.matrix.reset();

        this.board = this.createBoard();
        this.figures = this.createFigures();
        this.dragControls = new DragControl(this.figures.map((f) => f.object));
    }

    makeMove(from: Point, to: Point): void {
        tryMoveChecker(this.matrix, from, to);
    }

    update() {
        world.update();
        requestAnimationFrame(this.update.bind(this));
    }
}
