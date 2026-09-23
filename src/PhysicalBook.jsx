import { useEffect, useRef } from 'react';
import { toCanvas } from 'html-to-image';
import * as THREE from 'three';

const PAGE_WIDTH = 10.9;
const PAGE_HEIGHT = 9.45;
const TURN_DURATION = 700;

function curvedPageGeometry(side) {
  const geometry = new THREE.PlaneGeometry(PAGE_WIDTH, PAGE_HEIGHT, 32, 1);
  const positions = geometry.attributes.position;
  for (let index = 0; index < positions.count; index++) {
    const x = positions.getX(index);
    const edge = Math.abs(x) / (PAGE_WIDTH / 2);
    positions.setZ(index, 0.13 + 0.1 * Math.sin((x / PAGE_WIDTH + 0.5) * Math.PI) + 0.09 * edge + (side === 'left' ? -x : x) * 0.004);
  }
  positions.needsUpdate = true;
  geometry.computeVertexNormals();
  return geometry;
}

export default function PhysicalBook({ page, flip, sourcesRef, apiRef, onReady, onSelectExperience, onTurn }) {
  const mountRef = useRef(null);
  const pageRef = useRef(page);
  const flipRef = useRef(flip);
  const callbacksRef = useRef({ onReady, onSelectExperience, onTurn });
  useEffect(() => { pageRef.current = page; }, [page]);
  useEffect(() => { flipRef.current = flip; }, [flip]);
  useEffect(() => { callbacksRef.current = { onReady, onSelectExperience, onTurn }; }, [onReady, onSelectExperience, onTurn]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return undefined;
    let renderer;
    try { renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true }); }
    catch { return undefined; }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 60);
    camera.position.set(0, 2.15, 15.5);
    camera.lookAt(0, 0, 0);
    scene.add(new THREE.AmbientLight(0xffe8cd, 1.6));
    const keyLight = new THREE.DirectionalLight(0xffdfad, 2.7);
    keyLight.position.set(-4, 7, 7);
    scene.add(keyLight);

    const book = new THREE.Group();
    book.rotation.x = -0.035;
    book.rotation.y = -0.045;
    scene.add(book);
    const coverMaterial = new THREE.MeshStandardMaterial({ color: 0x302017, roughness: 0.8, metalness: 0.08 });
    const paperEdgeMaterial = new THREE.MeshStandardMaterial({ color: 0xe6d9c5, roughness: 0.96 });
    const goldMaterial = new THREE.MeshStandardMaterial({ color: 0xb18b58, metalness: 0.68, roughness: 0.38 });
    const cover = new THREE.Mesh(new THREE.BoxGeometry(22.75, 10.13, 0.4), coverMaterial);
    cover.position.z = -0.22;
    book.add(cover);
    const spine = new THREE.Mesh(new THREE.BoxGeometry(0.45, 10.15, 0.58), coverMaterial);
    spine.position.z = -0.06;
    book.add(spine);
    for (let index = 0; index < 8; index++) {
      const stack = new THREE.Mesh(new THREE.BoxGeometry(21.98, 9.65, 0.018), paperEdgeMaterial);
      stack.position.z = -0.018 + index * 0.026;
      book.add(stack);
    }
    const trim = new THREE.Mesh(new THREE.BoxGeometry(22.57, 9.98, 0.024), goldMaterial);
    trim.position.z = -0.006;
    book.add(trim);
    const pageBase = new THREE.Mesh(new THREE.BoxGeometry(22.05, 9.68, 0.19), paperEdgeMaterial);
    pageBase.position.z = 0.13;
    book.add(pageBase);

    const emptyMaterial = new THREE.MeshBasicMaterial({ color: 0xf1e9dd, side: THREE.DoubleSide, toneMapped: false });
    const leftGeometry = curvedPageGeometry('left');
    const rightGeometry = curvedPageGeometry('right');
    const leftPage = new THREE.Mesh(leftGeometry, emptyMaterial.clone());
    leftPage.position.x = -PAGE_WIDTH / 2;
    leftPage.position.z = 0.26;
    const rightPage = new THREE.Mesh(rightGeometry, emptyMaterial.clone());
    rightPage.position.x = PAGE_WIDTH / 2;
    rightPage.position.z = 0.26;
    book.add(leftPage, rightPage);

    const turnGroup = new THREE.Group();
    turnGroup.position.z = 0.52;
    turnGroup.visible = false;
    const front = new THREE.Mesh(rightGeometry.clone(), emptyMaterial.clone());
    const back = new THREE.Mesh(rightGeometry.clone(), emptyMaterial.clone());
    back.rotation.y = Math.PI;
    back.position.z = -0.015;
    turnGroup.add(front, back);
    book.add(turnGroup);

    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    const textures = new Map();
    const requests = new Map();
    let disposed = false;
    const textureKey = (index, side) => `${index}-${side}`;
    const sourceNode = (index, side) => sourcesRef.current?.querySelector(`[data-page="${index}"][data-side="${side}"]`);
    const ensureTexture = (index, side) => {
      const key = textureKey(index, side);
      if (textures.has(key)) return Promise.resolve(textures.get(key));
      if (requests.has(key)) return requests.get(key);
      const node = sourceNode(index, side);
      if (!node) return Promise.reject(new Error(`Missing book page ${key}`));
      const request = toCanvas(node, { pixelRatio: 1.5, backgroundColor: '#f1e9dd' }).then((canvas) => {
        if (disposed) return null;
        const texture = new THREE.CanvasTexture(canvas);
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.anisotropy = Math.min(renderer.capabilities.getMaxAnisotropy(), 8);
        texture.needsUpdate = true;
        textures.set(key, texture);
        return texture;
      }).finally(() => requests.delete(key));
      requests.set(key, request);
      return request;
    };
    const prepare = async (index) => {
      await Promise.all([ensureTexture(index, 'left'), ensureTexture(index, 'right')]);
    };
    const mappedMaterial = (texture, side = THREE.DoubleSide) => new THREE.MeshBasicMaterial({ map: texture, side, toneMapped: false });
    const applyPages = (index) => {
      const left = textures.get(textureKey(index, 'left'));
      const right = textures.get(textureKey(index, 'right'));
      if (!left || !right) return;
      leftPage.material.dispose();
      rightPage.material.dispose();
      leftPage.material = mappedMaterial(left);
      rightPage.material = mappedMaterial(right);
    };
    const prepareAndApply = (index) => prepare(index).then(() => {
      if (!disposed && pageRef.current === index) applyPages(index);
    });
    apiRef.current = { prepare, setPage: prepareAndApply };
    prepareAndApply(pageRef.current).then(() => {
      if (!disposed) callbacksRef.current.onReady();
    }).catch(() => {
      // The DOM/CSS book remains available if page rasterization fails.
    });

    const resize = () => {
      const width = Math.max(1, mount.clientWidth);
      const height = Math.max(1, mount.clientHeight);
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      const visibleHeight = 2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.position.z;
      const visibleWidth = visibleHeight * camera.aspect;
      const scale = Math.min(visibleWidth / 23.3, visibleHeight / 10.5) * 0.93;
      book.scale.setScalar(scale);
    };
    const observer = new ResizeObserver(resize);
    observer.observe(mount);
    resize();

    let activeFlip = null;
    let flipStartedAt = 0;
    const configureTurn = (turn) => {
      if (!turn) { turnGroup.visible = false; activeFlip = null; return; }
      const frontTexture = textures.get(textureKey(turn.from, turn.direction === 1 ? 'right' : 'left'));
      const backTexture = textures.get(textureKey(turn.to, turn.direction === 1 ? 'left' : 'right'));
      if (!frontTexture || !backTexture) return;
      front.material.dispose();
      back.material.dispose();
      front.material = mappedMaterial(frontTexture, THREE.FrontSide);
      back.material = mappedMaterial(backTexture, THREE.FrontSide);
      front.geometry.dispose();
      back.geometry.dispose();
      const geometry = curvedPageGeometry(turn.direction === 1 ? 'right' : 'left');
      front.geometry = geometry;
      back.geometry = geometry.clone();
      const offset = turn.direction === 1 ? PAGE_WIDTH / 2 : -PAGE_WIDTH / 2;
      front.position.x = offset;
      back.position.x = offset;
      turnGroup.rotation.y = 0;
      turnGroup.visible = true;
      activeFlip = turn;
      flipStartedAt = performance.now();
    };

    let targetYaw = -0.045;
    let targetPitch = -0.035;
    const handlePointerMove = (event) => {
      const bounds = renderer.domElement.getBoundingClientRect();
      targetYaw = -0.045 + ((event.clientX - bounds.left) / bounds.width - 0.5) * 0.3;
      targetPitch = -0.035 + ((event.clientY - bounds.top) / bounds.height - 0.5) * 0.09;
    };
    const handlePointerLeave = () => { targetYaw = -0.045; targetPitch = -0.035; };
    const handleClick = (event) => {
      const bounds = renderer.domElement.getBoundingClientRect();
      pointer.set(((event.clientX - bounds.left) / bounds.width) * 2 - 1, -((event.clientY - bounds.top) / bounds.height) * 2 + 1);
      raycaster.setFromCamera(pointer, camera);
      const hit = raycaster.intersectObjects([leftPage, rightPage])[0];
      if (!hit || flipRef.current) return;
      const index = pageRef.current;
      if (index >= 3 && index <= 7 && hit.object === leftPage && hit.uv) {
        const node = sourceNode(index, 'left');
        const nodeBounds = node?.getBoundingClientRect();
        if (nodeBounds) {
          const x = hit.uv.x * nodeBounds.width;
          const y = (1 - hit.uv.y) * nodeBounds.height;
          const buttons = [...node.querySelectorAll('.leaf-jobs button')];
          const selected = buttons.findIndex((button) => {
            const box = button.getBoundingClientRect();
            return x >= box.left - nodeBounds.left && x <= box.right - nodeBounds.left && y >= box.top - nodeBounds.top && y <= box.bottom - nodeBounds.top;
          });
          if (selected >= 0) { callbacksRef.current.onSelectExperience(selected); return; }
        }
      }
      if (hit.uv && hit.uv.x > 0.88 && hit.object === rightPage) callbacksRef.current.onTurn(1);
      if (hit.uv && hit.uv.x < 0.12 && hit.object === leftPage) callbacksRef.current.onTurn(-1);
    };
    renderer.domElement.addEventListener('click', handleClick);
    renderer.domElement.addEventListener('pointermove', handlePointerMove);
    renderer.domElement.addEventListener('pointerleave', handlePointerLeave);

    let frame;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const animate = () => {
      const nextFlip = flipRef.current;
      if (nextFlip !== activeFlip) configureTurn(nextFlip);
      if (activeFlip) {
        const progress = Math.min(1, (performance.now() - flipStartedAt) / TURN_DURATION);
        const eased = progress * progress * (3 - 2 * progress);
        turnGroup.rotation.y = (activeFlip.direction === 1 ? -1 : 1) * Math.PI * eased;
      }
      if (!reduced) {
        book.rotation.x += (targetPitch - book.rotation.x) * 0.035;
        book.rotation.y += (targetYaw - book.rotation.y) * 0.035;
      }
      renderer.render(scene, camera);
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      observer.disconnect();
      renderer.domElement.removeEventListener('click', handleClick);
      renderer.domElement.removeEventListener('pointermove', handlePointerMove);
      renderer.domElement.removeEventListener('pointerleave', handlePointerLeave);
      if (apiRef.current?.prepare === prepare) apiRef.current = null;
      const geometries = new Set();
      const materials = new Set();
      scene.traverse((object) => {
        if (object.geometry) geometries.add(object.geometry);
        if (object.material) materials.add(object.material);
      });
      geometries.forEach((geometry) => geometry.dispose());
      materials.forEach((material) => material.dispose());
      textures.forEach((texture) => texture.dispose());
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [apiRef, sourcesRef]);

  useEffect(() => { apiRef.current?.setPage(page).catch(() => {}); }, [apiRef, page]);
  return <div ref={mountRef} className="physical-book-canvas" aria-hidden="true" />;
}
