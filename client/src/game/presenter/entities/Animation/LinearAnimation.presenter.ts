import * as THREE from 'three';
import { Animation } from './Animation.presenter';

export class LinearAnimation extends Animation {
    override getCurrentPosition() {
        return new THREE.Vector3(
            this.from.x + (this.to.x - this.from.x) * this.part,
            this.from.y + (this.to.y - this.from.y) * this.part,
            this.from.z + (this.to.z - this.from.z) * this.part
        );
    }
}
