import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import type { ProjectState, SurfaceId, WallId } from "./domain";

type ViewerOptions = {
  container: HTMLElement;
  onEntitySelect?: (id: SurfaceId) => void;
};

const WALL_THICKNESS = 0.08;

export class RoomViewer {
  private readonly container: HTMLElement;
  private readonly scene = new THREE.Scene();
  private readonly camera = new THREE.PerspectiveCamera(45, 1, 0.01, 100);
  private readonly renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  private readonly controls: OrbitControls;
  private readonly raycaster = new THREE.Raycaster();
  private readonly pointer = new THREE.Vector2();
  private readonly pointerDown = new THREE.Vector2();
  private readonly entityMeshes = new Map<SurfaceId, THREE.Mesh>();
  private readonly manualHidden = new Set<SurfaceId>();
  private readonly autoHidden = new Set<SurfaceId>();
  private highlighted = new Set<SurfaceId>();
  private project: ProjectState | null = null;
  private autoCutaway = true;
  private readonly onEntitySelect?: (id: SurfaceId) => void;
  private animationFrame = 0;

  constructor(options: ViewerOptions) {
    this.container = options.container;
    this.onEntitySelect = options.onEntitySelect;

    this.scene.background = new THREE.Color(0x0a0e17);

    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    // Keep the first slice visually clean and deterministic.
    // Shadow mapping caused visible moire/acne artifacts in headless and low-end renders.
    this.renderer.shadowMap.enabled = false;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.container.appendChild(this.renderer.domElement);

    this.camera.position.set(6.5, 4.6, 7.2);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.08;
    this.controls.target.set(0, 1.2, 0);
    this.controls.maxPolarAngle = Math.PI * 0.49;
    this.controls.minDistance = 2;
    this.controls.maxDistance = 18;

    const hemi = new THREE.HemisphereLight(0xffffff, 0x1b2538, 2.2);
    this.scene.add(hemi);

    const key = new THREE.DirectionalLight(0xffffff, 2.6);
    key.position.set(3.5, 7, 5);
    this.scene.add(key);

    this.renderer.domElement.addEventListener("pointerdown", this.handlePointerDown);
    this.renderer.domElement.addEventListener("pointerup", this.handlePointerUp);
    window.addEventListener("resize", this.resize);

    this.resize();
    this.animate();
  }

  setProject(project: ProjectState): void {
    this.project = project;
    this.rebuildRoom();
    this.updateVisibility();
  }

  setHighlightedEntities(ids: SurfaceId[]): void {
    this.highlighted = new Set(ids);
    this.applyMaterials();
  }

  setManualVisibility(id: SurfaceId, visible: boolean): void {
    if (visible) this.manualHidden.delete(id);
    else this.manualHidden.add(id);
    this.updateVisibility();
  }

  showAll(): void {
    this.manualHidden.clear();
    this.autoHidden.clear();
    this.autoCutaway = false;
    this.updateVisibility();
  }

  setAutoCutaway(enabled: boolean): void {
    this.autoCutaway = enabled;
    if (!enabled) this.autoHidden.clear();
    this.updateVisibility();
  }

  resetCamera(): void {
    this.camera.position.set(6.5, 4.6, 7.2);
    this.controls.target.set(0, 1.2, 0);
    this.controls.update();
  }

  dispose(): void {
    cancelAnimationFrame(this.animationFrame);
    window.removeEventListener("resize", this.resize);
    this.renderer.domElement.removeEventListener("pointerdown", this.handlePointerDown);
    this.renderer.domElement.removeEventListener("pointerup", this.handlePointerUp);
    this.controls.dispose();
    this.renderer.dispose();
    this.container.replaceChildren();
  }

  private rebuildRoom(): void {
    for (const mesh of this.entityMeshes.values()) {
      mesh.geometry.dispose();
      if (Array.isArray(mesh.material)) {
        mesh.material.forEach((material) => material.dispose());
      } else {
        mesh.material.dispose();
      }
      this.scene.remove(mesh);
    }
    this.entityMeshes.clear();

    if (!this.project) return;

    const { widthM: width, lengthM: length, heightM: height } = this.project.room;

    const floor = this.makeMesh(
      "room-1.floor",
      new THREE.BoxGeometry(width, WALL_THICKNESS, length),
      new THREE.Vector3(0, -WALL_THICKNESS / 2, 0),
    );

    const ceiling = this.makeMesh(
      "room-1.ceiling",
      new THREE.BoxGeometry(width, WALL_THICKNESS, length),
      new THREE.Vector3(0, height + WALL_THICKNESS / 2, 0),
    );

    this.makeMesh(
      "room-1.wall-front",
      new THREE.BoxGeometry(width, height, WALL_THICKNESS),
      new THREE.Vector3(0, height / 2, length / 2),
    );
    this.makeMesh(
      "room-1.wall-back",
      new THREE.BoxGeometry(width, height, WALL_THICKNESS),
      new THREE.Vector3(0, height / 2, -length / 2),
    );
    this.makeMesh(
      "room-1.wall-left",
      new THREE.BoxGeometry(WALL_THICKNESS, height, length),
      new THREE.Vector3(-width / 2, height / 2, 0),
    );
    this.makeMesh(
      "room-1.wall-right",
      new THREE.BoxGeometry(WALL_THICKNESS, height, length),
      new THREE.Vector3(width / 2, height / 2, 0),
    );

    this.controls.target.set(0, height * 0.45, 0);
    this.applyMaterials();
  }

