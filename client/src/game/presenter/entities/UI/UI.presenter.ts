import { GameService } from '@shared/game/domain/Game.service';
import './styles.css';
import { network } from '../../../../shared/api/network.api';
import { MoveDto } from '@shared/game/dto/MoveDto';
import { PointType } from '@shared/game/domain/entities/Matrix/Matrix.entity';
import { ClientGameService } from '../../../domain/ClientGame.service';

export class UI {
    container: HTMLDivElement;

    constructor(private gameService: ClientGameService) {
        this.container = document.getElementById('container') as HTMLDivElement;

        const info = document.createElement('div');
        info.classList.add('info');
        this.container.appendChild(info);

        const myColor = document.createElement('p');
        myColor.classList.add('info__color');
        myColor.id = 'my-color';
        info.appendChild(myColor);
        myColor.textContent = '';

        const turnInfo = document.createElement('p');
        turnInfo.classList.add('info__turn');
        turnInfo.id = 'turn-info';
        info.appendChild(turnInfo);
        turnInfo.textContent = '';

        this.handleEvents();
    }

    handleEvents() {
        this.gameService.events.onGameStart.push(() => {
            document.getElementById('my-color').textContent =
                this.gameService.me.pointType === PointType.White
                    ? 'Мой цвет - белый'
                    : 'Мой цвет - чёрный';

            document.getElementById('turn-info').textContent = this.gameService.myTurn
                ? 'Мой ход'
                : 'Ход противника';
        });

        this.gameService.events.onTurnUpdate = myTurn => {
            document.getElementById('turn-info').textContent = myTurn ? 'Мой ход' : 'Ход противника';
        };
    }
}
