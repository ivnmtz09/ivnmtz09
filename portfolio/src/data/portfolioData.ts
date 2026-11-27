export type Lang = 'es' | 'en';

export interface ProjectItem {
  id: string;
  title: string;
  subtitle: Record<Lang, string>;
  role: Record<Lang, string>;
  year: string;
  category: 'fullstack' | 'backend' | 'ecosystem';
  description: Record<Lang, string>;
  highlights: Record<Lang, string[]>;
  architecture: Record<Lang, {
    backend: string;
    frontend: string;
    database: string;
    deployment: string;
  }>;
  stack: string[];
  repoUrl: string;
  secondaryRepoUrl?: string;
  secondaryRepoLabel?: Record<Lang, string>;
  featured?: boolean;
}

export interface SkillGroup {
  id: string;
  label: Record<Lang, string>;
  items: string[];
}

export interface TimelineEntry {
  title: Record<Lang, string>;
  org: string;
  period: string;
  location?: string;
  bullets: Record<Lang, string[]>;
}

export interface CertificationItem {
  title: string;
  issuer: string;
  year: string;
  tag: Record<Lang, string>;
}

export const PROFILE = {
  name: 'Iván Jesús Martínez Molina',
  shortName: 'Iván Martínez',
  handle: '@ivnmtz09',
  email: 'ivanjmm01@gmail.com',
  phone: '+57 322 680 0403',
  phoneRaw: '573226800403',
  location: 'Riohacha, La Guajira, Colombia',
  university: 'Universidad de La Guajira',
  github: 'https://github.com/ivnmtz09',
  linkedin: 'https://www.linkedin.com/in/ivan-jesus-martinez-molina-0580411b5/',
  typingRoles: {
    es: [
      'Desarrollador Full Stack Junior',
      'Estudiante de Ingeniería de Sistemas (10.º sem.)',
      'Arquitecto Backend en Django & Spring Boot',
      'Constructor de Interfaces en React & Angular',
    ],
    en: [
      'Junior Full Stack Software Developer',
      'Systems Engineering Student (10th Semester)',
      'Backend Architect · Django & Spring Boot',
      'Frontend Builder · React & Angular',
    ],
  },
};

