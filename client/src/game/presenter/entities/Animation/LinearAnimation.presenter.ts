import * as THREE from 'three';
import { Animation } from './Animation.presenter';

export class LinearAnimation extends Animation {
    override getCurrentPosition() {
        if (!this.animationConfig.positionFrom) return new THREE.Vector3(0, 0, 0);
        return new THREE.Vector3(
            this.animationConfig.positionFrom.x +
                (this.animationConfig.positionTo.x - this.animationConfig.positionFrom.x) * this.part,
            this.animationConfig.positionFrom.y +
                (this.animationConfig.positionTo.y - this.animationConfig.positionFrom.y) * this.part,
            this.animationConfig.positionFrom.z +
                (this.animationConfig.positionTo.z - this.animationConfig.positionFrom.z) * this.part
        );
    }

    override getCurrentAlpha(): THREE.Euler {
        if (!this.animationConfig.alphaFrom || !this.animationConfig.alphaTo)
            return new THREE.Euler(0, 0, 0);
        return new THREE.Euler(
            this.animationConfig.alphaFrom.x +
                (this.animationConfig.alphaTo.x - this.animationConfig.alphaFrom.x) * this.part,
            this.animationConfig.alphaFrom.y +
                (this.animationConfig.alphaTo.y - this.animationConfig.alphaFrom.y) * this.part,
            this.animationConfig.alphaFrom.z +
                (this.animationConfig.alphaTo.z - this.animationConfig.alphaFrom.z) * this.part
        );
    }
}
