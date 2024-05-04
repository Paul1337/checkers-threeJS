import * as THREE from 'three';
import woodAsset from './assets/wood2.jpg';

export const initGameBoard = (scene: THREE.Scene) => {
    const M = 8;
    const N = 8;

    const SquareSize = 1;

    for (let i = 0; i < M; i++) {
        for (let j = 0; j < N; j++) {
            const planeGeometry = new THREE.PlaneGeometry(SquareSize, SquareSize);
            const material = new THREE.MeshBasicMaterial({
                color: (i + j) % 2 == 0 ? 0x000000 : 0xb0b0b0,
                side: THREE.DoubleSide,
            });
            const square = new THREE.Mesh(planeGeometry, material);
            square.position.set(i * SquareSize + SquareSize * 0.5, 0, j * SquareSize + SquareSize * 0.5);
            square.rotateX(-Math.PI / 2);
            scene.add(square);
        }
    }

    // const texture = loader.load([woodAsset, woodAsset, woodAsset, woodAsset, woodAsset, woodAsset]);
    var texture = new THREE.TextureLoader().load(woodAsset);

    const boxGeometry = new THREE.BoxGeometry(SquareSize * M, SquareSize * N, 0.7);
    const board = new THREE.Mesh(
        boxGeometry,
        new THREE.MeshStandardMaterial({ map: texture })
        // new THREE.MeshStandardMaterial({
        //     color: 0xb0b0b0,
        // })
    );
    board.rotateX(-Math.PI / 2);
    board.position.set((SquareSize * M) / 2, -0.35 - 0.01, (SquareSize * N) / 2);
    scene.add(board);
};
