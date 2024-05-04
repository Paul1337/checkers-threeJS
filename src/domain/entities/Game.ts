import { tryMoveChecker } from '../usecases/tryMoveChecker';
import { Matrix } from './Matrix';
import { Player } from './Player';
import { Point } from './Point';

export enum currentPlayer {
    Player1,
    Player2,
}

export interface GameConfig {
    MatrixWidth: number;
    MatrixHeight: number;
}

export interface GameLogic {
    makeMove(from: Point, to: Point): void;
}

export class Game implements GameLogic {
    matrix: Matrix;
    player1: Player;
    player2: Player;
    currentPlayer: Player;

    constructor(private readonly config: GameConfig) {
        this.matrix = new Matrix(config.MatrixWidth, config.MatrixHeight);

        this.player1 = new Player();
        this.player2 = new Player();

        this.currentPlayer = this.player1;
    }

    start() {
        const rnd = Math.floor(Math.random() * 2);
        this.currentPlayer = rnd === 0 ? this.player1 : this.player2;
        this.matrix.reset();
    }

    makeMove(from: Point, to: Point): void {
        tryMoveChecker(this.matrix, from, to);
    }
}
