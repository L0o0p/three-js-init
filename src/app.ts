import * as THREE from 'three';
import { OrbitControls, RGBELoader } from 'three/examples/jsm/Addons.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export class Game {
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  cameraTarget: THREE.Object3D | null;
  scene: THREE.Scene;
  cameraOffset: THREE.Vector3;
  smoothness: number;

  constructor() {
    // 场景和摄像机
    // 初始化场景
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.scene = new THREE.Scene();
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);
    this.cameraTarget = null;// playerMesh
    this.cameraOffset = new THREE.Vector3(0, 3, 5);
    // this.cameraOffset = new THREE.Vector3(0, 1.8, 1);
    this.smoothness = 0.1; // 相机移动平滑度
    this.init()

  }
  init() {
    // 设置摄像机初始位置
    this.camera.position.z = 5;
    const control = new OrbitControls(this.camera, this.renderer.domElement)

    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    this.scene.add(cube);


    const gltfLoader = new GLTFLoader();
    console.log(gltfLoader);
    gltfLoader.load('/car.glb', (obj) => {
      this.scene.add(obj.scene)
    })
    gltfLoader.load('/ground.glb', (obj) => {
      this.scene.add(obj.scene)
      
    })

    const rgbeLoader = new RGBELoader()
    rgbeLoader.load('/hdr.hdr', (skyTexture) => {
      this.scene.background = skyTexture
      this.scene.environment = skyTexture
      skyTexture.mapping = THREE.EquirectangularReflectionMapping
    })


  }


  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }
  animate() {
    requestAnimationFrame(this.animate.bind(this));
    this.renderer.render(this.scene, this.camera);

  }

  async run() {
    try {
      this.animate();

    } catch (error) {
      console.error('Game initialization failed:', error);
    }
  }

}