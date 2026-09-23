import { useEffect, useRef } from 'react';
import { toCanvas } from 'html-to-image';
import * as THREE from 'three';

const PAGE_WIDTH = 10.9;
const PAGE_HEIGHT = 9.45;
const HALF = PAGE_WIDTH / 2;
const TURN_DURATION = 800;
const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

function curvedPageGeometry(side) {
  const geometry = new THREE.PlaneGeometry(PAGE_WIDTH, PAGE_HEIGHT, 32, 14);
  const positions = geometry.attributes.position;
  for (let index = 0; index < positions.count; index++) {
    const x = positions.getX(index);
    const edge = Math.abs(x) / HALF;
    positions.setZ(index, 0.13 + 0.1 * Math.sin((x / PAGE_WIDTH + 0.5) * Math.PI) + 0.09 * edge + (side === 'left' ? -x : x) * 0.004);
  }
  positions.needsUpdate = true;
  geometry.computeVertexNormals();
  return geometry;
}

function coverTexture(back = false) {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 900;
  const ctx = canvas.getContext('2d');
  const leather = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  leather.addColorStop(0, '#65442b');
  leather.addColorStop(0.44, '#302017');
  leather.addColorStop(1, '#170f0c');
  ctx.fillStyle = leather;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  for (let index = 0; index < 1000; index++) {
    const x = (index * 721) % canvas.width;
    const y = (index * 457) % canvas.height;
    ctx.fillStyle = index % 2 ? '#e2bd7b08' : '#05030218';
    ctx.fillRect(x, y, 2, 2);
  }
  ctx.strokeStyle = '#b18a55';
  ctx.lineWidth = 5;
  ctx.strokeRect(32, 32, 960, 836);
  ctx.lineWidth = 1.5;
  ctx.strokeRect(50, 50, 924, 800);
  ctx.strokeStyle = '#d2ab6b88';
  ctx.beginPath();
  ctx.moveTo(270, 300);
  ctx.lineTo(754, 300);
  ctx.moveTo(270, 605);
  ctx.lineTo(754, 605);
  ctx.stroke();
  ctx.textAlign = 'center';
  ctx.fillStyle = '#d5b784';
  ctx.font = '500 23px Arial';
  ctx.fillText('THE BOOK OF THINH', 512, 252);
  ctx.font = back ? '400 98px Georgia' : '400 83px Georgia';
  ctx.fillStyle = '#f3dfb8';
  if (back) {
    ctx.fillText('9/2026', 512, 467);
  } else {
    ctx.fillText('Bùi Hữu', 512, 425);
    ctx.fillText('Thịnh', 512, 522);
  }
  ctx.fillStyle = '#d6bb91';
  ctx.font = '500 22px Arial';
  ctx.fillText(back ? 'PORTFOLIO · BÙI HỮU THỊNH' : 'SOFTWARE ENGINEER · MIDDLE', 512, 658);
  ctx.font = '500 18px Arial';
  ctx.fillText(back ? 'THE END · KEEP EXPLORING' : 'PORTFOLIO / CV · 2026', 512, 784);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  return texture;
}

