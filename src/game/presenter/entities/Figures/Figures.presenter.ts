import * as THREE from 'three';
import { modulesController } from '../../../../modulesController';
import { WorldPresenter } from '../../../../world/presenter/World.presenter';
import { PointType } from '../../../domain/entities/Matrix.entity';
import { Point } from '../../../domain/entities/Point.entity';
import { GameService } from '../../../domain/Game.service';
import { GameBoard } from '../GameBoard.presenter';
import { Figure, FigureObjectType } from './Figure.presenter';

export class FiguresPresenter {
    figures: Figure[] = [];
    private worldPresenter: WorldPresenter;

    constructor(private gameService: GameService, private board: GameBoard) {
        if (!modulesController.modules.world) {
            throw new Error('world is not defined in figures presenter');
        }
        const { matrix } = gameService;
        this.worldPresenter = modulesController.modules.world.worldPresenter;
        for (let i = 0; i < matrix.height; i++) {
            for (let j = 0; j < matrix.width; j++) {
                const pointType = matrix.get(new Point(j, i));
                if (pointType === PointType.Empty) continue;
                const figure = new Figure(pointType, new Point(j, i));
                this.worldPresenter.scene.add(figure.object);

                this.figures.push(figure);
            }
        }
        this.listenToEvents();
    }

    listenToEvents() {
        document.addEventListener('mousemove', this.handleMouseMove.bind(this));
        document.addEventListener('mousedown', this.handleMouseDown.bind(this));

        this.board.onCellClick = point => {
            if (!this.selectedFigure) return;
            const fromPosition = this.selectedFigure.gamePosition;
            const gameMoves = this.gameService.getMovesFrom(fromPosition);
            console.log(gameMoves);
            const gameMove = gameMoves.find(move => move.path[move.path.length - 1].equals(point));
            if (gameMove) {
                this.gameService.makeMove(fromPosition, gameMove);
                gameMove.capturedPoints.forEach(capturedPoint => {
                    const figure = this.figures.find(figure =>
                        figure.gamePosition.equals(capturedPoint)
                    );
                    if (figure) {
                        this.worldPresenter.scene.remove(figure.object);
                    }
                });
                this.figures = this.figures.filter(
                    figure =>
                        !gameMove.capturedPoints.some(captured => captured.equals(figure.gamePosition))
                );
                // this.selectedFigure.moveTo(point);
                this.selectedFigure.unselect();
                this.selectedFigure.animateTo(point);
                this.selectedFigure = null;
            }
        };
    }

    private hoveredFigure: Figure | null = null;
    private selectedFigure: Figure | null = null;

    handleMouseDown(event: MouseEvent) {
        if (this.hoveredFigure) {
            this.selectedFigure?.unselect();

            if (this.hoveredFigure !== this.selectedFigure) {
                this.hoveredFigure.select();
                this.selectedFigure = this.hoveredFigure;
            } else {
                this.selectedFigure = null;
            }
        }
    }

    handleMouseMove(event: MouseEvent) {
        const pointer = new THREE.Vector2();
        pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
        pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(pointer, this.worldPresenter.camera);
        const intersects = raycaster.intersectObjects<FigureObjectType>(
            this.figures.map(f => f.object),
            false
        );
        if (intersects.length > 0) {
            const hoveringFigure = this.figures.find(figure => figure.object === intersects[0].object);
            if (hoveringFigure?.pointType === this.gameService.currentPlayer.pointType) {
                this.hoveredFigure?.unhover();
                hoveringFigure.hover();
                this.hoveredFigure = hoveringFigure;
                document.body.style.cursor = 'pointer';
            }
        } else {
            this.hoveredFigure?.unhover();
            this.hoveredFigure = null;
            document.body.style.cursor = 'default';
        }
    }

    update() {
        this.board.unmarkCells();
        if (this.selectedFigure) {
            this.board.markCells(
                this.gameService.getAvailableDestinationsFrom(this.selectedFigure.gamePosition)
            );
        }
        this.figures.forEach(figure => figure.updateAnimations());
    }
}
