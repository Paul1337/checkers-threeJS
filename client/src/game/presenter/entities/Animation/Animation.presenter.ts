import * as THREE from 'three';
import { presenterConfig } from '../../Presenter.config';

export interface AnimationConfig {
    positionFrom: THREE.Vector3;
    positionTo: THREE.Vector3;

    alphaFrom?: THREE.Euler;
    alphaTo?: THREE.Euler;

    time: number;
    onDone?: () => void;
}

export abstract class Animation {
    private currentTime = 0;
    protected part: number = 0;
    public currentPoint: THREE.Vector3;
    public currentAlpha?: THREE.Euler;
    private isRunning = true;

    private lastTime: number;

    constructor(protected animationConfig: AnimationConfig) {
        this.currentPoint = this.animationConfig.positionFrom?.clone() ?? new THREE.Vector3(0, 0, 0);
        this.currentAlpha = this.animationConfig.alphaFrom?.clone();
        this.lastTime = performance.now();
    }

    get isFinished() {
        return this.part === 1;
    }

    abstract getCurrentPosition(): THREE.Vector3;
    abstract getCurrentAlpha(): THREE.Euler;

    applyTo(object: THREE.Object3D) {
        object.position.copy(this.currentPoint);
        if (this.currentAlpha) object.rotation.copy(this.currentAlpha);
    }

    update() {
        const now = performance.now();
        const delta = now - this.lastTime;
        this.lastTime = now;
        this.currentTime += delta;
        this.part = this.currentTime / this.animationConfig.time;

        if (this.part > 1) this.part = 1;

        this.currentPoint.copy(this.getCurrentPosition());
        if (this.currentAlpha) this.currentAlpha.copy(this.getCurrentAlpha());

        if (this.isFinished && this.isRunning) {
            this.animationConfig.onDone?.();
            this.isRunning = false;
        }
    }
}
