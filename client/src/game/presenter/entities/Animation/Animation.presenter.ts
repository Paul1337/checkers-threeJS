import * as THREE from 'three';
import { presenterConfig } from '../../Presenter.config';

export abstract class Animation {
    private currentTime = 0;
    protected part: number = 0;
    public currentPoint: THREE.Vector3;
    private isRunning = true;

    constructor(
        public from: THREE.Vector3,
        public to: THREE.Vector3,
        private time: number,
        private onDone?: () => void
    ) {
        this.currentPoint = from.clone();
    }

    get isFinished() {
        return this.part === 1;
    }

    abstract getCurrentPosition(): THREE.Vector3;

    update() {
        this.currentTime++;
        this.part = this.currentTime / this.time;

        if (this.part > 1) this.part = 1;

        this.currentPoint.copy(this.getCurrentPosition());

        if (this.isFinished && this.isRunning) {
            this.onDone?.();
            this.isRunning = false;
        }
    }
}
