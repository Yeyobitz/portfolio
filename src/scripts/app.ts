/**
 * Client bootstrap: HUD, graphics panel, tier switching, XP/achievements.
 */

import {
  TIERS,
  TIER_ORDER,
  detectTier,
  getTier,
  initTier,
  onTierChange,
  prefersReducedMotion,
  setTier,
  type Tier,
} from './core/quality';
import {
  ACHIEVEMENTS,
  achievementText,
  addXp,
  award,
  getSave,
  levelInfo,
  markExplored,
  markProject,
  subscribe,
  toast,
} from './core/game';
import { blip, isMuted, setMuted } from './core/sound';
import { getDict, clientLang } from '../i18n/ui';

const t = getDict(clientLang());

const $ = <T extends HTMLElement = HTMLElement>(sel: string, root: ParentNode = document): T | null =>
  root.querySelector<T>(sel);
const $$ = <T extends HTMLElement = HTMLElement>(sel: string, root: ParentNode = document): T[] =>
  Array.from(root.querySelectorAll<T>(sel));

let tier: Tier = initTier();

/* ------------------------------------------------------------------ */
/* world                                                              */
/* ------------------------------------------------------------------ */

const canvas = $<HTMLCanvasElement>('#world-canvas');
const stage = $('#stage');
let disposeWorld: (() => void) | null = null;
let worldTier: Tier | null = null;

function projectPins(): { name: string; color: number }[] {
  try {
    return JSON.parse(canvas?.dataset.pins ?? '[]');
  } catch {
    return [];
  }
}

async function mountWorld(next: Tier): Promise<void> {
  if (!canvas || !stage) return;
  if (!TIERS[next].webgl) {
    disposeWorld?.();
    disposeWorld = null;
    worldTier = null;
    canvas.classList.remove('is-on');
    return;
  }
  if (worldTier === next) return;
  disposeWorld?.();
  disposeWorld = null;
  try {
    const { createWorld } = await import('./three/world');
    const handle = createWorld(canvas, stage, next, projectPins());
    disposeWorld = () => handle.dispose();
    worldTier = next;
    canvas.classList.add('is-on');
    document.documentElement.dataset.webgl = 'on';
  } catch (err) {
    // GPU died or WebGL is blacklisted: fall back to the CSS backdrop instead
    console.warn('[world] 3D unavailable', err);
    worldTier = null;
    canvas.classList.remove('is-on');
    document.documentElement.dataset.webgl = 'off';
    if (tier !== 'low') {
      tier = 'low';
      paintTier();
      toast({
        icon: '▁',
        kicker: t.game.toast.graphics,
        title: t.game.toast.fallbackTitle,
        body: t.game.toast.fallbackBody,
        accent: 'blue',
      });
    }
  }
}

/* ------------------------------------------------------------------ */
/* graphics panel                                                     */
/* ------------------------------------------------------------------ */

function gpuInfo(): string {
  try {
    const gl = document.createElement('canvas').getContext('webgl2') ?? document.createElement('canvas').getContext('webgl');
    if (!gl) return t.hud.facts.na;
    const dbg = gl.getExtension('WEBGL_debug_renderer_info');
    const name = dbg ? (gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL) as string) : 'GPU genérica';
    return String(name).replace(/ANGLE \(|\)/g, '').slice(0, 46);
  } catch {
    return t.hud.facts.na;
  }
}

function deviceFacts(): { cores: number; mem: string; dpr: number; gpu: string; webgl2: boolean } {
  const nav = navigator as Navigator & { deviceMemory?: number };
  return {
    cores: navigator.hardwareConcurrency ?? 0,
    mem: nav.deviceMemory ? `${nav.deviceMemory} GB` : 'n/a',
    dpr: Math.round((window.devicePixelRatio || 1) * 100) / 100,
    gpu: gpuInfo(),
    webgl2: !!document.createElement('canvas').getContext('webgl2'),
  };
}

