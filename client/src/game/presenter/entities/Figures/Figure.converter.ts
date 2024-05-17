import { Point } from '@shared/game/domain/entities/Point.entity';
import * as THREE from 'three';
import { presenterConfig } from '../../Presenter.config';

export class FigureConverter {
    constructor() {}

    static convertToPresenterPosition(position: Point) {
        return new THREE.Vector3(
            0.5 + position.x * presenterConfig.figure.radius * 2,
            presenterConfig.figure.height / 2,
            0.5 + position.y * presenterConfig.figure.radius * 2
        );
    }
}
