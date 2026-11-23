/**
 * The persistent background world: a floating isometric diorama of a
 * night-shift workstation. Scroll and mouse drive the camera, the whole
 * thing is rebuilt when the graphics tier changes.
 */

import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { TIERS, type Tier } from '../core/quality';
import { markSecret } from '../core/game';
import { blip } from '../core/sound';
import { getDict, clientLang } from '../../i18n/ui';

export interface ProjectPin {
  name: string;
  color: number;
}

export interface WorldHandle {
  dispose(): void;
  setTier(tier: Tier): void;
}

const ACCENT = {
  cyan: 0x00f0ff,
  purple: 0xff2bd6,
  green: 0x00ff41,
  amber: 0xffb020,
};

/* ------------------------------------------------------------------ */
/* helpers                                                             */
/* ------------------------------------------------------------------ */

function makeScreenTexture(): { texture: THREE.CanvasTexture; draw: (t: number) => void } {
  const canvas = document.createElement('canvas');
  canvas.width = 640;
  canvas.height = 400;
  const ctx = canvas.getContext('2d')!;
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;

  const lines = [
    ['$ npm run build', '#7fffd4'],
    ['> astro build', '#b9c7d6'],
    ['✓ 12 modules transformed', '#00ff9d'],
    ['', '#000'],
    ['const dev = {', '#ff9de2'],
    ['  name: "Diego",', '#f2fbff'],
    ['  stack: ["ts","py","docker"],', '#f2fbff'],
    ['  homelab: true,', '#f2fbff'],
    ['  coffee: Infinity', '#ffcf6b'],
    ['};', '#ff9de2'],
    ['> all systems operational', '#00f0ff'],
  ];

  let last = -1;
  const draw = (t: number) => {
    const step = Math.floor(t / 1.1) % (lines.length + 4);
    if (step === last) return;
    last = step;
    ctx.fillStyle = '#0a2130';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // header bar
    ctx.fillStyle = '#08131c';
    ctx.fillRect(0, 0, canvas.width, 44);
    ctx.fillStyle = '#00f0ff';
    ctx.font = 'bold 20px "IBM Plex Mono", monospace';
    ctx.fillText('YEYOBITZ.OS', 18, 29);
    ctx.fillStyle = '#1d3f4d';
    ctx.fillRect(0, 44, canvas.width, 2);

    ctx.fillStyle = '#071722';
    ctx.fillRect(0, 46, 196, canvas.height - 46);
    ctx.fillStyle = '#00ff41';
    ctx.font = '14px "IBM Plex Mono", monospace';
    ['> about', '  projects', '  skills', '  contact', '  homelab', '  grafos'].forEach((l, i) => {
      ctx.globalAlpha = i === 0 ? 1 : 0.55;
      ctx.fillText(l, 14, 78 + i * 26);
    });
    ctx.globalAlpha = 1;

    ctx.font = '18px "IBM Plex Mono", monospace';
    const visible = Math.min(lines.length, step);
    for (let i = 0; i < visible; i += 1) {
      const [text, color] = lines[i];
      ctx.fillStyle = color;
      ctx.fillText(text, 212, 84 + i * 29);
    }
    // blinking cursor on the current line
    if (Math.floor(t * 2) % 2 === 0) {
      ctx.fillStyle = '#00ff41';
      ctx.fillRect(212, 84 + Math.min(visible, lines.length) * 29 - 13, 10, 18);
    }

    // fake load bar
    const p = ((t % 12) / 12) * 100;
    ctx.strokeStyle = '#123243';
    ctx.strokeRect(430, 344, 190, 12);
    ctx.fillStyle = '#00d0ff';
    ctx.fillRect(432, 346, (186 * p) / 100, 8);

    // scanlines
    ctx.fillStyle = 'rgba(0,0,0,0.22)';
    for (let y = 0; y < canvas.height; y += 4) ctx.fillRect(0, y, canvas.width, 1);

    texture.needsUpdate = true;
  };

  draw(0);
  return { texture, draw };
}

function makeLabelTexture(text: string, color: string, w = 320, h = 96, bg = 'rgba(4,8,14,0.92)'): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);
  ctx.strokeStyle = color;
  ctx.lineWidth = 3;
  ctx.strokeRect(2, 2, w - 4, h - 4);
  ctx.fillStyle = color;
  ctx.font = `bold ${Math.floor(h * 0.3)}px "IBM Plex Mono", monospace`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text.slice(0, 22), w / 2, h / 2 + 2);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function mat(color: number, opts: Partial<THREE.MeshStandardMaterialParameters> = {}): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({ color, roughness: 0.55, metalness: 0.3, ...opts });
}

function glow(color: number, intensity = 2.2): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({ color: 0x05080c, emissive: color, emissiveIntensity: intensity, roughness: 0.4 });
}

/* ------------------------------------------------------------------ */
/* world                                                               */
/* ------------------------------------------------------------------ */

