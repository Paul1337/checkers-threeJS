import * as THREE from 'three';
import { Game, GameLogic } from '../domain/entities/Game';
import { DragControls, OrbitControls } from 'three/examples/jsm/Addons.js';
import { GameBoard } from './GameBoard';
import './styles/style.css';

export class Presenter {
    private container: HTMLDivElement;
    private camera: THREE.PerspectiveCamera;
    private scene: THREE.Scene;
    private renderer: THREE.WebGLRenderer;

    private dragControls?: DragControls;
    private orbitControls: OrbitControls;

    private board?: GameBoard;
    // private figures?:
    private selectedFigure?: THREE.Object3D;

    constructor(private game: GameLogic) {
        this.container = document.createElement('div');
        const appContainer = document.getElementById('container')!;
        appContainer.appendChild(this.container);

        this.camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 500);
        this.camera.position.z = 25;

        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0xf0f0f0);

        this.scene.add(new THREE.AmbientLight(0xaaaaaa));

        const spotLight = new THREE.SpotLight(0xffffff, 10000);
        spotLight.position.set(0, 25, 50);
        spotLight.angle = Math.PI / 9;

        spotLight.castShadow = true;
        spotLight.shadow.camera.near = 10;
        spotLight.shadow.camera.far = 100;
        spotLight.shadow.mapSize.width = 1024;
        spotLight.shadow.mapSize.height = 1024;

        this.scene.add(spotLight);

        this.renderer = new THREE.WebGLRenderer({ antialias: true, logarithmicDepthBuffer: true });
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFShadowMap;

        this.orbitControls = new OrbitControls(this.camera, this.renderer.domElement);
        this.orbitControls.enableDamping = true;
        this.orbitControls.target.set(4, 0, 4);
        this.orbitControls.maxPolarAngle = Math.PI * 0.43;
        this.orbitControls.update();

        this.container.appendChild(this.renderer.domElement);

        this.createBoard();
        this.createFigures();

        // document.addEventListener('mousemove', onMouseMove);
        // document.addEventListener('mouseup', onMouseUp);
    }

    createBoard() {
        this.board = new GameBoard(8, 8);
        this.scene.add(this.board.group);
    }

    createFigures() {
        const objects: any[] = [];
        const geometry = new THREE.CylinderGeometry(0.5, 0.5, 0.2, 32);
        for (let i = 0; i < 12; i++) {
            const type = 0;
            const object = new THREE.Mesh(
                geometry,
                new THREE.MeshLambertMaterial({
                    color: type === 1 ? 0x303030 : 0xffffff,
                })
            );
            object.position.z = 0.5 + Math.floor(i / 4) * object.geometry.parameters.radiusBottom * 2;
            object.position.x =
                0.5 +
                (1 - (Math.floor(i / 4) % 2)) +
                (i % 4) * 2 * object.geometry.parameters.radiusBottom * 2;
            object.position.y = object.geometry.parameters.height / 2;
            object.castShadow = true;
            object.receiveShadow = true;
            this.scene.add(object);
            objects.push(object);
        }
        this.dragControls = new DragControls([...objects], this.camera, this.renderer.domElement);
        this.dragControls.rotateSpeed = 2;
        this.dragControls.addEventListener('dragstart', ({ object }) => {
            this.orbitControls.enabled = false;
            this.selectedFigure = object;
        });
        this.dragControls.addEventListener('dragend', () => {
            this.orbitControls.enabled = true;
            this.selectedFigure = undefined;
        });

        document.addEventListener('mousemove', this.handleMouseMove.bind(this));
        // this.dragControls.addEventListener('drag', () => {});
    }

    handleMouseMove(event: MouseEvent) {
        if (!this.selectedFigure) return;

        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();

        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        raycaster.setFromCamera(mouse, this.camera);

        const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
        const point = new THREE.Vector3();
        raycaster.ray.intersectPlane(plane, point);

        this.selectedFigure.position.setY(point.y + 0.1);
        this.selectedFigure.position.setX(point.x);
        this.selectedFigure.position.setZ(point.z);
    }

    update() {
        this.renderer.render(this.scene, this.camera);
    }
}
