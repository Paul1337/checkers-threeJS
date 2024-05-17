import * as THREE from 'three';
import { modulesController } from '../../../modulesController';
import { WorldPresenter } from '../../../world/presenter/World.presenter';
import woodAsset from '../assets/wood2.jpg';
import { presenterConfig } from '../Presenter.config';
import { Table } from './Table.presenter';
import { GameService } from '../../../../../shared/game/domain/Game.service';
import { Point } from '../../../../../shared/game/domain/entities/Point.entity';
import { ClientGameService } from '../../domain/ClientGame.service';

type PlaneMeshType = THREE.Mesh<THREE.PlaneGeometry, THREE.MeshStandardMaterial>;

export class GameBoard {
    readonly object: THREE.Object3D;
    private squares: PlaneMeshType[];

    private readonly worldPresenter: WorldPresenter;

    constructor(private gameService: ClientGameService) {
        const { width, height } = gameService.matrix;
        this.object = new THREE.Group();

        this.squares = [];

        const { size: cellSize } = presenterConfig.board.cell;

        for (let i = 0; i < height; i++) {
            for (let j = 0; j < width; j++) {
                const planeGeometry = new THREE.PlaneGeometry(cellSize, cellSize);
                const material = new THREE.MeshStandardMaterial({
                    color: (i + j) % 2 == 0 ? 0x000000 : 0xb0b0b0,
                    metalness: 1,
                    // roughness: 0.5,
                    side: THREE.DoubleSide,
                });
                const square = new THREE.Mesh(planeGeometry, material);
                square.position.set(j * cellSize + cellSize * 0.5, 0, i * cellSize + cellSize * 0.5);
                square.rotateX(-Math.PI / 2);
                this.squares.push(square);
                square.userData.defaultColor = square.material.color;
                square.userData.position = new Point(j, i);
                this.object.add(square);
            }
        }

        const texture = new THREE.TextureLoader().load(woodAsset);
        const boxGeometry = new THREE.BoxGeometry(cellSize * height, cellSize * width, 0.7);
        const board = new THREE.Mesh(
            boxGeometry,
            new THREE.MeshStandardMaterial({ map: texture, color: 0xb37260 })
        );
        board.rotateX(-Math.PI / 2);
        board.position.set(
            (cellSize * height) / 2,
            -presenterConfig.board.height - 0.01,
            (cellSize * width) / 2
        );
        this.object.add(board);

        const table = new Table(
            board.position
                .clone()
                .add({ y: -cellSize * width * 2 - presenterConfig.board.height, z: 0, x: 0 }),
            new THREE.Vector3(cellSize * height * 2, cellSize * width * 2, cellSize * width * 2)
        );

        if (!modulesController.modules.world) {
            throw new Error('World is not defined at gameBoard');
        }

        this.worldPresenter = modulesController.modules.world.worldPresenter;
        this.worldPresenter.scene.add(this.object);

        this.listenToEvents();
    }

    listenToEvents() {
        document.addEventListener('mousemove', this.handleMouseMove.bind(this));
        document.addEventListener('click', this.handleMouseDown.bind(this));
    }

    // private pointer: THREE.Vector2;
    private hoveredCell: PlaneMeshType | null = null;
    private selectedCell: PlaneMeshType | null = null;

    unmarkCells() {
        this.squares.forEach(square => {
            square.material.emissive = square.userData.defaultColor;
        });
    }

    markCells(cells: Point[]) {
        for (const cell of cells) {
            const square = this.squares.find(square => cell.equals(square.userData.position));
            if (square) {
                square.material.emissive = new THREE.Color(0x32a852);
            }
        }
    }

    public onCellClick?: (position: Point) => void;

    handleMouseDown(event: MouseEvent) {
        if (this.hoveredCell) {
            this.onCellClick?.(this.hoveredCell.userData.position);
        }
    }

    handleMouseMove(event: MouseEvent) {
        const pointer = new THREE.Vector2();
        pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
        pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(pointer, this.worldPresenter.camera);
        const intersects = raycaster.intersectObjects<PlaneMeshType>(this.squares, false);
        if (intersects.length > 0) {
            if (this.hoveredCell !== intersects[0].object) {
                if (this.selectedCell !== intersects[0].object) {
                    this.hoveredCell = intersects[0].object;
                }
            }
        } else {
            this.hoveredCell = null;
        }
    }
}
