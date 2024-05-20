import { GLTFLoader } from 'three/examples/jsm/Addons.js';
import { modulesController } from '../../gameModulesController';
import { WorldPresenter } from '../../world/presenter/World.presenter';
import { presenterConfig } from '../Presenter.config';
import * as THREE from 'three';
// import table from

export class Table {
    private loader: GLTFLoader;
    private worldPresenter: WorldPresenter;

    object?: THREE.Object3D;

    constructor(position: THREE.Vector3, desiredSize: THREE.Vector3) {
        const world = modulesController.modules.world;
        if (!world) throw 'world is not defined in table';
        this.worldPresenter = world.worldPresenter;

        this.loader = new GLTFLoader();

        // const { size: cellSize } = presenterConfig.board.cell;

        this.loader.load('/models/table3.glb', gltf => {
            const box = new THREE.Box3().setFromObject(gltf.scene);
            const size = box.getSize(new THREE.Vector3());
            // console.log(size);
            // console.log(gltf);
            this.object = gltf.scene;
            gltf.scene.position.copy(position);
            gltf.scene.scale.copy(
                new THREE.Vector3(desiredSize.x / size.x, desiredSize.y / size.y, desiredSize.z / size.z)
            );
            this.worldPresenter.scene.add(gltf.scene);
        });
    }
}
