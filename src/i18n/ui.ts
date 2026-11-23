/**
 * UI copy for every language. `es` is the source of truth: `en` is typed
 * against it, so a missing key is a TypeScript error instead of a blank label.
 */

export type Lang = 'es' | 'en';

const es = {
  meta: {
    title: 'Yeyobitz — Soporte IT y desarrollo full stack',
    description:
      'Soporte IT y desarrollador full stack en Concepción, Chile. Portafolio 3D interactivo: homelab, proyectos y un diorama que puedes explorar.',
    htmlLang: 'es-CL',
  },
  nav: {
    about: 'SOBRE MÍ',
    quests: 'MISIONES',
    skills: 'HABILIDADES',
    contact: 'CONTACTO',
    online: 'EN LÍNEA',
    openMenu: 'Abrir menú',
    closeMenu: 'Cerrar menú',
    switchTo: 'EN',
    switchLabel: 'Ver el sitio en inglés',
    home: 'Volver arriba',
  },
  hero: {
    kicker: 'TURNO NOCTURNO · SECTOR 07 · BUILD 2.0',
    start: 'EMPEZAR',
    questlog: 'MISIONES',
    hint: '◐ HAZ CLIC EN EL DIORAMA · BUSCA LOS DISQUETES',
    scroll: 'BAJA PARA EXPLORAR',
    loc: 'CONCEPCIÓN · CHILE · UTC-3',
    years: 'AÑOS',
    quests: 'MISIONES',
    containers: 'CONTENEDORES',
    coffee: 'CAFÉ',
  },
  about: {
    title: 'PERFIL_JUGADOR',
    tag: 'EN ESPERA',
    note: 'Casi todo lo que sé salió de romper mi propio homelab a las 2 de la mañana y arreglarlo antes del amanecer. Me gustan las herramientas que no se caen, las interfaces que se explican solas y el código que otro puede leer sin sufrir.',
    sheetAria: 'Ficha del personaje',
    sheet: {
      class: 'CLASE',
      role: 'ROL',
      base: 'BASE',
      status: 'ESTADO',
      loadout: 'EQUIPO',
      side: 'MISIONES',
    },
    values: {
      class: 'Soporte / Builder',
      status: 'Disponible',
      loadout: 'Linux · Docker · TS · Python',
      shipped: 'lanzados',
    },
    statsAria: 'Atributos',
    stats: {
      linux: 'LINUX / INFRA',
      automation: 'AUTOMATIZACIÓN',
      frontend: 'FRONTEND',
      backend: 'BACKEND',
      gamedev: 'GAMEDEV',
    },
    perks: [
      {
        title: 'HOMELAB',
        text: 'Más de 15 contenedores en un servidor Ubuntu: Plex, Jellyfin, la familia *arr, Gitea y monitoreo. Todo detrás de un reverse proxy que también mantengo yo.',
      },
      {
        title: 'MENTALIDAD DE SOPORTE',
        text: 'Escribo el runbook, no solo el arreglo. Los tickets me enseñaron a reproducir primero, adivinar después y documentar para que nadie tenga que preguntar dos veces.',
      },
      {
        title: 'ENTREGO COSAS',
        text: 'Juegos, dashboards, bots, este portfolio. Alcance chico y terminado le gana a un repo perfecto que nunca sale de localhost.',
      },
    ],
  },
  projects: {
    title: 'REGISTRO_MISIONES',
    tag: 'MISIONES',
    intro:
      'Cada tarjeta es una misión que terminé y publiqué. Si te quedas un momento en ella, ganas su XP; si no, salta directo a la demo.',
    features: 'Lo importante',
    tech: 'Tecnologías',
    caseStudy: 'VER EL CASO',
    process: 'Cómo lo hice',
    challenges: 'Desafíos',
    solutions: 'Soluciones',
    learnings: 'Lo que aprendí',
    legendary: 'MISIÓN ACTIVA · LEGENDARIA',
    archived: 'MISIÓN SECUNDARIA · ARCHIVADA',
    demo: 'Demo',
    github: 'GitHub',
    collapse: 'Contraer',
    expand: 'Expandir',
  },
  skills: {
    title: 'ÁRBOL_HABILIDADES',
    tag: 'NODOS',
    intro:
      'Pasa el cursor por un nodo para inspeccionarlo y arrastra para girar el árbol. El tamaño del nodo indica cuánto confío en esa herramienta, no cuánto me gusta.',
    hint: 'arrastra para girar · pasa el mouse por un nodo',
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
      GameDev: 'GAMEDEV',
      Design: 'DISEÑO',
      Media: 'MEDIA',
    },
  },
  contact: {
    title: 'INVOCAR',
    tag: 'ABIERTO',
    line1: '¿Tienes algo en mente?',
    line2: 'Hagámoslo =)',
    copyHint: 'haz clic para copiar · +25 XP',
    copied: '✓ COPIADO',
    mailSubject: 'Hola Diego',
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
      collector: { name: 'COLECCIONISTA', desc: 'Revisaste todas las misiones.' },
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
  a11y: {
    skip: 'Saltar al contenido principal',
  },
};