function renderFacts(): void {
  const f = deviceFacts();
  const el = $('#gfx-facts');
  if (!el) return;
  el.innerHTML = `
    <span><b>${t.hud.facts.gpu}</b> ${f.gpu}</span>
    <span><b>${t.hud.facts.webgl}</b> ${f.webgl2 ? t.hud.facts.yes : t.hud.facts.no}</span>
    <span><b>${t.hud.facts.cores}</b> ${f.cores || t.hud.facts.na}</span>
    <span><b>${t.hud.facts.ram}</b> ${f.mem}</span>
    <span><b>${t.hud.facts.dpr}</b> ${f.dpr}</span>`;
}

function paintTier(): void {
  $$<HTMLButtonElement>('[data-tier]').forEach((btn) => {
    const on = btn.dataset.tier === tier;
    btn.classList.toggle('is-active', on);
    btn.setAttribute('aria-pressed', String(on));
  });
  const badge = $('#gfx-current');
  if (badge) badge.textContent = t.gfx[tier].label.toUpperCase();
  const desc = $('#gfx-desc');
  if (desc) desc.textContent = t.hud.activePreset(t.gfx[tier].label);
  document.documentElement.dataset.gfx = tier;
}

function chooseTier(next: Tier, manual = true): void {
  if (next === tier) return;
  tier = next;
  setTier(next);
  paintTier();
  if (manual) {
    blip('select');
    award('tinkerer');
    if (next === 'high') award('overclocked');
    toast({
      icon: next === 'high' ? '⚡' : next === 'mid' ? '◐' : '▁',
      kicker: t.game.toast.graphics,
      title: t.game.toast.quality(t.gfx[next].label),
      body: t.gfx[next].description,
      accent: next === 'high' ? 'green' : 'blue',
    });
  }
}

/* fps meter + automatic downgrade */
let fpsValue = 0;
let fpsRaf = 0;
let fpsFrames = 0;
let fpsLast = performance.now();
let slowSamples = 0;
let autoDowngraded = false;
const bootedAt = performance.now();

function maybeDowngrade(): void {
  if (autoDowngraded || tier === 'low' || prefersReducedMotion()) return;
  if (performance.now() - bootedAt < 6000) return; // let the scene warm up first
  if (fpsValue > 0 && fpsValue < 24) slowSamples += 1;
  else slowSamples = 0;
  if (slowSamples < 6) return;
  autoDowngraded = true;
  slowSamples = 0;
  const next: Tier = tier === 'high' ? 'mid' : 'low';
  chooseTier(next, false);
  toast({
    icon: '⚠',
    kicker: 'AUTO',
    title: t.game.toast.autoTitle(t.gfx[next].label),
    body: t.game.toast.autoBody(fpsValue),
    accent: 'purple',
  });
}

function tickFps(): void {
  fpsRaf = requestAnimationFrame(tickFps);
  fpsFrames += 1;
  const now = performance.now();
  if (now - fpsLast >= 500) {
    fpsValue = Math.round((fpsFrames * 1000) / (now - fpsLast));
    fpsFrames = 0;
    fpsLast = now;
    const el = $('#gfx-fps');
    if (el) {
      el.textContent = String(fpsValue);
      el.dataset.level = fpsValue >= 50 ? 'good' : fpsValue >= 30 ? 'ok' : 'bad';
    }
    const chip = $('#hud-fps');
    if (chip) chip.textContent = `${fpsValue} FPS`;
    maybeDowngrade();
  }
}

