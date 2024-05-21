import { EventEmitter } from '@shared/game/domain/utils/EventEmmiter';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';

export class WorldPresenter extends EventEmitter {
    container: HTMLDivElement;
    camera: THREE.PerspectiveCamera;
    scene: THREE.Scene;
    renderer: THREE.WebGLRenderer;

    orbitControls: OrbitControls;

    private lastAnimationFrame: number | null = null;
    private shouldUpdate = true;

    constructor() {
        super();

        this.container = document.getElementById('game-container') as HTMLDivElement;

        this.camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 500);
        this.camera.position.z = 25;

        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0xf0f0f0);
        this.scene.background = new THREE.Color(0xbfe3dd);

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

        this.handleEvents();
        this.update();
    }

    update() {
        if (!this.shouldUpdate) return;

        this.renderer.render(this.scene, this.camera);
        this.emit('update');
        this.lastAnimationFrame = requestAnimationFrame(this.update.bind(this));
    }

    stopUpdating() {
        if (this.lastAnimationFrame) cancelAnimationFrame(this.lastAnimationFrame);
        this.shouldUpdate = false;
    }

    handleEvents() {
        window.onresize = () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();

            this.renderer.setSize(window.innerWidth, window.innerHeight);
        };
    }
}
