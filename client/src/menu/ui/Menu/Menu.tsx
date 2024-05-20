import { JoinResultDto } from '@shared/game/dto/JoinResult.dto';
import { FC, useState } from 'react';
import { network } from '../../../shared/api/network.api';
import { Button } from '../../../shared/ui/Button/Button';

interface MenuProps {
    onJoinClick: (id: string) => void;
}

export const Menu: FC<MenuProps> = ({ onJoinClick }) => {
    const [joinId, setJoinId] = useState('');
    const [newGameId, setNewGameId] = useState('');

    const handleNewGameClick = () => {
        network.emit('new-game', (gameId: string) => {
            setNewGameId(gameId);
        });
    };

    return (
        <div className='bg-gray-200 h-full w-full absolute left-0 top-0 bg-opacity-50'>
            <h1 className='text-center text-4xl mb-4'>Simple checkers</h1>
            <div className='flex justify-center gap-4 px-2 max-w-[80%] mx-auto flex-col md:flex-row'>
                <div className='flex flex-col justify-stretch border p-4 bg-gray-300 flex-1'>
                    <input
                        className='p-2 rounded-md outline-black'
                        value={joinId}
                        onChange={e => setJoinId(e.target.value)}
                        type='text'
                        placeholder='id игры'
                    />
                    <Button className='' onClick={() => onJoinClick(joinId)}>
                        Присоединиться
                    </Button>
                </div>
                <div className='border flex flex-col justify-stretch p-4 bg-gray-300  flex-1'>
                    <Button onClick={handleNewGameClick}>Новая игра</Button>
                    <p className='mt-2 text-center'>
                        Нажми, чтобы создать новую игру, после чего друг сможет присоединиться по id
                    </p>
                    {newGameId && <p className='text-lg text-red font-semibold'>id: {newGameId}</p>}
                </div>
            </div>
        </div>
    );
};
