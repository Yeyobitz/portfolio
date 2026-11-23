# ROADMAP — de portfolio bonito a portfolio que consigue entrevistas

> Objetivo: trabajo remoto como **AI Automation Engineer / Full-Stack Developer**.
> Inglés C2 certificado. Base: Concepción, Chile (UTC-3).
>
> Regla que ordena todo lo demás: **cada afirmación del sitio tiene que poder
> defenderse en una entrevista técnica**. Si no hay número verificable, se cuenta
> la decisión y el resultado cualitativo; nunca se inventa una métrica.

---

## 0. Posicionamiento (una sola frase, repetida en todo)

**ES:** Diseño e implemento automatizaciones con IA y las entrego como producto web:
agentes con guardrails, pipelines de documentos, integraciones y dashboards que
funcionan sin supervisión.

**EN:** I build AI-powered automations and ship them as web products — guardrailed
agents, document pipelines, integrations and dashboards that run unattended.

Títulos a los que apuntamos (usar exactamente estos en CV/LinkedIn/búsquedas):

- AI Automation Engineer
- AI Solutions Engineer / AI Product Engineer
- Full-Stack Developer (AI & Automation)
- Internal Tools Engineer

Lo que **no** se dice: "apasionado por la tecnología", "quick learner",
"full stack" a secas. Nada de adjetivos sin evidencia.

### Decisión pendiente: idioma por defecto

Hoy `/` es español y `/en/` inglés. Si apuntas a US/EU remoto, el sitio debería
abrir en **inglés** (`/` EN, `/es/` ES) porque el primer filtro lo hace alguien que
no lee español. Si apuntas a LatAm, el orden actual está bien. Cambiarlo es una
línea en `astro.config.mjs` + mover una página.

---

## Diagnóstico de partida (lo que hay que arreglar)

| # | Problema | Impacto |
| --- | --- | --- |
| 1 | `yeyobitz.dev` no resuelve; no hay deploy | Bloqueador total |
| 2 | Sin experiencia laboral en el sitio ni en `cv.json` | Se lee como recién egresado |
| 3 | Métricas no verificables ("500+ usuarios", "+200%") | Riesgo de credibilidad en entrevista |
| 4 | Dos perfiles mezclados (soporte vs full-stack) | Diluye el mensaje |
| 5 | Homelab enterrado en una tarjeta | Se pierde el activo más difícil de copiar |
| 6 | 3D pesa 126 kB gzip y en equipos capados cae a LOW | Costo alto, retorno incierto |
| 7 | HUD "NIV 01 / 0 XP" y tipografía de 8–10 px | Ruido y baja legibilidad |
| 8 | Sin CV PDF, sin nivel de inglés, sin disponibilidad | El reclutador no puede avanzar |
| 9 | Sin tests, CI, lint ni LICENSE | Mala señal en el repo que van a abrir |
| 10 | Sin analytics, sitemap ni escritura técnica | Cero distribución y cero prueba de comunicación |

---

## Fase 0 — Fundaciones (semana 1, ~8 h)

- [ ] Desplegar en Cloudflare Pages o Netlify conectado a `main` (build `npm run build`, output `dist`).
- [ ] Dominio + HTTPS + redirect `www` → apex. Verificar `/` y `/en/` con 200.
- [ ] Analytics privacy-first (Plausible/Umami) + eventos: `cv_download`, `contact_click`, `project_demo_click`, `apply`.
- [ ] `robots.txt` + sitemap (ya generado por `@astrojs/sitemap`).
- [ ] GitHub Actions: build + typecheck en cada PR (falla el merge si rompe).
- [ ] `LICENSE` (MIT para el código del sitio; los textos e imágenes quedan reservados).
- [ ] Presupuesto de rendimiento documentado y medido: LCP < 2.5 s en 4G, CLS < 0.1, JS inicial < 120 kB gzip.

**Hecho cuando:** hay una URL pública que responde 200 en ambos idiomas, el pipeline
está verde y el primer evento de analytics se registra desde tu propio móvil.

---

## Fase 1 — Verdad y narrativa (semana 1–2, ~12 h)

Rellenar `docs/FACTS.md` **antes** de escribir una línea de copy. Sin datos reales
no se avanza.

