import { Game, GameConfig } from '../entities/Game';

const gameConfig: GameConfig = {
    MatrixHeight: 8,
    MatrixWidth: 8,
};

export const initGame = () => {
    const game = new Game(gameConfig);
    return game;
};