async function benchmark(): Promise<void> {
  const btn = $<HTMLButtonElement>('#gfx-bench');
  const out = $('#gfx-bench-out');
  if (!btn || !out) return;
  btn.disabled = true;
  const original = tier;
  // measure on the heaviest preset the device claims to support
  if (original === 'low') chooseTier('mid', false);
  out.textContent = t.hud.perfMeasuring;
  const samples: number[] = [];
  let last = performance.now();
  await new Promise<void>((resolve) => {
    let n = 0;
    const step = (t: number) => {
      samples.push(t - last);
      last = t;
      n += 1;
      if (n < 180) requestAnimationFrame(step);
      else resolve();
    };
    requestAnimationFrame(step);
  });
  const avg = samples.reduce((a, b) => a + b, 0) / samples.length;
  const fps = Math.round(1000 / avg);
  const worst = Math.round(1000 / Math.max(...samples));
  let suggested: Tier = original;
  if (fps >= 52 && original !== 'high') suggested = original === 'low' ? 'mid' : 'high';
  else if (fps < 38 && original !== 'low') suggested = original === 'high' ? 'mid' : 'low';
  out.innerHTML = t.hud.perfResult(fps, worst, t.gfx[suggested].label.toUpperCase());
  btn.disabled = false;
  award('benchmark');
  if (suggested !== original) {
    toast({
      icon: '📊',
      kicker: 'BENCHMARK',
      title: t.game.toast.benchTitle(t.gfx[suggested].label),
      body: t.game.toast.benchBody(fps, t.gfx[original].label),
      accent: 'blue',
    });
    btn.dataset.suggest = suggested;
    btn.textContent = `${t.hud.apply} ${t.gfx[suggested].label.toUpperCase()}`;
    btn.onclick = () => {
      chooseTier(suggested);
      btn.textContent = t.hud.perfTest;
      btn.onclick = () => void benchmark();
    };
  }
}

/* ------------------------------------------------------------------ */
/* HUD                                                                */
/* ------------------------------------------------------------------ */

function paintHud(): void {
  const { level, current, need, pct } = levelInfo();
  const save = getSave();
  const lvl = $('#hud-level');
  if (lvl) lvl.textContent = String(level).padStart(2, '0');
  const bar = $('#hud-bar') as HTMLElement | null;
  if (bar) bar.style.width = `${pct}%`;
  const xp = $('#hud-xp');
  if (xp) xp.textContent = `${current}/${need} XP`;
  const total = $('#hud-total');
  if (total) total.textContent = `${save.xp} XP`;
  const ach = $('#hud-ach-count');
  if (ach) ach.textContent = String(save.achievements.length).padStart(2, '0');
  paintAchievements();
  paintQuests(save.explored);
  document.documentElement.dataset.level = String(level);
}

function paintAchievements(): void {
  const list = $('#ach-list');
  if (!list) return;
  const save = getSave();
  list.innerHTML = ACHIEVEMENTS.map((a) => {
    const unlocked = save.achievements.includes(a.id);
    const text = achievementText(a.id);
    return `<li class="${unlocked ? 'is-unlocked' : ''}">
      <span class="ach-icon" aria-hidden="true">${text.icon}</span>
      <span class="ach-text"><strong>${text.name}</strong><em>${text.desc}</em></span>
      <span class="ach-xp">${unlocked ? t.hud.unlocked : `+${a.xp}`}</span>
    </li>`;
  }).join('');
}

function paintQuests(explored: string[]): void {
  $$<HTMLElement>('[data-quest]').forEach((el) => {
    el.classList.toggle('is-done', explored.includes(el.dataset.quest ?? ''));
  });
}

/* ------------------------------------------------------------------ */
/* popovers                                                           */
/* ------------------------------------------------------------------ */

