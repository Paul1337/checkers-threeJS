import * as THREE from 'three';
import { Animation } from './Animation.presenter';
import { presenterConfig } from '../../Presenter.config';

export class CapturingAnimation extends Animation {
    override getCurrentPosition() {
        const a = 4;
        const b = -presenterConfig.figure.height / 2 + this.from.y - a;
        const c = this.from.y;

        return new THREE.Vector3(
            this.from.x + (this.to.x - this.from.x) * this.part,
            -a * this.part ** 2 - b * this.part + c,
            this.from.z + (this.to.z - this.from.z) * this.part
        );
    }
}