- [ ] Reescribir el hero: una frase de resultado + rol objetivo + disponibilidad + inglés C2 + botón "Download CV".
- [ ] Nueva sección **Experience** con Ferrostaal y cualquier rol de soporte/IT: fechas, responsabilidades, sistemas, volumen, turnos, gente atendida.
- [ ] Nueva página **/hire** (o `/cv`): resumen de una pantalla, sin 3D, imprimible, con todo lo que un reclutador necesita decidir en 60 segundos.
- [ ] CV en PDF generado desde los mismos datos (script de build, no un archivo huérfano).
- [ ] Certificado C2: badge + enlace al certificado (o captura redactada) + fecha e institución.
- [ ] Alinear LinkedIn (mismo titular, mismas fechas, mismas métricas) y el README de perfil de GitHub (bio, pinned repos).
- [ ] Eliminar toda métrica no verificable del `cv.json`/`cv.es.json`.

**Hecho cuando:** un desconocido puede responder en 60 s: qué haces, dónde trabajaste,
qué sabes hacer, cuándo puedes empezar y cómo contactarte.

---

## Fase 2 — Casos de estudio (semana 2–3, ~14 h)

Formato fijo para cada caso: **Contexto → Restricciones → Arquitectura (diagrama) →
Decisiones y trade-offs → Resultado → Qué haría distinto → Enlaces**.

- [ ] **Homelab** (caso principal): diagrama de red, servicios, Docker, reverse proxy, backups y **prueba de restauración**, monitoreo, consumo, costo mensual, incidentes reales y cómo se resolvieron.
- [ ] **Este sitio**: 3 niveles de calidad, auto-downgrade, cero texturas, i18n estático, accesibilidad. Es una historia de ingeniería real y demuestra criterio de performance.
- [ ] **Triage Copilot** o **DocuMind** (el primero que termines) con métricas de eval y costo.
- [ ] Reescribir los 4 proyectos actuales en el mismo formato; los que no resistan, se retiran del sitio (no se dejan "de relleno").

**Hecho cuando:** cada caso tiene diagrama, captura o demo, decisiones explicadas y
al menos una cosa que salió mal.

---

## Fase 3 — Proyectos flagship (semanas 3–7)

Tres proyectos, ~2 semanas cada uno a 10 h/semana. Todos: repo público, README con
diagrama, tests, CI verde, demo en vivo, video de 90 s, post en inglés.

### P1 — Triage Copilot (AI + producto + backend)

- **Qué hace:** ingiere tickets (CSV/IMAP de prueba), clasifica categoría/prioridad/sentimiento, sugiere responsable y redacta respuesta con políticas; un humano aprueba o corrige; todo queda auditado.
- **Prueba:** integración de LLM con guardrails, human-in-the-loop, evaluación, backend y UI.
- **Stack:** Python + FastAPI + Postgres, cola ligera, Docker Compose; front en Next o Astro islands; OpenAI/Anthropic API.
- **Entregables:** 40 tickets etiquetados como set de eval; accuracy/precisión y costo por ticket en el README; tests unitarios + Playwright del flujo aprobar/corregir; log de decisiones.
- **No hacer:** datos reales de una empresa, ni prometer "reemplaza al equipo de soporte".

### P2 — DocuMind (RAG con citas + evals)

- **Qué hace:** PDF/DOCX → parseo → chunking → búsqueda híbrida → respuesta con citas a página y fragmento; extracción a JSON con esquema; panel de costo/latencia por consulta.
- **Prueba:** RAG bien hecho, no un wrapper: citas verificables, set de 25 preguntas, medición de fidelidad y de costo por 1.000 páginas.
- **Stack:** Python, pgvector, FastAPI, worker de ingesta, UI de carga y streaming.
- **Reutiliza:** tu repo `pdftoai` como base; conviértelo en producto con métricas.
- **Entregables:** demo con 3 documentos públicos, tabla de resultados de eval, comparación de dos estrategias de chunking.

### P3 — Homelab Sentinel (automatización + operación)

- **Qué hace:** agente en Docker que vigila contenedores y disco, detecta reinicios en bucle o servicios caídos, propone un runbook y lo ejecuta **con aprobación** desde Discord/Telegram; registra incidentes y manda informe semanal.
- **Prueba:** automatización con límites de seguridad, observabilidad, alertas y capacidad de operar sin supervisión.
- **Stack:** Python, Docker API, Prometheus/node-exporter, SQLite o Postgres, bot de Discord.
- **Entregables:** video de un incidente simulado resuelto de punta a punta, historial de incidentes, tests de las acciones peligrosas (deben pedir aprobación).

