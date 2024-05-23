import * as THREE from 'three';
import { presenterConfig } from '../../Presenter.config';
import { PointType } from '../../../../../../shared/game/domain/entities/Matrix/Matrix.entity';
import { Point } from '../../../../../../shared/game/domain/entities/Point.entity';
import { Animation } from '../Animation/Animation.presenter';
import { CapturingAnimation } from '../Animation/CapturingAnimation.presenter';
import { LinearAnimation } from '../Animation/LinearAnimation.presenter';
import { FigureConverter } from './Figure.converter';

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

    public isQueen = false;

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

    makeQueen() {
        this.isQueen = true;
        const config = presenterConfig.figure;
        const markHeight = config.height * 0.1;
        const queenMark = new THREE.Mesh(
            new THREE.CylinderGeometry(config.radius * 0.5, config.radius * 0.5, markHeight, 32),
            new THREE.MeshStandardMaterial({
                metalness: 0.4,
                roughness: 0.2,
                color: 0xff0000,
            })
        );
        queenMark.position.set(0, -(config.height / 2 + markHeight / 2), 0);
        this.object.add(queenMark);

        const liftedPosition = this.liftedPosition.clone().setY(this.liftedPosition.y + 1.2);
        this.movingAnimation = new LinearAnimation({
            positionFrom: this.object.position.clone(),
            positionTo: liftedPosition,
            alphaFrom: this.object.rotation.clone(),
            alphaTo: new THREE.Euler((1 * Math.PI) / 2, 0, 0),
            time: Math.floor(presenterConfig.animation.queenBecoming / 2),
            onDone: () => {
                this.movingAnimation = new LinearAnimation({
                    positionFrom: this.object.position.clone(),
                    positionTo: this.defaultPosition,
                    alphaFrom: this.object.rotation.clone(),
                    alphaTo: new THREE.Euler(Math.PI, 0, 0),
                    time: Math.floor(presenterConfig.animation.queenBecoming / 2),
                });
            },
        });
    }

    select() {
        this.object.material.emissive.set(0x32a852);

        this.isSelected = true;
    }

    lift() {
        this.movingAnimation = new LinearAnimation({
            positionFrom: this.object.position.clone(),
            positionTo: this.liftedPosition.clone(),
            time: presenterConfig.animation.liftFigureTime,
        });
    }

    unselect() {
        this.object.material.emissive.set(this.defaultColor);
        this.isSelected = false;
    }

    unlift() {
        this.movingAnimation = new LinearAnimation({
            positionFrom: this.object.position.clone(),
            positionTo: this.defaultPosition.clone(),
            time: presenterConfig.animation.liftFigureTime,
        });
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
        this.movingAnimation = new LinearAnimation({
            positionFrom: this.object.position.clone(),
            positionTo: resultPosition,
            time: presenterConfig.animation.linearMoveTime,
            onDone,
        });
    }

    animateToCapturing(position: Point, onDone: () => void) {
        const resultPosition = FigureConverter.convertToPresenterPosition(position);
        this.movingAnimation = new CapturingAnimation({
            positionFrom: this.object.position.clone(),
            positionTo: resultPosition,
            time: presenterConfig.animation.captureMoveTime,
            onDone,
        });
    }

    moveTo(position: Point) {
        this.gamePosition = position;
        this.defaultPosition = this.object.position.clone();
        this.liftedPosition = this.defaultPosition.clone();
        this.liftedPosition.setY(this.liftedPosition.y + 0.2);
    }

    updateAnimations() {
        if (this.movingAnimation) {
            this.movingAnimation.update();
            this.movingAnimation.applyTo(this.object);
            // this.object.position.copy(this.movingAnimation.currentPoint);
            // this.object.rotation.copy(this.movingAnimation.currentAlpha);
            if (this.movingAnimation.isFinished) {
                this.movingAnimation = undefined;
            }
        }
    }
}