const en: typeof es = {
  meta: {
    title: 'Yeyobitz — IT Support & Full-Stack Developer',
    description:
      'IT support specialist and full-stack developer based in Concepción, Chile. Interactive 3D portfolio: homelab, projects and a diorama you can explore.',
    htmlLang: 'en',
  },
  nav: {
    about: 'ABOUT',
    quests: 'QUESTS',
    skills: 'HABILIDADES',
    contact: 'CONTACT',
    online: 'ONLINE',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
    switchTo: 'ES',
    switchLabel: 'Ver el sitio en español',
    home: 'Back to top',
  },
  hero: {
    kicker: 'NIGHT SHIFT · SECTOR 07 · BUILD 2.0',
    start: 'START GAME',
    questlog: 'QUEST LOG',
    hint: '◐ CLICK THE DIORAMA · FIND THE FLOPPIES',
    scroll: 'SCROLL TO EXPLORE',
    loc: 'CONCEPCIÓN · CHILE · UTC-3',
    years: 'YEARS',
    quests: 'QUESTS',
    containers: 'CONTAINERS',
    coffee: 'COFFEE',
  },
  about: {
    title: 'PLAYER_PROFILE',
    tag: 'IDLE',
    note: "Most of what I know came from breaking my own homelab at 2 AM and fixing it before sunrise. I like tools that stay up, interfaces that explain themselves, and code somebody else can read without suffering.",
    sheetAria: 'Character sheet',
    sheet: {
      class: 'CLASS',
      role: 'ROLE',
      base: 'BASE',
      status: 'STATUS',
      loadout: 'LOADOUT',
      side: 'SIDE QUESTS',
    },
    values: {
      class: 'Support / Builder',
      status: 'Open to work',
      loadout: 'Linux · Docker · TS · Python',
      shipped: 'shipped',
    },
    statsAria: 'Attributes',
    stats: {
      linux: 'LINUX / INFRA',
      automation: 'AUTOMATION',
      frontend: 'FRONTEND',
      backend: 'BACKEND',
      gamedev: 'GAMEDEV',
    },
    perks: [
      {
        title: 'HOMELAB',
        text: '15+ containers on an Ubuntu server: Plex, Jellyfin, the *arr stack, Gitea and monitoring. Everything behind a reverse proxy I also maintain.',
      },
      {
        title: 'SUPPORT MINDSET',
        text: 'I write the runbook, not just the fix. Tickets taught me to reproduce first, guess later, and document so nobody has to ask twice.',
      },
      {
        title: 'SHIPS THINGS',
        text: 'Games, dashboards, bots, this portfolio. Small scope, finished and deployed beats a perfect repo that never leaves localhost.',
      },
    ],
  },
  projects: {
    title: 'QUEST_LOG',
    tag: 'QUESTS',
    intro:
      'Every card is a quest I actually finished and shipped. Dwell on one to collect its XP, or jump straight to the live demo.',
    features: 'Key features',
    tech: 'Technologies',
    caseStudy: 'VIEW CASE STUDY',
    process: 'Process overview',
    challenges: 'Challenges',
    solutions: 'Solutions',
    learnings: 'Key learnings',
    legendary: 'ACTIVE QUEST · LEGENDARY',
    archived: 'SIDE QUEST · ARCHIVED',
    demo: 'Demo',
    github: 'GitHub',
    collapse: 'Collapse',
    expand: 'Expand',
  },
  skills: {
    title: 'SKILL_TREE',
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
      GameDev: 'GAMEDEV',
      Design: 'DESIGN',
      Media: 'MEDIA',
    },
  },
  contact: {
    title: 'SUMMON',
    tag: 'OPEN',
    line1: 'Have something in mind?',
    line2: "Let's do it =)",
    copyHint: 'click to copy · +25 XP',
    copied: '✓ COPIED',
    mailSubject: 'Hi Diego',
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
      collector: { name: 'COLLECTOR', desc: 'You inspected every project quest.' },
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
