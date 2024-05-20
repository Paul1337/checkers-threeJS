import * as THREE from 'three';
import { Animation } from './Animation.presenter';
import { presenterConfig } from '../../Presenter.config';

export class CapturingAnimation extends Animation {
    override getCurrentPosition() {
        const a = 4;
        const b = -presenterConfig.figure.height / 2 + this.animationConfig.positionFrom.y - a;
        const c = this.animationConfig.positionFrom.y;

        return new THREE.Vector3(
            this.animationConfig.positionFrom.x +
                (this.animationConfig.positionTo.x - this.animationConfig.positionFrom.x) * this.part,
            -a * this.part ** 2 - b * this.part + c,
            this.animationConfig.positionFrom.z +
                (this.animationConfig.positionTo.z - this.animationConfig.positionFrom.z) * this.part
        );
    }

    override getCurrentAlpha(): THREE.Euler {
        return new THREE.Euler(0, 0, 0);
    }
}
