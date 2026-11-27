export type Lang = 'es' | 'en';

export type ProjectCategory = 'web' | 'multiplatform';
export type ProjectFilter = 'all' | ProjectCategory;

export interface ProjectItem {
  id: string;
  title: string;
  subtitle: Record<Lang, string>;
  role: Record<Lang, string>;
  year: string;
  category: ProjectCategory;
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
    es: ['Desarrollador Full Stack Junior', 'Estudiante de Ingeniería de Sistemas'],
    en: ['Junior Full Stack Developer', 'Systems Engineering Student'],
  },
};

export const PROJECTS: ProjectItem[] = [
  {
    id: 'edubid',
    title: 'EduBid',
    subtitle: { es: 'Proyecto de grado', en: 'Capstone project' },
    role: { es: 'Desarrollo del servidor', en: 'Backend development' },
    year: '2026',
    category: 'web',
    featured: true,
    description: {
      es: 'Los alumnos ganan puntos y pujan por beneficios en vivo.',
      en: 'Students earn points and bid on rewards in real time.',
    },
    highlights: {
      es: ['Puntos por logros académicos.', 'Subastas de beneficios en vivo.'],
      en: ['Points for academic achievements.', 'Live reward auctions.'],
    },
    architecture: {
      es: {
        backend: 'Django REST Framework y acceso con Google',
        frontend: 'React, Vite y Tailwind CSS',
        database: 'MySQL y PostgreSQL',
        deployment: 'Railway (servidor) y Netlify (web)',
      },
      en: {
        backend: 'Django REST Framework and Google sign-in',
        frontend: 'React, Vite, and Tailwind CSS',
        database: 'MySQL and PostgreSQL',
        deployment: 'Railway (server) and Netlify (web)',
      },
    },
    stack: ['Python', 'Django', 'React', 'Tailwind CSS', 'MySQL'],
    repoUrl: 'https://github.com/ivnmtz09/edubid',
  },
  {
    id: 'yonna-akademia',
    title: 'Yonna Akademia',
    subtitle: { es: 'Aprendizaje de wayuunaiki', en: 'Wayuunaiki learning' },
    role: { es: 'Desarrollo web y móvil', en: 'Web and mobile development' },
    year: '2026',
    category: 'multiplatform',
    featured: true,
    description: {
      es: 'Wayuunaiki en web y app, con lecciones, niveles y logros.',
      en: 'Wayuunaiki lessons, levels and achievements on web and mobile.',
    },
    highlights: {
      es: ['Lecciones interactivas desde el español.', 'Rachas para sostener el hábito.'],
      en: ['Interactive lessons for Spanish speakers.', 'Streaks to build a learning habit.'],
    },
    architecture: {
      es: {
        backend: 'Django REST Framework',
        frontend: 'Angular (web) y Flutter (app)',
        database: 'PostgreSQL',
        deployment: 'Web y app con un servidor compartido',
      },
      en: {
        backend: 'Django REST Framework',
        frontend: 'Angular (web) and Flutter (app)',
        database: 'PostgreSQL',
        deployment: 'Web and mobile apps share a server',
      },
    },
    stack: ['Django', 'Angular', 'Flutter', 'PostgreSQL'],
    repoUrl: 'https://github.com/ivnmtz09/yonna_akademia',
    secondaryRepoUrl: 'https://github.com/ivnmtz09/yonna_app',
    secondaryRepoLabel: { es: 'App móvil', en: 'Mobile app' },
  },
  {
    id: 'gym-tracker',
    title: 'Gym Tracker',
    subtitle: { es: 'Gestión de gimnasios', en: 'Gym management' },
    role: { es: 'Desarrollo web', en: 'Web development' },
    year: '2025–2026',
    category: 'web',
    description: {
      es: 'Web para gestionar clientes, rutinas y progreso físico.',
      en: 'Manage gym members, workouts, and fitness progress online.',
    },
    highlights: {
      es: ['Rutinas personalizadas para cada cliente.', 'Historial de medidas y avances.'],
      en: ['Personalized workouts for each member.', 'History of measurements and progress.'],
    },
    architecture: {
      es: {
        backend: 'Node.js y Express',
        frontend: 'Aplicación web en JavaScript',
        database: 'Base de datos relacional',
        deployment: 'Servicios web por función',
      },
      en: {
        backend: 'Node.js and Express',
        frontend: 'JavaScript web app',
        database: 'Relational database',
        deployment: 'Web services grouped by feature',
      },
    },
    stack: ['JavaScript', 'Node.js', 'Express'],
    repoUrl: 'https://github.com/ivnmtz09/gym-tracker',
  },
];

export const NAV_SECTIONS = [
  { id: 'top', marker: '00' },
  { id: 'terminal', marker: '>_' },
  { id: 'about', marker: '01' },
  { id: 'projects', marker: '02' },
  { id: 'skills', marker: '03' },
  { id: 'trajectory', marker: '04' },
  { id: 'contact', marker: '05' },
] as const;

export type SectionId = (typeof NAV_SECTIONS)[number]['id'];

