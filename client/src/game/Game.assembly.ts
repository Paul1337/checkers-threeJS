import { ClientGameService } from './domain/ClientGame.service';
import { modulesController } from './gameModulesController';
import { EventsPresenter } from './presenter/entities/Events.presenter';
import { FiguresPresenter } from './presenter/entities/Figures/Figures.presenter';
import { GameBoard } from './presenter/entities/GameBoard.presenter';
import { WorldPresenter } from './world/presenter/World.presenter';

export class Game {
    readonly gameService: ClientGameService;
    readonly worldPresenter: WorldPresenter;

    readonly figuresPresenter: FiguresPresenter;
    readonly eventsPresenter: EventsPresenter;

    readonly board: GameBoard;

    constructor() {
        if (!modulesController.modules.world) {
            throw new Error('world is not defined in game module');
        }

        this.worldPresenter = modulesController.modules.world.worldPresenter;

        this.gameService = new ClientGameService();

        this.board = new GameBoard(this.gameService);
        this.figuresPresenter = new FiguresPresenter(this.gameService, this.board);
        this.eventsPresenter = new EventsPresenter(this.gameService, this.figuresPresenter);
    }
}