function bindPanels(): void {
  const gfxPanel = $('#gfx-panel');
  const achPanel = $('#ach-panel');
  const closeAll = (except?: HTMLElement | null) => {
    [gfxPanel, achPanel].forEach((p) => {
      if (p && p !== except) p.classList.remove('is-open');
    });
  };
  const toggle = (panel: HTMLElement | null) => {
    if (!panel) return;
    const open = !panel.classList.contains('is-open');
    closeAll(panel);
    panel.classList.toggle('is-open', open);
    if (open) {
      blip('select');
      if (panel === gfxPanel) renderFacts();
      panel.querySelector<HTMLElement>('button, [tabindex]')?.focus();
    }
  };

  $('#hud-gfx')?.addEventListener('click', () => toggle(gfxPanel));
  $('#hud-ach')?.addEventListener('click', () => toggle(achPanel));
  $$('[data-close-panel]').forEach((b) => b.addEventListener('click', () => closeAll()));
  document.addEventListener('click', (e) => {
    const t = e.target as Node;
    if (gfxPanel?.contains(t) || achPanel?.contains(t)) return;
    if ((t as HTMLElement).closest?.('#hud-gfx, #hud-ach')) return;
    closeAll();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeAll();
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
    if (e.key.toLowerCase() === 'g') { toggle(gfxPanel); }
    if (e.key.toLowerCase() === 'a') { toggle(achPanel); }
    if (e.key.toLowerCase() === 'm') { toggleSound(); }
  });

  $$<HTMLButtonElement>('[data-tier]').forEach((btn) => {
    btn.addEventListener('click', () => chooseTier(btn.dataset.tier as Tier));
  });

  $('#gfx-bench')?.addEventListener('click', () => void benchmark());

  const soundBtn = $('#hud-sound');
  soundBtn?.addEventListener('click', toggleSound);
  paintSound();
}

function paintSound(): void {
  const btn = $('#hud-sound');
  if (!btn) return;
  const muted = isMuted();
  btn.setAttribute('aria-pressed', String(!muted));
  btn.classList.toggle('is-off', muted);
  const label = $('#hud-sound-label');
  if (label) label.textContent = muted ? 'OFF' : 'ON';
}

function toggleSound(): void {
  setMuted(!isMuted());
  paintSound();
  blip('select');
}

/* ------------------------------------------------------------------ */
/* exploration / quests                                               */
/* ------------------------------------------------------------------ */

function bindExploration(): void {
  const sections = $$<HTMLElement>('section[id]');
  const seen = new Set<string>();
  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const id = entry.target.id;
        if (!entry.isIntersecting || seen.has(id)) return;
        seen.add(id);
        if (['about', 'projects', 'skills', 'contact'].includes(id)) markExplored(id);
      });
    },
    { threshold: 0.35 }
  );
  sections.forEach((s) => obs.observe(s));

  /* opening a case study is an interaction worth XP (once) */
  $$<HTMLDetailsElement>('.case-study-toggle').forEach((details) => {
    details.addEventListener('toggle', () => {
      if (!details.open || details.dataset.awarded === '1') return;
      details.dataset.awarded = '1';
      addXp(10, t.game.caseStudyXp);
      const project = details.closest<HTMLElement>('[data-project]')?.dataset.project;
      if (project) markProject(project);
    });
  });

  /* project quests: dwell 1.2s on a card */
  const timers = new Map<HTMLElement, number>();
  const cardObs = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const card = entry.target as HTMLElement;
        const name = card.dataset.project;
        if (!name) return;
        if (entry.isIntersecting) {
          if (timers.has(card)) return;
          const t = window.setTimeout(() => markProject(name), 1200);
          timers.set(card, t);
        } else {
          const t = timers.get(card);
          if (t) clearTimeout(t);
          timers.delete(card);
        }
      });
    },
    { threshold: 0.55 }
  );
  $$<HTMLElement>('[data-project]').forEach((c) => cardObs.observe(c));
}

/* contact copy */
function bindContact(): void {
  $$<HTMLElement>('[data-copy-email]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const email = btn.dataset.copyEmail ?? '';
      try {
        await navigator.clipboard.writeText(email);
        blip('select');
        award('headhunter');
        const old = btn.dataset.label ?? btn.textContent ?? '';
        btn.dataset.label = old;
        btn.textContent = t.contact.copied;
        setTimeout(() => { btn.textContent = btn.dataset.label ?? old; }, 1800);
      } catch {
        window.location.href = `mailto:${email}`;
      }
    });
  });
}

