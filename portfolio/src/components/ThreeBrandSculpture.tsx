import { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface ThreeBrandSculptureProps {
  scrollProgress: number;
}

/**
 * Interactive Three.js TorusKnot + wireframe grid sculpture for the Brand Showcase.
 */
export function ThreeBrandSculpture({ scrollProgress }: ThreeBrandSculptureProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const scrollRef = useRef(scrollProgress);
  scrollRef.current = scrollProgress;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 320;
    const height = container.clientHeight || 280;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 50);
    camera.position.set(0, 0, 5.2);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Wireframe TorusKnot in Electric Blue (#0066FF)
    const knotGeo = new THREE.TorusKnotGeometry(1.15, 0.32, 96, 16);
    const knotMat = new THREE.MeshBasicMaterial({
      color: 0x0066ff,
      wireframe: true,
      transparent: true,
      opacity: 0.55,
    });
    const knot = new THREE.Mesh(knotGeo, knotMat);
    scene.add(knot);

    // Outer Octahedron wireframe in Monochromatic Gray
    const octGeo = new THREE.OctahedronGeometry(2.0, 0);
    const octEdges = new THREE.EdgesGeometry(octGeo);
    const octMat = new THREE.LineBasicMaterial({
      color: 0x71717a,
      transparent: true,
      opacity: 0.45,
    });
    const octWire = new THREE.LineSegments(octEdges, octMat);
    scene.add(octWire);

    let hoverX = 0;
    let hoverY = 0;
    const onPointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      hoverX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      hoverY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    };
    container.addEventListener('pointermove', onPointerMove);

    const onResize = () => {
      if (!container) return;
      const w = container.clientWidth || 320;
      const h = container.clientHeight || 280;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    let animId = 0;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = window.requestAnimationFrame(animate);
      const t = clock.getElapsedTime();
      const s = scrollRef.current * Math.PI * 2;

      knot.rotation.x = t * 0.28 + s * 0.5 + hoverY * 0.4;
      knot.rotation.y = t * 0.35 + s * 0.7 + hoverX * 0.5;

      octWire.rotation.x = -t * 0.15 - s * 0.3;
      octWire.rotation.y = -t * 0.2;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.cancelAnimationFrame(animId);
      container.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('resize', onResize);
      knotGeo.dispose();
      knotMat.dispose();
      octGeo.dispose();
      octEdges.dispose();
      octMat.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={containerRef} className="h-[260px] w-full cursor-crosshair sm:h-[300px]" />;
}
