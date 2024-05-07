import { Game, GameConfig } from './game/Game';
import './styles/style.css';

const config: GameConfig = {
    MatrixHeight: 8,
    MatrixWidth: 8,
};
const game = new Game(config);
game.update();
