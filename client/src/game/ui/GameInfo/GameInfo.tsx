import React, { useEffect, useState } from 'react';
import { Button } from '../../../shared/ui/Button/Button';
import { network } from '../../../shared/api/network.api';
import { observer } from 'mobx-react';
import { ClientGameService } from '../../domain/ClientGame.service';
import { PointType } from '@shared/game/domain/entities/Matrix/Matrix.entity';

export interface GameInfoProps {
    gameService: ClientGameService;
}

export const GameInfo = observer(({ gameService }: GameInfoProps) => {
    useEffect(() => {}, []);

    const handleFinishGameClick = () => {
        network.emit('finish-game', undefined);
    };

    return (
        <div className='absolute p-4 right-1 top-1 rounded-md bg-slate-200 bg-opacity-70'>
            <div>
                <p className='text-md'>
                    Мой цвет:{' '}
                    <span className='font-semibold'>
                        {gameService.me.pointType === PointType.White ? 'белый' : 'чёрный'}
                    </span>
                </p>
                <p className='text-md font-semibold'>
                    {gameService.myTurn ? 'Мой ход' : 'Ход противника'}
                </p>
            </div>
            <Button onClick={handleFinishGameClick} className='block mx-auto'>
                Закончить игру
            </Button>
        </div>
    );
});