export const UI_COPY: Record<Lang, {
  nav: {
    about: string;
    projects: string;
    skills: string;
    trajectory: string;
    contact: string;
    hireMe: string;
  };
  hero: {
    statusBadge: string;
    greeting: string;
    summary: string;
    ctaProjects: string;
    ctaCopyEmail: string;
    copied: string;
    terminalTitle: string;
  };
  about: {
    eyebrow: string;
    title: string;
    paragraphs: string[];
    metrics: { value: string; label: string; detail: string }[];
  };
  projects: {
    eyebrow: string;
    title: string;
    subtitle: string;
    filters: { id: 'all' | 'fullstack' | 'backend' | 'ecosystem'; label: string }[];
    viewArchitecture: string;
    viewRepo: string;
    modal: {
      architectureTitle: string;
      backend: string;
      frontend: string;
      database: string;
      deployment: string;
      highlights: string;
      close: string;
    };
  };
  skills: {
    eyebrow: string;
    title: string;
    subtitle: string;
    softSkillsTitle: string;
    languagesTitle: string;
    languages: { name: string; level: string }[];
  };
  trajectory: {
    eyebrow: string;
    title: string;
    experienceTitle: string;
    educationTitle: string;
    certificationsTitle: string;
    certNote: string;
  };
  contact: {
    eyebrow: string;
    title: string;
    subtitle: string;
    emailLabel: string;
    phoneLabel: string;
    locationLabel: string;
    copyBtn: string;
    copiedBtn: string;
    formTitle: string;
    namePlaceholder: string;
    subjectPlaceholder: string;
    messagePlaceholder: string;
    sendMailto: string;
    copyMessage: string;
  };
  footer: {
    status: string;
    builtWith: string;
  };
}> = {
  es: {
    nav: {
      about: 'Sobre mí',
      projects: 'Proyectos',
      skills: 'Stack',
      trajectory: 'Trayectoria',
      contact: 'Contacto',
      hireMe: 'Hablemos',
    },
    hero: {
      statusBadge: 'Disponible para práctica profesional o primer empleo',
      greeting: 'Hola, soy',
      summary:
        'Estudiante de décimo semestre de Ingeniería de Sistemas en la Universidad de La Guajira. Construyo APIs REST resilientes en Django y Spring Boot e interfaces modernas en React y Angular, respaldado por ~13 años de experiencia operativa, atención al cliente y soporte técnico.',
      ctaProjects: 'Explorar proyectos',
      ctaCopyEmail: 'Copiar correo',
      copied: '¡Correo copiado!',
      terminalTitle: 'ivnmtz09@workstation: ~',
    },
    about: {
      eyebrow: '// 01. Perfil Profesional',
      title: 'Ingeniería de software con disciplina operativa real',
      paragraphs: [
        'Mi enfoque combina rigor técnico en arquitectura backend, modelado relacional (PostgreSQL / MySQL) y desarrollo frontend reactivo con una sólida trayectoria en entornos de trabajo reales.',
        'Durante cerca de 13 años como Auxiliar Operativo y de Soporte Interno, gestioné inventarios, conciliación diaria, pagos digitales y soporte de primer nivel. Esa experiencia se traduce hoy en código mantenible, comunicación asertiva con equipos Scrum y capacidad para resolver problemas bajo presión.',
      ],
      metrics: [
        {
          value: '10.º Sem.',
          label: 'Ingeniería de Sistemas',
          detail: 'Universidad de La Guajira (2022–Actualidad)',
        },
        {
          value: '~13 Años',
          label: 'Operación & Soporte',
          detail: 'Inventarios, caja, clientes y hardware/LAN',
        },
        {
          value: '4+ Sistemas',
          label: 'Proyectos Full-Stack',
          detail: 'SaaS, EdTech, Reservas y Preservación Cultural',
        },
        {
          value: 'SDD + Scrum',
          label: 'Flujo de Ingeniería',
          detail: 'Spec Driven Development, Git PRs y pruebas API',
        },
      ],
    },
    projects: {
      eyebrow: '// 02. Proyectos Destacados',
      title: 'Sistemas diseñados de extremo a extremo',
      subtitle:
        'Plataformas reales construidas con arquitecturas desacopladas, autenticación segura y foco en la experiencia de usuario.',
      filters: [
        { id: 'all', label: 'Todos' },
        { id: 'fullstack', label: 'Full-Stack & SaaS' },
        { id: 'ecosystem', label: 'Ecosistema Multi-cliente' },
        { id: 'backend', label: 'Enterprise & APIs' },
      ],
      viewArchitecture: 'Ver arquitectura',
      viewRepo: 'Repositorio',
      modal: {
        architectureTitle: 'Arquitectura del sistema',
        backend: 'Backend & API',
        frontend: 'Frontend / Cliente',
        database: 'Persistencia',
        deployment: 'Despliegue & Flujo',
        highlights: 'Logros clave',
        close: 'Cerrar',
      },
    },
    skills: {
      eyebrow: '// 03. Stack Tecnológico',
      title: 'Herramientas, lenguajes y metodología',
      subtitle:
        'Un ecosistema enfocado en backend robusto, interfaces modernas, contenedores y buenas prácticas de ingeniería.',
      softSkillsTitle: 'Habilidades Blandas',
      languagesTitle: 'Idiomas',
      languages: [
        { name: 'Español', level: 'Nativo' },
        { name: 'Inglés', level: 'Básico · Lectura de documentación técnica' },
      ],
    },
    trajectory: {
      eyebrow: '// 04. Trayectoria',
      title: 'Experiencia, formación y certificaciones',
      experienceTitle: 'Experiencia Laboral',
      educationTitle: 'Formación Académica',
      certificationsTitle: 'Certificaciones y Ponencias',
      certNote: 'Certificados y referencias disponibles a solicitud.',
    },
    contact: {
      eyebrow: '// 05. Contacto',
      title: 'Construyamos algo sólido juntos',
      subtitle:
        'Busco una práctica profesional o mi primer empleo como Desarrollador Full Stack o Backend Junior. Respondo rápido por correo, LinkedIn o WhatsApp.',
      emailLabel: 'Correo electrónico',
      phoneLabel: 'Teléfono / WhatsApp',
      locationLabel: 'Ubicación',
      copyBtn: 'Copiar',
      copiedBtn: 'Copiado',
      formTitle: 'Enviar mensaje rápido',
      namePlaceholder: 'Tu nombre o empresa',
      subjectPlaceholder: 'Asunto (ej. Oportunidad práctica / Junior Dev)',
      messagePlaceholder: 'Cuéntame sobre el equipo, proyecto o vacante...',
      sendMailto: 'Abrir en cliente de correo',
      copyMessage: 'Copiar texto',
    },
    footer: {
      status: '[SYSTEM STATUS]: OPERATIONAL • KERNEL 6.x • READY TO DEPLOY',
      builtWith: 'Diseñado y desarrollado con React, TypeScript & Tailwind CSS por Iván Martínez • 2026',
    },
  },
  en: {
    nav: {
      about: 'About',
      projects: 'Projects',
      skills: 'Stack',
      trajectory: 'Background',
      contact: 'Contact',
      hireMe: 'Let’s talk',
    },
    hero: {
      statusBadge: 'Open to internships or junior developer roles',
      greeting: 'Hi, I’m',
      summary:
        '10th-semester Systems Engineering student at Universidad de La Guajira. I build resilient REST APIs with Django and Spring Boot alongside modern React and Angular interfaces, backed by ~13 years of real-world operations, customer service, and IT support.',
      ctaProjects: 'Explore projects',
      ctaCopyEmail: 'Copy email',
      copied: 'Email copied!',
      terminalTitle: 'ivnmtz09@workstation: ~',
    },
    about: {
      eyebrow: '// 01. Professional Profile',
      title: 'Software engineering grounded in real-world operations',
      paragraphs: [
        'My approach blends technical rigor in backend architecture, relational modeling (PostgreSQL / MySQL), and reactive frontend engineering with years of hands-on operational responsibility.',
        'Over nearly 13 years as an Operations & Internal Support Assistant, I managed inventory audits, daily cash reconciliation, digital payments, and tier-1 IT support. Today that translates into maintainable code, clear Scrum collaboration, and calm problem-solving under pressure.',
      ],
      metrics: [
        {
          value: '10th Sem.',
          label: 'Systems Engineering',
          detail: 'Universidad de La Guajira (2022–Present)',
        },
        {
          value: '~13 Years',
          label: 'Operations & Support',
          detail: 'Inventory, POS reconciliation & hardware/LAN',
        },
        {
          value: '4+ Systems',
          label: 'Full-Stack Projects',
          detail: 'SaaS, EdTech, Bookings & Cultural Preservation',
        },
        {
          value: 'SDD + Scrum',
          label: 'Engineering Flow',
          detail: 'Spec Driven Development, Git PRs & API testing',
        },
      ],
    },
    projects: {
      eyebrow: '// 02. Featured Systems',
      title: 'End-to-end engineered platforms',
      subtitle:
        'Real-world applications built with decoupled architectures, secure authentication, and clean user experiences.',
      filters: [
        { id: 'all', label: 'All' },
        { id: 'fullstack', label: 'Full-Stack & SaaS' },
        { id: 'ecosystem', label: 'Multi-Client Ecosystem' },
        { id: 'backend', label: 'Enterprise & APIs' },
      ],
      viewArchitecture: 'Inspect architecture',
      viewRepo: 'Repository',
      modal: {
        architectureTitle: 'System Architecture',
        backend: 'Backend & API',
        frontend: 'Frontend / Client',
        database: 'Persistence',
        deployment: 'Deployment & Workflow',
        highlights: 'Key Highlights',
        close: 'Close',
      },
    },
    skills: {
      eyebrow: '// 03. Tech Stack',
      title: 'Tools, languages & engineering practices',
      subtitle:
        'A focused stack for resilient backends, responsive frontends, containerization, and disciplined delivery.',
      softSkillsTitle: 'Soft Skills',
      languagesTitle: 'Languages',
      languages: [
        { name: 'Spanish', level: 'Native' },
        { name: 'English', level: 'Basic · Technical documentation reading' },
      ],
    },
    trajectory: {
      eyebrow: '// 04. Background',
      title: 'Experience, education & certifications',
      experienceTitle: 'Work Experience',
      educationTitle: 'Education',
      certificationsTitle: 'Certifications & Talks',
      certNote: 'Certificates and references available upon request.',
    },
    contact: {
      eyebrow: '// 05. Contact',
      title: 'Let’s build something reliable together',
      subtitle:
        'I am looking for an internship or my first role as a Junior Full Stack or Backend Developer. Reach out via email, LinkedIn, or WhatsApp.',
      emailLabel: 'Email',
      phoneLabel: 'Phone / WhatsApp',
      locationLabel: 'Location',
      copyBtn: 'Copy',
      copiedBtn: 'Copied',
      formTitle: 'Quick message',
      namePlaceholder: 'Your name or company',
      subjectPlaceholder: 'Subject (e.g. Junior Dev / Internship opportunity)',
      messagePlaceholder: 'Tell me about your team, project, or role...',
      sendMailto: 'Open in email client',
      copyMessage: 'Copy text',
    },
    footer: {
      status: '[SYSTEM STATUS]: OPERATIONAL • KERNEL 6.x • READY TO DEPLOY',
      builtWith: 'Designed & built with React, TypeScript & Tailwind CSS by Iván Martínez • 2026',
    },
  },
};

