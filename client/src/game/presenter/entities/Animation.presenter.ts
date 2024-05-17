import * as THREE from 'three';
import { presenterConfig } from '../Presenter.config';

export class Animation {
    private time = presenterConfig.animation.time;
    private currentTime = 0;
    private share: number = 0;
    public currentPoint: THREE.Vector3;
    private isRunning = true;

    constructor(public from: THREE.Vector3, public to: THREE.Vector3, private onDone?: () => void) {
        this.currentPoint = from.clone();
    }

    get isFinished() {
        return this.share === 1;
    }

    update() {
        this.currentTime++;
        this.share = this.currentTime / this.time;

        if (this.share > 1) this.share = 1;

        this.currentPoint.set(
            this.from.x + (this.to.x - this.from.x) * this.share,
            this.from.y + (this.to.y - this.from.y) * this.share,
            this.from.z + (this.to.z - this.from.z) * this.share
        );

        if (this.isFinished && this.isRunning) {
            this.onDone?.();
            this.isRunning = false;
        }
    }
}
