import { modulesController } from '../modulesController';
import { WorldPresenter } from '../world/presenter/World.presenter';
import { GameService } from './domain/Game.service';
import { FiguresPresenter } from './presenter/entities/Figures/Figures.presenter';
import { GameBoard } from './presenter/entities/GameBoard.presenter';

export class Game {
    readonly gameService: GameService;
    readonly worldPresenter: WorldPresenter;

    readonly figuresPresenter: FiguresPresenter;
    readonly board: GameBoard;

    constructor() {
        if (!modulesController.modules.world) {
            throw new Error('world is not defined in game module');
        }

        this.worldPresenter = modulesController.modules.world.worldPresenter;

        this.gameService = new GameService();
        this.gameService.start();

        this.board = new GameBoard(this.gameService);
        this.figuresPresenter = new FiguresPresenter(this.gameService, this.board);
        // const dragControl = new DragControl(figuresPresenter.figures.map(figure => figure.object));

        this.update();
    }

    update() {
        this.worldPresenter.update();
        this.figuresPresenter.update();
        requestAnimationFrame(this.update.bind(this));
    }
}
