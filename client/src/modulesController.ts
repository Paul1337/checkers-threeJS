import { Game } from './game/Game.assembly';
import { Shared } from './shared/shared.assembly';
import { World } from './world/World.assembly';

export interface ModulesMap {
    world: World;
    game: Game;
    shared: Shared;
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

    createSharedModule() {
        this.modules.shared = new Shared();
    }
}

export const modulesController = new ModulesController();
