import { DragControls } from 'three/examples/jsm/Addons.js';
import * as THREE from 'three';
import { modulesController } from '../../../modulesController';
import { WorldPresenter } from '../../../world/presenter/World.presenter';

export class DragControl {
    private dragControls: DragControls;
    private selectedFigure?: THREE.Object3D;

    private readonly worldPresenter: WorldPresenter;

    constructor(objects: THREE.Object3D[]) {
        const worldPresenter = modulesController.modules.world?.worldPresenter;
        if (!worldPresenter)
            throw new Error('Can not create drag control when world is not yet created');

        this.worldPresenter = worldPresenter;
        this.dragControls = new DragControls(
            [...objects],
            worldPresenter.camera,
            worldPresenter.renderer.domElement
        );
        this.dragControls.rotateSpeed = 2;

        this.listenToEvents();
    }

    listenToEvents() {
        this.dragControls.addEventListener('dragstart', ({ object }) => {
            this.worldPresenter.orbitControls.enabled = false;
            this.selectedFigure = object;
        });
        this.dragControls.addEventListener('dragend', () => {
            this.worldPresenter.orbitControls.enabled = true;
            this.selectedFigure = undefined;
        });

        document.addEventListener('mousemove', this.handleMouseMove.bind(this));
    }

    handleMouseMove(event: MouseEvent) {
        if (!this.selectedFigure) return;

        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();

        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        raycaster.setFromCamera(mouse, this.worldPresenter.camera);

        const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
        const point = new THREE.Vector3();
        raycaster.ray.intersectPlane(plane, point);

        this.selectedFigure.position.setY(point.y + 0.1);
        this.selectedFigure.position.setX(point.x);
        this.selectedFigure.position.setZ(point.z);
    }
}