export const PROJECTS: ProjectItem[] = [
  {
    id: 'edubid',
    title: 'EduBid',
    subtitle: {
      es: 'Plataforma SaaS de Gamificación Educativa (Proyecto de Grado)',
      en: 'Educational Gamification SaaS Platform (Capstone Project)',
    },
    role: {
      es: 'Desarrollador Backend',
      en: 'Backend Developer',
    },
    year: '2026',
    category: 'fullstack',
    featured: true,
    description: {
      es: 'Plataforma SaaS educativa diseñada para impulsar la motivación y el rendimiento académico mediante tokens virtuales, economía de incentivos y subastas de beneficios en tiempo real.',
      en: 'Educational SaaS platform designed to boost academic motivation through virtual tokens, an incentive economy, and real-time reward auctions.',
    },
    highlights: {
      es: [
        'API REST robusta con Django 5.2, Django REST Framework y MySQL 8 / PostgreSQL.',
        'Autenticación híbrida segura con JWT y Google OAuth.',
        'Backend desplegado en Railway y frontend en Netlify (React + Tailwind CSS + Vite, trabajo en equipo).',
      ],
      en: [
        'Resilient REST API built with Django 5.2, Django REST Framework, and MySQL 8 / PostgreSQL.',
        'Secure hybrid authentication with JWT and Google OAuth.',
        'Backend deployed on Railway and frontend on Netlify (React + Tailwind CSS + Vite, team collaboration).',
      ],
    },
    architecture: {
      es: {
        backend: 'Django 5.2 + Django REST Framework + JWT + Google OAuth',
        frontend: 'React 18 + Vite + Tailwind CSS',
        database: 'MySQL 8 / PostgreSQL',
        deployment: 'Railway (API) & Netlify (Web Client)',
      },
      en: {
        backend: 'Django 5.2 + Django REST Framework + JWT + Google OAuth',
        frontend: 'React 18 + Vite + Tailwind CSS',
        database: 'MySQL 8 / PostgreSQL',
        deployment: 'Railway (API) & Netlify (Web Client)',
      },
    },
    stack: ['Python', 'Django 5.2', 'DRF', 'React', 'Vite', 'Tailwind CSS', 'MySQL 8', 'JWT', 'Google OAuth'],
    repoUrl: 'https://github.com/ivnmtz09/edubid',
  },
  {
    id: 'yonna-akademia',
    title: 'Yonna Akademia',
    subtitle: {
      es: 'Ecosistema de Preservación Cultural & Gamificación (Proyecto II)',
      en: 'Cultural Preservation & Gamification Ecosystem (Project II)',
    },
    role: {
      es: 'Desarrollador Full-Stack',
      en: 'Full-Stack Developer',
    },
    year: '2026',
    category: 'ecosystem',
    featured: true,
    description: {
      es: 'Plataforma web y móvil gamificada para aprender wayuunaiki desde el español. Integra módulos bilingües, puntos de experiencia, rachas, niveles y logros.',
      en: 'Gamified web and mobile ecosystem for learning Wayuunaiki from Spanish, featuring bilingual modules, XP, streaks, levels, and achievements.',
    },
    highlights: {
      es: [
        'Arquitectura distribuida: API REST en Django 5 con JWT y PostgreSQL.',
        'Panel web en Angular 21 con módulos bilingües y cliente móvil en Flutter (yonna_app).',
        'Desarrollo iterativo gestionado bajo metodología ágil Scrum.',
      ],
      en: [
        'Distributed architecture: Django 5 REST API with JWT and PostgreSQL.',
        'Angular 21 web platform with bilingual modules plus Flutter mobile client (yonna_app).',
        'Iterative delivery managed with Scrum methodology.',
      ],
    },
    architecture: {
      es: {
        backend: 'Django 5 + Django REST Framework + JWT',
        frontend: 'Angular 21 (Web) + Flutter (Móvil)',
        database: 'PostgreSQL',
        deployment: 'Arquitectura desacoplada multi-cliente + Scrum',
      },
      en: {
        backend: 'Django 5 + Django REST Framework + JWT',
        frontend: 'Angular 21 (Web) + Flutter (Mobile)',
        database: 'PostgreSQL',
        deployment: 'Decoupled multi-client architecture + Scrum',
      },
    },
    stack: ['Django 5', 'Angular 21', 'Flutter', 'PostgreSQL', 'JWT', 'Scrum'],
    repoUrl: 'https://github.com/ivnmtz09/yonna_akademia',
    secondaryRepoUrl: 'https://github.com/ivnmtz09/yonna_app',
    secondaryRepoLabel: {
      es: 'App Móvil (Flutter)',
      en: 'Mobile App (Flutter)',
    },
  },
  {
    id: 'reservas-fullstack',
    title: 'Sistema de Reservas Full-Stack',
    subtitle: {
      es: 'Enterprise Booking Management System',
      en: 'Enterprise Booking Management System',
    },
    role: {
      es: 'Desarrollador Full-Stack',
      en: 'Full-Stack Developer',
    },
    year: '2026',
    category: 'backend',
    description: {
      es: 'Sistema empresarial para la gestión, calendarización y persistencia transaccional de reservas de alta concurrencia con arquitectura desacoplada.',
      en: 'Enterprise booking system engineered for scheduling and transactional persistence under high concurrency with a decoupled architecture.',
    },
    highlights: {
      es: [
        'Backend empresarial en Java con Spring Boot 4 y persistencia en PostgreSQL 18.',
        'Frontend reactivo desacoplado en Angular 21.',
        'Control transaccional y modelado relacional orientado a integridad de datos.',
      ],
      en: [
        'Enterprise Java backend with Spring Boot 4 and PostgreSQL 18 persistence.',
        'Decoupled reactive frontend built with Angular 21.',
        'Transactional control and relational modeling focused on data integrity.',
      ],
    },
    architecture: {
      es: {
        backend: 'Java + Spring Boot 4 + API REST',
        frontend: 'Angular 21 + TypeScript',
        database: 'PostgreSQL 18',
        deployment: 'Arquitectura empresarial desacoplada',
      },
      en: {
        backend: 'Java + Spring Boot 4 + REST API',
        frontend: 'Angular 21 + TypeScript',
        database: 'PostgreSQL 18',
        deployment: 'Decoupled enterprise architecture',
      },
    },
    stack: ['Java', 'Spring Boot 4', 'Angular 21', 'TypeScript', 'PostgreSQL 18'],
    repoUrl: 'https://github.com/ivnmtz09/Curso-FullStack-Reservas',
  },
  {
    id: 'gym-tracker',
    title: 'Gym Tracker SaaS',
    subtitle: {
      es: 'Fitness & Facility Management Platform',
      en: 'Fitness & Facility Management Platform',
    },
    role: {
      es: 'Desarrollador Full-Stack',
      en: 'Full-Stack Developer',
    },
    year: '2025–2026',
    category: 'fullstack',
    description: {
      es: 'Solución SaaS orientada al seguimiento biométrico, rutinas personalizadas, control de usuarios y analítica de desempeño para centros deportivos.',
      en: 'SaaS platform for biometric tracking, custom workout routines, member management, and performance analytics for athletic facilities.',
    },
    highlights: {
      es: [
        'API REST modular construida con Node.js y JavaScript.',
        'Gestión de métricas biométricas, rutinas y seguimiento de progreso.',
        'Diseño orientado a escalabilidad para múltiples instalaciones deportivas.',
      ],
      en: [
        'Modular REST API built with Node.js and JavaScript.',
        'Biometric metrics, workout routines, and progress tracking.',
        'Scalable design tailored for multi-facility gym operations.',
      ],
    },
    architecture: {
      es: {
        backend: 'Node.js + Express + REST API',
        frontend: 'JavaScript + Interfaz Web',
        database: 'Persistencia relacional / API',
        deployment: 'Arquitectura SaaS modular',
      },
      en: {
        backend: 'Node.js + Express + REST API',
        frontend: 'JavaScript + Web UI',
        database: 'Relational / API Persistence',
        deployment: 'Modular SaaS architecture',
      },
    },
    stack: ['JavaScript', 'Node.js', 'Express', 'REST API'],
    repoUrl: 'https://github.com/ivnmtz09/gym-tracker',
  },
];

