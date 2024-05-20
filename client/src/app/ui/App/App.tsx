import React, { useEffect } from 'react';
import { AppRouter } from '../AppRouter/AppRouter';
import { network } from '../../../shared/api/network.api';
import { Game } from '../../../game/ui/Game/Game';

export const App = () => {
    useEffect(() => {
        console.log('connect socket');
        network.connect();
    });

    return <Game />;
};
