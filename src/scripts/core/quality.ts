/**
 * Graphics quality tiers.
 *
 * The whole 3D layer is driven by this file: how many objects, how many
 * particles, what pixel ratio, whether post-processing exists at all.
 * "low" doesn't even load three.js — the page falls back to CSS.
 */

export type Tier = 'low' | 'mid' | 'high';

export const TIER_ORDER: Tier[] = ['low', 'mid', 'high'];

export interface TierConfig {
  short: string;
  /** webgl canvas enabled at all */
  webgl: boolean;
  maxDpr: number;
  stars: number;
  cubes: number;
  shadows: boolean;
  bloom: boolean;
  /** antialias in the WebGL context */
  antialias: boolean;
  /** extra props on the desk */
  props: boolean;
  /** animated screen texture refresh (ms). 0 = static frame */
  screenFps: number;
  /** how many floating project cartridges */
  cartridges: number;
  skillNodes: number;
}

export const TIERS: Record<Tier, TierConfig> = {
  low: {
    short: 'LOW',
    webgl: false,
    maxDpr: 1,
    stars: 0,
    cubes: 0,
    shadows: false,
    bloom: false,
    antialias: false,
    props: false,
    screenFps: 0,
    cartridges: 0,
    skillNodes: 0,
  },
  mid: {
    short: 'MID',
    webgl: true,
    maxDpr: 1.5,
    stars: 900,
    cubes: 6,
    shadows: false,
    bloom: false,
    antialias: true,
    props: true,
    screenFps: 12,
    cartridges: 4,
    skillNodes: 12,
  },
  high: {
    short: 'HIGH',
    webgl: true,
    maxDpr: 1.75,
    stars: 2400,
    cubes: 18,
    shadows: true,
    bloom: true,
    antialias: true,
    props: true,
    screenFps: 30,
    cartridges: 6,
    skillNodes: 26,
  },
};

const KEY = 'yb:gfx-tier';
export const TIER_EVENT = 'yb:tier';

export function hasWebGL(): boolean {
  try {
    const c = document.createElement('canvas');
    return !!(window.WebGLRenderingContext && (c.getContext('webgl2') || c.getContext('webgl')));
  } catch {
    return false;
  }
}

export function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/** Best guess for this device, used the first time somebody lands. */
export function detectTier(): Tier {
  if (prefersReducedMotion() || !hasWebGL()) return 'low';

  const nav = navigator as Navigator & { deviceMemory?: number };
  const mem = nav.deviceMemory ?? 8;
  const cores = navigator.hardwareConcurrency ?? 4;
  const coarse = window.matchMedia('(pointer: coarse)').matches;
  const narrow = window.matchMedia('(max-width: 820px)').matches;
  const mobile = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent) || (coarse && narrow);

  if (mobile) return cores >= 8 && mem >= 6 ? 'mid' : 'low';
  if (cores >= 8 && mem >= 8) return 'high';
  if (cores >= 4 && mem >= 4) return 'mid';
  return 'low';
}

export function getTier(): Tier {
  const stored = localStorage.getItem(KEY);
  if (stored === 'low' || stored === 'mid' || stored === 'high') return stored;
  return detectTier();
}

export function setTier(tier: Tier, opts: { persist?: boolean } = {}): void {
  if (opts.persist !== false) localStorage.setItem(KEY, tier);
  document.documentElement.dataset.gfx = tier;
  window.dispatchEvent(new CustomEvent(TIER_EVENT, { detail: tier }));
}

export function initTier(): Tier {
  const tier = getTier();
  document.documentElement.dataset.gfx = tier;
  return tier;
}

export function onTierChange(cb: (tier: Tier) => void): () => void {
  const handler = (e: Event) => cb((e as CustomEvent<Tier>).detail);
  window.addEventListener(TIER_EVENT, handler);
  return () => window.removeEventListener(TIER_EVENT, handler);
}
