import { Point } from '../../../../../shared/game/domain/entities/Point.entity';
import { MoveDto } from '../../../../../shared/game/dto/MoveDto';
import { network } from '../../../shared/api/network.api';
import { GameService } from '../../../../../shared/game/domain/Game.service';
import { FiguresPresenter } from './Figures/Figures.presenter';
import { ClientGameService } from '../../domain/ClientGame.service';

export class EventsPresenter {
    constructor(private gameService: ClientGameService, private figuresPresenter: FiguresPresenter) {
        this.handleEvents();
    }

    handleEvents() {
        network.on('move', ({ move, from }: MoveDto) => {
            console.log('on move', move, from);

            from = Point.from(from);
            move.path = move.path.map(pathPoint => Point.from(pathPoint));

            this.gameService.makeMove(from, move);
            this.figuresPresenter.makeViewMove(from, move);
        });
    }
}
