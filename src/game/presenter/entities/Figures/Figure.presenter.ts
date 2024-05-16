import * as THREE from 'three';
import { presenterConfig } from '../../Presenter.config';
import { PointType } from '../../../domain/entities/Matrix.entity';
import { Point } from '../../../domain/entities/Point.entity';
import { Animation } from '../Animation.presenter';

export interface FigureConfig {
    radius: number;
    height: number;
}

export type FigureObjectType = THREE.Mesh<THREE.CylinderGeometry, THREE.MeshStandardMaterial>;

export class Figure {
    readonly object: FigureObjectType;
    readonly pointType: PointType;

    private defaultPosition: THREE.Vector3;
    private liftedPosition: THREE.Vector3;
    private defaultColor: THREE.Color;

    private isSelected: boolean;

    private movingAnimation?: Animation;
    private destinationGamePosition?: Point;

    constructor(type: PointType, public gamePosition: Point) {
        const config = presenterConfig.figure;
        const geometry = new THREE.CylinderGeometry(config.radius, config.radius, config.height, 32);
        const figure = new THREE.Mesh(
            geometry,
            new THREE.MeshStandardMaterial({
                metalness: 0.4,
                roughness: 0.2,
                color: type === PointType.Black ? 0x303030 : 0xffffff,
            })
        );
        this.pointType = type;

        const position = new THREE.Vector3(
            0.5 + gamePosition.x * presenterConfig.figure.radius * 2,
            presenterConfig.figure.height / 2,
            0.5 + gamePosition.y * presenterConfig.figure.radius * 2
        );

        figure.position.set(position.x, position.y, position.z);
        figure.castShadow = true;
        figure.receiveShadow = true;

        this.liftedPosition = position.clone();
        this.liftedPosition.setY(this.liftedPosition.y + 0.2);
        this.defaultPosition = position.clone();
        this.defaultColor = figure.material.emissive.clone();

        this.object = figure;
        this.isSelected = false;
    }

    select() {
        this.object.position.set(this.liftedPosition.x, this.liftedPosition.y, this.liftedPosition.z);
        this.object.material.emissive.set(0x32a852);

        this.isSelected = true;
    }

    unselect() {
        this.object.position.set(this.defaultPosition.x, this.defaultPosition.y, this.defaultPosition.z);
        this.object.material.emissive.set(this.defaultColor);

        this.isSelected = false;
    }

    hover() {
        if (this.isSelected) return;
        if (this.pointType === PointType.White) {
            this.object.material.emissive.setRGB(0.2, 0.2, 0.2);
        } else {
            this.object.material.emissive.setRGB(0.05, 0.05, 0.05);
        }
    }

    unhover() {
        if (this.isSelected) return;
        this.object.material.emissive.set(this.defaultColor);
    }

    animateTo(position: Point) {
        const resultPosition = new THREE.Vector3(
            0.5 + position.x * presenterConfig.figure.radius * 2,
            this.defaultPosition.y,
            0.5 + position.y * presenterConfig.figure.radius * 2
        );
        this.movingAnimation = new Animation(this.object.position.clone(), resultPosition);
        this.destinationGamePosition = position;
    }

    moveTo(position: Point) {
        this.gamePosition = position;

        // const newPosition = new THREE.Vector3(
        //     0.5 + this.gamePosition.x * presenterConfig.figure.radius * 2,
        //     this.defaultPosition.y,
        //     0.5 + this.gamePosition.y * presenterConfig.figure.radius * 2
        // );

        // this.object.position.set(newPosition.x, newPosition.y, newPosition.z);
        this.defaultPosition = this.object.position.clone();

        this.liftedPosition = this.defaultPosition.clone();
        this.liftedPosition.setY(this.liftedPosition.y + 0.2);
    }

    updateAnimations() {
        if (this.movingAnimation) {
            this.movingAnimation.update();
            this.object.position.copy(this.movingAnimation.currentPoint);
            if (this.movingAnimation.isFinished) {
                this.moveTo(this.destinationGamePosition!);
                this.movingAnimation = undefined;
                // this.unselect();
            }
        }
    }
}