function makeCover(texture, goldMaterial, leatherMaterial, reverse = false) {
  const group = new THREE.Group();
  const pages = new THREE.Mesh(new THREE.BoxGeometry(11.2, 9.96, 0.35), new THREE.MeshStandardMaterial({ color: 0xe8dcc9, roughness: 0.96 }));
  pages.position.set(HALF + 0.04, -0.1, 0.13);
  group.add(pages);
  const spine = new THREE.Mesh(new THREE.BoxGeometry(0.35, 10.12, 0.62), leatherMaterial);
  spine.position.set(0.09, 0, 0.28);
  group.add(spine);
  const trim = new THREE.Mesh(new THREE.BoxGeometry(11.43, 10.13, 0.27), goldMaterial);
  trim.position.set(HALF + 0.04, 0, 0.39);
  group.add(trim);
  const board = new THREE.Mesh(new THREE.BoxGeometry(11.34, 10.05, 0.29), leatherMaterial);
  board.position.set(HALF + 0.04, 0, 0.45);
  group.add(board);
  const face = new THREE.Mesh(new THREE.PlaneGeometry(11.17, 9.88), new THREE.MeshBasicMaterial(reverse ? { color: 0x382519, toneMapped: false } : { map: texture, toneMapped: false }));
  face.position.set(HALF + 0.04, 0, 0.602);
  group.add(face);
  let reverseFace = null;
  if (reverse) {
    reverseFace = new THREE.Mesh(new THREE.PlaneGeometry(11.17, 9.88), new THREE.MeshBasicMaterial({ map: texture, toneMapped: false }));
    reverseFace.position.set(HALF + 0.04, 0, -0.07);
    reverseFace.rotation.y = Math.PI;
    group.add(reverseFace);
  }
  return { group, face, reverseFace };
}

function curlPage(geometry, side, progress, cornerY) {
  const positions = geometry.attributes.position;
  const original = geometry.userData.original ?? Float32Array.from(positions.array);
  geometry.userData.original = original;
  const wave = Math.sin(Math.PI * progress);
  for (let index = 0; index < positions.count; index++) {
    const x = original[index * 3];
    const y = original[index * 3 + 1];
    const edge = side === 'right' ? (x + HALF) / PAGE_WIDTH : (HALF - x) / PAGE_WIDTH;
    const bottom = (PAGE_HEIGHT / 2 - y) / PAGE_HEIGHT;
    const cornerWeight = cornerY < 0 ? bottom : 1 - bottom;
    const lift = wave * Math.pow(edge, 1.55) * (0.38 + 0.62 * cornerWeight) * 1.7;
    positions.setXYZ(index, x, y + lift * (cornerY < 0 ? 0.17 : -0.17), original[index * 3 + 2] + lift);
  }
  positions.needsUpdate = true;
  geometry.computeVertexNormals();
}