export function createWorld(canvas: HTMLCanvasElement, host: HTMLElement, initialTier: Tier, pins: ProjectPin[]): WorldHandle {
  let tier = initialTier;
  let cfg = TIERS[tier];

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.34;

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x03060b, 0.028);

  const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 120);
  const camBase = new THREE.Vector3(6.9, 5.1, 8.3);
  const camTarget = new THREE.Vector3(-1.0, 1.7, 0);
  camera.position.copy(camBase);
  camera.lookAt(camTarget);

  let composerRef: EffectComposer | null = null;
  const bloomPass: { pass?: UnrealBloomPass } = {};

  /* --------------------------- lights --------------------------- */
  const hemi = new THREE.HemisphereLight(0x9fdcff, 0x1f1430, 1.15);
  scene.add(hemi);

  const key = new THREE.DirectionalLight(0xdff3ff, 2.1);
  key.position.set(6, 9, 7);
  scene.add(key);

  const rimCyan = new THREE.PointLight(ACCENT.cyan, 34, 28, 2);
  rimCyan.position.set(-5, 4.5, 4);
  scene.add(rimCyan);

  const rimPurple = new THREE.PointLight(ACCENT.purple, 30, 26, 2);
  rimPurple.position.set(5.5, 3.4, -3.5);
  scene.add(rimPurple);

  // warm practical light hanging over the desk
  const deskLamp = new THREE.PointLight(0xffc078, 14, 9, 2);
  deskLamp.position.set(-0.6, 4.2, 1.6);
  scene.add(deskLamp);

  // rim light on the mascot so it separates from the dark platform
  const devRim = new THREE.PointLight(0x7dffcf, 26, 8, 2);
  devRim.position.set(3.6, 2.8, -0.8);
  scene.add(devRim);

  // warm key light from above the desk
  const keySpot = new THREE.SpotLight(0xffe2b8, 42, 16, 0.62, 0.85, 1.6);
  keySpot.position.set(0.4, 8.2, 5.2);
  keySpot.target.position.set(0, 1.2, 0.4);
  scene.add(keySpot);
  scene.add(keySpot.target);

  /* --------------------------- groups --------------------------- */
  const root = new THREE.Group();
  scene.add(root);

  const world = new THREE.Group();
  root.add(world);

  /* ------------------------- starfield -------------------------- */
  let stars: THREE.Points | null = null;
  let starMat: THREE.PointsMaterial | null = null;

  function buildStars(count: number): void {
    if (stars) {
      stars.geometry.dispose();
      (stars.material as THREE.Material).dispose();
      scene.remove(stars);
      stars = null;
    }
    if (count <= 0) return;
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const palette = [new THREE.Color(ACCENT.cyan), new THREE.Color(ACCENT.purple), new THREE.Color(0xffffff), new THREE.Color(ACCENT.green)];
    for (let i = 0; i < count; i += 1) {
      const r = 18 + Math.random() * 26;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.min(1, Math.max(-1, Math.random() * 1.6 - 0.55)));
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.cos(phi) * 0.7 + 4;
      pos[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
      const c = palette[Math.floor(Math.random() * palette.length)];
      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
    starMat = new THREE.PointsMaterial({
      size: 0.13,
      sizeAttenuation: true,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    stars = new THREE.Points(geo, starMat);
    scene.add(stars);
  }

  /* ------------------------- diorama --------------------------- */
  const island = new THREE.Group();
  world.add(island);

  function buildIsland(): void {
    // hex slab
    const slab = new THREE.Mesh(new THREE.CylinderGeometry(5.4, 4.7, 0.75, 6), mat(0x1c2836, { roughness: 0.38, metalness: 0.5 }));
    slab.position.y = -0.4;
    island.add(slab);

    // glowing rim
    const rim = new THREE.Mesh(new THREE.CylinderGeometry(5.42, 5.42, 0.045, 6, 1, true), glow(ACCENT.cyan, 2.6));
    rim.position.y = -0.06;
    island.add(rim);
    const rim2 = new THREE.Mesh(new THREE.CylinderGeometry(4.72, 4.72, 0.045, 6, 1, true), glow(ACCENT.purple, 1.6));
    rim2.position.y = -0.76;
    island.add(rim2);

    // grid on top
    const gridCanvas = document.createElement('canvas');
    gridCanvas.width = gridCanvas.height = 512;
    const gctx = gridCanvas.getContext('2d')!;
    gctx.clearRect(0, 0, 512, 512);
    gctx.strokeStyle = 'rgba(0,240,255,0.5)';
    gctx.lineWidth = 2;
    for (let i = 0; i <= 512; i += 64) {
      gctx.beginPath();
      gctx.moveTo(i, 0);
      gctx.lineTo(i, 512);
      gctx.moveTo(0, i);
      gctx.lineTo(512, i);
      gctx.stroke();
    }
    const gridTex = new THREE.CanvasTexture(gridCanvas);
    gridTex.wrapS = gridTex.wrapT = THREE.RepeatWrapping;
    const grid = new THREE.Mesh(
      new THREE.CircleGeometry(5.1, 48),
      new THREE.MeshBasicMaterial({ map: gridTex, transparent: true, opacity: 0.3, depthWrite: false })
    );
    grid.rotation.x = -Math.PI / 2;
    grid.position.y = 0.002;
    grid.name = 'grid';
    island.add(grid);

    // pool of light under the desk
    const pool = new THREE.Mesh(
      new THREE.CircleGeometry(3.4, 32),
      new THREE.MeshBasicMaterial({ color: 0xffc078, transparent: true, opacity: 0.06, blending: THREE.AdditiveBlending, depthWrite: false })
    );
    pool.rotation.x = -Math.PI / 2;
    pool.position.set(-0.2, 0.01, 0.6);
    island.add(pool);

    // soft ground glow
    const halo = new THREE.Mesh(
      new THREE.CircleGeometry(8.5, 40),
      new THREE.MeshBasicMaterial({ color: ACCENT.cyan, transparent: true, opacity: 0.05, depthWrite: false, blending: THREE.AdditiveBlending })
    );
    halo.rotation.x = -Math.PI / 2;
    halo.position.y = -0.02;
    island.add(halo);
  }

  /* --------------------------- desk ---------------------------- */
  const desk = new THREE.Group();
  desk.position.set(-0.15, 0, -0.15);
  island.add(desk);

  const screen = makeScreenTexture();
  let screenMesh: THREE.Mesh | null = null;
  let screenMatRef: THREE.MeshBasicMaterial | null = null;

  function buildDesk(): void {
    const topMat = mat(0x22303f, { roughness: 0.42, metalness: 0.45 });
    const top = new THREE.Mesh(new THREE.BoxGeometry(5.1, 0.16, 2.1), topMat);
    top.position.y = 1.12;
    desk.add(top);

    const edge = new THREE.Mesh(new THREE.BoxGeometry(5.12, 0.03, 2.12), glow(ACCENT.cyan, 2.4));
    edge.position.y = 1.045;
    desk.add(edge);

    // legs
    const legMat = mat(0x0e141c, { metalness: 0.7, roughness: 0.4 });
    [[-2.35, 0.85], [2.35, 0.85], [-2.35, -0.85], [2.35, -0.85]].forEach(([x, z]) => {
      const leg = new THREE.Mesh(new THREE.BoxGeometry(0.12, 1.05, 0.12), legMat);
      leg.position.set(x, 0.52, z);
      desk.add(leg);
    });

    // monitor
    const monitor = new THREE.Group();
    monitor.position.set(-1.05, 1.2, -0.5);
    monitor.rotation.y = 0.18;
    desk.add(monitor);

    const shell = new THREE.Mesh(new THREE.BoxGeometry(2.65, 1.72, 0.16), mat(0x10161f, { metalness: 0.6, roughness: 0.35 }));
    shell.position.y = 0.92;
    monitor.add(shell);

    const bezel = new THREE.Mesh(new THREE.BoxGeometry(2.72, 1.79, 0.06), glow(ACCENT.cyan, 0.9));
    bezel.position.set(0, 0.92, -0.07);
    monitor.add(bezel);

    const screenGlow = new THREE.Mesh(
      new THREE.PlaneGeometry(2.6, 1.7),
      new THREE.MeshBasicMaterial({ color: 0x2ad2ff, transparent: true, opacity: 0.12, blending: THREE.AdditiveBlending, depthWrite: false })
    );
    screenGlow.position.set(0, 0.92, 0.095);
    monitor.add(screenGlow);

    screenMatRef = new THREE.MeshBasicMaterial({ map: screen.texture, toneMapped: false });
    screenMesh = new THREE.Mesh(new THREE.PlaneGeometry(2.4, 1.5), screenMatRef);
    screenMesh.position.set(0, 0.92, 0.085);
    screenMesh.name = 'screen';
    monitor.add(screenMesh);

    const stand = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.5, 0.3), mat(0x11181f, { metalness: 0.7 }));
    stand.position.set(0, 0.14, 0);
    monitor.add(stand);
    const foot = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.06, 0.55), mat(0x11181f, { metalness: 0.7 }));
    foot.position.set(0, -0.1, 0.06);
    monitor.add(foot);

    // screen light spill
    const spill = new THREE.PointLight(ACCENT.cyan, 16, 8, 2);
    spill.position.set(0, 0.9, 1.1);
    monitor.add(spill);

    // soft halo behind the screen so it reads as a light source
    const halo = new THREE.Mesh(
      new THREE.PlaneGeometry(3.4, 2.4),
      new THREE.MeshBasicMaterial({ color: ACCENT.cyan, transparent: true, opacity: 0.1, blending: THREE.AdditiveBlending, depthWrite: false })
    );
    halo.position.set(0, 0.92, -0.12);
    monitor.add(halo);

    // keyboard
    const kbGroup = new THREE.Group();
    kbGroup.position.set(-0.75, 1.22, 0.42);
    kbGroup.rotation.y = 0.08;
    desk.add(kbGroup);
    const kb = new THREE.Mesh(new THREE.BoxGeometry(1.85, 0.06, 0.62), mat(0x0d1219, { metalness: 0.4 }));
    kbGroup.add(kb);
    const keysGeo = new THREE.BoxGeometry(0.09, 0.03, 0.09);
    const keys = new THREE.InstancedMesh(keysGeo, glow(ACCENT.green, 0.35), 84);
    const dummy = new THREE.Object3D();
    let k = 0;
    for (let r = 0; r < 6; r += 1) {
      for (let c = 0; c < 14; c += 1) {
        dummy.position.set(-0.78 + c * 0.12, 0.045, -0.24 + r * 0.098);
        dummy.updateMatrix();
        keys.setMatrixAt(k, dummy.matrix);
        k += 1;
      }
    }
    kbGroup.add(keys);

    // mouse + pad
    const pad = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.02, 0.55), mat(0x0a1017, { roughness: 0.9 }));
    pad.position.set(0.42, 1.215, 0.42);
    desk.add(pad);
    const mouse = new THREE.Mesh(new THREE.CapsuleGeometry(0.085, 0.16, 4, 8), mat(0x141c25, { metalness: 0.5 }));
    mouse.rotation.z = Math.PI / 2;
    mouse.position.set(0.42, 1.26, 0.42);
    mouse.name = 'mouse';
    desk.add(mouse);

    // mug
    const mug = new THREE.Group();
    mug.position.set(1.15, 1.2, 0.5);
    desk.add(mug);
    const cup = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.15, 0.3, 16, 1, true), mat(0xe8eef5, { roughness: 0.5, side: THREE.DoubleSide }));
    cup.position.y = 0.15;
    mug.add(cup);
    const coffee = new THREE.Mesh(new THREE.CircleGeometry(0.155, 16), mat(0x2a1608, { roughness: 0.25 }));
    coffee.rotation.x = -Math.PI / 2;
    coffee.position.y = 0.28;
    mug.add(coffee);
    const handle = new THREE.Mesh(new THREE.TorusGeometry(0.1, 0.025, 8, 14, Math.PI * 1.3), mat(0xe8eef5));
    handle.position.set(0.19, 0.16, 0);
    handle.rotation.z = -0.4;
    mug.add(handle);

    // little plant
    const pot = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.12, 0.24, 10), mat(0x2a2233));
    pot.position.set(2.05, 1.34, -0.55);
    desk.add(pot);
    for (let i = 0; i < 5; i += 1) {
      const leaf = new THREE.Mesh(new THREE.IcosahedronGeometry(0.16, 0), mat(0x1f8f5a, { roughness: 0.8 }));
      leaf.position.set(2.05 + Math.cos(i * 1.7) * 0.12, 1.55 + Math.random() * 0.16, -0.55 + Math.sin(i * 1.7) * 0.12);
      leaf.rotation.set(Math.random(), Math.random(), Math.random());
      desk.add(leaf);
    }
  }

  /* --------------------------- dev ----------------------------- */
  const dev = new THREE.Group();
  dev.position.set(2.15, 0.05, 1.35);
  dev.rotation.y = -0.28;
  island.add(dev);
  const devParts: THREE.Object3D[] = [];

  function buildDev(): void {
    const hoodie = mat(0x28a86c, { roughness: 0.75 });
    const skin = mat(0xe8b78c, { roughness: 0.7 });
    const dark = mat(0x141d27, { roughness: 0.8 });

    const torso = new THREE.Mesh(new THREE.BoxGeometry(0.78, 0.95, 0.46), hoodie);
    torso.position.y = 0.98;
    dev.add(torso);

    const hood = new THREE.Mesh(new THREE.BoxGeometry(0.86, 0.2, 0.56), hoodie);
    hood.position.y = 1.38;
    dev.add(hood);

    const head = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.52, 0.5), skin);
    head.position.y = 1.62;
    head.name = 'dev-head';
    dev.add(head);

    const hair = new THREE.Mesh(new THREE.BoxGeometry(0.56, 0.16, 0.54), dark);
    hair.position.y = 1.86;
    dev.add(hair);

    // eyes (so the mascot reads as a character, not a block)
    [-0.11, 0.11].forEach((x) => {
      const eye = new THREE.Mesh(new THREE.PlaneGeometry(0.09, 0.07), new THREE.MeshBasicMaterial({ color: 0x0a0f16, toneMapped: false }));
      eye.position.set(x, 1.66, 0.256);
      dev.add(eye);
      const glint = new THREE.Mesh(new THREE.PlaneGeometry(0.035, 0.035), new THREE.MeshBasicMaterial({ color: 0x00ff41, toneMapped: false }));
      glint.position.set(x + 0.02, 1.675, 0.257);
      dev.add(glint);
    });

    // headphones
    const band = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.035, 6, 16, Math.PI), mat(0x1b2430, { metalness: 0.6 }));
    band.position.y = 1.7;
    band.rotation.z = Math.PI;
    dev.add(band);
    [-1, 1].forEach((s) => {
      const cup = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.09, 12), mat(0x232f3d, { metalness: 0.5 }));
      cup.rotation.z = Math.PI / 2;
      cup.position.set(0.3 * s, 1.6, 0);
      dev.add(cup);
      const led = new THREE.Mesh(new THREE.CircleGeometry(0.03, 8), glow(ACCENT.green, 3));
      led.rotation.y = (Math.PI / 2) * s;
      led.position.set(0.345 * s, 1.6, 0);
      dev.add(led);
    });

    // backpack straps
    const strap = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.8, 0.05), dark);
    strap.position.set(-0.2, 1.0, 0.24);
    dev.add(strap);
    const strap2 = strap.clone();
    strap2.position.x = 0.2;
    dev.add(strap2);

    // arms
    [-1, 1].forEach((s) => {
      const arm = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.72, 0.2), hoodie);
      arm.position.set(0.47 * s, 1.0, 0.02);
      arm.rotation.z = 0.14 * s;
      arm.name = `arm-${s}`;
      dev.add(arm);
      const armStripe = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.6, 0.02), glow(0x7dffcf, 1.1));
      armStripe.position.set(0.47 * s, 1.0, 0.12);
      dev.add(armStripe);
      devParts.push(arm);
      const hand = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.16, 0.18), skin);
      hand.position.set(0.55 * s, 0.62, 0.04);
      dev.add(hand);
    });

    // legs
    [-1, 1].forEach((s) => {
      const leg = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.62, 0.28), dark);
      leg.position.set(0.18 * s, 0.31, 0);
      dev.add(leg);
      const shoe = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.14, 0.42), mat(0xf2f5f8, { roughness: 0.7 }));
      shoe.position.set(0.18 * s, 0.07, 0.06);
      dev.add(shoe);
    });

    // quest marker floating above the character
    const marker = new THREE.Mesh(
      new THREE.OctahedronGeometry(0.16, 0),
      new THREE.MeshStandardMaterial({ color: 0x02120a, emissive: 0x00ff41, emissiveIntensity: 3, roughness: 0.3 })
    );
    marker.position.set(0, 2.34, 0);
    marker.name = 'marker';
    dev.add(marker);

    const markerGlow = new THREE.PointLight(0x00ff41, 4, 3, 2);
    markerGlow.position.set(0, 2.34, 0);
    dev.add(markerGlow);

    devParts.push(dev);
  }

  /* ------------------------ server rack ------------------------ */
  const rack = new THREE.Group();
  rack.position.set(-2.55, 0, -1.75);
  rack.rotation.y = 0.5;
  island.add(rack);
  const leds: THREE.Mesh[] = [];
  const fans: THREE.Mesh[] = [];

  function buildRack(): void {
    const body = new THREE.Mesh(new THREE.BoxGeometry(1.5, 2.2, 0.95), mat(0x0c1219, { metalness: 0.65, roughness: 0.4 }));
    body.position.y = 1.1;
    rack.add(body);

    const face = new THREE.Mesh(new THREE.BoxGeometry(1.36, 2.05, 0.04), mat(0x070b10, { metalness: 0.3 }));
    face.position.set(0, 1.1, 0.49);
    rack.add(face);

    for (let i = 0; i < 8; i += 1) {
      const unit = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.14, 0.06), mat(0x141c26, { metalness: 0.5 }));
      unit.position.set(0, 0.35 + i * 0.21, 0.52);
      rack.add(unit);

      for (let j = 0; j < 3; j += 1) {
        const color = j === 0 ? ACCENT.green : j === 1 ? ACCENT.cyan : ACCENT.amber;
        const led = new THREE.Mesh(new THREE.BoxGeometry(0.055, 0.055, 0.02), glow(color, 3));
        led.position.set(-0.45 + j * 0.1, 0.35 + i * 0.21, 0.57);
        led.userData.phase = Math.random() * Math.PI * 2;
        led.userData.speed = 1.5 + Math.random() * 5;
        rack.add(led);
        leds.push(led);
      }
    }

    // top fan
    const fan = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.03, 6, 20), glow(ACCENT.cyan, 1.4));
    fan.rotation.x = -Math.PI / 2;
    fan.position.set(0, 2.24, 0);
    rack.add(fan);
    fans.push(fan);

    // label
    const label = new THREE.Mesh(
      new THREE.PlaneGeometry(0.8, 0.24),
      new THREE.MeshBasicMaterial({ map: makeLabelTexture('HOMELAB', '#00f0ff', 320, 96), transparent: true, depthWrite: false, toneMapped: false })
    );
    label.position.set(0, 2.55, 0);
    rack.add(label);
  }

  /* ------------------------ cartridges ------------------------- */
  const cartridges = new THREE.Group();
  island.add(cartridges);
  const cartridgeMeshes: THREE.Mesh[] = [];

  function buildCartridges(list: ProjectPin[]): void {
    while (cartridges.children.length) {
      const c = cartridges.children.pop() as THREE.Mesh;
      c.geometry.dispose();
      (c.material as THREE.Material).dispose();
    }
    cartridgeMeshes.length = 0;
    if (list.length === 0) return;

    const count = Math.min(cfg.cartridges, list.length);
    for (let i = 0; i < count; i += 1) {
      const pin = list[i];
      const group = new THREE.Group();
      const body = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.86, 0.1), mat(0x111a24, { metalness: 0.6, roughness: 0.35 }));
      group.add(body);
      const colorHex = `#${pin.color.toString(16).padStart(6, '0')}`;
      const labelTex = makeLabelTexture(pin.name.split(' ')[0].toUpperCase(), colorHex, 256, 96);
      const face = new THREE.Mesh(
        new THREE.PlaneGeometry(0.54, 0.22),
        new THREE.MeshBasicMaterial({ map: labelTex, transparent: true, toneMapped: false })
      );
      face.position.z = 0.056;
      face.position.y = 0.12;
      group.add(face);
      const stripe = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.06, 0.02), glow(pin.color, 2.4));
      stripe.position.set(0, -0.22, 0.056);
      group.add(stripe);

      const angle = (i / count) * Math.PI * 2;
      group.userData = { angle, radius: 4.35, speed: 0.18 + i * 0.01, bob: Math.random() * Math.PI * 2, project: pin.name };
      group.name = 'cartridge';
      group.position.set(Math.cos(angle) * 4.35, 2.3 + i * 0.12, Math.sin(angle) * 4.35);
      group.scale.setScalar(1.15);
      cartridges.add(group);
      cartridgeMeshes.push(group as unknown as THREE.Mesh);
      group.traverse((o) => { if ((o as THREE.Mesh).isMesh) (o as THREE.Mesh).userData.project = pin.name; });
    }
  }

  /* ------------------------ floppy secrets --------------------- */
  const secrets: THREE.Mesh[] = [];

  function buildSecrets(): void {
    const spots: [number, number, number][] = [
      [-3.6, 1.95, -0.4],
      [3.15, 3.4, -1.15],
      [0.1, 0.18, 2.9],
    ];
    spots.forEach(([x, y, z], i) => {
      const floppy = new THREE.Mesh(
        new THREE.BoxGeometry(0.36, 0.36, 0.05),
        new THREE.MeshStandardMaterial({ color: 0x1b2a38, emissive: 0x00ff41, emissiveIntensity: 0.35, metalness: 0.5, roughness: 0.4 })
      );
      floppy.position.set(x, y, z);
      floppy.rotation.set(Math.random() * 0.4, Math.random() * Math.PI, Math.random() * 0.4);
      floppy.userData = { secret: `floppy-${i}`, bob: Math.random() * Math.PI * 2 };
      floppy.name = 'secret';
      island.add(floppy);
      secrets.push(floppy);
    });
  }

  /* ---------------------- floating cubes ----------------------- */
  let cubeMesh: THREE.InstancedMesh | null = null;
  const cubeData: { r: number; a: number; s: number; y: number; spin: number }[] = [];

  function buildCubes(count: number): void {
    if (cubeMesh) {
      island.remove(cubeMesh);
      cubeMesh.geometry.dispose();
      cubeMesh = null;
    }
    cubeData.length = 0;
    if (count <= 0) return;
    const geo = new THREE.BoxGeometry(0.16, 0.16, 0.16);
    const material = new THREE.MeshStandardMaterial({
      color: 0x0a141c,
      emissive: ACCENT.cyan,
      emissiveIntensity: 0.9,
      metalness: 0.4,
      roughness: 0.3,
    });
    cubeMesh = new THREE.InstancedMesh(geo, material, count);
    for (let i = 0; i < count; i += 1) {
      cubeData.push({
        r: 2.5 + Math.random() * 2.7,
        a: Math.random() * Math.PI * 2,
        s: (Math.random() * 0.3 + 0.08) * (Math.random() > 0.5 ? 1 : -1),
        y: 0.9 + Math.random() * 3.1,
        spin: Math.random() * Math.PI,
      });
    }
    island.add(cubeMesh);
  }

  /* --------------------------- build ---------------------------- */
  function buildScene(): void {
    // wipe dynamic groups
    while (island.children.length) island.remove(island.children[0]);
    while (world.children.length) world.remove(world.children[0]);
    world.add(island);
    leds.length = 0;
    fans.length = 0;
    secrets.length = 0;
    devParts.length = 0;
    cartridgeMeshes.length = 0;

    buildIsland();
    island.add(desk);
    desk.clear();
    buildDesk();
    island.add(dev);
    dev.clear();
    buildDev();
    island.add(rack);
    rack.clear();
    buildRack();
    island.add(cartridges);
    cartridges.clear();
    buildCartridges(pins);
    buildSecrets();
    buildCubes(cfg.cubes);
    buildStars(cfg.stars);

    renderer.shadowMap.enabled = cfg.shadows;
    if (cfg.shadows) {
      key.castShadow = true;
      key.shadow.mapSize.set(1024, 1024);
      key.shadow.camera.near = 1;
      key.shadow.camera.far = 30;
      const d = 8;
      key.shadow.camera.left = -d;
      key.shadow.camera.right = d;
      key.shadow.camera.top = d;
      key.shadow.camera.bottom = -d;
      island.traverse((o) => {
        const m = o as THREE.Mesh;
        if (m.isMesh) {
          m.castShadow = true;
          m.receiveShadow = true;
        }
      });
    }
  }

  /* ------------------------- composer -------------------------- */
  function setupComposer(): void {
    composerRef?.dispose();
    composerRef = null;
    bloomPass.pass = undefined;
    if (!cfg.bloom) return;
    composerRef = new EffectComposer(renderer);
    composerRef.addPass(new RenderPass(scene, camera));
    const bloom = new UnrealBloomPass(new THREE.Vector2(1, 1), 0.48, 0.65, 0.75);
    composerRef.addPass(bloom);
    bloomPass.pass = bloom;
  }

  /* -------------------------- sizes ---------------------------- */
  function resize(): void {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, cfg.maxDpr);
    renderer.setPixelRatio(dpr);
    renderer.setSize(w, h, false);
    composerRef?.setPixelRatio(dpr);
    composerRef?.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    bloomPass.pass?.setSize(w, h);
  }

  /* --------------------------- input --------------------------- */
  const pointer = new THREE.Vector2(0, 0);
  const pointerTarget = new THREE.Vector2(0, 0);
  const raycaster = new THREE.Raycaster();
  let hovered: THREE.Object3D | null = null;

  const tip = document.createElement('div');
  tip.className = 'scene-tip';
  host.appendChild(tip);

  function interactiveRoots(): THREE.Object3D[] {
    return [...cartridgeMeshes, ...secrets, ...(screenMesh ? [screenMesh] : [])];
  }

  function onPointerMove(e: PointerEvent): void {
    const nx = (e.clientX / window.innerWidth) * 2 - 1;
    const ny = -(e.clientY / window.innerHeight) * 2 + 1;
    pointerTarget.set(nx, ny);

    if (e.pointerType !== 'mouse') return;
    raycaster.setFromCamera(new THREE.Vector2(nx, ny), camera);
    const hits = raycaster.intersectObjects(interactiveRoots(), true);
    const first = hits.find((h) => (h.object as THREE.Mesh).isMesh);
    const obj = first?.object ?? null;

    if (hovered !== obj) {
      if (hovered) hovered.scale.setScalar((hovered.userData.baseScale as number) ?? 1.15);
      hovered = obj;
      if (obj) {
        obj.userData.baseScale = obj.scale.x;
        obj.scale.setScalar(obj.scale.x * 1.18);
        const d = getDict(clientLang());
        const name = obj.userData.project ?? (obj.userData.secret ? d.scene.floppy : d.scene.terminal);
        tip.textContent = obj.userData.project ? `▶ ${name}` : obj.userData.secret ? `? ${name}` : d.scene.inspect;
        tip.classList.add('visible');
        blip('hover');
      } else {
        tip.classList.remove('visible');
      }
    }

    if (obj) {
      tip.style.transform = `translate(${e.clientX + 16}px, ${e.clientY + 14}px)`;
    }
  }

  function onClick(e: MouseEvent): void {
    raycaster.setFromCamera(new THREE.Vector2((e.clientX / window.innerWidth) * 2 - 1, -(e.clientY / window.innerHeight) * 2 + 1), camera);
    const hits = raycaster.intersectObjects(interactiveRoots(), true);
    if (hits.length === 0) return;
    const obj = hits[0].object;
    if (obj.userData.project) {
      blip('select');
      document.querySelector('#projects')?.scrollIntoView({ behavior: 'smooth' });
      document.querySelector('#projects')?.classList.add('flash');
      setTimeout(() => document.querySelector('#projects')?.classList.remove('flash'), 1600);
    } else if (obj.userData.secret) {
      obj.visible = false;
      markSecret(obj.userData.secret);
    } else if (obj === screenMesh) {
      blip('power');
      screen.draw(performance.now() / 1000 + 40);
    }
  }

  /* --------------------------- loop ---------------------------- */
  let raf = 0;
  let running = true;
  const clock = new THREE.Clock();
  let elapsed = 0;
  let screenAcc = 0;
  let scrollY = window.scrollY;
  let maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
  const dummyCube = new THREE.Object3D();

  function readScroll(): void {
    scrollY = window.scrollY;
    maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
  }
  window.addEventListener('scroll', readScroll, { passive: true });

  let lastDraw = 0;

  function frame(): void {
    raf = requestAnimationFrame(frame);
    if (!running) return;
    const dt = Math.min(clock.getDelta(), 0.05);
    elapsed += dt;

    // once the hero is out of view the world is just backdrop: draw at 20fps
    const hidden = scrollY > window.innerHeight * 1.4;
    if (hidden) {
      const now = performance.now();
      if (now - lastDraw < 50) return;
      lastDraw = now;
    }

    pointer.x += (pointerTarget.x - pointer.x) * Math.min(1, dt * 6);
    pointer.y += (pointerTarget.y - pointer.y) * Math.min(1, dt * 6);

    const scrollT = Math.min(1, scrollY / maxScroll);

    // camera: isometric base + parallax + scroll drift
    const camX = camBase.x + pointer.x * 0.55;
    const camY = camBase.y + pointer.y * 0.4 + scrollT * 0.9;
    const camZ = camBase.z - scrollT * 0.8;
    camera.position.x += (camX - camera.position.x) * Math.min(1, dt * 3);
    camera.position.y += (camY - camera.position.y) * Math.min(1, dt * 3);
    camera.position.z += (camZ - camera.position.z) * Math.min(1, dt * 3);
    camTarget.y = 1.7 + scrollT * 0.5;
    camTarget.x = camera.aspect > 1.15 ? -1.05 : 0;
    camera.lookAt(camTarget);

    // island idle motion
    island.rotation.y = Math.sin(elapsed * 0.12) * 0.06 + pointer.x * 0.05;
    island.position.y = Math.sin(elapsed * 0.6) * 0.04;

    // dev breathing + head follow
    dev.position.y = 0.05 + Math.sin(elapsed * 1.5) * 0.015;
    dev.rotation.y = -0.28 + pointer.x * 0.12;
    const head = dev.getObjectByName('dev-head');
    if (head) head.rotation.y = pointer.x * 0.25;

    // quest marker bobs and spins
    const marker = dev.getObjectByName('marker');
    if (marker) {
      marker.position.y = 2.34 + Math.sin(elapsed * 2) * 0.06;
      marker.rotation.y = elapsed * 1.2;
    }

    // rack leds
    leds.forEach((led) => {
      const on = Math.sin(elapsed * (led.userData.speed as number) + (led.userData.phase as number)) > 0.1;
      (led.material as THREE.MeshStandardMaterial).emissiveIntensity = on ? 3.2 : 0.12;
    });
    fans.forEach((f) => { f.rotation.z = elapsed * 3.4; });

    // floating cubes
    if (cubeMesh) {
      cubeData.forEach((c, i) => {
        dummyCube.position.set(Math.cos(c.a + elapsed * c.s) * c.r, c.y + Math.sin(elapsed * 0.8 + c.a) * 0.25, Math.sin(c.a + elapsed * c.s) * c.r);
        dummyCube.rotation.set(elapsed * 0.4 + c.spin, elapsed * 0.6, 0);
        dummyCube.updateMatrix();
        cubeMesh!.setMatrixAt(i, dummyCube.matrix);
      });
      cubeMesh.instanceMatrix.needsUpdate = true;
    }

    // cartridges orbit
    cartridgeMeshes.forEach((group) => {
      const d = group.userData;
      const a = d.angle + elapsed * d.speed;
      group.position.set(Math.cos(a) * d.radius, 2.35 + Math.sin(elapsed * 0.9 + d.bob) * 0.18, Math.sin(a) * d.radius);
      group.rotation.y = -a + Math.PI / 2;
      group.rotation.z = Math.sin(elapsed * 0.7 + d.bob) * 0.12;
    });

    // secrets float
    secrets.forEach((s) => {
      s.position.y += Math.sin(elapsed * 1.6 + (s.userData.bob as number)) * 0.0016;
      s.rotation.y += dt * 0.8;
      s.rotation.x += dt * 0.3;
    });

    // screen refresh
    if (cfg.screenFps > 0) {
      screenAcc += dt;
      if (screenAcc > 1 / cfg.screenFps) {
        screenAcc = 0;
        screen.draw(elapsed);
      }
    }

    if (stars) stars.rotation.y = elapsed * 0.01;

    if (composerRef) composerRef.render();
    else renderer.render(scene, camera);
  }

  /* -------------------------- wiring --------------------------- */
  function applyTier(next: Tier): void {
    tier = next;
    cfg = TIERS[tier];
    resize();
    buildScene();
    setupComposer();
  }

  buildScene();
  setupComposer();
  resize();
  frame();

  window.addEventListener('pointermove', onPointerMove, { passive: true });
  canvas.addEventListener('click', onClick);
  window.addEventListener('resize', resize);

  const onVisibility = () => { running = !document.hidden; };
  document.addEventListener('visibilitychange', onVisibility);

  return {
    setTier: applyTier,
    dispose(): void {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('click', onClick);
      document.removeEventListener('visibilitychange', onVisibility);
      tip.remove();
      composerRef?.dispose();
      renderer.dispose();
      scene.traverse((o) => {
        const m = o as THREE.Mesh;
        if (m.isMesh) {
          m.geometry?.dispose();
          const material = m.material as THREE.Material | THREE.Material[];
          if (Array.isArray(material)) material.forEach((x) => x.dispose());
          else material?.dispose();
        }
      });
    },
  };
}
