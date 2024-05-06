import { GameLogic } from '../domain/boundaries/GameLogic';
import { PointType } from '../game/Matrix';
import { Figure, FigureType } from '../game/Figure';
import { GameBoard } from '../game/GameBoard';
import { presenterConfig } from './presenterConfig';
import { World } from '../game/World';

import './styles/style.css';
import { DragPresenter } from '../game/DragControl';

export class Presenter {
    private world: World;

    private board: GameBoard;
    private figures: Figure[];
    private dragPresenter: DragPresenter;

    constructor(private game: GameLogic) {
        this.world = new World();
        this.board = this.createBoard();
        this.figures = this.createFigures();
        this.dragPresenter = new DragPresenter(
            this.world,
            this.figures.map(f => f.object)
        );
    }

    createBoard() {
        const board = new GameBoard({
            height: this.game.field.length,
            width: this.game.field[0].length,
        });
        this.world.scene.add(board.object);
        return board;
    }

    createFigures() {
        const figures: Figure[] = [];
        const field = this.game.field;
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

                this.world.scene.add(figure.object);
                figures.push(figure);
            }
        }

        return figures;
    }

    update() {
        this.world.update();
    }
}
