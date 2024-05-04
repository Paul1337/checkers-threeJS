import * as THREE from 'three';
import { DragControls } from 'three/addons/controls/DragControls.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { initGameBoard } from './gameBoard';

let container: HTMLDivElement;
let camera: THREE.PerspectiveCamera;
let scene: THREE.Scene;
let renderer: THREE.WebGLRenderer;

let dragControls: DragControls;
let orbitControls: OrbitControls;

let group: THREE.Group;
let selectedObject: THREE.Object3D | null = null;

const objects: THREE.Mesh<THREE.CylinderGeometry, THREE.MeshLambertMaterial, THREE.Object3DEventMap>[] =
    [];

init();

function init() {
    container = document.createElement('div');
    document.body.appendChild(container);

    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 500);
    camera.position.z = 25;
    // camera.rotateX(0.3);

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0);

    // const axesHelper = new THREE.AxesHelper(500);
    // scene.add(axesHelper);

    scene.add(new THREE.AmbientLight(0xaaaaaa));

    const light = new THREE.SpotLight(0xffffff, 10000);
    light.position.set(0, 25, 50);
    light.angle = Math.PI / 9;

    light.castShadow = true;
    light.shadow.camera.near = 10;
    light.shadow.camera.far = 100;
    light.shadow.mapSize.width = 1024;
    light.shadow.mapSize.height = 1024;

    scene.add(light);

    group = new THREE.Group();
    scene.add(group);

    initGameBoard(scene);

    const geometry = new THREE.CylinderGeometry(0.5, 0.5, 0.2, 32);

    for (let i = 0; i < 12; i++) {
        // const type = Math.floor(Math.random() * 2);
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

        scene.add(object);

        objects.push(object);
    }

    // const n = 3;
    // const m = 3;
    // for (let i = 0; i < m; i++) {
    //     for (let j = 0; j < n; j++) {
    //         const type = Math.floor(Math.random() * 2);
    //         const object = new THREE.Mesh(
    //             geometry,
    //             new THREE.MeshLambertMaterial({
    //                 color: type === 1 ? 0x303030 : 0xffffff,
    //             })
    //         );

    //         object.position.z = 0.5 + j * object.geometry.parameters.radiusBottom * 2;
    //         object.position.x = 0.5 + i * object.geometry.parameters.radiusBottom * 2;
    //         object.position.y = object.geometry.parameters.height / 2;

    //         object.castShadow = true;
    //         object.receiveShadow = true;

    //         scene.add(object);

    //         objects.push(object);
    //     }
    // }

    renderer = new THREE.WebGLRenderer({ antialias: true, logarithmicDepthBuffer: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;

    orbitControls = new OrbitControls(camera, renderer.domElement);
    orbitControls.enableDamping = true;
    orbitControls.target.set(4, 0, 4);
    orbitControls.maxPolarAngle = Math.PI * 0.43;
    // orbitControls.update();

    container.appendChild(renderer.domElement);

    dragControls = new DragControls([...objects], camera, renderer.domElement);
    dragControls.rotateSpeed = 2;
    dragControls.addEventListener('dragstart', ({ object }) => {
        selectedObject = object;
        orbitControls.enabled = false;
    });
    dragControls.addEventListener('dragend', () => {
        orbitControls.enabled = true;
    });
    dragControls.addEventListener('drag', () => {
        // objects.forEach(object => {
        //     object.position.setY(object.geometry.parameters.height / 2);
        // });
    });

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);

    update();
}

function onMouseMove(event: MouseEvent) {
    event.preventDefault();
    if (event.button === 0 && selectedObject) {
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();

        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);

        const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
        const point = new THREE.Vector3();
        raycaster.ray.intersectPlane(plane, point);

        selectedObject.position.setY(point.y + 0.1);

        selectedObject.position.setX(point.x);
        selectedObject.position.setZ(point.z);
    }
}

function onMouseUp() {
    selectedObject = null;
}

function update() {
    requestAnimationFrame(update);

    renderer.render(scene, camera);
    orbitControls.update();
}
