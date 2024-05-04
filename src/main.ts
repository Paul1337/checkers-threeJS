import { initGame } from './domain/usecases/initGame';
import { Presenter } from './presenter/Presenter';

const game = initGame();
game.start();

const presenter = new Presenter(game);

const update = () => {
    presenter.update();
    requestAnimationFrame(update);
};
update();