export const SKILL_GROUPS: SkillGroup[] = [
  {
    id: 'languages',
    label: { es: 'Lenguajes', en: 'Languages' },
    items: ['Python', 'JavaScript', 'TypeScript', 'Java', 'Dart', 'C++', 'Bash'],
  },
  {
    id: 'backend',
    label: { es: 'Backend & APIs', en: 'Backend & APIs' },
    items: ['Django', 'Django REST Framework', 'Spring Boot', 'Node.js', 'Express', 'API REST', 'JWT', 'Google OAuth', 'Swagger'],
  },
  {
    id: 'frontend',
    label: { es: 'Frontend & Móvil', en: 'Frontend & Mobile' },
    items: ['React 18', 'Angular', 'Vite', 'Tailwind CSS', 'Axios', 'Next.js', 'Flutter'],
  },
  {
    id: 'databases',
    label: { es: 'Bases de Datos', en: 'Databases' },
    items: ['PostgreSQL', 'MySQL', 'Firebase', 'Supabase', 'SQLite', 'SQL básico'],
  },
  {
    id: 'tools',
    label: { es: 'Herramientas & DevOps', en: 'Tooling & DevOps' },
    items: ['Git', 'GitHub', 'GitHub Actions', 'Docker', 'Linux', 'Postman', 'Bruno', 'Railway', 'Netlify', 'VS Code', 'Antigravity', 'OpenCode'],
  },
  {
    id: 'methods',
    label: { es: 'Métodos & Soporte', en: 'Methods & IT Support' },
    items: ['Scrum', 'Spec Driven Development (SDD)', 'MVC', 'Ramas & Pull Requests', 'Pruebas de API', 'Hardware & SO', 'Redes LAN básicas'],
  },
];

