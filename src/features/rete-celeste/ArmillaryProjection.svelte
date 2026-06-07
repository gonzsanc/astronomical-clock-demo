<script lang="ts">
  import { onDestroy, onMount } from 'svelte';
  import type { Group, WebGLRenderer } from 'three';

  export let active = false;
  export let reducedMotion = false;

  let canvas: HTMLCanvasElement;
  let frame = 0;
  let renderer: WebGLRenderer;
  let group: Group;
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
    const camera = new three.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.set(0, 0, 6);
    renderer = new three.WebGLRenderer({ canvas, alpha: true, antialias: true, preserveDrawingBuffer: true });
    group = new three.Group();
    scene.add(group);

    addRing(three, group, 1.75, 0, '#f0c879', 0.25);
    addRing(three, group, 1.55, 65, '#fff1c6', 0.18);
    addRing(three, group, 1.35, -28, '#7f9bb5', 0.14);
    addStars(three, group);

    const resize = () => {
      const size = Math.max(240, canvas.clientWidth);
      renderer.setSize(size, size, false);
      camera.aspect = 1;
      camera.updateProjectionMatrix();
    };

    const animate = () => {
      resize();
      if (active && !reducedMotion) group.rotation.y += 0.0038;
      renderer.render(scene, camera);
      frame = window.requestAnimationFrame(animate);
    };

    animate();
    window.addEventListener('resize', resize);
    cleanup = () => {
      window.removeEventListener('resize', resize);
      window.cancelAnimationFrame(frame);
      renderer.dispose();
    };
  }

  function addRing(three: typeof import('three'), target: Group, radius: number, tilt: number, color: string, opacity: number): void {
    const points: import('three').Vector3[] = [];
    for (let index = 0; index <= 128; index += 1) {
      const angle = (index / 128) * Math.PI * 2;
      points.push(new three.Vector3(Math.cos(angle) * radius, Math.sin(angle) * radius, 0));
    }
    const material = new three.LineBasicMaterial({ color: new three.Color(color), transparent: true, opacity });
    const line = new three.Line(new three.BufferGeometry().setFromPoints(points), material);
    line.rotation.x = (tilt * Math.PI) / 180;
    target.add(line);
  }

  function addStars(three: typeof import('three'), target: Group): void {
    const material = new three.LineBasicMaterial({ color: '#fff7db', transparent: true, opacity: 0.22 });
    const paths = [
      [new three.Vector3(-0.9, 0.4, 0.2), new three.Vector3(-0.45, 0.62, -0.2), new three.Vector3(0.2, 0.48, 0.1)],
      [new three.Vector3(0.55, -0.35, 0.3), new three.Vector3(0.9, -0.1, -0.2), new three.Vector3(1.1, 0.2, 0.1)]
    ];
    paths.forEach((path) => target.add(new three.Line(new three.BufferGeometry().setFromPoints(path), material)));
  }
</script>

<canvas
  bind:this={canvas}
  class:active
  class="armillary-canvas"
  aria-hidden="true"
  data-testid="armillary-projection"
></canvas>
