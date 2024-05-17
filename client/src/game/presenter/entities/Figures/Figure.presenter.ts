import * as THREE from 'three';
import { presenterConfig } from '../../Presenter.config';
// import { PointType } from '../../../domain/entities/Matrix.entity';
// import { Point } from '../../../domain/entities/Point.entity';
import { Animation } from '../Animation/Animation.presenter';
import { PointType } from '../../../../../../shared/game/domain/entities/Matrix.entity';
import { Point } from '../../../../../../shared/game/domain/entities/Point.entity';
import { LinearAnimation } from '../Animation/LinearAnimation.presenter';
import { FigureConverter } from './Figure.converter';
import { CapturingAnimation } from '../Animation/CapturingAnimation.presenter';

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

    constructor(type: PointType, public gamePosition: Point) {
        const config = presenterConfig.figure;
        const geometry = new THREE.CylinderGeometry(config.radius, config.radius, config.height, 32);
        const figure = new THREE.Mesh(
            geometry,
            new THREE.MeshStandardMaterial({
                metalness: 0.4,
                roughness: 0.2,
                color: type === PointType.Black ? 0x303030 : 0xdbd197, //0xc7c7c7,
            })
        );
        this.pointType = type;

        figure.position.copy(FigureConverter.convertToPresenterPosition(gamePosition));
        figure.castShadow = true;
        figure.receiveShadow = true;

        this.liftedPosition = figure.position.clone();
        this.liftedPosition.setY(this.liftedPosition.y + 0.2);
        this.defaultPosition = figure.position.clone();
        this.defaultColor = figure.material.emissive.clone();

        this.object = figure;
        this.isSelected = false;
    }

    select() {
        this.object.material.emissive.set(0x32a852);

        this.isSelected = true;
    }

    lift() {
        this.movingAnimation = new LinearAnimation(
            this.object.position.clone(),
            this.liftedPosition.clone(),
            presenterConfig.animation.liftFigureTime
        );
    }

    unselect() {
        this.object.material.emissive.set(this.defaultColor);
        this.isSelected = false;
    }

    unlift() {
        this.movingAnimation = new LinearAnimation(
            this.object.position.clone(),
            this.defaultPosition.clone(),
            presenterConfig.animation.liftFigureTime
        );
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

    animateToLinear(position: Point, onDone: () => void) {
        const resultPosition = FigureConverter.convertToPresenterPosition(position);
        this.movingAnimation = new LinearAnimation(
            this.object.position.clone(),
            resultPosition,
            presenterConfig.animation.linearMoveTime,
            onDone
        );
    }

    animateToCapturing(position: Point, onDone: () => void) {
        const resultPosition = FigureConverter.convertToPresenterPosition(position);
        this.movingAnimation = new CapturingAnimation(
            this.object.position.clone(),
            resultPosition,
            presenterConfig.animation.captureMoveTime,
            onDone
        );
    }

    // animate(animation: Animation) {
    //     this.movingAnimation = animation;
    // }

    moveTo(position: Point) {
        this.gamePosition = position;
        this.defaultPosition = this.object.position.clone();
        this.liftedPosition = this.defaultPosition.clone();
        this.liftedPosition.setY(this.liftedPosition.y + 0.2);
    }

    updateAnimations() {
        if (this.movingAnimation) {
            this.movingAnimation.update();
            this.object.position.copy(this.movingAnimation.currentPoint);
            if (this.movingAnimation.isFinished) {
                this.movingAnimation = undefined;
            }
        }
    }
}