export const SOFT_SKILLS: Record<Lang, string[]> = {
  es: [
    'Trabajo en equipo',
    'Aprendizaje rápido',
    'Pensamiento analítico',
    'Comunicación asertiva',
    'Atención al cliente',
    'Resolución de problemas bajo presión',
    'Sensibilidad intercultural',
  ],
  en: [
    'Teamwork',
    'Fast learner',
    'Analytical thinking',
    'Assertive communication',
    'Customer service',
    'Problem solving under pressure',
    'Intercultural sensitivity',
  ],
};

export const EXPERIENCE: TimelineEntry[] = [
  {
    title: {
      es: 'Auxiliar Operativo y de Soporte Interno',
      en: 'Operations & Internal IT Support Assistant',
    },
    org: 'Tienda donde Iván',
    location: 'Riohacha, Colombia',
    period: '2012 – 2025',
    bullets: {
      es: [
        'Control de inventarios, relación con proveedores y auditorías de existencias para decidir compras.',
        'Caja y conciliación diaria, gestión de pagos digitales (Nequi y transferencias) y soporte técnico de primer nivel (hardware, sistemas operativos y redes LAN).',
      ],
      en: [
        'Managed inventory control, supplier coordination, and stock audits to guide purchasing decisions.',
        'Handled daily POS cash reconciliation, digital payments (Nequi & bank transfers), and tier-1 IT support (hardware, OS, and basic LAN).',
      ],
    },
  },
];

