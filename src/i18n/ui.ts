/**
 * UI copy for every language. `es` is the source of truth: `en` is typed
 * against it, so a missing key is a TypeScript error instead of a blank label.
 */

export type Lang = 'es' | 'en';

const es = {
  meta: {
    title: 'Diego Quiñones — Automatización con IA y desarrollo full stack',
    description:
      'Automatizo trabajo manual de operación con IA y lo entrego como herramienta web. Soporte TI, homelab de 15+ contenedores e inglés C2. Disponible para trabajo remoto desde diciembre 2026.',
    htmlLang: 'es-CL',
  },
  nav: {
    experience: 'EXPERIENCIA',
    projects: 'PROYECTOS',
    skills: 'STACK',
    contact: 'CONTACTO',
    cv: 'CV',
    online: 'EN LÍNEA',
    openMenu: 'Abrir menú',
    closeMenu: 'Cerrar menú',
    switchTo: 'EN',
    switchLabel: 'Ver el sitio en inglés',
    home: 'Volver arriba',
  },
  hero: {
    kicker: ['DISPONIBLE 1 DIC 2026', 'REMOTO', 'UTC-3', 'INGLÉS C2'],
    emailLabel: 'Contacto directo',
    start: 'DESCARGAR CV',
    questlog: 'VER EXPERIENCIA',
    hint: 'Abierto a roles remotos de automatización con IA y desarrollo full stack.',
    scroll: 'BAJA PARA EXPLORAR',
    loc: 'CONCEPCIÓN · CHILE',
    stats: {
      users: 'USUARIOS SOPORTADOS',
      containers: 'CONTENEDORES PROPIOS',
      english: 'INGLÉS CERTIFICADO',
      projects: 'PROYECTOS EN VIVO',
    },
  },
  experience: {
    title: 'EXPERIENCIA',
    tag: '2 ROLES',
    intro:
      'Dos trabajos, ambos presenciales y ambos con la misma obsesión: que el trabajo repetitivo deje de consumir horas.',
    tools: 'Herramientas',
    current: 'Actual',
    principlesTitle: 'CÓMO TRABAJO',
    principles: [
      {
        title: 'AUTOMATIZAR ANTES DE CONTRATAR',
        text: 'Busco la tarea que se repite antes de proponer una herramienta nueva. Si algo se hace tres veces por semana, se convierte en script, plantilla o flujo.',
      },
      {
        title: 'IA CON LÍMITES',
        text: 'Uso modelos donde aportan criterio y código determinista donde hace falta exactitud. Toda automatización que toca datos de alguien tiene una revisión humana.',
      },
      {
        title: 'OPS DE VERDAD',
        text: '300+ usuarios, turnos de noche y un servidor propio de 7 GB enseñan a mantener cosas andando, no solo a lanzarlas.',
      },
    ],
  },
  projects: {
    title: 'PROYECTOS',
    tag: 'PROYECTOS',
    intro:
      'Tres cosas que existen y puedes abrir ahora mismo. Sin demos maquetadas ni métricas inventadas.',
    features: 'Qué tiene',
    tech: 'Stack',
    caseStudy: 'VER EL CASO',
    process: 'Cómo lo hice',
    challenges: 'Desafíos',
    solutions: 'Soluciones',
    learnings: 'Lo que aprendí',
    repo: 'CÓDIGO',
    demo: 'DEMO',
    impact: 'Por qué importa',
    role: 'Rol',
    live: 'EN VIVO',
    building: 'EN CONSTRUCCIÓN',
    collapse: 'Contraer',
    expand: 'Expandir',
  },
  skills: {
    title: 'STACK',
    tag: 'NODOS',
    intro:
      'Pasa el cursor por un nodo para inspeccionarlo y arrastra para girar el árbol. El tamaño del nodo indica cuánto confío en esa herramienta, no cuánto me gusta.',
    hint: 'arrastra para girar · pasa el cursor por un nodo',
    labels: {
      advanced: 'avanzado',
      intermediate: 'intermedio',
      basic: 'básico',
    },
    categories: {
      Frontend: 'FRONTEND',
      Backend: 'BACKEND',
      Database: 'DATOS',
      DevTools: 'HERRAMIENTAS',
      Infra: 'INFRA',
      AI: 'IA',
      GameDev: 'GAMEDEV',
      Design: 'DISEÑO',
      Media: 'MEDIA',
    },
  },
  contact: {
    title: 'CONTACTO',
    tag: 'ABIERTO',
    line1: '¿Necesitas que algo deje de hacerse a mano?',
    line2: 'Escríbeme y lo vemos =)',
    copyHint: 'haz clic para copiar · +25 XP',
    copied: '✓ COPIADO',
    availability: 'Disponible desde el 1 de diciembre de 2026 · Remoto · UTC-3',
  },
  footer: {
    status: 'estado',
    system: 'SISTEMA',
    uptime: 'ACTIVO',
    online: 'EN LÍNEA',
    operational: 'Todo operativo',
    years: 'años',
  },
  loading: {
    brand: 'INICIANDO SISTEMA',
    messages: ['ARRANCANDO…', 'MONTANDO 3D…', 'LISTO.'],
  },
  hud: {
    level: 'NIV',
    gfx: 'GFX',
    sfx: 'SFX',
    log: 'LOGROS',
    on: 'ON',
    off: 'OFF',
    playerProgress: 'Progreso del jugador',
    experience: 'Experiencia',
    total: 'TOTAL',
    achievementsPanel: 'Logros',
    graphicsPanel: 'Ajustes de gráficos',
    close: 'Cerrar',
    graphicsTitle: 'GRÁFICOS',
    achievementsTitle: 'LOGROS',
    panelLead:
      'El mismo portafolio con tres perfiles de GPU. Elige lo que este dispositivo soporta de verdad — o corre la prueba y lo elegimos nosotros.',
    qualityAria: 'Calidad gráfica',
    fpsNow: 'FPS AHORA',
    perfTest: '▶ TEST DE RENDIMIENTO (3s)',
    perfMeasuring: 'Midiendo 3s…',
    perfHelp: 'Mide fotogramas reales en esta GPU y recomienda un perfil.',
    perfResult: (fps: number, worst: number, tier: string) =>
      `Resultado: <b>${fps} fps</b> de promedio · peor fotograma ${worst} fps → recomendado <b>${tier}</b>`,
    apply: 'Aplicar',
    activePreset: (label: string) => `> preset activo: ${label} · se aplica al instante`,
    shortcuts: 'Atajos: <kbd>G</kbd> gráficos · <kbd>A</kbd> logros · <kbd>M</kbd> sonido · <kbd>↑↑↓↓←→←→BA</kbd> 😉',
    achLead: 'Explora el portfolio para desbloquearlos. Cada uno da XP.',
    unlocked: 'OK',
    facts: {
      gpu: 'GPU',
      webgl: 'WebGL2',
      cores: 'Núcleos',
      ram: 'RAM',
      dpr: 'DPR',
      yes: 'sí',
      no: 'no',
      na: 'n/d',
    },
  },
  gfx: {
    low: {
      label: 'Bajo',
      description: 'Sin WebGL. Solo CSS: máxima compatibilidad y cero costo de GPU.',
    },
    mid: {
      label: 'Medio',
      description: 'Escena 3D básica, sin post-proceso ni sombras. Pensado para notebooks y celulares.',
    },
    high: {
      label: 'Alto',
      description: 'Bloom, sombras, 3× partículas, objetivo 60 fps. Requiere una GPU dedicada.',
    },
  },
  game: {
    achievements: {
      boot: { name: 'SECUENCIA DE ARRANQUE', desc: 'Encendiste el sistema.' },
      explorer: { name: 'EXPLORADOR', desc: 'Visitaste las cuatro zonas del mapa.' },
      collector: { name: 'COLECCIONISTA', desc: 'Revisaste todos los proyectos.' },
      headhunter: { name: 'CAZATALENTOS', desc: 'Copiaste el correo de contacto.' },
      tinkerer: { name: 'AJUSTADOR', desc: 'Cambiaste la calidad gráfica a mano.' },
      benchmark: { name: 'BENCHMARKER', desc: 'Corriste el test de rendimiento.' },
      archaeologist: { name: 'ARQUEÓLOGO', desc: 'Encontraste un disquete escondido en el diorama.' },
      overclocked: { name: 'OVERCLOCK', desc: 'Pusiste los gráficos en ALTO.' },
      konami: { name: '↑↑↓↓←→←→BA', desc: 'El código antiguo sigue funcionando.' },
      completionist: { name: '100%', desc: 'Desbloqueaste todo lo demás.' },
    },
    levelUp: {
      kicker: 'SUBISTE DE NIVEL',
      title: (level: number) => `NIVEL ${level}`,
      bodyHigh: 'El sistema empieza a respetarte.',
      bodyLow: 'Sigue explorando el mapa.',
    },
    achievementKicker: 'LOGRO DESBLOQUEADO',
    completion: { title: 'COMPLETISTA', body: 'Desbloqueaste todo el portfolio.' },
    caseStudyXp: 'CASO DE ESTUDIO',
    toast: {
      graphics: 'GRÁFICOS',
      quality: (label: string) => `CALIDAD ${label.toUpperCase()}`,
      fallbackTitle: 'VOLVIENDO A BAJO',
      fallbackBody: 'No se pudo iniciar WebGL en este dispositivo.',
      autoTitle: (label: string) => `BAJANDO A ${label.toUpperCase()}`,
      autoBody: (fps: number) => `${fps} fps sostenidos. Puedes volver a subir en GRÁFICOS.`,
      benchTitle: (label: string) => `TE RECOMENDAMOS ${label.toUpperCase()}`,
      benchBody: (fps: number, label: string) => `${fps} fps en ${label}. Haz clic para aplicar.`,
      reducedTitle: 'MOVIMIENTO REDUCIDO',
      reducedBody: 'Animaciones 3D apagadas por preferencia del sistema.',
      accessibility: 'ACCESIBILIDAD',
    },
  },
  scene: {
    inspect: '> INSPECCIONAR',
    floppy: 'DISQUETE 3½',
    terminal: 'TERMINAL',
  },
  cv: {
    metaTitle: 'CV — Diego Quiñones',
    metaDescription:
      'CV de Diego Quiñones: soporte TI, automatización con IA y desarrollo full stack. Remoto, UTC-3, inglés C2.',
    kicker: 'CV · ACTUALIZADO NOVIEMBRE 2026',
    print: 'GUARDAR COMO PDF',
    summary: 'Perfil',
    experience: 'Experiencia',
    projects: 'Proyectos',
    skills: 'Stack',
    education: 'Formación',
    certifications: 'Certificaciones',
    contact: 'Contacto',
    labels: {
      availability: 'Disponibilidad',
      rate: 'Renta',
      english: 'Inglés',
      location: 'Ubicación',
      timezone: 'Zona horaria',
      email: 'Email',
      role: 'Rol',
      impact: 'Impacto',
    },
    back: 'Volver al portfolio',
  },
  a11y: {
    skip: 'Saltar al contenido principal',
  },
};