/* konami */
function bindKonami(): void {
  const seq = ['arrowup', 'arrowup', 'arrowdown', 'arrowdown', 'arrowleft', 'arrowright', 'arrowleft', 'arrowright', 'b', 'a'];
  let i = 0;
  document.addEventListener('keydown', (e) => {
    const k = e.key.toLowerCase();
    if (k === seq[i]) {
      i += 1;
      if (i === seq.length) {
        i = 0;
        award('konami');
        addXp(100, 'KONAMI');
        document.body.classList.add('konami-active');
      }
    } else {
      i = k === seq[0] ? 1 : 0;
    }
  });
}

/* hide the HUD while scrolling down so it never sits on top of content */
function bindHudAutoHide(): void {
  const hud = $('#hud');
  if (!hud) return;
  let last = window.scrollY;
  let acc = 0;
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    acc += y - last;
    last = y;
    if (y < 200) {
      hud.classList.remove('is-hidden');
      acc = 0;
      return;
    }
    if (acc > 120) {
      hud.classList.add('is-hidden');
      acc = 0;
    } else if (acc < -80) {
      hud.classList.remove('is-hidden');
      acc = 0;
    }
  }, { passive: true });
}

/* smooth nav + flash */
function bindNav(): void {
  $$<HTMLAnchorElement>('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', () => blip('select'));
  });
}

/* ------------------------------------------------------------------ */
/* skills scene                                                       */
/* ------------------------------------------------------------------ */

let skillsHandle: { dispose(): void; setTier: (t: Tier) => void } | null = null;

async function mountSkills(next: Tier): Promise<void> {
  const host = $('#skill-orbit');
  const cvs = $<HTMLCanvasElement>('#skill-canvas');
  if (!host || !cvs) return;
  if (!TIERS[next].webgl) {
    skillsHandle?.dispose();
    skillsHandle = null;
    host.classList.add('is-off');
    return;
  }
  host.classList.remove('is-off');
  if (skillsHandle) {
    skillsHandle.setTier(next);
    return;
  }
  try {
    const nodes = JSON.parse(host.dataset.skills ?? '[]');
    const { createSkillScene } = await import('./three/skills');
    skillsHandle = createSkillScene(cvs, host, next, nodes);
  } catch (err) {
    console.warn('[skills] 3D unavailable', err);
    host.classList.add('is-off');
  }
}

/* ------------------------------------------------------------------ */
/* boot                                                               */
/* ------------------------------------------------------------------ */

function boot(): void {
  paintTier();
  paintHud();
  bindPanels();
  bindExploration();
  bindContact();
  bindKonami();
  bindNav();
  bindHudAutoHide();
  subscribe(paintHud);
  tickFps();
  award('boot');

  void mountWorld(tier);
  void mountSkills(tier);

  let lastTier = tier;
  onTierChange((next) => {
    if (next === lastTier) return;
    lastTier = next;
    paintTier();
    void mountWorld(next);
    void mountSkills(next);
  });

  window.addEventListener('yb:xp', (e) => {
    const detail = (e as CustomEvent).detail as { amount: number; reason: string };
    const el = $('#hud-toast-xp');
    if (!el) return;
    el.textContent = `+${detail.amount} XP · ${detail.reason}`;
    el.classList.remove('pop');
    void el.offsetWidth;
    el.classList.add('pop');
  });

  /* dev helper: ?tier=low|mid|high forces a preset without saving */
  const forced = new URLSearchParams(location.search).get('tier');
  if (forced === 'low' || forced === 'mid' || forced === 'high') {
    tier = forced;
    setTier(forced, { persist: false });
    paintTier();
    void mountWorld(forced);
    void mountSkills(forced);
  }

  if (prefersReducedMotion()) toast({
    icon: '◼',
    kicker: t.game.toast.accessibility,
    title: t.game.toast.reducedTitle,
    body: t.game.toast.reducedBody,
    accent: 'blue',
  });

  document.documentElement.classList.add('is-ready');
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
else boot();

/* exposed for debugging */
(window as unknown as { yb?: unknown }).yb = { getTier, detectTier, setTier, getSave, levelInfo, TIERS, TIER_ORDER };
