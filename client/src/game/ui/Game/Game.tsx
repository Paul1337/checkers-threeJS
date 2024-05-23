import React, { useEffect, useState } from 'react';
import { modulesController } from '../../gameModulesController';
import { GameInfo } from '../GameInfo/GameInfo';
import { useModal } from '../../../shared/hooks/useModal';
import { GameEndModal } from '../GameEndModal/GameEndModal';
import { network } from '../../../shared/api/network.api';
import { GameEndDto, GameResult } from '@shared/game/dto/GameEnd.dto';
import { GameStartDto } from '@shared/game/dto/GameStart.dto';
import { Menu } from '../../../menu/ui/Menu/Menu';
import { JoinResultDto } from '@shared/game/dto/JoinResult.dto';

export const Game = () => {
    const gameEndModal = useModal();
    const [gameModulesReady, setGameModulesReady] = useState(false);
    const [gameEndStatus, setGameEndStatus] = useState<GameResult>(GameResult.Draw);
    const [inGame, setInGame] = useState(false);

    useEffect(() => {
        console.log('init modules');
        modulesController.init();

        network.on('game-end', (gameEndDto: GameEndDto) => {
            setGameEndStatus(gameEndDto.result);
            gameEndModal.show();
            setInGame(false);
        });

        network.on('game-start', (gameStartDto: GameStartDto) => {
            console.log('game-start', gameStartDto);
            modulesController.modules.game?.gameService.start(gameStartDto);
            setInGame(true);
        });

        setGameModulesReady(true);
    }, []);

    const handleJoinClick = (joinId: string) => {
        network.emit('join-game', joinId, (joinResult: JoinResultDto) => {
            console.log('join result', joinResult);
            if (joinResult.success) {
                modulesController.modules.game?.gameService.start(joinResult.gameStartDto!);
                setInGame(true);
            }
        });
    };

    return (
        <div id='game-container'>
            {!inGame && <Menu onJoinClick={handleJoinClick} />}
            {inGame && gameModulesReady && <GameInfo />}
            {gameEndModal.isShown && <GameEndModal status={gameEndStatus} onClose={gameEndModal.hide} />}
        </div>
    );
};
