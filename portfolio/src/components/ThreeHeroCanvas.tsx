import { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface ThreeHeroCanvasProps {
  scrollY: number;
}

/**
 * Interactive Three.js background scene for the Hero section.
 * Strictly uses monochromatic grays and electric blue (#0066FF).
 */
export function ThreeHeroCanvas({ scrollY }: ThreeHeroCanvasProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const scrollRef = useRef(scrollY);
  scrollRef.current = scrollY;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || 600;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(48, width / height, 0.1, 100);
    camera.position.set(0, 0, 7.5);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const group = new THREE.Group();
    group.position.set(2.1, 0.1, 0);
    scene.add(group);

    // Outer architectural wireframe icosahedron (electric blue)
    const icoGeo = new THREE.IcosahedronGeometry(1.75, 1);
    const icoEdges = new THREE.EdgesGeometry(icoGeo);
    const icoMat = new THREE.LineBasicMaterial({
      color: 0x0066ff,
      transparent: true,
      opacity: 0.45,
    });
    const icoWire = new THREE.LineSegments(icoEdges, icoMat);
    group.add(icoWire);

    // Inner counter-rotating cube wireframe (monochromatic gray)
    const boxGeo = new THREE.BoxGeometry(1.65, 1.65, 1.65);
    const boxEdges = new THREE.EdgesGeometry(boxGeo);
    const boxMat = new THREE.LineBasicMaterial({
      color: 0x71717a,
      transparent: true,
      opacity: 0.55,
    });
    const boxWire = new THREE.LineSegments(boxEdges, boxMat);
    group.add(boxWire);

    // Orbital ring
    const ringGeo = new THREE.RingGeometry(2.35, 2.38, 64);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x0066ff,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.35,
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 2.6;
    group.add(ring);

    // Architectural 3D grid floor
    const gridHelper = new THREE.GridHelper(18, 24, 0x0066ff, 0x52525b);
    gridHelper.position.set(0, -2.8, -1.5);
    const gridMaterials = Array.isArray(gridHelper.material)
      ? gridHelper.material
      : [gridHelper.material];
    gridMaterials.forEach((m) => {
      m.transparent = true;
      m.opacity = 0.22;
    });
    scene.add(gridHelper);

    // Monochromatic + electric blue particle field
    const particleCount = 140;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const blueColor = new THREE.Color(0x0066ff);
    const grayColor = new THREE.Color(0xa1a1aa);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 14;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 8;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 6;
      const c = i % 4 === 0 ? blueColor : grayColor;
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }

    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    const particleMat = new THREE.PointsMaterial({
      size: 0.055,
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    let mouseX = 0;
    let mouseY = 0;

    const onPointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      mouseX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      mouseY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });

    const onResize = () => {
      if (!container) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || 600;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', onResize);

    let animId = 0;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = window.requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();
      const s = scrollRef.current * 0.0025;

      icoWire.rotation.x = elapsed * 0.18 + s;
      icoWire.rotation.y = elapsed * 0.25 + mouseX * 0.45;

      boxWire.rotation.x = -elapsed * 0.22 - s * 0.8;
      boxWire.rotation.y = -elapsed * 0.16 + mouseY * 0.35;

      ring.rotation.z = elapsed * 0.12 + s;

      group.position.y = 0.1 - scrollRef.current * 0.002;
      group.rotation.y += (mouseX * 0.25 - group.rotation.y) * 0.04;
      group.rotation.x += (-mouseY * 0.18 - group.rotation.x) * 0.04;

      particles.rotation.y = elapsed * 0.03 + s * 0.2;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.cancelAnimationFrame(animId);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('resize', onResize);
      icoGeo.dispose();
      icoEdges.dispose();
      icoMat.dispose();
      boxGeo.dispose();
      boxEdges.dispose();
      boxMat.dispose();
      ringGeo.dispose();
      ringMat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 opacity-85"
    />
  );
}