const en: typeof es = {
  meta: {
    title: 'Diego Quiñones — AI Automation & Full-Stack Developer',
    description:
      'I automate manual operations work with AI and ship it as a web tool. IT support, a 15+ container homelab and C2 English. Available for remote work from December 2026.',
    htmlLang: 'en',
  },
  nav: {
    experience: 'EXPERIENCE',
    projects: 'PROJECTS',
    skills: 'STACK',
    contact: 'CONTACT',
    cv: 'CV',
    online: 'ONLINE',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
    switchTo: 'ES',
    switchLabel: 'View the site in Spanish',
    home: 'Back to top',
  },
  hero: {
    kicker: ['AVAILABLE DEC 1, 2026', 'REMOTE', 'UTC-3', 'C2 ENGLISH'],
    emailLabel: 'Direct contact',
    start: 'DOWNLOAD CV',
    questlog: 'SEE EXPERIENCE',
    hint: 'Open to remote AI automation and full-stack roles.',
    scroll: 'SCROLL TO EXPLORE',
    loc: 'CONCEPCIÓN · CHILE',
    stats: {
      users: 'USERS SUPPORTED',
      containers: 'SELF-HOSTED CONTAINERS',
      english: 'CERTIFIED ENGLISH',
      projects: 'LIVE PROJECTS',
    },
  },
  experience: {
    title: 'EXPERIENCE',
    tag: '2 ROLES',
    intro:
      'Two jobs, both on-site and both with the same obsession: stop repetitive work from eating hours.',
    tools: 'Tools',
    current: 'Current',
    principlesTitle: 'HOW I WORK',
    principles: [
      {
        title: 'AUTOMATE BEFORE HIRING',
        text: 'I look for the task that repeats before proposing a new tool. If something happens three times a week, it becomes a script, a template or a workflow.',
      },
      {
        title: 'AI WITH BOUNDARIES',
        text: 'I use models where judgement helps and deterministic code where accuracy is required. Any automation that touches someone else\u2019s data keeps a human review.',
      },
      {
        title: 'REAL OPS',
        text: '300+ users, night shifts and a 7 GB server at home teach you to keep things running, not just to ship them.',
      },
    ],
  },
  projects: {
    title: 'PROJECTS',
    tag: 'PROJECTS',
    intro:
      'Three things that exist and you can open right now. No mock demos, no invented metrics.',
    features: 'What it has',
    tech: 'Stack',
    caseStudy: 'VIEW CASE STUDY',
    process: 'Process overview',
    challenges: 'Challenges',
    solutions: 'Solutions',
    learnings: 'Key learnings',
    repo: 'CODE',
    demo: 'DEMO',
    impact: 'Why it matters',
    role: 'Role',
    live: 'LIVE',
    building: 'BUILDING',
    collapse: 'Collapse',
    expand: 'Expand',
  },
  skills: {
    title: 'STACK',
    tag: 'NODES',
    intro:
      'Hover a node to inspect it, drag to rotate the tree. Node size is how much I trust myself with it, not how much I like it.',
    hint: 'drag to rotate · hover a node',
    labels: {
      advanced: 'advanced',
      intermediate: 'intermediate',
      basic: 'basic',
    },
    categories: {
      Frontend: 'FRONTEND',
      Backend: 'BACKEND',
      Database: 'DATA',
      DevTools: 'TOOLING',
      Infra: 'INFRA',
      AI: 'AI',
      GameDev: 'GAMEDEV',
      Design: 'DESIGN',
      Media: 'MEDIA',
    },
  },
  contact: {
    title: 'CONTACT',
    tag: 'OPEN',
    line1: 'Need something to stop being done by hand?',
    line2: "Write to me and let's look at it =)",
    copyHint: 'click to copy · +25 XP',
    copied: '✓ COPIED',
    availability: 'Available from December 1, 2026 · Remote · UTC-3',
  },
  footer: {
    status: 'status',
    system: 'SYSTEM',
    uptime: 'UPTIME',
    online: 'ONLINE',
    operational: 'All systems operational',
    years: 'Y',
  },
  loading: {
    brand: 'BOOTING SYSTEM',
    messages: ['BOOTING…', 'MOUNTING 3D…', 'READY.'],
  },
  hud: {
    level: 'LVL',
    gfx: 'GFX',
    sfx: 'SFX',
    log: 'ACHV',
    on: 'ON',
    off: 'OFF',
    playerProgress: 'Player progress',
    experience: 'Experience',
    total: 'TOTAL',
    achievementsPanel: 'Achievements',
    graphicsPanel: 'Graphics settings',
    close: 'Close',
    graphicsTitle: 'GRAPHICS',
    achievementsTitle: 'ACHIEVEMENTS',
    panelLead:
      "Same portfolio, three GPU budgets. Pick what this device can actually handle — or run the test and we'll pick for you.",
    qualityAria: 'Graphics quality',
    fpsNow: 'FPS NOW',
    perfTest: '▶ PERFORMANCE TEST (3s)',
    perfMeasuring: 'Measuring 3s…',
    perfHelp: 'Measures real frames on this GPU and recommends a preset.',
    perfResult: (fps: number, worst: number, tier: string) =>
      `Result: <b>${fps} fps</b> average · worst frame ${worst} fps → recommended <b>${tier}</b>`,
    apply: 'Apply',
    activePreset: (label: string) => `> active preset: ${label.toLowerCase()} · applied instantly`,
    shortcuts: 'Shortcuts: <kbd>G</kbd> graphics · <kbd>A</kbd> achievements · <kbd>M</kbd> sound · <kbd>↑↑↓↓←→←→BA</kbd> 😉',
    achLead: 'Explore the portfolio to unlock these. Each one grants XP.',
    unlocked: 'OK',
    facts: {
      gpu: 'GPU',
      webgl: 'WebGL2',
      cores: 'Cores',
      ram: 'RAM',
      dpr: 'DPR',
      yes: 'yes',
      no: 'no',
      na: 'n/a',
    },
  },
  gfx: {
    low: {
      label: 'Low',
      description: 'No WebGL. Pure CSS: maximum compatibility and zero GPU cost.',
    },
    mid: {
      label: 'Medium',
      description: 'Basic 3D scene, no post-processing, no shadows. Built for laptops and phones.',
    },
    high: {
      label: 'High',
      description: 'Bloom, shadows, 3× particles, target 60 fps. Wants a dedicated GPU.',
    },
  },
  game: {
    achievements: {
      boot: { name: 'BOOT SEQUENCE', desc: 'You powered the system on.' },
      explorer: { name: 'EXPLORER', desc: 'You visited all four zones of the map.' },
      collector: { name: 'COLLECTOR', desc: 'You inspected every project.' },
      headhunter: { name: 'HEADHUNTER', desc: 'You copied the contact email.' },
      tinkerer: { name: 'TINKERER', desc: 'You changed the graphics preset by hand.' },
      benchmark: { name: 'BENCHMARKER', desc: 'You ran the performance test.' },
      archaeologist: { name: 'ARCHAEOLOGIST', desc: 'You found a floppy disk hidden in the diorama.' },
      overclocked: { name: 'OVERCLOCKED', desc: 'You set graphics to HIGH.' },
      konami: { name: '↑↑↓↓←→←→BA', desc: 'The old code still works.' },
      completionist: { name: '100%', desc: 'You unlocked everything else.' },
    },
    levelUp: {
      kicker: 'LEVEL UP',
      title: (level: number) => `LEVEL ${level}`,
      bodyHigh: 'The system is starting to respect you.',
      bodyLow: 'Keep exploring the map.',
    },
    achievementKicker: 'ACHIEVEMENT UNLOCKED',
    completion: { title: 'COMPLETIONIST', body: 'You unlocked the whole portfolio.' },
    caseStudyXp: 'CASE STUDY',
    toast: {
      graphics: 'GRAPHICS',
      quality: (label: string) => `QUALITY ${label.toUpperCase()}`,
      fallbackTitle: 'FALLING BACK TO LOW',
      fallbackBody: 'WebGL could not start on this device.',
      autoTitle: (label: string) => `DROPPING TO ${label.toUpperCase()}`,
      autoBody: (fps: number) => `${fps} fps sustained. You can go back up in GRAPHICS.`,
      benchTitle: (label: string) => `WE SUGGEST ${label.toUpperCase()}`,
      benchBody: (fps: number, label: string) => `${fps} fps on ${label}. Click to apply.`,
      reducedTitle: 'REDUCED MOTION',
      reducedBody: '3D motion is off because of your system preference.',
      accessibility: 'ACCESSIBILITY',
    },
  },
  scene: {
    inspect: '> INSPECT',
    floppy: 'FLOPPY DISK',
    terminal: 'TERMINAL',
  },
  cv: {
    metaTitle: 'CV — Diego Quiñones',
    metaDescription:
      'Diego Quiñones: IT support, AI automation and full-stack development. Remote, UTC-3, C2 English.',
    kicker: 'CV · UPDATED NOVEMBER 2026',
    print: 'SAVE AS PDF',
    summary: 'Profile',
    experience: 'Experience',
    projects: 'Projects',
    skills: 'Stack',
    education: 'Education',
    certifications: 'Certifications',
    contact: 'Contact',
    labels: {
      availability: 'Availability',
      rate: 'Rate',
      english: 'English',
      location: 'Location',
      timezone: 'Time zone',
      email: 'Email',
      role: 'Role',
      impact: 'Impact',
    },
    back: 'Back to the portfolio',
  },
  a11y: {
    skip: 'Skip to main content',
  },
};

export const ui: Record<Lang, typeof es> = { es, en };

export function normalizeLang(value?: string | null): Lang {
  return value === 'en' ? 'en' : 'es';
}

export function getDict(lang?: string | null): typeof es {
  return ui[normalizeLang(lang)];
}

/** Locale used by the client scripts, read from <html lang>. */
export function clientLang(): Lang {
  if (typeof document === 'undefined') return 'es';
  return normalizeLang(document.documentElement.getAttribute('lang')?.slice(0, 2));
}

export function tClient(): typeof es {
  return ui[clientLang()];
}
