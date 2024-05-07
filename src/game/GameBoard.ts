import * as THREE from 'three';
import woodAsset from '../assets/wood2.jpg';
import { world } from './World';

export interface GameBoardConfig {
    width: number;
    height: number;
}

export class GameBoard {
    readonly object: THREE.Object3D;
    private squares: THREE.Object3D[];

    private readonly SquareSize = 1;

    private pointer: THREE.Vector2;
    private INTERSECTED: THREE.Object3D | null = null;

    constructor({ width, height }: GameBoardConfig) {
        this.object = new THREE.Group();

        this.squares = [];
        this.pointer = new THREE.Vector2();

        for (let i = 0; i < height; i++) {
            for (let j = 0; j < width; j++) {
                const planeGeometry = new THREE.PlaneGeometry(this.SquareSize, this.SquareSize);
                const material = new THREE.MeshBasicMaterial({
                    color: (i + j) % 2 == 0 ? 0x000000 : 0xb0b0b0,
                    side: THREE.DoubleSide,
                });
                const square = new THREE.Mesh(planeGeometry, material);
                square.position.set(
                    i * this.SquareSize + this.SquareSize * 0.5,
                    0,
                    j * this.SquareSize + this.SquareSize * 0.5
                );
                square.rotateX(-Math.PI / 2);
                this.squares.push(square);
                this.object.add(square);
            }
        }

        const texture = new THREE.TextureLoader().load(woodAsset);
        const boxGeometry = new THREE.BoxGeometry(
            this.SquareSize * height,
            this.SquareSize * width,
            0.7
        );
        const board = new THREE.Mesh(boxGeometry, new THREE.MeshStandardMaterial({ map: texture }));
        board.rotateX(-Math.PI / 2);
        board.position.set((this.SquareSize * height) / 2, -0.35 - 0.01, (this.SquareSize * width) / 2);
        this.object.add(board);
        world.scene.add(this.object);
    }

    handleMouseMove(event: MouseEvent) {
        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(this.pointer, world.camera);
        const intersects = raycaster.intersectObjects(this.squares, false);
        if (intersects.length > 0) {
            // intersects[0].object.
            if (this.INTERSECTED != intersects[0].object) {
                // if (this.INTERSECTED)
                //     this.INTERSECTED. .setHex(this.INTERSECTED.currentHex);
                this.INTERSECTED = intersects[0].object;
                // this.INTERSECTED.currentHex = this.INTERSECTED.material.emissive.getHex();
                // this.INTERSECTED.material.emissive.setHex(0xff0000);
            }
        } else {
            if (this.INTERSECTED) this.INTERSECTED.material.emissive.setHex(this.INTERSECTED.currentHex);
            this.INTERSECTED = null;
        }
    }
}
