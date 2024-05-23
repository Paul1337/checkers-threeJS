import { PointType } from '@shared/game/domain/entities/Matrix/Matrix.entity';
import { useEffect, useRef } from 'react';
import { network } from '../../../shared/api/network.api';
import { Button } from '../../../shared/ui/Button/Button';
import { ClientGameService } from '../../domain/ClientGame.service';
import { modulesController } from '../../gameModulesController';

export interface GameInfoProps {
    // gameService: GameInfo;
}

export const GameInfo = () => {
    const myColorRef = useRef<HTMLSpanElement | null>(null);
    const myTurnRef = useRef<HTMLParagraphElement | null>(null);
    const gameServiceRef = useRef<ClientGameService | null>(null);

    useEffect(() => {
        const gameService = modulesController.modules.game!.gameService;
        gameServiceRef.current = gameService;

        if (!myColorRef.current || !myTurnRef.current) throw 'Strange error - not defined current';

        myColorRef.current.textContent =
            gameServiceRef.current.me.pointType === PointType.White ? 'белый' : 'чёрный';
        myTurnRef.current.textContent = gameService.myTurn ? 'Мой ход' : 'Ход противника';
        gameService.eventEmmiter.on('turn-switch', () => {
            myTurnRef.current!.textContent = gameService.myTurn ? 'Мой ход' : 'Ход противника';
        });
    }, []);

    const handleFinishGameClick = () => {
        network.emit('finish-game', undefined);
    };

    return (
        <div className='absolute p-4 right-1 top-1 rounded-md bg-slate-200 bg-opacity-70'>
            <div>
                <p className='text-md'>
                    Мой цвет: <span className='font-semibold' ref={myColorRef} />
                </p>
                <p className='text-md font-semibold' ref={myTurnRef} />
            </div>
            <Button onClick={handleFinishGameClick} className='block mx-auto'>
                Закончить игру
            </Button>
        </div>
    );
};
