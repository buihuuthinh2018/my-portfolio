import { useEffect, useRef } from 'react';
import * as THREE from 'three';

// Curved sheets share a spine. Their height rises as a page turns.
function sheetGeometry(side, layer, turn = 0) {
  const geometry = new THREE.PlaneGeometry(3.5, 3.5, 40, 12);
  const positions = geometry.attributes.position;
  for (let i = 0; i < positions.count; i++) {
    const u = (positions.getX(i) + 1.75) / 3.5;
    const depth = positions.getY(i);
    const angle = turn * Math.PI;
    const x = side * u * 3.5 * Math.cos(angle);
    const y = 0.13 + layer * 0.018 + Math.sin(u * Math.PI) * (0.12 + layer * 0.01)
      + Math.pow(u, 1.8) * layer * 0.012 + Math.sin(angle) * u * 2.9;
    positions.setXYZ(i, x, y, depth);
  }
  geometry.computeVertexNormals();
  return geometry;
}

export default function ThreeBookScene({ page, direction }) {
  const mountRef = useRef(null);
  const flipRef = useRef({ progress: 1, direction: 1 });
  useEffect(() => { flipRef.current = { progress: 0, direction }; }, [page, direction]);

  useEffect(() => {
    const mount = mountRef.current;
    let renderer;
    try { renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true }); }
    catch { return undefined; }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.setClearColor(0x030913, 1);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3;
    mount.appendChild(renderer.domElement);
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x030913, 0.025);
    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 70);
    camera.position.set(0, 5.5, 12.8);
    camera.lookAt(0, 1.8, 0);
    scene.add(new THREE.HemisphereLight(0x9fcaff, 0x121023, 2.2));
    [[0x54cfff, 45, 0, 2, 1], [0x665dff, 55, -5, 3, 2], [0xa9d8ff, 60, 5, 5, -1]].forEach(([color, power, x,y,z]) => {
      const light = new THREE.PointLight(color, power, 20); light.position.set(x,y,z); scene.add(light);
    });
    const book = new THREE.Group();
    book.position.set(0, -0.7, 0);
    scene.add(book);
    const cover = new THREE.MeshStandardMaterial({ color: 0x07162b, metalness: 0.65, roughness: 0.24 });
    const paper = new THREE.MeshStandardMaterial({ color: 0xd1dded, side: THREE.DoubleSide, roughness: 0.8 });
    for (const side of [-1,1]) {
      const board = new THREE.Mesh(new THREE.BoxGeometry(3.65, 0.12, 3.7), cover);
      board.position.set(side*1.84,0,0); book.add(board);
      for (let layer = 0; layer < 22; layer++) {
        const sheet=sheetGeometry(side,layer);
        book.add(new THREE.Mesh(sheet,paper));
        const points=[];
        for(let j=0;j<=40;j++) { const u=j/40;points.push(new THREE.Vector3(side*u*3.5,0.13+layer*0.018+Math.sin(u*Math.PI)*(0.12+layer*0.01)+Math.pow(u,1.8)*layer*0.012,1.755)); }
        book.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(points),new THREE.LineBasicMaterial({color:0x42526c,transparent:true,opacity:0.6})));
      }
      for(let leaf=0;leaf<3;leaf++) book.add(new THREE.Mesh(sheetGeometry(side,24+leaf*2,0.09+leaf*0.075),paper));
    }
    const turning = new THREE.Mesh(sheetGeometry(1,23),paper); book.add(turning);
    const glow = new THREE.LineBasicMaterial({ color: 0x63dcff, transparent:true, opacity:0.8 });
    const spine = new THREE.Line(new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0,0.6,-1.8),new THREE.Vector3(0,0.6,1.8),
    ]),glow); book.add(spine);
    const ground = new THREE.Mesh(new THREE.PlaneGeometry(70,70), new THREE.MeshStandardMaterial({color:0x041023,metalness:0.85,roughness:0.22}));
    ground.rotation.x = -Math.PI/2; ground.position.y=-0.82; scene.add(ground);
    const grid = new THREE.GridHelper(50,70,0x163964,0x091a2b); grid.position.y=-0.81; scene.add(grid);

    const globe = new THREE.Group(); globe.position.set(0,2.5,0); scene.add(globe);
    const globeMaterial = new THREE.MeshBasicMaterial({color:0x39bfff,wireframe:true,transparent:true,opacity:0.2});
    globe.add(new THREE.Mesh(new THREE.SphereGeometry(1.05,28,18),globeMaterial));
    for(let i=0;i<3;i++) {
      const ring = new THREE.Mesh(new THREE.TorusGeometry(1.3+i*0.13,0.008,6,100),new THREE.MeshBasicMaterial({color:0x87dfff,transparent:true,opacity:0.5}));
      ring.rotation.set(i*0.8, i*0.6, i*0.4); globe.add(ring);
    }

    // Floating architectural panes with linework, not fabricated portfolio text.
    const panes = new THREE.Group(); scene.add(panes);
    const paneMaterial = new THREE.MeshBasicMaterial({ color:0x123974,transparent:true,opacity:0.2,side:THREE.DoubleSide,depthWrite:false });
    [[-2.3,3.4,-0.5,0.3],[2.2,3.8,-0.9,-0.4],[-2.6,1.9,0.4,0.45],[2.6,2,0.1,-0.5],[0.2,4.6,-1,0]].forEach(([x,y,z,angle],index)=>{
      const panel=new THREE.Group(); panel.position.set(x,y,z);panel.rotation.y=angle;
      const shape=new THREE.PlaneGeometry(1.65,1.05);
      panel.add(new THREE.Mesh(shape,paneMaterial));
      panel.add(new THREE.LineSegments(new THREE.EdgesGeometry(shape),glow));
      for(let row=0;row<4;row++) {
        const line=new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(-0.65,0.32-row*0.18,0.01),new THREE.Vector3(0.5-row*0.12,0.32-row*0.18,0.01)]),glow);
        panel.add(line);
      }
      panel.userData.phase=index;panes.add(panel);
    });
    const beam=new THREE.Mesh(new THREE.CylinderGeometry(1.9,0.06,5,48,1,true),new THREE.MeshBasicMaterial({color:0x248fff,transparent:true,opacity:0.075,side:THREE.DoubleSide,depthWrite:false,blending:THREE.AdditiveBlending}));
    beam.position.set(0,2,0);scene.add(beam);
    const glowCanvas=document.createElement('canvas');glowCanvas.width=128;glowCanvas.height=128;
    const ctx=glowCanvas.getContext('2d');const gradient=ctx.createRadialGradient(64,64,0,64,64,64);
    gradient.addColorStop(0,'rgba(210,245,255,1)');gradient.addColorStop(0.12,'rgba(90,180,255,.8)');gradient.addColorStop(0.4,'rgba(35,95,255,.2)');gradient.addColorStop(1,'rgba(0,30,255,0)');
    ctx.fillStyle=gradient;ctx.fillRect(0,0,128,128);
    const glowTexture=new THREE.CanvasTexture(glowCanvas);
    [[0,0,1.5,2.3],[0,2.5,0,4],[-2.5,2,0.5,1.2],[2.5,3.7,-0.8,1.2]].forEach(([x,y,z,size])=>{
      const flare=new THREE.Sprite(new THREE.SpriteMaterial({map:glowTexture,transparent:true,blending:THREE.AdditiveBlending,depthWrite:false,opacity:0.65}));flare.position.set(x,y,z);flare.scale.set(size,size,1);scene.add(flare);
    });
    const positions=new Float32Array(1300*3);
    for(let i=0;i<1300;i++){ positions[i*3]=(Math.random()-0.5)*23;positions[i*3+1]=Math.random()*13-1;positions[i*3+2]=(Math.random()-0.5)*15; }
    const starsGeometry=new THREE.BufferGeometry();starsGeometry.setAttribute('position',new THREE.BufferAttribute(positions,3));
    const stars=new THREE.Points(starsGeometry,new THREE.PointsMaterial({color:0x88bfff,size:0.025,transparent:true,opacity:0.7}));scene.add(stars);
    const resize=()=>{
      const w=mount.clientWidth,h=Math.max(1,mount.clientHeight);renderer.setSize(w,h,false);camera.aspect=w/h;
      camera.position.z = w/h < 1 ? 18 : 12.8;
      camera.updateProjectionMatrix();
    };
    const observer=new ResizeObserver(resize);observer.observe(mount);resize();
    const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let previous=performance.now(),elapsed=0,frame;
    const animate=(now)=>{
      const delta=Math.min((now-previous)/1000,0.05);previous=now;elapsed+=delta;
      const flip=flipRef.current;
      if(flip.progress<1){
        flip.progress=Math.min(1,flip.progress+delta/1.05);
        const t=reduced?1:flip.progress;
        turning.geometry.dispose();turning.geometry=sheetGeometry(flip.direction,23,t);
      }
      if(!reduced){globe.rotation.y=elapsed*0.12; stars.rotation.y=elapsed*0.008;panes.children.forEach(p=>{p.position.y+=Math.sin(elapsed+p.userData.phase)*delta*0.045;});}
      renderer.render(scene,camera); frame=requestAnimationFrame(animate);
    }; frame=requestAnimationFrame(animate);
    return ()=>{
      cancelAnimationFrame(frame);observer.disconnect();
      const geometries=new Set(),materials=new Set();scene.traverse(o=>{if(o.geometry)geometries.add(o.geometry);if(o.material)materials.add(o.material);});
      geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());glowTexture.dispose();renderer.dispose();renderer.domElement.remove();
    };
  },[]);
  return <div ref={mountRef} className="concept-scene" aria-hidden="true" />;
}
