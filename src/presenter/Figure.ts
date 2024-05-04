import * as THREE from 'three';

export enum FigureType {
    White,
    Black,
}

export interface FigureConfig {
    radius: number;
    height: number;
}

export class Figure {
    readonly object: THREE.Object3D;

    constructor(type: FigureType, private config: FigureConfig) {
        const geometry = new THREE.CylinderGeometry(config.radius, config.radius, config.height, 32);
        const figure = new THREE.Mesh(
            geometry,
            new THREE.MeshLambertMaterial({
                color: type === FigureType.Black ? 0x303030 : 0xffffff,
            })
        );
        // figure.position.z = 0.5 + Math.floor(i / 4) * figure.geometry.parameters.radiusBottom * 2;
        // figure.position.x =
        //     0.5 +
        //     (1 - (Math.floor(i / 4) % 2)) +
        //     (i % 4) * 2 * figure.geometry.parameters.radiusBottom * 2;
        // figure.position.y = figure.geometry.parameters.height / 2;

        figure.castShadow = true;
        figure.receiveShadow = true;

        this.object = figure;
    }
}
