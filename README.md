# YEYOBITZ — 3D portfolio

Personal portfolio built as a small playable world instead of a scrolling document:
an isometric night-shift workstation rendered with **three.js**, a skill constellation
you can drag, XP for exploring, achievements, and a **GRAPHICS** panel with three real
quality tiers (Low / Medium / High) so the same site can run on a phone and on a
dedicated GPU.

```
https://yeyobitz.dev
```

## What is in here

| Area | What it does |
| --- | --- |
| `#top` hero | Full-bleed three.js diorama: desk, CRT with a live canvas screen, server rack, floating cartridges, mascot with a quest marker. Mouse parallax + scroll camera. |
| `#about` | Player profile: character sheet, attribute bars, three "perks". |
| `#projects` | Quest log. Each card is a project; opening a case study grants XP. |
| `#skills` | Draggable 3D constellation. Node size = confidence, colour = category. |
| `#contact` | Summon panel with copy-to-clipboard email. |
| HUD | Level, XP bar, FPS, achievements log, sound toggle and the graphics panel. |
| Secrets | Three floppy disks hidden in the diorama and a very old cheat code. |

## Graphics tiers

The tier is detected on the first visit (cores, RAM, pointer type, WebGL support,
`prefers-reduced-motion`) and can be overridden by hand. The choice is stored in
`localStorage`; `?tier=low|mid|high` forces a preset without saving it.

| | Low | Medium | High |
| --- | --- | --- | --- |
| WebGL | off (CSS backdrop) | on | on |
| three.js chunk | not loaded | loaded lazily | loaded lazily |
| Pixel ratio cap | 1 | 1.5 | 2 |
| Stars | – | 900 | 2600 |
| Shadows | no | no | yes |
| Bloom | no | no | yes |
| Props / cartridges | – | basic / 4 | full / 6 |
| Target | any device, 0 GPU | laptops, phones | desktop GPU |

The **Performance test** button in the panel measures real frames for 3 seconds and
suggests a preset (and can apply it). The FPS readout is live.

## Stack

- [Astro 4](https://astro.build) — static-first, zero framework runtime
- [three.js](https://threejs.org) 0.169 — diorama, skill constellation, post-processing
- TypeScript for the 3D/engine layer, Web Audio for UI sound, no UI library
- Deployed with the Netlify adapter (`output: "hybrid"`)

## Structure

```
src/
  components/
    gfx/          Scene.astro (fixed canvas), Hud.astro (XP, graphics + achievements panels)
    hero/         Hero.astro (title screen copy)
    skills/       SkillOrbit.astro + the 2D skill cards
    projects/     quest cards, carousel, case study
  scripts/
    app.ts        bootstrap: HUD, tiers, exploration, achievements
    core/         quality.ts (tiers), game.ts (XP/save), sound.ts (synth)
    three/        world.ts (diorama), skills.ts (constellation)
  data/cv.json    all copy and project data
```

Everything 3D is code — no `.glb`, no textures on disk. The CRT screen is a canvas
texture drawn at runtime, so the whole visual layer costs ~130 kB gzipped of JS and
zero image requests.

## Commands

```sh
npm install
npm run dev      # http://localhost:4321
npm run build    # dist/
npm run preview
```

Useful during development:

- `?tier=low|mid|high` — force a graphics preset for the session
- `G` / `A` / `M` — graphics panel, achievements, mute
- `window.yb` — exposes the tier and save helpers in the console

## Notes

- The site is usable with JavaScript disabled: content, projects and contact are plain
  HTML; only the 3D layer, XP and the panels go away.
- `prefers-reduced-motion` forces Low and disables the interface animations.
- Progress lives in `localStorage` (`yb:save`). Clearing site data resets it.
