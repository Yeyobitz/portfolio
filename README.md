# Diego Quiñones — Portfolio

Portfolio personal construido con [Astro](https://astro.build) y deployeado en Netlify.

## Stack

- **Framework:** Astro 4 (hybrid mode — SSR + static)
- **Hosting:** Netlify (adapter `@astrojs/netlify`)
- **Estilos:** CSS vanilla con variables custom (dark/light theme)
- **Tipografía:** JetBrains Mono (headings) + IBM Plex Mono (body)
- **Datos:** `src/data/cv.json` — single source of truth

## Scripts

| Comando | Acción |
|---------|--------|
| `npm install` | Instalar dependencias |
| `npm run dev` | Dev server en `localhost:4321` |
| `npm run build` | Build de producción → `dist/` |
| `npm run preview` | Previsualizar build local |

## Estructura

```
src/
├── components/
│   ├── Header.astro          # Nav sticky + mobile menu
│   ├── Footer.astro          # Footer minimalista
│   ├── ThemeToggle.astro     # Dark/light toggle
│   ├── ParticleBackground.astro  # Canvas sutil de partículas
│   ├── hero/Hero.astro       # Hero section: nombre + rol + tagline
│   ├── About.astro           # About + botón descargar CV
│   ├── skills/               # Skills: agrupados por categoría con nivel
│   ├── projects/             # Project cards con case studies
│   └── contact/              # Links de contacto + CV download
├── data/
│   └── cv.json               # Datos del CV (skills, proyectos, perfiles)
├── layouts/
│   └── Layout.astro          # Shell HTML principal
├── pages/
│   └── index.astro           # Página única
├── styles/
│   ├── theme.css             # Design tokens (colores, tipografía, spacing)
│   ├── main.css              # Entry point de CSS
│   └── base/                 # Reset, tipografía
└── types/
    └── cv.ts                 # TypeScript types para cv.json
```

## Customización

Todo el contenido se edita en `src/data/cv.json`:

- **basics:** nombre, rol, summary, email, links
- **skills:** array de `{ name, level ("basic"|"intermediate"|"advanced"), keywords }`
- **projects:** array con nombre, descripción, tecnologías, imágenes, url, github, case study

El sitio se regenera solo en Netlify al hacer push a `main`.