  private makeMesh(
    id: SurfaceId,
    geometry: THREE.BufferGeometry,
    position: THREE.Vector3,
  ): THREE.Mesh {
    const material = new THREE.MeshStandardMaterial({
      color: 0x27364c,
      roughness: 0.78,
      metalness: 0.03,
      transparent: true,
      opacity: 0.96,
      side: THREE.DoubleSide,
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.copy(position);
    mesh.castShadow = false;
    mesh.receiveShadow = false;
    mesh.userData.entityId = id;
    this.scene.add(mesh);
    this.entityMeshes.set(id, mesh);
    return mesh;
  }

  private applyMaterials(): void {
    for (const [id, mesh] of this.entityMeshes) {
      const material = mesh.material as THREE.MeshStandardMaterial;
      const isHighlighted = this.highlighted.has(id);
      const isWall = id.includes(".wall-");

      if (isHighlighted) {
        material.color.setHex(0xd9a441);
        material.emissive.setHex(0x392500);
        material.emissiveIntensity = 0.55;
        material.opacity = 1;
      } else if (id === "room-1.floor") {
        material.color.setHex(0x192536);
        material.emissive.setHex(0x000000);
        material.opacity = 1;
      } else if (id === "room-1.ceiling") {
        material.color.setHex(0x536176);
        material.emissive.setHex(0x000000);
        material.opacity = 0.86;
      } else {
        material.color.setHex(isWall ? 0x27364c : 0x27364c);
        material.emissive.setHex(0x000000);
        material.opacity = 0.96;
      }
      material.needsUpdate = true;
    }
  }

  private updateAutoCutaway(): void {
    if (!this.project || !this.autoCutaway) return;

    const { widthM: width, lengthM: length, heightM: height } = this.project.room;
    const x = this.camera.position.x;
    const z = this.camera.position.z;

    this.autoHidden.clear();

    const normalizedX = width > 0 ? x / (width / 2) : 0;
    const normalizedZ = length > 0 ? z / (length / 2) : 0;

    if (Math.abs(normalizedX) > Math.abs(normalizedZ)) {
      this.autoHidden.add(
        normalizedX > 0 ? "room-1.wall-right" : "room-1.wall-left",
      );
    } else {
      this.autoHidden.add(
        normalizedZ > 0 ? "room-1.wall-front" : "room-1.wall-back",
      );
    }

    if (this.camera.position.y > height * 1.35) {
      this.autoHidden.add("room-1.ceiling");
    }
  }

  private updateVisibility(): void {
    for (const [id, mesh] of this.entityMeshes) {
      mesh.visible = !this.manualHidden.has(id) && !this.autoHidden.has(id);
    }
  }

  private readonly handlePointerDown = (event: PointerEvent): void => {
    this.pointerDown.set(event.clientX, event.clientY);
  };

  private readonly handlePointerUp = (event: PointerEvent): void => {
    const dragDistance = this.pointerDown.distanceTo(
      new THREE.Vector2(event.clientX, event.clientY),
    );

    if (dragDistance > 5) return;

    const rect = this.renderer.domElement.getBoundingClientRect();
    this.pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    this.raycaster.setFromCamera(this.pointer, this.camera);
    const hits = this.raycaster.intersectObjects(
      [...this.entityMeshes.values()].filter((mesh) => mesh.visible),
      false,
    );
    const id = hits[0]?.object.userData.entityId as SurfaceId | undefined;
    if (id) this.onEntitySelect?.(id);
  };

  private readonly resize = (): void => {
    const width = Math.max(1, this.container.clientWidth);
    const height = Math.max(1, this.container.clientHeight);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height, false);
  };

  private animate = (): void => {
    this.animationFrame = requestAnimationFrame(this.animate);
    this.controls.update();
    if (this.autoCutaway) {
      this.updateAutoCutaway();
      this.updateVisibility();
    }
    this.renderer.render(this.scene, this.camera);
  };
}

export const wallSurfaceIds: WallId[] = [
  "room-1.wall-front",
  "room-1.wall-back",
  "room-1.wall-left",
  "room-1.wall-right",
];
