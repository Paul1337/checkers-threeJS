// import { modulesController } from './modulesController';

// modulesController.createWorldModule();
// modulesController.createGameModule();

import { createRoot } from 'react-dom/client';
import { App } from './app/ui/App/App';
import './index.css';

const root = createRoot(document.getElementById('root-container'));
root.render(<App />);