export const UI_COPY: Record<Lang, {
  nav: Record<SectionId, string> & {
    primary: string;
    sectionProgress: string;
    menu: string;
    soundOn: string;
    soundOff: string;
    language: string;
    theme: string;
    hireMe: string;
  };
  hero: {
    statusBadge: string;
    greeting: string;
    summary: string;
    ctaProjects: string;
    ctaCopyEmail: string;
    copied: string;
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
    filters: { id: ProjectFilter; label: string }[];
    viewDetails: string;
    viewRepo: string;
    modal: {
      detailsTitle: string;
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
    subtitle: string;
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
    builtWith: string;
    navigation: string;
    links: string;
    email: string;
    backToTop: string;
  };
}> = {
  es: {
    nav: {
      top: 'Inicio',
      terminal: 'Consola',
      about: 'Sobre mí',
      primary: 'Navegación principal',
      sectionProgress: 'Recorrido por secciones',
      menu: 'Menú',
      soundOn: 'Silenciar sonidos',
      soundOff: 'Activar sonidos',
      language: 'Cambiar idioma',
      theme: 'Cambiar tema',
      projects: 'Proyectos',
      skills: 'Stack',
      trajectory: 'Trayectoria',
      contact: 'Contacto',
      hireMe: 'Hablemos',
    },
    hero: {
      statusBadge: 'Disponible para prácticas o empleo junior',
      greeting: 'Hola, soy',
      summary: 'Apps web y móviles completas\nExperiencia en operación y soporte',
      ctaProjects: 'Ver proyectos',
      ctaCopyEmail: 'Copiar correo',
      copied: 'Correo copiado',
    },
    about: {
      eyebrow: '// 01. Perfil',
      title: 'De la operación al software',
      paragraphs: [
        'Construyo aplicaciones web y móviles, desde la idea hasta la puesta en marcha.',
        'Durante casi 13 años trabajé en operaciones, atención al cliente y soporte técnico. Esa experiencia me ayuda a entender lo que un equipo necesita en el día a día.',
      ],
      metrics: [
        { value: '10.º sem.', label: 'Ingeniería de Sistemas', detail: 'Universidad de La Guajira' },
        { value: 'Casi 13 años', label: 'Operación y soporte', detail: 'Atención al cliente y soporte técnico' },
        { value: String(PROJECTS.length), label: 'Proyectos destacados', detail: 'Educación, idiomas y gimnasios' },
      ],
    },
    projects: {
      eyebrow: '// 02. Portafolio',
      title: 'Proyectos',
      filters: [
        { id: 'all', label: 'Todos' },
        { id: 'web', label: 'Web y SaaS' },
        { id: 'multiplatform', label: 'Multiplataforma' },
      ],
      viewDetails: 'Ver detalles',
      viewRepo: 'Repositorio',
      modal: {
        detailsTitle: 'Detalles',
        backend: 'Servidor',
        frontend: 'Interfaz',
        database: 'Base de datos',
        deployment: 'Puesta en marcha',
        highlights: 'Funciones',
        close: 'Cerrar',
      },
    },
    skills: {
      eyebrow: '// 03. Stack',
      title: 'Tecnologías',
      subtitle: 'Herramientas que uso para crear y mantener aplicaciones.',
      softSkillsTitle: 'Cómo trabajo',
      languagesTitle: 'Idiomas',
      languages: [
        { name: 'Español', level: 'Nativo' },
        { name: 'Inglés', level: 'Básico · Lectura técnica' },
      ],
    },
    trajectory: {
      eyebrow: '// 04. Trayectoria',
      title: 'Experiencia y formación',
      subtitle: 'Operación comercial, soporte técnico y estudios de ingeniería.',
      experienceTitle: 'Experiencia laboral',
      educationTitle: 'Estudios',
      certificationsTitle: 'Certificaciones y ponencias',
      certNote: 'Certificados y referencias a solicitud.',
    },
    contact: {
      eyebrow: '// 05. Contacto',
      title: 'Hablemos',
      subtitle: 'Busco una práctica o un puesto junior en desarrollo.',
      emailLabel: 'Correo',
      phoneLabel: 'Teléfono o WhatsApp',
      locationLabel: 'Ubicación',
      copyBtn: 'Copiar',
      copiedBtn: 'Copiado',
      formTitle: 'Enviar un mensaje',
      namePlaceholder: 'Nombre o empresa',
      subjectPlaceholder: 'Asunto',
      messagePlaceholder: 'Cuéntame sobre tu proyecto o vacante',
      sendMailto: 'Abrir correo',
      copyMessage: 'Copiar mensaje',
    },
    footer: {
      builtWith: 'Iván Martínez · 2026',
      navigation: 'Secciones',
      links: 'Enlaces',
      email: 'Correo',
      backToTop: 'Subir',
    },
  },
  en: {
    nav: {
      top: 'Home',
      terminal: 'Console',
      about: 'About',
      primary: 'Main navigation',
      sectionProgress: 'Section progress',
      menu: 'Menu',
      soundOn: 'Mute sounds',
      soundOff: 'Enable sounds',
      language: 'Change language',
      theme: 'Change theme',
      projects: 'Projects',
      skills: 'Stack',
      trajectory: 'Background',
      contact: 'Contact',
      hireMe: 'Let’s talk',
    },
    hero: {
      statusBadge: 'Open to internships and junior roles',
      greeting: 'Hi, I’m',
      summary: 'End-to-end web and mobile apps\nHands-on operations and support',
      ctaProjects: 'View projects',
      ctaCopyEmail: 'Copy email',
      copied: 'Email copied',
    },
    about: {
      eyebrow: '// 01. About',
      title: 'From operations to software',
      paragraphs: [
        'I build web and mobile apps from idea to launch.',
        'I spent nearly 13 years in operations, customer service, and IT support. That experience helps me understand what teams need day to day.',
      ],
      metrics: [
        { value: '10th term', label: 'Systems Engineering', detail: 'Universidad de La Guajira' },
        { value: 'Nearly 13 years', label: 'Operations and support', detail: 'Customer service and IT support' },
        { value: String(PROJECTS.length), label: 'Featured projects', detail: 'Education, languages, and gyms' },
      ],
    },
    projects: {
      eyebrow: '// 02. Portfolio',
      title: 'Projects',
      filters: [
        { id: 'all', label: 'All' },
        { id: 'web', label: 'Web & SaaS' },
        { id: 'multiplatform', label: 'Cross-platform' },
      ],
      viewDetails: 'View details',
      viewRepo: 'Repository',
      modal: {
        detailsTitle: 'Details',
        backend: 'Server',
        frontend: 'Interface',
        database: 'Database',
        deployment: 'Delivery',
        highlights: 'Features',
        close: 'Close',
      },
    },
    skills: {
      eyebrow: '// 03. Stack',
      title: 'Technologies',
      subtitle: 'Tools I use to build and maintain applications.',
      softSkillsTitle: 'How I work',
      languagesTitle: 'Languages',
      languages: [
        { name: 'Spanish', level: 'Native' },
        { name: 'English', level: 'Basic · Technical reading' },
      ],
    },
    trajectory: {
      eyebrow: '// 04. Background',
      title: 'Experience and education',
      subtitle: 'Retail operations, IT support, and engineering studies.',
      experienceTitle: 'Work experience',
      educationTitle: 'Education',
      certificationsTitle: 'Certificates and talks',
      certNote: 'Certificates and references on request.',
    },
    contact: {
      eyebrow: '// 05. Contact',
      title: 'Let’s talk',
      subtitle: 'I’m looking for a development internship or junior role.',
      emailLabel: 'Email',
      phoneLabel: 'Phone or WhatsApp',
      locationLabel: 'Location',
      copyBtn: 'Copy',
      copiedBtn: 'Copied',
      formTitle: 'Send a message',
      namePlaceholder: 'Name or company',
      subjectPlaceholder: 'Subject',
      messagePlaceholder: 'Tell me about your project or role',
      sendMailto: 'Open email',
      copyMessage: 'Copy message',
    },
    footer: {
      builtWith: 'Iván Martínez · 2026',
      navigation: 'Sections',
      links: 'Links',
      email: 'Email',
      backToTop: 'Back to top',
    },
  },
};

export const SKILL_GROUPS: SkillGroup[] = [
  {
    id: 'languages',
    label: { es: 'Lenguajes', en: 'Languages' },
    items: ['Python', 'JavaScript', 'TypeScript', 'Java', 'Dart'],
  },
  {
    id: 'backend',
    label: { es: 'Servidor', en: 'Backend' },
    items: ['Django', 'Spring Boot', 'Node.js', 'Express'],
  },
  {
    id: 'frontend',
    label: { es: 'Web y móvil', en: 'Web & mobile' },
    items: ['React', 'Angular', 'Flutter', 'Tailwind CSS'],
  },
  {
    id: 'databases',
    label: { es: 'Bases de Datos', en: 'Databases' },
    items: ['PostgreSQL', 'MySQL', 'Firebase', 'Supabase', 'SQLite'],
  },
  {
    id: 'tools',
    label: { es: 'Despliegue y herramientas', en: 'Deployment & tools' },
    items: ['Git', 'GitHub Actions', 'Docker', 'Linux', 'Railway', 'Netlify'],
  },
];

export const SOFT_SKILLS: Record<Lang, string[]> = {
  es: ['Trabajo en equipo', 'Atención al cliente', 'Resolución de problemas'],
  en: ['Teamwork', 'Customer service', 'Problem solving'],
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
        'Gestioné inventarios y coordiné compras con proveedores.',
        'Atendí clientes, gestioné caja y pagos, y di soporte técnico.',
      ],
      en: [
        'Managed inventory and coordinated orders with suppliers.',
        'Helped customers, handled payments, and provided IT support.',
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
      es: ['Desarrollo de aplicaciones web y móviles.'],
      en: ['Web and mobile application development.'],
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
      es: ['Procesos y normativa ambiental.'],
      en: ['Environmental processes and standards.'],
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