### Regla anti-humo

Ningún proyecto entra al portfolio sin: demo pública, README con diagrama, tests,
CI verde, y una decisión técnica que puedas defender en voz alta.

---

## Fase 4 — Prueba de oficio (semana 6, ~6 h)

- [ ] CI en los 4 repos: lint + tests + build.
- [ ] `LICENSE`, `CONTRIBUTING` mínimo y plantilla de PR en el repo del sitio.
- [ ] Dependabot + CodeQL activos.
- [ ] Auditoría de accesibilidad: foco visible, contraste AA, navegación por teclado, `prefers-reduced-motion`.
- [ ] Subir todo el texto pequeño: mínimo 12 px reales; HUD opcional.
- [ ] "Modo reclutador": página `/hire` sin 3D, sin boot screen, LCP < 1.5 s.

**Hecho cuando:** Lighthouse mobile ≥ 95 en Performance/A11y/Best Practices/SEO para `/hire`.

---

## Fase 5 — Distribución (semana 7–8)

- [ ] Dos posts en inglés: "Running 15 containers on a mini PC without losing sleep" y "How I made a 3D portfolio survive a 2019 phone".
- [ ] README de perfil de GitHub con los 3 proyectos y una línea de posicionamiento.
- [ ] LinkedIn: titular, "About" de 5 líneas, proyectos destacados, certificado C2, abierto a remoto.
- [ ] Plan de aplicaciones: 5/semana, con tracker (empresa, rol, contacto, fecha, estado).
- [ ] 10 empresas objetivo con equipo distribuido y stack parecido (automatización interna, agencias, SaaS chico).
- [ ] Pedir 2 recomendaciones (Ferrostaal / cliente / docente) con texto concreto.

---

## Calendario

| Semana | Foco | Entregable visible |
| --- | --- | --- |
| 1 | Fase 0 + FACTS + hero/experiencia | Sitio online, CV PDF, sección Experience |
| 2 | Casos: homelab + este sitio | 2 casos publicados |
| 3 | P1 arranca + reescritura de proyectos viejos | P1 repo + caso de estudio |
| 4 | P1 terminado | Demo + video + eval |
| 5 | P2 | DocuMind demo |
| 6 | P2 cierre + Fase 4 | CI/a11y/Lighthouse |
| 7 | P3 | Sentinel demo + post |
| 8 | Distribución | 2 posts, LinkedIn, 40 aplicaciones |

A 10–12 h/semana. Si el tiempo se reduce, se recorta P3 antes que Fase 0, 1 o 2.

---

## Criterios de "portfolio reluciente" (medibles)

1. Todos los enlaces del sitio devuelven 200 (incluido el dominio y `/en/`).
2. Todo proyecto visible tiene demo en vivo, repo público, tests y CI verde.
3. Cero métricas sin fuente.
4. `/hire` responde las 6 preguntas del reclutador y pesa < 120 kB de JS.
5. Lighthouse mobile ≥ 95 en `/hire`; ≥ 85 en la home 3D.
6. Formulario de contacto entrega y confirma (no solo `mailto`).
7. CV PDF y LinkedIn dicen lo mismo que el sitio.
8. Analytics con eventos de descarga de CV y clic a demo.
9. Dos posts técnicos en inglés publicados.
10. Un video de 90 s por proyecto.

---

## Riesgos

- **3D vs claridad:** el diorama es memorable pero caro. Se mantiene como capa opcional; la decisión de contratación no puede depender de él.
- **APIs de pago:** los proyectos P1/P2 necesitan crédito. Presupuestar ~US$10–20/mes y poner límites + caché + modo demo sin API.
- **Tiempo:** turno de noche. El calendario asume 10 h/semana; si no se cumplen, se extiende, no se comprime la calidad.
- **Sobreventa:** si una tecnología no se domina, se etiqueta como "working knowledge" o no se lista.

## Decisiones abiertas

1. Idioma por defecto: EN-first (US/EU) o ES-first (LatAm).
2. Plataforma de deploy: Cloudflare Pages / Netlify / VPS propio.
3. Rango de renta o tarifa por hora para el `/hire`.
4. Fecha de disponibilidad y tipo de contrato (full-time / contractor).
