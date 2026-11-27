import { FormEvent, KeyboardEvent, useEffect, useRef, useState } from 'react';
import { Terminal } from 'lucide-react';
import { Lang, PROFILE, PROJECTS } from '../data/portfolioData';
import { useScrollReveal } from '../hooks/useScrollEffects';
import { soundEngine } from '../utils/soundEngine';

interface InteractiveTerminalSectionProps {
  lang: Lang;
}

type LocalizedLines = Record<Lang, string[]>;

interface TerminalEntry {
  id: number;
  command: string;
  output: LocalizedLines;
  visibleLines: number;
}

const NEOFETCH_LINES: LocalizedLines = {
  es: [
    ' /\\_/\\   Iván Martínez',
    '( o.o )  Desarrollo web y móvil',
    ' > ^ <   Riohacha, Colombia',
    '         Disponible para prácticas',
    '         y puestos junior.',
  ],
  en: [
    ' /\\_/\\   Iván Martínez',
    '( o.o )  Web and mobile development',
    ' > ^ <   Riohacha, Colombia',
    '         Open to internships',
    '         and junior roles.',
  ],
};

const COMMAND_OUTPUTS: Record<string, LocalizedLines> = {
  help: {
    es: [
      'Comandos disponibles',
      '  neofetch --profile  Perfil',
      '  whoami              Sobre mí',
      '  projects            Lista los proyectos destacados',
      '  skills              Tecnologías',
      '  contact             Datos de contacto',
      '  goto <sección>      Ej. goto projects',
      '  clear               Limpiar consola',
    ],
    en: [
      'Available commands',
      '  neofetch --profile  Profile',
      '  whoami              About me',
      '  projects            List featured projects',
      '  skills              Technologies',
      '  contact             Contact details',
      '  goto <section>      E.g. goto projects',
      '  clear               Clear terminal',
    ],
  },
  'neofetch --profile': NEOFETCH_LINES,
  whoami: {
    es: [
      `${PROFILE.name} (${PROFILE.handle})`,
      'Creo aplicaciones web y móviles.',
      'Casi 13 años en operación, atención al cliente y soporte técnico.',
    ],
    en: [
      `${PROFILE.name} (${PROFILE.handle})`,
      'I build web and mobile apps.',
      'Nearly 13 years in operations, customer service, and IT support.',
    ],
  },
  projects: {
    es: PROJECTS.map((project) => `• ${project.title} · ${project.subtitle.es}`),
    en: PROJECTS.map((project) => `• ${project.title} · ${project.subtitle.en}`),
  },
  skills: {
    es: [
      'Servidor: Django, Spring Boot, Node.js',
      'Web y móvil: React, Angular, Flutter',
      'Datos: PostgreSQL, MySQL',
      'Herramientas: Git, Docker, Linux',
    ],
    en: [
      'Backend: Django, Spring Boot, Node.js',
      'Web and mobile: React, Angular, Flutter',
      'Data: PostgreSQL, MySQL',
      'Tools: Git, Docker, Linux',
    ],
  },
  contact: {
    es: [`Correo: ${PROFILE.email}`, `Teléfono: ${PROFILE.phone}`, PROFILE.github, PROFILE.linkedin],
    en: [`Email: ${PROFILE.email}`, `Phone: ${PROFILE.phone}`, PROFILE.github, PROFILE.linkedin],
  },
};

const COMMAND_ALIASES: ReadonlyMap<string, string> = new Map([
  ['neofetch', 'neofetch --profile'],
  ['ls', 'projects'],
]);

const AVAILABLE_COMMANDS = [
  ...Object.keys(COMMAND_OUTPUTS),
  'goto top',
  'goto about',
  'goto projects',
  'goto skills',
  'goto trajectory',
  'goto contact',
  'clear',
];

