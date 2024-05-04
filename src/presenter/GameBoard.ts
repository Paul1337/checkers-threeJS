import * as THREE from 'three';
import woodAsset from './assets/wood2.jpg';

export class GameBoard {
    readonly group: THREE.Group;

    private readonly SquareSize = 1;

    constructor(width: number, height: number) {
        this.group = new THREE.Group();

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
                this.group.add(square);
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
        this.group.add(board);
    }
}