export const EDUCATION: TimelineEntry[] = [
  {
    title: {
      es: 'Ingeniería de Sistemas (10.º semestre)',
      en: 'B.S. in Systems Engineering (10th Semester)',
    },
    org: 'Universidad de La Guajira',
    period: '2022 – Actualidad',
    bullets: {
      es: ['Enfoque en arquitectura de software, bases de datos relacionales, desarrollo web/móvil y proyectos de impacto regional.'],
      en: ['Focused on software architecture, relational databases, web/mobile engineering, and regional impact projects.'],
    },
  },
  {
    title: {
      es: 'Técnico en Manejo Ambiental',
      en: 'Environmental Management Technician',
    },
    org: 'SENA',
    period: '2019',
    bullets: {
      es: ['Formación técnica complementaria en gestión de procesos y normativa ambiental.'],
      en: ['Technical training in process management and environmental standards.'],
    },
  },
  {
    title: {
      es: 'Bachiller Académico',
      en: 'High School Diploma',
    },
    org: 'I. E. Livio Reginaldo Fischione',
    period: '2019',
    bullets: {
      es: ['Riohacha, La Guajira.'],
      en: ['Riohacha, La Guajira.'],
    },
  },
];

export const CERTIFICATIONS: CertificationItem[] = [
  {
    title: 'Enterprise Full Stack con Spring Boot 4 y Angular 21',
    issuer: 'Dev Senior Code',
    year: '2026',
    tag: { es: 'Full-Stack Enterprise', en: 'Full-Stack Enterprise' },
  },
  {
    title: 'Software Architect Mindset Workshop',
    issuer: 'Dev Senior Code',
    year: '2026',
    tag: { es: 'Arquitectura', en: 'Architecture' },
  },
  {
    title: 'Ponente en Ingenia el Futuro',
    issuer: 'Universidad de La Guajira',
    year: '2026',
    tag: { es: 'Ponencia', en: 'Speaker' },
  },
  {
    title: 'Desarrollo Productivo: Software y Hardware (156 h)',
    issuer: 'ZASCA',
    year: '2025',
    tag: { es: '156 Horas', en: '156 Hours' },
  },
];
