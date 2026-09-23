import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import type { ProjectState, SurfaceId, WallId } from "./domain";
import { getAutoHiddenSurfaceIds, isSurfaceVisible } from "./viewer-visibility";
import { calculateShowcaseFrame } from "./viewer-framing";

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
  private readonly entityOutlines = new Map<SurfaceId, THREE.LineSegments>();
  private readonly manualHidden = new Set<SurfaceId>();
  private readonly autoHidden = new Set<SurfaceId>();
  private highlighted = new Set<SurfaceId>();
  private project: ProjectState | null = null;
  private autoCutaway = true;
  private showcaseFrameActive = true;
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

    this.camera.position.set(1, 1, 1);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.08;
    this.controls.target.set(0, 0, 0);
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
    this.controls.addEventListener("start", this.handleControlsStart);
    window.addEventListener("resize", this.resize);

    this.resize();
    this.animate();
  }

  setProject(project: ProjectState): void {
    this.project = project;
    this.rebuildRoom();
    this.showcaseFrameActive = true;
    this.applyShowcaseFrame();
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
    this.showcaseFrameActive = true;
    this.applyShowcaseFrame();
  }

  dispose(): void {
    cancelAnimationFrame(this.animationFrame);
    window.removeEventListener("resize", this.resize);
    this.renderer.domElement.removeEventListener("pointerdown", this.handlePointerDown);
    this.renderer.domElement.removeEventListener("pointerup", this.handlePointerUp);
    this.controls.removeEventListener("start", this.handleControlsStart);
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
    for (const outline of this.entityOutlines.values()) {
      outline.geometry.dispose();
      const material = outline.material;
      if (Array.isArray(material)) material.forEach((item) => item.dispose());
      else material.dispose();
    }
    this.entityMeshes.clear();
    this.entityOutlines.clear();

    if (!this.project) return;

    const { widthM: width, lengthM: length, heightM: height } = this.project.room;

    this.makeMesh(
      "room-1.floor",
      new THREE.BoxGeometry(width, WALL_THICKNESS, length),
      new THREE.Vector3(0, -WALL_THICKNESS / 2, 0),
    );

    this.makeMesh(
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
    const outline = new THREE.LineSegments(
      new THREE.EdgesGeometry(geometry),
      new THREE.LineBasicMaterial({
        color: 0x60718a,
        transparent: true,
        opacity: 0.28,
      }),
    );
    outline.renderOrder = 2;
    mesh.add(outline);

    this.scene.add(mesh);
    this.entityMeshes.set(id, mesh);
    this.entityOutlines.set(id, outline);
    return mesh;
  }

  private applyMaterials(): void {
    for (const [id, mesh] of this.entityMeshes) {
      const material = mesh.material as THREE.MeshStandardMaterial;
      const isHighlighted = this.highlighted.has(id);
      const isWall = id.includes(".wall-");

      const outline = this.entityOutlines.get(id);
      if (outline) {
        const outlineMaterial = outline.material as THREE.LineBasicMaterial;
        outlineMaterial.color.setHex(isHighlighted ? 0xe8b84b : 0x60718a);
        outlineMaterial.opacity = isHighlighted ? 1 : 0.28;
        outlineMaterial.needsUpdate = true;
      }

      if (isHighlighted) {
        material.color.setHex(0x465164);
        material.emissive.setHex(0x7a4f00);
        material.emissiveIntensity = 0.28;
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

    const nextAutoHidden = getAutoHiddenSurfaceIds(this.project, {
      x: this.camera.position.x,
      y: this.camera.position.y,
      z: this.camera.position.z,
    });

    this.autoHidden.clear();
    nextAutoHidden.forEach((id) => this.autoHidden.add(id));
  }

  private updateVisibility(): void {
    for (const [id, mesh] of this.entityMeshes) {
      mesh.visible = isSurfaceVisible(id, this.manualHidden, this.autoHidden);
    }
  }

  private readonly handleControlsStart = (): void => {
    this.showcaseFrameActive = false;
  };

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

  private applyShowcaseFrame(
    width = Math.max(1, this.container.clientWidth),
    height = Math.max(1, this.container.clientHeight),
  ): void {
    if (!this.project) return;

    const frame = calculateShowcaseFrame(
      this.project.room,
      { width, height },
      this.camera.fov,
    );

    this.camera.position.set(frame.camera.x, frame.camera.y, frame.camera.z);
    this.controls.target.set(frame.target.x, frame.target.y, frame.target.z);
    this.controls.maxDistance = Math.max(18, frame.distance * 2.25);
    this.controls.update();
    this.updateAutoCutaway();
    this.updateVisibility();
  }

  private readonly resize = (): void => {
    const width = Math.max(1, this.container.clientWidth);
    const height = Math.max(1, this.container.clientHeight);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);

    if (this.showcaseFrameActive && this.project) {
      this.applyShowcaseFrame(width, height);
    }
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
