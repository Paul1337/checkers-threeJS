import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Menu } from '../../../menu/ui/Menu/Menu';
import { Game } from '../../../game/ui/Game/Game';

const router = createBrowserRouter([
    {
        path: '/',
        element: <Menu />,
    },
    {
        path: 'game',
        element: <Game />,
    },
]);

export const AppRouter = () => {
    return <RouterProvider router={router} />;
};
