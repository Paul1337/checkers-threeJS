import { Game } from './Game.assembly';
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

    init() {
        this.createWorldModule();
        this.createGameModule();
    }

    createWorldModule() {
        this.modules.world = new World();
    }

    createGameModule() {
        this.modules.game = new Game();
    }
}

export const modulesController = new ModulesController();