export default function PhysicalBook({ page, flip, sourcesRef, apiRef, onReady, onSelectExperience, onTurn, lastChapter }) {
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
    camera.position.set(0, 0.3, 16.5);
    camera.lookAt(0, 0, 0);
    scene.add(new THREE.AmbientLight(0xffe8cd, 1.6));
    const keyLight = new THREE.DirectionalLight(0xffdfad, 2.7);
    keyLight.position.set(-4, 7, 7);
    scene.add(keyLight);

    const book = new THREE.Group();
    scene.add(book);
    const leatherMaterial = new THREE.MeshStandardMaterial({ color: 0x302017, roughness: 0.84, metalness: 0.06 });
    const paperEdgeMaterial = new THREE.MeshStandardMaterial({ color: 0xe6d9c5, roughness: 0.96 });
    const goldMaterial = new THREE.MeshStandardMaterial({ color: 0xb18b58, metalness: 0.68, roughness: 0.38 });
    const frontTexture = coverTexture();
    const backTexture = coverTexture(true);
    const frontCover = makeCover(frontTexture, goldMaterial, leatherMaterial);
    const backCover = makeCover(backTexture, goldMaterial, leatherMaterial, true);
    book.add(frontCover.group, backCover.group);

    const openParts = new THREE.Group();
    book.add(openParts);
    const base = new THREE.Mesh(new THREE.BoxGeometry(22.75, 10.13, 0.4), leatherMaterial);
    base.position.z = -0.22;
    openParts.add(base);
    const spine = new THREE.Mesh(new THREE.BoxGeometry(0.45, 10.15, 0.58), leatherMaterial);
    spine.position.z = -0.06;
    openParts.add(spine);
    for (let index = 0; index < 8; index++) {
      const stack = new THREE.Mesh(new THREE.BoxGeometry(21.98, 9.65, 0.018), paperEdgeMaterial);
      stack.position.z = -0.018 + index * 0.026;
      openParts.add(stack);
    }
    const trim = new THREE.Mesh(new THREE.BoxGeometry(22.57, 9.98, 0.024), goldMaterial);
    trim.position.z = -0.006;
    openParts.add(trim);
    const pageBase = new THREE.Mesh(new THREE.BoxGeometry(22.05, 9.68, 0.19), paperEdgeMaterial);
    pageBase.position.z = 0.13;
    openParts.add(pageBase);

    const emptyMaterial = new THREE.MeshBasicMaterial({ color: 0xf1e9dd, side: THREE.DoubleSide, toneMapped: false });
    const leftPage = new THREE.Mesh(curvedPageGeometry('left'), emptyMaterial.clone());
    leftPage.position.set(-HALF, 0, 0.26);
    const rightPage = new THREE.Mesh(curvedPageGeometry('right'), emptyMaterial.clone());
    rightPage.position.set(HALF, 0, 0.26);
    openParts.add(leftPage, rightPage);

    const turnGroup = new THREE.Group();
    turnGroup.position.z = 0.6;
    turnGroup.visible = false;
    const front = new THREE.Mesh(curvedPageGeometry('right'), emptyMaterial.clone());
    const back = new THREE.Mesh(curvedPageGeometry('right'), emptyMaterial.clone());
    back.rotation.y = Math.PI;
    back.position.z = -0.015;
    turnGroup.add(front, back);
    book.add(turnGroup);

    const cornerGlow = new THREE.Mesh(new THREE.CircleGeometry(0.53, 32), new THREE.MeshBasicMaterial({ color: 0xf3c279, transparent: true, opacity: 0.4, depthWrite: false }));
    cornerGlow.visible = false;
    book.add(cornerGlow);

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
      if (index < 0 || index > lastChapter) return;
      await Promise.all([ensureTexture(index, 'left'), ensureTexture(index, 'right')]);
    };
    const mappedMaterial = (texture, side = THREE.DoubleSide) => new THREE.MeshBasicMaterial({ map: texture, side, toneMapped: false });
    const applySide = (index, side) => {
      if (index < 0 || index > lastChapter) return;
      const texture = textures.get(textureKey(index, side));
      if (!texture) return;
      const pageMesh = side === 'left' ? leftPage : rightPage;
      pageMesh.material.dispose();
      pageMesh.material = mappedMaterial(texture);
    };
    const applyPages = (index) => {
      applySide(index, 'left');
      applySide(index, 'right');
    };
    const setPage = (index) => prepare(index).then(() => { if (!disposed && pageRef.current === index) applyPages(index); });
    apiRef.current = { prepare, setPage };

    let baseScale = 1;
    const layout = (closedAmount, closedSide = 'right') => {
      const scale = baseScale * (1 + closedAmount * 0.16);
      book.scale.setScalar(scale);
      book.position.x = (closedSide === 'left' ? HALF : -HALF) * closedAmount * scale;
    };
    const showRest = (index) => {
      const frontClosed = index < 0;
      const backClosed = index > lastChapter;
      if (!frontClosed && !backClosed) applyPages(index);
      openParts.visible = !frontClosed && !backClosed;
      frontCover.group.visible = !backClosed;
      frontCover.group.rotation.y = frontClosed ? 0 : -Math.PI;
      backCover.group.visible = backClosed;
      backCover.group.rotation.y = backClosed ? -Math.PI : 0;
      turnGroup.visible = false;
      cornerGlow.visible = false;
      layout(frontClosed || backClosed ? 1 : 0, backClosed ? 'left' : 'right');
    };
    showRest(pageRef.current);
    prepare(pageRef.current >= 0 && pageRef.current <= lastChapter ? pageRef.current : 0).then(() => {
      if (!disposed) {
        if (pageRef.current >= 0 && pageRef.current <= lastChapter) applyPages(pageRef.current);
        callbacksRef.current.onReady();
      }
    }).catch(() => {
      // The CSS book stays visible if WebGL page capture is unavailable.
    });

    const resize = () => {
      const width = Math.max(1, mount.clientWidth);
      const height = Math.max(1, mount.clientHeight);
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      const visibleHeight = 2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.position.z;
      const visibleWidth = visibleHeight * camera.aspect;
      baseScale = Math.min(visibleWidth / 23.3, visibleHeight / 10.5) * 0.95;
      layout(pageRef.current < 0 || pageRef.current > lastChapter ? 1 : 0, pageRef.current > lastChapter ? 'left' : 'right');
    };
    const observer = new ResizeObserver(resize);
    observer.observe(mount);
    resize();

    let activeFlip = null;
    let flipStartedAt = 0;
    let preview = null;
    let drag = null;
    let returning = null;
    const configureSheet = (turn) => {
      if (turn.from < 0 || turn.to < 0 || turn.from > lastChapter || turn.to > lastChapter) return;
      const frontTexture = textures.get(textureKey(turn.from, turn.direction === 1 ? 'right' : 'left'));
      const backTexture = textures.get(textureKey(turn.to, turn.direction === 1 ? 'left' : 'right'));
      if (!frontTexture || !backTexture) return;
      front.material.dispose();
      back.material.dispose();
      front.material = mappedMaterial(frontTexture, THREE.FrontSide);
      back.material = mappedMaterial(backTexture, THREE.FrontSide);
      front.geometry.dispose();
      back.geometry.dispose();
      const side = turn.direction === 1 ? 'right' : 'left';
      front.geometry = curvedPageGeometry(side);
      back.geometry = curvedPageGeometry(side);
      const offset = turn.direction === 1 ? HALF : -HALF;
      front.position.x = offset;
      back.position.x = offset;
      turnGroup.rotation.y = 0;
      turnGroup.visible = true;
    };
    const renderTurn = (turn, progress) => {
      const p = clamp(progress, 0, 1);
      const coverTransition = turn.from < 0 || turn.to < 0;
      const backTransition = turn.from > lastChapter || turn.to > lastChapter;
      if (coverTransition || backTransition) {
        const opening = turn.from < 0 || turn.from > lastChapter;
        const closed = opening ? 1 - p : p;
        openParts.visible = opening ? p > 0.03 : p < 0.97;
        frontCover.group.visible = !backTransition;
        backCover.group.visible = backTransition;
        if (coverTransition) frontCover.group.rotation.y = -Math.PI * (opening ? p : 1 - p);
        if (backTransition) backCover.group.rotation.y = -Math.PI * (opening ? 1 - p : p);
        layout(closed, backTransition ? 'left' : 'right');
        turnGroup.visible = false;
      } else {
        openParts.visible = true;
        layout(0);
        turnGroup.visible = true;
        const side = turn.direction === 1 ? 'right' : 'left';
        turnGroup.rotation.y = (turn.direction === 1 ? -1 : 1) * Math.PI * p;
        curlPage(front.geometry, side, p, turn.cornerY ?? -1);
        curlPage(back.geometry, side, p, turn.cornerY ?? -1);
      }
    };
    const configureTurn = (turn) => {
      if (!turn) return;
      preview = null;
      returning = null;
      activeFlip = turn;
      flipStartedAt = performance.now();
      if ((turn.from < 0 || turn.from > lastChapter) && turn.to >= 0 && turn.to <= lastChapter) applyPages(turn.to);
      if (turn.from >= 0 && turn.from <= lastChapter && turn.to >= 0 && turn.to <= lastChapter) {
        configureSheet(turn);
        applySide(turn.to, turn.direction === 1 ? 'right' : 'left');
      }
      renderTurn(turn, turn.startProgress || 0);
    };

    const hitAt = (event) => {
      const bounds = renderer.domElement.getBoundingClientRect();
      pointer.set(((event.clientX - bounds.left) / bounds.width) * 2 - 1, -((event.clientY - bounds.top) / bounds.height) * 2 + 1);
      raycaster.setFromCamera(pointer, camera);
      const index = pageRef.current;
      const targets = index < 0 ? [frontCover.face] : index > lastChapter ? [backCover.reverseFace] : [leftPage, rightPage];
      return raycaster.intersectObjects(targets)[0];
    };
    const cornerAt = (hit) => {
      if (!hit?.uv || flipRef.current || activeFlip || preview?.waiting) return null;
      const index = pageRef.current;
      const right = index < 0 || (index <= lastChapter && hit.object === rightPage);
      const left = index > lastChapter || (index >= 0 && hit.object === leftPage);
      const outer = right ? hit.uv.x > 0.86 : hit.uv.x < 0.14;
      const corner = hit.uv.y < 0.18 || hit.uv.y > 0.82;
      if ((!right && !left) || !outer || !corner) return null;
      return { direction: right ? 1 : -1, cornerY: hit.uv.y < 0.5 ? -1 : 1 };
    };
    const showCorner = (corner) => {
      cornerGlow.visible = Boolean(corner);
      if (corner) {
        const closed = pageRef.current < 0 || pageRef.current > lastChapter;
        cornerGlow.position.set(corner.direction === 1 ? PAGE_WIDTH - 0.55 : -PAGE_WIDTH + 0.55, corner.cornerY * (PAGE_HEIGHT / 2 - 0.45), 0.83);
        layout(closed ? 1 : 0, pageRef.current > lastChapter ? 'left' : 'right');
      }
      renderer.domElement.style.cursor = corner ? 'grab' : 'default';
    };
    const handlePointerDown = async (event) => {
      if (event.button !== 0) return;
      const hit = hitAt(event);
      const corner = cornerAt(hit);
      if (!corner) return;
      const next = pageRef.current + corner.direction;
      if (next < -1 || next > lastChapter + 1) return;
      renderer.domElement.setPointerCapture(event.pointerId);
      drag = { pointerId: event.pointerId, startX: event.clientX, startY: event.clientY, x: event.clientX, y: event.clientY, progress: 0, ready: false, turn: { from: pageRef.current, to: next, ...corner } };
      showCorner(null);
      try {
        await prepare(next);
        if (!disposed && drag?.pointerId === event.pointerId) {
          drag.ready = true;
          preview = { turn: drag.turn, progress: drag.progress };
          if ((drag.turn.from < 0 || drag.turn.from > lastChapter) && next >= 0 && next <= lastChapter) applyPages(next);
          if (next >= 0 && next <= lastChapter && pageRef.current >= 0 && pageRef.current <= lastChapter) {
            configureSheet(drag.turn);
            applySide(next, drag.turn.direction === 1 ? 'right' : 'left');
          }
        }
      } catch { drag = null; preview = null; }
    };
    const handlePointerMove = (event) => {
      if (!drag || drag.pointerId !== event.pointerId) {
        if (!preview && !activeFlip) showCorner(cornerAt(hitAt(event)));
        return;
      }
      drag.x = event.clientX;
      drag.y = event.clientY;
      const bounds = renderer.domElement.getBoundingClientRect();
      const horizontal = (drag.startX - event.clientX) * drag.turn.direction / (bounds.width * 0.38);
      const upward = Math.max(0, drag.startY - event.clientY) / (bounds.height * 0.65);
      drag.progress = clamp(horizontal * 0.85 + upward * 0.15, 0, 0.98);
      if (drag.ready && preview) preview.progress = drag.progress;
      renderer.domElement.style.cursor = 'grabbing';
    };
    const finishDrag = (event, cancelled = false) => {
      if (!drag || drag.pointerId !== event.pointerId) return;
      const current = drag;
      drag = null;
      if (renderer.domElement.hasPointerCapture(event.pointerId)) renderer.domElement.releasePointerCapture(event.pointerId);
      renderer.domElement.style.cursor = 'default';
      const moved = Math.hypot(current.x - current.startX, current.y - current.startY);
      if (!cancelled && (current.progress > 0.24 || moved < 7)) {
        preview = { turn: current.turn, progress: current.progress, waiting: true };
        callbacksRef.current.onTurn(current.turn.direction, current.progress, current.turn.cornerY);
      } else if (preview) {
        returning = { turn: current.turn, from: current.progress, start: performance.now() };
        preview = null;
      }
    };
    const handleClick = (event) => {
      if (drag || preview || activeFlip || flipRef.current) return;
      const hit = hitAt(event);
      const index = pageRef.current;
      if (index < 3 || index > 7 || hit?.object !== leftPage || !hit.uv) return;
      const node = sourceNode(index, 'left');
      const bounds = node?.getBoundingClientRect();
      if (!bounds) return;
      const x = hit.uv.x * bounds.width;
      const y = (1 - hit.uv.y) * bounds.height;
      const selected = [...node.querySelectorAll('.leaf-jobs button')].findIndex((button) => {
        const box = button.getBoundingClientRect();
        return x >= box.left - bounds.left && x <= box.right - bounds.left && y >= box.top - bounds.top && y <= box.bottom - bounds.top;
      });
      if (selected >= 0) callbacksRef.current.onSelectExperience(selected);
    };
    const handlePointerLeave = () => { if (!drag) showCorner(null); };
    const handlePointerCancel = (event) => finishDrag(event, true);
    renderer.domElement.addEventListener('pointerdown', handlePointerDown);
    renderer.domElement.addEventListener('pointermove', handlePointerMove);
    renderer.domElement.addEventListener('pointerup', finishDrag);
    renderer.domElement.addEventListener('pointercancel', handlePointerCancel);
    renderer.domElement.addEventListener('pointerleave', handlePointerLeave);
    renderer.domElement.addEventListener('click', handleClick);

    let frame;
    const animate = () => {
      const nextFlip = flipRef.current;
      if (nextFlip && nextFlip !== activeFlip) configureTurn(nextFlip);
      if (!nextFlip && activeFlip) { activeFlip = null; showRest(pageRef.current); }
      if (activeFlip) {
        const elapsed = (performance.now() - flipStartedAt) / (activeFlip.duration || TURN_DURATION);
        const eased = 1 - Math.pow(1 - clamp(elapsed, 0, 1), 3);
        const progress = (activeFlip.startProgress || 0) + (1 - (activeFlip.startProgress || 0)) * eased;
        renderTurn(activeFlip, progress);
      } else if (preview) renderTurn(preview.turn, preview.progress);
      else if (returning) {
        const progress = returning.from * Math.pow(1 - clamp((performance.now() - returning.start) / 240, 0, 1), 2);
        if (progress < 0.01) { returning = null; showRest(pageRef.current); }
        else renderTurn(returning.turn, progress);
      }
      renderer.render(scene, camera);
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      observer.disconnect();
      renderer.domElement.removeEventListener('pointerdown', handlePointerDown);
      renderer.domElement.removeEventListener('pointermove', handlePointerMove);
      renderer.domElement.removeEventListener('pointerup', finishDrag);
      renderer.domElement.removeEventListener('pointercancel', handlePointerCancel);
      renderer.domElement.removeEventListener('pointerleave', handlePointerLeave);
      renderer.domElement.removeEventListener('click', handleClick);
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
      frontTexture.dispose();
      backTexture.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [apiRef, sourcesRef, lastChapter]);

  useEffect(() => { apiRef.current?.setPage(page).catch(() => {}); }, [apiRef, page]);
  return <div ref={mountRef} className="physical-book-canvas" aria-hidden="true" />;
}
