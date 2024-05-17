import * as THREE from 'three';
import { GameMove } from '../../../../../../shared/game/domain/entities/GameMove.entity';
import { PointType } from '../../../../../../shared/game/domain/entities/Matrix.entity';
import { Point } from '../../../../../../shared/game/domain/entities/Point.entity';
import { modulesController } from '../../../../modulesController';
import { WorldPresenter } from '../../../../world/presenter/World.presenter';
import { ClientGameService } from '../../../domain/ClientGame.service';
import { GameBoard } from '../GameBoard.presenter';
import { Figure, FigureObjectType } from './Figure.presenter';

export class FiguresPresenter {
    figures: Figure[] = [];
    private worldPresenter: WorldPresenter;

    constructor(private gameService: ClientGameService, private board: GameBoard) {
        if (!modulesController.modules.world) {
            throw new Error('world is not defined in figures presenter');
        }

        this.worldPresenter = modulesController.modules.world.worldPresenter;

        this.listenToEvents();
    }

    resetFigures() {
        const { matrix } = this.gameService;
        this.figures.forEach(figure => this.worldPresenter.scene.remove(figure.object));
        this.figures = [];
        for (let i = 0; i < matrix.height; i++) {
            for (let j = 0; j < matrix.width; j++) {
                const pointType = matrix.get(new Point(j, i));
                if (pointType === PointType.Empty) continue;
                const figure = new Figure(pointType, new Point(j, i));
                this.worldPresenter.scene.add(figure.object);

                this.figures.push(figure);
            }
        }
    }

    listenToEvents() {
        this.gameService.matrix.events.onReset = () => this.resetFigures();

        document.addEventListener('mousemove', this.handleMouseMove.bind(this));
        document.addEventListener('mousedown', this.handleMouseDown.bind(this));

        this.board.onCellClick = point => {
            if (!this.selectedFigure) return;
            const fromPosition = this.selectedFigure.gamePosition;
            const gameMoves = this.gameService.getMovesFrom(fromPosition);
            const gameMove = gameMoves.find(move => move.path[move.path.length - 1].equals(point));
            if (gameMove) {
                this.selectedFigure.unselect();
                this.gameService.makeMyMove(fromPosition, gameMove);
                this.makeViewMove(fromPosition, gameMove);
                this.selectedFigure = null;
            }
        };
    }

    makeViewMove(fromPosition: Point, gameMove: GameMove) {
        const figure = this.figures.find(figure => figure.gamePosition.equals(fromPosition));
        if (!figure) return;

        if (gameMove.capturedPoints.length > 0) {
            figure.animateToCapturing(gameMove.path[gameMove.path.length - 1], () => {
                figure.moveTo(gameMove.path[gameMove.path.length - 1]);
            });
        } else {
            figure.animateToLinear(gameMove.path[gameMove.path.length - 1], () => {
                figure.moveTo(gameMove.path[gameMove.path.length - 1]);
            });
        }

        gameMove.capturedPoints.forEach(capturedPoint => {
            const figure = this.figures.find(figure => figure.gamePosition.equals(capturedPoint));
            if (figure) {
                this.worldPresenter.scene.remove(figure.object);
            }
        });
        this.figures = this.figures.filter(
            figure => !gameMove.capturedPoints.some(captured => figure.gamePosition.equals(captured))
        );
    }

    private hoveredFigure: Figure | null = null;
    private selectedFigure: Figure | null = null;

    handleMouseDown(event: MouseEvent) {
        if (this.hoveredFigure) {
            this.selectedFigure?.unselect();
            this.selectedFigure?.unlift();

            if (this.hoveredFigure !== this.selectedFigure) {
                this.hoveredFigure.select();
                this.hoveredFigure.lift();
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
        if (intersects.length > 0 && this.gameService.myTurn) {
            const hoveringFigure = this.figures.find(figure => figure.object === intersects[0].object);
            if (hoveringFigure?.pointType === this.gameService.me.pointType) {
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
