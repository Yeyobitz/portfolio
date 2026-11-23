# STATUS — dónde quedó todo

Actualizado: 23 de noviembre de 2026.

## En vivo

- https://yeyobitz.github.io/portfolio/ (ES)
- https://yeyobitz.github.io/portfolio/en/ (EN)
- https://yeyobitz.github.io/portfolio/cv/ (CV, una página)
- PDFs: `/cv/diego-quinones-cv-es.pdf` y `-en.pdf`

`yeyobitz.dev` **no tiene DNS** (no resuelve). Comprarlo es el paso 1 pendiente.

## Cómo se despliega

- Push a `main` → `.github/workflows/pages.yml` (typecheck → build → artifact → deploy).
- El build es estático y usa dos variables en el workflow:
  `SITE_URL=https://yeyobitz.github.io` y `BASE_PATH=/portfolio`.
- Con dominio propio: cambiar esas dos (`https://yeyobitz.dev`, `/`), agregar el
  custom domain en Pages y los registros DNS. Nada más.
- Manual: `gh workflow run pages.yml`.

## Hecho

- Sitio v2: diorama 3D, tres niveles de gráficos, i18n ES/EN, HUD, logros.
- Contenido reescrito con evidencia: experiencia real, tres proyectos reales,
  métricas inventadas eliminadas, "20+" corregido a "15+" contenedores.
- CV one-page ES/EN con generación de PDF (`npm run cv:pdf`).
- Deploy en GitHub Pages, CI en cada PR, LICENSE, sitemap y robots generados.
- PR #1 mergeado a `main` (squash). Rama `feat/3d-gamified-portfolio` conservada.

## Pendiente, en orden de impacto

1. **Dominio**: comprar y conectar (DNS + 2 variables + rebuild).
2. **LinkedIn y GitHub alineados**: mismo titular, fechas y link al sitio en vivo.
   Hoy el perfil de GitHub dice "IT support specialist and programmer" y enlaza al
   repo, no al sitio.
3. **Homelab**: faltan dos datos para publicar el caso de estudio:
   - un incidente real (qué se cayó, cómo se detectó, cómo se arregló)
   - backups (destino, frecuencia, si se restauró alguna vez)
4. **Triage Copilot**: repo, ingesta de tickets, clasificación + borrador con
   guardrails, aprobación humana, auditoría, set de 40 tickets y métricas.
5. **Postular**: 5 por semana con tracker. El sitio ya no es el cuello de botella.
6. Analytics (eventos `cv_download`, `demo_click`, `contact_click`) y dos posts
   técnicos en inglés.

## Decisiones abiertas

- Idioma por defecto: hoy ES en `/`; para remoto internacional conviene EN en `/`
  y ES en `/es/`.
- Renta: USD 1.500/mes declarados en el CV.
- Teléfono: no publicado (solo email, LinkedIn, GitHub y certificado EF SET).

## Comandos

```sh
npm run dev        # local
npm run build      # dist/
npm run typecheck  # astro sync + tsc
npm run cv:pdf     # regenera public/cv/*.pdf (requiere Chrome)
```

Si cambias `cv.json` / `cv.es.json`, corre `cv:pdf` antes de commitear o los PDFs
quedan desactualizados.

## Para retomar

Leer este archivo, `docs/ROADMAP.md` (plan de 8 semanas) y `docs/FACTS.md`
(datos verificados y los dos campos del homelab que faltan).
