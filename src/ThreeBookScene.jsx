import { useEffect, useRef } from 'react';
import * as THREE from 'three';

// Ambient WebGL environment behind the independently rendered physical book.
export default function ThreeBookScene({ page }) {
  const mountRef = useRef(null);
  const pageRef = useRef(page);
  useEffect(() => { pageRef.current = page; }, [page]);

  useEffect(() => {
    const mount = mountRef.current;
    let renderer;
    try { renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true }); }
    catch { return undefined; }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setClearColor(0x111116, 1);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x17151a, 0.023);
    const camera = new THREE.PerspectiveCamera(48, 1, 0.1, 100);
    camera.position.set(0, 2.5, 15);
    camera.lookAt(0, 0, 0);
    scene.add(new THREE.HemisphereLight(0xe6d4bd, 0x09090c, 1.7));
    const keyLight = new THREE.PointLight(0xffd8a2, 110, 23);
    keyLight.position.set(1, 7, 4);
    scene.add(keyLight);
    const rimLight = new THREE.PointLight(0xf0b474, 46, 18);
    rimLight.position.set(-6, 0, -1);
    scene.add(rimLight);

    const planet = new THREE.Mesh(new THREE.SphereGeometry(3.2, 40, 32), new THREE.MeshStandardMaterial({ color: 0x564849, roughness: 1, metalness: 0.03 }));
    planet.position.set(-5.5, 4.5, -11);
    scene.add(planet);
    const planetHalo = new THREE.Mesh(new THREE.SphereGeometry(3.5, 32, 24), new THREE.MeshBasicMaterial({ color: 0xeabf9d, transparent: true, opacity: 0.035, side: THREE.BackSide }));
    planetHalo.position.copy(planet.position);
    scene.add(planetHalo);

    const floor = new THREE.Mesh(new THREE.PlaneGeometry(80, 80), new THREE.MeshStandardMaterial({ color: 0x151316, metalness: 0.18, roughness: 0.8 }));
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -5.2;
    scene.add(floor);

    const orbit = new THREE.Group();
    orbit.position.set(0, -1.5, -1.5);
    scene.add(orbit);
    for (let index = 0; index < 3; index++) {
      const ring = new THREE.Mesh(new THREE.TorusGeometry(9.3 + index * 0.7, 0.017, 4, 160), new THREE.MeshBasicMaterial({ color: 0xdba565, transparent: true, opacity: 0.28 - index * 0.055 }));
      ring.rotation.set(0.5 + index * 0.11, 0.12, index * 0.18);
      orbit.add(ring);
    }

    const rockGeometry = new THREE.DodecahedronGeometry(1, 1);
    const rockMaterial = new THREE.MeshStandardMaterial({ color: 0x332c2a, roughness: 0.94, flatShading: true, metalness: 0.05 });
    const rocks = new THREE.Group();
    [[-9,-3,2,1.8],[9,5,-1,1.4],[10,-3,1,1.1],[-8,4,-3,.8],[-4,-5,0,2.7],[4,-5,-2,2.4]].forEach(([x,y,z,size], index) => {
      const rock = new THREE.Mesh(rockGeometry, rockMaterial);
      rock.position.set(x,y,z);
      rock.scale.set(size,size*.72,size*.8);
      rock.rotation.set(index*.6,index*.8,index*.3);
      rocks.add(rock);
    });
    scene.add(rocks);

    const positions = new Float32Array(500 * 3);
    for (let index = 0; index < 500; index++) {
      positions[index * 3] = (Math.random() - .5) * 38;
      positions[index * 3 + 1] = (Math.random() - .5) * 22;
      positions[index * 3 + 2] = (Math.random() - .5) * 24 - 5;
    }
    const dustGeometry = new THREE.BufferGeometry();
    dustGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const dust = new THREE.Points(dustGeometry, new THREE.PointsMaterial({ color: 0xeac99e, size: 0.055, transparent: true, opacity: 0.64 }));
    scene.add(dust);

    const resize = () => {
      const width = mount.clientWidth;
      const height = Math.max(1, mount.clientHeight);
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };
    const observer = new ResizeObserver(resize);
    observer.observe(mount);
    resize();

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let frame;
    const animate = (time) => {
      if (!reduced) {
        orbit.rotation.z = time * 0.000015;
        dust.rotation.y = time * 0.000004;
        rocks.rotation.y = Math.sin(time * 0.00012) * 0.025;
        keyLight.intensity = 106 + Math.sin(time * 0.001 + pageRef.current) * 5;
      }
      renderer.render(scene, camera);
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      const geometries = new Set();
      const materials = new Set();
      scene.traverse((object) => {
        if (object.geometry) geometries.add(object.geometry);
        if (object.material) materials.add(object.material);
      });
      geometries.forEach((geometry) => geometry.dispose());
      materials.forEach((material) => material.dispose());
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return <div ref={mountRef} className="concept-scene" aria-hidden="true" />;
}
