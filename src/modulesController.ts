import { Game } from './game/Game.assembly';
import { World } from './world/World.assembly';

export interface ModulesMap {
    world: World;
    game: Game;
}

export class ModulesController {
    readonly modules: Partial<ModulesMap>;

    constructor() {
        this.modules = {};
    }

    createWorldModule() {
        this.modules.world = new World();
    }

    createGameModule() {
        this.modules.game = new Game();
    }
}

export const modulesController = new ModulesController();
