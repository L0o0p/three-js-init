import * as THREE from 'three';
import { OrbitControls, RGBELoader } from 'three/examples/jsm/Addons.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export class Game {
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  scene: THREE.Scene;
  smoothness: number;
  cubeRenderTarget: THREE.WebGLCubeRenderTarget;
  cubeCamera: THREE.CubeCamera;

  constructor() {
    // 场景和摄像机
    // 初始化场景
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.scene = new THREE.Scene();
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);
    // this.cameraTarget = null;// playerMesh
    // this.cameraOffset = new THREE.Vector3(0, 3, 5);
    // this.cameraOffset = new THREE.Vector3(0, 1.8, 1);
    this.smoothness = 0.1; // 相机移动平滑度
    // 创建立方体渲染目标
    this.cubeRenderTarget = new THREE.WebGLCubeRenderTarget(256, {
      format: THREE.RGBAFormat,
      generateMipmaps: true,
      minFilter: THREE.LinearMipmapLinearFilter
    });
    this.cubeCamera = new THREE.CubeCamera(0.1, 100, this.cubeRenderTarget)
    this.init()

  }
  init() {
    // 设置摄像机初始位置
    this.camera.position.z = 5;
    const control = new OrbitControls(this.camera, this.renderer.domElement)

    // 创建使用环境贴图的材质
    const reflectiveMaterial = new THREE.MeshStandardMaterial({
      envMap: this.cubeRenderTarget.texture,
      roughness: 0.05,
      metalness: 1.0
    });

    const gltfLoader = new GLTFLoader();
    console.log(gltfLoader);
    gltfLoader.load('/monkey.glb', (obj) => {
      obj.scene.traverse((child: any) => {
        child.castShadow = true
        child.receiveShadow = true
      })
      this.scene.add(obj.scene)
    })

    // const rgbeLoader = new RGBELoader()
    // rgbeLoader.load('/sky.hdr', (skyTexture) => {
    //   this.scene.background = skyTexture
    //   this.scene.environment = skyTexture
    //   skyTexture.mapping = THREE.EquirectangularReflectionMapping
    // })

  }


  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }
  animate() {
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