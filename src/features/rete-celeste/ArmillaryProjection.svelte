<script lang="ts">
  import { onDestroy, onMount } from 'svelte';
  import type { Group, Material, Object3D, WebGLRenderer } from 'three';

  export let active = false;
  export let reducedMotion = false;

  type ThreeModule = typeof import('three');

  let canvas: HTMLCanvasElement;
  let frame = 0;
  let renderer: WebGLRenderer | undefined;
  let group: Group | undefined;
  let cleanup = () => {};

  onMount(() => {
    void setupProjection();
    return () => cleanup();
  });

  onDestroy(() => {
    window.cancelAnimationFrame(frame);
    cleanup();
  });

  async function setupProjection(): Promise<void> {
    const three = await import('three');
    const scene = new three.Scene();
    const camera = new three.PerspectiveCamera(42, 1, 0.1, 100);
    camera.position.set(0, 0, 6.25);

    renderer = new three.WebGLRenderer({ canvas, alpha: true, antialias: true, preserveDrawingBuffer: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    group = new three.Group();
    group.rotation.x = -0.18;
    group.rotation.z = -0.08;
    scene.add(group);

    buildArmillary(three, group);

    const resize = () => {
      if (!renderer) return;
      const size = Math.max(260, canvas.clientWidth);
      renderer.setSize(size, size, false);
      camera.aspect = 1;
      camera.updateProjectionMatrix();
    };

    const animate = () => {
      resize();
      if (group && active && !reducedMotion) {
        group.rotation.y += 0.0032;
        group.rotation.z += 0.00045;
      }
      renderer?.render(scene, camera);
      frame = window.requestAnimationFrame(animate);
    };

    animate();
    window.addEventListener('resize', resize);
    cleanup = () => {
      window.removeEventListener('resize', resize);
      window.cancelAnimationFrame(frame);
      if (group) disposeObject(group);
      renderer?.dispose();
      renderer = undefined;
    };
  }

  function buildArmillary(three: ThreeModule, target: Group): void {
    addRing(three, target, 2.05, '#e7f3f4', 0.16, { x: 0, y: 0, z: 0 });
    addRing(three, target, 1.94, '#f0c36c', 0.28, { x: 23.5, y: 0, z: -14 });
    addRing(three, target, 2.12, '#d8edf0', 0.15, { x: 0, y: 72, z: 0 });
    addRing(three, target, 2.12, '#d8edf0', 0.12, { x: 0, y: 108, z: 0 });
    addRing(three, target, 1.5, '#d8edf0', 0.1, { x: 0, y: 0, z: 0 });
    addRing(three, target, 1.5, '#d8edf0', 0.1, { x: 34, y: 0, z: 0 });
    addAxis(three, target);
    addConstellations(three, target);
    addStars(three, target);
  }

  function addRing(
    three: ThreeModule,
    target: Group,
    radius: number,
    color: string,
    opacity: number,
    rotation: { x: number; y: number; z: number }
  ): void {
    const points: import('three').Vector3[] = [];
    for (let index = 0; index <= 192; index += 1) {
      const angle = (index / 192) * Math.PI * 2;
      points.push(new three.Vector3(Math.cos(angle) * radius, Math.sin(angle) * radius, 0));
    }

    const material = new three.LineBasicMaterial({
      color: new three.Color(color),
      transparent: true,
      opacity
    });
    const line = new three.Line(new three.BufferGeometry().setFromPoints(points), material);
    line.rotation.set(deg(rotation.x), deg(rotation.y), deg(rotation.z));
    target.add(line);
  }

  function addAxis(three: ThreeModule, target: Group): void {
    const material = new three.LineBasicMaterial({ color: '#f4d18a', transparent: true, opacity: 0.22 });
    const axis = new three.Line(
      new three.BufferGeometry().setFromPoints([
        new three.Vector3(0, -2.22, 0),
        new three.Vector3(0, 2.22, 0)
      ]),
      material
    );
    axis.rotation.z = deg(-23.5);
    target.add(axis);
  }

  function addConstellations(three: ThreeModule, target: Group): void {
    const material = new three.LineBasicMaterial({ color: '#dceff4', transparent: true, opacity: 0.24 });
    const paths = [
      [[-1.18, 0.7, 0.35], [-0.78, 0.95, 0.15], [-0.26, 0.78, 0.26], [0.26, 1.08, -0.08]],
      [[0.46, -0.62, 0.36], [0.82, -0.35, 0.05], [1.15, 0.08, -0.16], [1.36, 0.32, 0.12]],
      [[-1.08, -0.46, -0.12], [-0.58, -0.22, 0.18], [-0.12, -0.48, 0.28], [0.36, -0.22, 0.1]]
    ];

    paths.forEach((path) => {
      const points = path.map(([x, y, z]) => new three.Vector3(x, y, z));
      target.add(new three.Line(new three.BufferGeometry().setFromPoints(points), material));
    });
  }

  function addStars(three: ThreeModule, target: Group): void {
    const material = new three.MeshBasicMaterial({ color: '#fff1b8', transparent: true, opacity: 0.72 });
    const geometry = new three.SphereGeometry(0.034, 10, 10);
    const stars = [
      [-1.18, 0.7, 0.35, 1.15],
      [0.26, 1.08, -0.08, 1.3],
      [1.36, 0.32, 0.12, 1.2],
      [-0.58, -0.22, 0.18, 0.85],
      [0.36, -0.22, 0.1, 0.85],
      [0.82, -0.35, 0.05, 0.92]
    ];

    stars.forEach(([x, y, z, scale]) => {
      const star = new three.Mesh(geometry, material);
      star.position.set(x, y, z);
      star.scale.setScalar(scale);
      target.add(star);
    });
  }

  function disposeObject(object: Object3D): void {
    object.traverse((item) => {
      const withResources = item as Object3D & {
        geometry?: { dispose: () => void };
        material?: Material | Material[];
      };
      withResources.geometry?.dispose();
      const material = withResources.material;
      if (Array.isArray(material)) material.forEach((entry) => entry.dispose());
      else material?.dispose();
    });
  }

  function deg(value: number): number {
    return (value * Math.PI) / 180;
  }
</script>

<canvas
  bind:this={canvas}
  class:active
  class="armillary-canvas"
  aria-hidden="true"
  data-testid="armillary-projection"
  data-active={active}
  data-reduced-motion={reducedMotion}
></canvas>
