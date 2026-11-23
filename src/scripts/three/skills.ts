/**
 * Skills as a 3D constellation / skill tree.
 * Small scene, own renderer, created lazily when the section is visible and
 * torn down when quality drops to "low".
 */

import * as THREE from 'three';
import { TIERS, type Tier } from '../core/quality';
import { getDict, clientLang } from '../../i18n/ui';

export interface SkillNode {
  name: string;
  level: string;
  category: string;
}

export interface SkillSceneHandle {
  dispose(): void;
  setTier(tier: Tier): void;
}

const CATEGORY_COLOR: Record<string, number> = {
  Frontend: 0x00f0ff,
  Backend: 0x00ff41,
  Database: 0xb24bff,
  GameDev: 0xffb020,
  Design: 0xff2bd6,
  DevTools: 0x4f8cff,
  AI: 0x7dffcf,
};

const LEVEL_WEIGHT: Record<string, number> = {
  advanced: 1,
  intermediate: 0.78,
  basic: 0.58,
};

function colorFor(cat: string): number {
  return CATEGORY_COLOR[cat] ?? 0x00f0ff;
}

export function createSkillScene(canvas: HTMLCanvasElement, host: HTMLElement, initialTier: Tier, nodes: SkillNode[]): SkillSceneHandle {
  let tier = initialTier;
  let cfg = TIERS[tier];

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
  camera.position.set(0, 0.35, 9.1);
  camera.lookAt(0, 0, 0);

  const root = new THREE.Group();
  scene.add(root);

  scene.add(new THREE.AmbientLight(0xffffff, 1.4));
  const p1 = new THREE.PointLight(0x00f0ff, 40, 40, 2);
  p1.position.set(6, 6, 8);
  scene.add(p1);
  const p2 = new THREE.PointLight(0xff2bd6, 30, 40, 2);
  p2.position.set(-7, -4, -6);
  scene.add(p2);

  /* core */
  const core = new THREE.Mesh(
    new THREE.IcosahedronGeometry(0.55, 1),
    new THREE.MeshStandardMaterial({ color: 0x061018, emissive: 0x00f0ff, emissiveIntensity: 2.4, metalness: 0.6, roughness: 0.25 })
  );
  root.add(core);

  const halo = new THREE.Mesh(
    new THREE.TorusGeometry(1.05, 0.015, 8, 90),
    new THREE.MeshBasicMaterial({ color: 0x00f0ff, transparent: true, opacity: 0.55 })
  );
  halo.rotation.x = Math.PI / 2.4;
  root.add(halo);

  const halo2 = halo.clone();
  halo2.material = new THREE.MeshBasicMaterial({ color: 0xff2bd6, transparent: true, opacity: 0.4 });
  halo2.rotation.set(Math.PI / 1.7, 0.4, 0);
  root.add(halo2);

  /* nodes */
  const maxNodes = cfg.skillNodes || 26;
  const picked = [...nodes]
    .sort((a, b) => (LEVEL_WEIGHT[b.level.toLowerCase()] ?? 0.5) - (LEVEL_WEIGHT[a.level.toLowerCase()] ?? 0.5))
    .slice(0, maxNodes);

  const nodeMeshes: THREE.Mesh[] = [];
  const labels: { el: HTMLDivElement; node: THREE.Vector3; name: string; level: string }[] = [];

  const labelLayer = document.createElement('div');
  labelLayer.className = 'skill-labels';
  host.appendChild(labelLayer);

  picked.forEach((skill, i) => {
    const weight = LEVEL_WEIGHT[skill.level.toLowerCase()] ?? 0.55;
    const color = colorFor(skill.category);
    const radius = 1.95 + (1 - weight) * 1.15;
    // fibonacci sphere for even distribution
    const y = 1 - (i / Math.max(1, picked.length - 1)) * 2;
    const r = Math.sqrt(Math.max(0, 1 - y * y));
    const phi = i * 2.399963;
    const pos = new THREE.Vector3(Math.cos(phi) * r, y, Math.sin(phi) * r).multiplyScalar(radius);
    pos.x *= 1.25;

    const mesh = new THREE.Mesh(
      new THREE.IcosahedronGeometry(0.16 + weight * 0.18, 1),
      new THREE.MeshStandardMaterial({
        color: 0x081018,
        emissive: color,
        emissiveIntensity: 1.6 + weight,
        metalness: 0.4,
        roughness: 0.3,
      })
    );
    mesh.position.copy(pos);
    mesh.userData = { name: skill.name, level: skill.level, category: skill.category, base: mesh.scale.x };
    root.add(mesh);
    nodeMeshes.push(mesh);

    // link to core
    const geo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, 0), pos]);
    const line = new THREE.Line(geo, new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.18 }));
    root.add(line);

    if (i < 14) {
      const el = document.createElement('div');
      el.className = 'skill-label';
      el.textContent = skill.name;
      el.style.color = `#${color.toString(16).padStart(6, '0')}`;
      labelLayer.appendChild(el);

      // static label sprite would blur; HTML keeps it crisp
      labels.push({ el, node: pos, name: skill.name, level: skill.level });
    }
  });

  /* ambient dust */
  let dust: THREE.Points | null = null;
  if (cfg.stars > 0) {
    const count = Math.min(700, Math.floor(cfg.stars / 3));
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i += 1) {
      arr[i * 3] = (Math.random() - 0.5) * 18;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 12;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 18;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(arr, 3));
    dust = new THREE.Points(
      g,
      new THREE.PointsMaterial({ color: 0x66e0ff, size: 0.05, transparent: true, opacity: 0.6, depthWrite: false, blending: THREE.AdditiveBlending })
    );
    scene.add(dust);
  }

  /* tooltip */
  const tip = document.createElement('div');
  tip.className = 'skill-tip';
  host.appendChild(tip);

  /* sizing */
  function resize(): void {
    const rect = host.getBoundingClientRect();
    hostRect = rect;
    const w = Math.max(1, rect.width);
    const h = Math.max(1, rect.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, cfg.maxDpr));
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }

  /* interaction */
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2(-10, -10);
  let hovered: THREE.Mesh | null = null;
  let dragging = false;
  let dragStart = 0;
  let autoSpin = 0.25;
  let spin = 0;
  let lastX = 0;

  function pick(clientX: number, clientY: number): THREE.Mesh | null {
    const rect = host.getBoundingClientRect();
    pointer.set(((clientX - rect.left) / rect.width) * 2 - 1, -((clientY - rect.top) / rect.height) * 2 + 1);
    raycaster.setFromCamera(pointer, camera);
    const hit = raycaster.intersectObjects(nodeMeshes, false)[0];
    return (hit?.object as THREE.Mesh) ?? null;
  }

  function onMove(e: PointerEvent): void {
    const node = pick(e.clientX, e.clientY);
    if (node !== hovered) {
      if (hovered) hovered.scale.setScalar((hovered.userData.base as number) ?? 1);
      hovered = node;
      if (node) {
        node.scale.setScalar(((node.userData.base as number) ?? 1) * 1.6);
        const d = getDict(clientLang());
        const lvl = (d.skills.labels as Record<string, string>)[String(node.userData.level).toLowerCase()] ?? node.userData.level;
        const cat = (d.skills.categories as Record<string, string>)[String(node.userData.category)] ?? node.userData.category;
        tip.innerHTML = `<strong>${node.userData.name}</strong><span>${lvl} · ${cat}</span>`;
        tip.classList.add('visible');
        autoSpin = 0;
      } else {
        tip.classList.remove('visible');
        autoSpin = 0.25;
      }
    }
    if (hovered) {
      const rect = host.getBoundingClientRect();
      tip.style.transform = `translate(${e.clientX - rect.left + 14}px, ${e.clientY - rect.top + 10}px)`;
    }
    if (dragging) {
      spin += (e.clientX - lastX) * 0.006;
      lastX = e.clientX;
    }
  }

  function onDown(e: PointerEvent): void {
    dragging = true;
    dragStart = e.clientX;
    lastX = e.clientX;
    host.setPointerCapture?.(e.pointerId);
  }
  function onUp(): void {
    dragging = false;
  }

  /* loop */
  let hostRect = host.getBoundingClientRect();
  const labelVec = new THREE.Vector3();
  let raf = 0;
  let visible = true;
  let elapsed = 0;

  function frame(dt: number): void {
    if (!visible) return;
    raf = requestAnimationFrame(() => frame(Math.min(0.05, 0.016)));
    elapsed += dt;
    spin += autoSpin * dt;
    root.rotation.y = spin + Math.sin(elapsed * 0.2) * 0.1;
    root.rotation.x = Math.sin(elapsed * 0.3) * 0.08;

    core.rotation.y += dt * 0.5;
    core.rotation.x += dt * 0.2;
    core.scale.setScalar(1 + Math.sin(elapsed * 2) * 0.05);
    halo.rotation.z += dt * 0.25;
    halo2.rotation.z -= dt * 0.18;
    if (dust) dust.rotation.y += dt * 0.02;

    nodeMeshes.forEach((n, i) => {
      const s = (n.userData.base as number) ?? 1;
      const target = n === hovered ? s * 1.6 : s * (1 + Math.sin(elapsed * 1.4 + i) * 0.06);
      n.scale.setScalar(n.scale.x + (target - n.scale.x) * 0.15);
      n.rotation.y += dt * 0.3;
    });

    // labels follow the projected nodes
    const rect = hostRect;
    const vec = labelVec;
    const pad = 42;
    labels.forEach(({ el, node }) => {
      vec.copy(node).applyMatrix4(root.matrixWorld).project(camera);
      const rawX = (vec.x * 0.5 + 0.5) * rect.width;
      const rawY = (-vec.y * 0.5 + 0.5) * rect.height;
      const x = Math.max(pad, Math.min(rect.width - pad, rawX));
      const y = Math.max(pad, Math.min(rect.height - pad, rawY + 18));
      const inFront = vec.z < 1;
      el.style.transform = `translate(-50%,-50%) translate(${x}px, ${y}px)`;
      el.style.opacity = inFront ? (vec.z > 0.93 ? '0.45' : '1') : '0';
    });

    renderer.render(scene, camera);
  }

  const obs = new IntersectionObserver((entries) => {
    const entry = entries[0];
    if (!entry) return;
    visible = entry.isIntersecting;
    if (visible && raf === 0) {
      raf = requestAnimationFrame(() => frame(0.016));
    }
  }, { threshold: 0.05 });
  obs.observe(host);

  resize();
  window.addEventListener('resize', resize);
  host.addEventListener('pointermove', onMove);
  host.addEventListener('pointerdown', onDown);
  window.addEventListener('pointerup', onUp);

  return {
    setTier(next: Tier): void {
      tier = next;
      cfg = TIERS[tier];
      resize();
      if (dust) dust.visible = cfg.stars > 0;
    },
    dispose(): void {
      cancelAnimationFrame(raf);
      obs.disconnect();
      window.removeEventListener('resize', resize);
      host.removeEventListener('pointermove', onMove);
      host.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointerup', onUp);
      labelLayer.remove();
      tip.remove();
      renderer.dispose();
      scene.traverse((o) => {
        const m = o as THREE.Mesh;
        if (m.isMesh) {
          m.geometry.dispose();
          (m.material as THREE.Material)?.dispose?.();
        }
      });
      labels.length = 0;
    },
  };
}
