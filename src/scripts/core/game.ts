/**
 * Player progression: XP, levels, achievements.
 * Deliberately tiny and dependency-free so it can run before three.js loads.
 */

import { blip } from './sound';
import { getDict, clientLang } from '../../i18n/ui';

export interface Save {
  xp: number;
  achievements: string[];
  explored: string[];
  projects: string[];
  secrets: string[];
  streak: number;
}

export interface Achievement {
  id: string;
  icon: string;
  xp: number;
}

export const ACHIEVEMENTS: Achievement[] = [
  { id: 'boot', icon: '⏻', xp: 10 },
  { id: 'explorer', icon: '🗺', xp: 60 },
  { id: 'collector', icon: '💾', xp: 80 },
  { id: 'headhunter', icon: '📡', xp: 25 },
  { id: 'tinkerer', icon: '🎛', xp: 20 },
  { id: 'benchmark', icon: '📊', xp: 30 },
  { id: 'archaeologist', icon: '🧭', xp: 50 },
  { id: 'overclocked', icon: '⚡', xp: 40 },
  { id: 'konami', icon: '🕹', xp: 100 },
  { id: 'completionist', icon: '🏆', xp: 0 },
];

/** Localized name/description for an achievement id. */
export function achievementText(id: string): { name: string; desc: string; icon: string; xp: number } {
  const d = getDict(clientLang()).game.achievements as Record<string, { name: string; desc: string }>;
  const meta = ACHIEVEMENTS.find((a) => a.id === id);
  return {
    name: d[id]?.name ?? id,
    desc: d[id]?.desc ?? '',
    icon: meta?.icon ?? '★',
    xp: meta?.xp ?? 0,
  };
}

const KEY = 'yb:save';
const listeners = new Set<() => void>();

const empty = (): Save => ({ xp: 0, achievements: [], explored: [], projects: [], secrets: [], streak: 0 });

function load(): Save {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return empty();
    const parsed = JSON.parse(raw) as Partial<Save>;
    return { ...empty(), ...parsed };
  } catch {
    return empty();
  }
}

let save: Save = load();

function persist(): void {
  localStorage.setItem(KEY, JSON.stringify(save));
  listeners.forEach((fn) => fn());
}

export function subscribe(fn: () => void): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function getSave(): Save {
  return { ...save };
}

export function xpForLevel(level: number): number {
  return 100 + (level - 1) * 60;
}

export function levelInfo(xp = save.xp): { level: number; current: number; need: number; pct: number } {
  let level = 1;
  let rest = xp;
  while (rest >= xpForLevel(level)) {
    rest -= xpForLevel(level);
    level += 1;
  }
  const need = xpForLevel(level);
  return { level, current: rest, need, pct: Math.min(100, Math.round((rest / need) * 100)) };
}

type XpDetail = { amount: number; reason: string; levelUp: boolean; level: number };

export function addXp(amount: number, reason: string, silent = false): void {
  if (amount <= 0) return;
  const before = levelInfo().level;
  save.xp += amount;
  persist();
  if (!silent) {
    blip('xp');
    window.dispatchEvent(
      new CustomEvent<XpDetail>('yb:xp', { detail: { amount, reason, levelUp: false, level: before } })
    );
  }
  const after = levelInfo().level;
  if (after > before) {
    blip('level');
    window.dispatchEvent(
      new CustomEvent<XpDetail>('yb:xp', { detail: { amount, reason, levelUp: true, level: after } })
    );
    const d = getDict(clientLang());
    toast({
      icon: '▲',
      kicker: d.game.levelUp.kicker,
      title: d.game.levelUp.title(after),
      body: after >= 5 ? d.game.levelUp.bodyHigh : d.game.levelUp.bodyLow,
      accent: 'green',
    });
  }
}

export function award(id: string): boolean {
  if (!save.achievements.includes(id)) {
    const meta = ACHIEVEMENTS.find((a) => a.id === id);
    save.achievements.push(id);
    persist();
    if (meta) {
      const d = getDict(clientLang());
      const text = achievementText(id);
      blip('achievement');
      addXp(meta.xp, text.name, true);
      toast({
        icon: text.icon,
        kicker: d.game.achievementKicker,
        title: text.name,
        body: text.desc,
        accent: 'purple',
      });
    }
    if (save.achievements.length >= ACHIEVEMENTS.length - 1 && !save.achievements.includes('completionist')) {
      save.achievements.push('completionist');
      persist();
      const dc = getDict(clientLang());
      toast({ icon: '🏆', kicker: '100%', title: dc.game.completion.title, body: dc.game.completion.body, accent: 'green' });
    }
    return true;
  }
  return false;
}

export function markExplored(id: string): void {
  if (save.explored.includes(id)) return;
  save.explored.push(id);
  persist();
  const d = getDict(clientLang());
  const reason = ({ experience: d.nav.experience, projects: d.nav.projects, skills: d.nav.skills, contact: d.nav.contact } as Record<string, string>)[id] ?? id;
  addXp(25, reason);
  if (['experience', 'projects', 'skills', 'contact'].every((s) => save.explored.includes(s))) award('explorer');
}

export function markProject(name: string): void {
  if (save.projects.includes(name)) return;
  save.projects.push(name);
  persist();
  addXp(15, name);
  const total = Number(document.documentElement.dataset.projectTotal ?? 0);
  if (total > 0 && save.projects.length >= total) award('collector');
}

export function markSecret(id: string): void {
  if (save.secrets.includes(id)) return;
  save.secrets.push(id);
  persist();
  addXp(50, getDict(clientLang()).scene.floppy);
  award('archaeologist');
}

export function reset(): void {
  save = empty();
  persist();
}

/* ---------------- toasts ---------------- */

interface ToastInput {
  icon: string;
  kicker: string;
  title: string;
  body?: string;
  accent?: 'green' | 'purple' | 'blue';
}

let queue: ToastInput[] = [];
let showing = false;

export function toast(input: ToastInput): void {
  if (!document.querySelector('.game-toasts')) {
    const host = document.createElement('div');
    host.className = 'game-toasts';
    host.setAttribute('role', 'status');
    host.setAttribute('aria-live', 'polite');
    document.body.appendChild(host);
  }
  queue.push(input);
  if (!showing) next();
}

function next(): void {
  const host = document.querySelector<HTMLElement>('.game-toasts');
  const item = queue.shift();
  if (!host || !item) {
    showing = false;
    return;
  }
  showing = true;
  const el = document.createElement('div');
  el.className = `game-toast accent-${item.accent ?? 'green'}`;
  el.innerHTML = `
    <span class="game-toast__icon" aria-hidden="true">${item.icon}</span>
    <span class="game-toast__text">
      <span class="game-toast__kicker">${item.kicker}</span>
      <strong class="game-toast__title">${item.title}</strong>
      ${item.body ? `<span class="game-toast__body">${item.body}</span>` : ''}
    </span>`;
  host.appendChild(el);
  requestAnimationFrame(() => el.classList.add('in'));
  setTimeout(() => {
    el.classList.remove('in');
    setTimeout(() => {
      el.remove();
      next();
    }, 320);
  }, 3400);
}