export function InteractiveTerminalSection({ lang }: InteractiveTerminalSectionProps) {
  const { ref, visible } = useScrollReveal();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const nextEntryId = useRef(2);

  const [input, setInput] = useState('');
  const [cmdHistory, setCmdHistory] = useState<string[]>(['neofetch --profile']);
  const [historyCursor, setHistoryCursor] = useState<number>(-1);
  const [history, setHistory] = useState<TerminalEntry[]>([
    {
      id: 1,
      command: 'neofetch --profile',
      output: NEOFETCH_LINES,
      visibleLines: NEOFETCH_LINES.es.length,
    },
  ]);

  const quickCommands = ['help', 'neofetch --profile', 'projects', 'skills', 'goto trajectory', 'goto contact', 'clear'];

  // Always auto-scroll terminal output to the bottom when new commands or streamed lines appear
  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const rafId = window.requestAnimationFrame(() => {
      el.scrollTop = el.scrollHeight;
    });
    return () => window.cancelAnimationFrame(rafId);
  }, [history]);

  const streamOutput = (entryId: number, lineCount: number) => {
    let idx = 0;
    const timer = window.setInterval(() => {
      idx += 1;
      setHistory((prev) =>
        prev.map((item) =>
          item.id === entryId ? { ...item, visibleLines: idx } : item
        )
      );
      if (idx >= lineCount) {
        window.clearInterval(timer);
      }
    }, 22);
  };

  const runCommand = (rawCmd: string) => {
    const cmd = rawCmd.trim().toLowerCase();
    if (!cmd) return;

    soundEngine.playEnter();
    setCmdHistory((prev) => [...prev, rawCmd.trim()]);
    setHistoryCursor(-1);

    if (cmd === 'clear') {
      setHistory([]);
      return;
    }

    const entryId = nextEntryId.current++;
    if (cmd.startsWith('goto ')) {
      const destination = cmd.slice(5).trim();
      const target = destination === 'hero' ? 'top' : destination;
      const targetEl = document.getElementById(target);
      targetEl?.scrollIntoView({ behavior: 'smooth' });
      const output: LocalizedLines = targetEl
        ? { es: [`Ir a #${target}`], en: [`Go to #${target}`] }
        : {
            es: [`Sección #${target} no encontrada.`, 'Opciones: top, about, projects, skills, trajectory, contact'],
            en: [`Section #${target} was not found.`, 'Options: top, about, projects, skills, trajectory, contact'],
          };
      setHistory((prev) => [...prev, { id: entryId, command: rawCmd, output, visibleLines: output.es.length }]);
      return;
    }

    const canonicalCommand = COMMAND_ALIASES.get(cmd) ?? cmd;
    const output = Object.hasOwn(COMMAND_OUTPUTS, canonicalCommand)
      ? COMMAND_OUTPUTS[canonicalCommand]
      : {
          es: [`Comando desconocido: ${rawCmd}. Escribe 'help'.`],
          en: [`Unknown command: ${rawCmd}. Type 'help'.`],
        };

    setHistory((prev) => [...prev, { id: entryId, command: rawCmd, output, visibleLines: 0 }]);
    streamOutput(entryId, Math.max(output.es.length, output.en.length));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    runCommand(input);
    setInput('');
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (cmdHistory.length === 0) return;
      const nextCursor =
        historyCursor === -1 ? cmdHistory.length - 1 : Math.max(0, historyCursor - 1);
      setHistoryCursor(nextCursor);
      setInput(cmdHistory[nextCursor]);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyCursor === -1) return;
      if (historyCursor >= cmdHistory.length - 1) {
        setHistoryCursor(-1);
        setInput('');
      } else {
        const nextCursor = historyCursor + 1;
        setHistoryCursor(nextCursor);
        setInput(cmdHistory[nextCursor]);
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const match = AVAILABLE_COMMANDS.find((c) => c.startsWith(input.toLowerCase()));
      if (match) setInput(match);
    }
  };

  return (
    <section id="terminal" tabIndex={-1} className="relative py-14 sm:py-16">
      <div
        ref={ref}
        className={`mx-auto max-w-6xl px-4 transition-[opacity,transform] duration-500 ease-out sm:px-6 ${
          visible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
        }`}
      >
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
          <div className="glass-blue inline-flex w-fit items-center gap-2 px-3 py-1 font-mono text-xs font-semibold tracking-wider text-[#0066FF] uppercase">
            <Terminal className="h-4 w-4 shrink-0" />
            <span>
              {lang === 'es'
                ? '// Terminal · Tab completa · ↑↓ historial'
                : '// Terminal · Tab completes · ↑↓ history'}
            </span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {quickCommands.map((cmd) => (
              <button
                key={cmd}
                type="button"
                onClick={() => {
                  runCommand(cmd);
                  inputRef.current?.focus();
                }}
                className="glass-chip px-2.5 py-1 font-mono text-[11px] font-medium text-zinc-800 transition hover:border-[#0066FF] hover:text-[#0066FF] dark:text-zinc-200"
              >
                {cmd}
              </button>
            ))}
          </div>
        </div>

        <div
          onClick={() => inputRef.current?.focus()}
          className="relative cursor-text overflow-hidden border border-zinc-300/60 bg-zinc-950/92 text-zinc-100 shadow-[0_16px_48px_rgba(0,102,255,0.14)] backdrop-blur-md dark:border-white/15"
        >
          <div className="flex items-center justify-between border-b border-zinc-800/90 bg-zinc-900/90 px-4 py-2.5">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-zinc-500" />
              <span className="h-2.5 w-2.5 rounded-full bg-zinc-600" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#0066FF]" />
            </div>
            <span className="truncate font-mono text-xs text-zinc-400">ivnmtz09@workstation: ~</span>
            <span className="hidden font-mono text-[10px] text-[#0066FF] sm:inline">bash</span>
          </div>

          <div
            ref={scrollContainerRef}
            className="terminal-output max-h-[340px] overflow-y-auto p-4 font-mono text-[11px] leading-relaxed sm:p-5 sm:text-[13px]"
          >
            {history.map((entry) => (
              <div key={entry.id} className="mb-4">
                <p className="text-zinc-400">
                  <span className="text-[#0066FF]">╭─ ivnmtz09@workstation</span>{' '}
                  <span className="text-zinc-300">~</span>
                </p>
                <p className="break-words text-zinc-100">
                  <span className="text-[#0066FF]">╰─$</span> {entry.command}
                </p>
                {entry.visibleLines > 0 && (
                  <pre className="mt-2 overflow-x-auto whitespace-pre-wrap break-words text-zinc-300">
                    {entry.output[lang].slice(0, entry.visibleLines).join('\n')}
                  </pre>
                )}
              </div>
            ))}

            <form onSubmit={handleSubmit} className="mt-2">
              <p className="text-zinc-400">
                <span className="text-[#0066FF]">╭─ ivnmtz09@workstation</span>{' '}
                <span className="text-zinc-300">~</span>
              </p>
              <div className="flex items-center gap-2">
                <span className="shrink-0 text-[#0066FF]">╰─$</span>
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onKeyDown={handleKeyDown}
                  onChange={(e) => {
                    soundEngine.playKeystroke();
                    setInput(e.target.value);
                  }}
                  placeholder={
                    lang === 'es'
                      ? "Escribe 'help'"
                      : "Type 'help'"
                  }
                  className="min-w-0 flex-1 bg-transparent font-mono text-xs text-zinc-100 placeholder-zinc-600 outline-none sm:text-[13px]"
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
