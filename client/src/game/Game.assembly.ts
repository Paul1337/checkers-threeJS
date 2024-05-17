import { GameService } from '../../../shared/game/domain/Game.service';
import { modulesController } from '../modulesController';
import { WorldPresenter } from '../world/presenter/World.presenter';
import { FiguresPresenter } from './presenter/entities/Figures/Figures.presenter';
import { GameBoard } from './presenter/entities/GameBoard.presenter';
import { EventsPresenter } from './presenter/entities/Events.presenter';
import { UI } from './presenter/entities/UI/UI.presenter';
import { ClientGameService } from './domain/ClientGame.service';

export class Game {
    readonly gameService: ClientGameService;
    readonly worldPresenter: WorldPresenter;

    readonly figuresPresenter: FiguresPresenter;
    readonly eventsPresenter: EventsPresenter;
    readonly uiPresenter: UI;

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
        this.uiPresenter = new UI(this.gameService);

        // const dragControl = new DragControl(figuresPresenter.figures.map(figure => figure.object));

        this.update();
    }

    update() {
        this.worldPresenter.update();
        this.figuresPresenter.update();
        requestAnimationFrame(this.update.bind(this));
    }
}
