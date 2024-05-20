export enum GameResult {
    Player1Winner,
    Player2Winner,
    Draw,
    PlayerEndedGame,
}

export interface GameEndDto {
    result: GameResult;
}
