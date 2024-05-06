import * as THREE from 'three';
import woodAsset from './assets/wood2.jpg';
import { MatrixBoundary } from '../domain/boundaries/MatrixBoundary';

export interface GameBoardConfig {
    width: number;
    height: number;
}

export class GameBoard {
    readonly object: THREE.Object3D;

    private readonly SquareSize = 1;

    constructor({ width, height }: GameBoardConfig, private matrix: MatrixBoundary) {
        this.object = new THREE.Group();

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

        this.listenToEvents();
    }

    listenToEvents() {
        document.addEventListener('mousemove', this.handleMouseMove.bind(this));
    }

    handleMouseMove(event: MouseEvent) {
        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(pointer, camera);
        const intersects = raycaster.intersectObjects(scene.children, false);
        if (intersects.length > 0) {
            if (INTERSECTED != intersects[0].object) {
                if (INTERSECTED) INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex);
                INTERSECTED = intersects[0].object;
                INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex();
                INTERSECTED.material.emissive.setHex(0xff0000);
            }
        } else {
            if (INTERSECTED) INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex);
            INTERSECTED = null;
        }
    }
}
