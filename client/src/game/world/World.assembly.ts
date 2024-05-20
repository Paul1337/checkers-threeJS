import { WorldPresenter } from './presenter/World.presenter';

export class World {
    readonly worldPresenter: WorldPresenter;

    constructor() {
        this.worldPresenter = new WorldPresenter();
    }
}
