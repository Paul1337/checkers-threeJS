import { GameResult } from '@shared/game/dto/GameEnd.dto';
import { FC } from 'react';
import { Modal } from '../../../shared/ui/Modal/Modal';

export interface GameEndModalProps {
    onClose?: () => void;
    status: GameResult;
}

const resultToTextMap: Record<GameResult, string> = {
    [GameResult.Draw]: 'Ничья',
    [GameResult.Player1Winner]: 'Белые выиграли',
    [GameResult.Player2Winner]: 'Чёрные выиграли',
    [GameResult.PlayerEndedGame]: 'Игрок завершил игру',
};

export const GameEndModal: FC<GameEndModalProps> = props => {
    return <Modal title='Конец игры' content={resultToTextMap[props.status]} onClose={props.onClose} />;
};
