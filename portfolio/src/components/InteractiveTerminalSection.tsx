import { FormEvent, KeyboardEvent, useEffect, useRef, useState } from 'react';
import { Terminal } from 'lucide-react';
import { Lang, PROFILE, PROJECTS } from '../data/portfolioData';
import { useScrollReveal } from '../hooks/useScrollEffects';
import { soundEngine } from '../utils/soundEngine';
import { GridCellMarkers } from './BrandLogo';

interface InteractiveTerminalSectionProps {
  lang: Lang;
}

interface TerminalEntry {
  id: number;
  command: string;
  output: string[];
}

const NEOFETCH_LINES = [
  '      /\\_/\\          User       : Ivan Martinez (@ivnmtz09)',
  '     ( o.o )         Role       : Full Stack Junior · Systems Engineering',
  '      > ^ <          Location   : Riohacha, La Guajira, Colombia',
  '     /     \\         Alma Mater : Universidad de La Guajira (10th Sem.)',
  '    (_______)        Core Stack : Django, Spring Boot, React, Angular, Flutter',
  '                     Databases  : PostgreSQL, MySQL, Firebase, Supabase',
  '                     Current    : EduBid SaaS & Yonna Akademia',
  '                     Status     : open_to_work = true',
];

const AVAILABLE_COMMANDS = [
  'help',
  'neofetch --profile',
  'whoami',
  'projects',
  'skills',
  'contact',
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

  const [input, setInput] = useState('');
  const [cmdHistory, setCmdHistory] = useState<string[]>(['neofetch --profile']);
  const [historyCursor, setHistoryCursor] = useState<number>(-1);
  const [history, setHistory] = useState<TerminalEntry[]>([
    {
      id: 1,
      command: 'neofetch --profile',
      output: NEOFETCH_LINES,
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

  const streamOutput = (entryId: number, lines: string[]) => {
    let idx = 0;
    const timer = window.setInterval(() => {
      idx += 1;
      setHistory((prev) =>
        prev.map((item) =>
          item.id === entryId ? { ...item, output: lines.slice(0, idx) } : item
        )
      );
      if (idx >= lines.length) {
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

    if (cmd.startsWith('goto ')) {
      const targetRaw = cmd.replace('goto ', '').trim();
      const target = targetRaw === 'hero' ? 'top' : targetRaw;
      const targetEl = document.getElementById(target);
      const entryId = Date.now();
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: 'smooth' });
        setHistory((prev) => [
          ...prev,
          {
            id: entryId,
            command: rawCmd,
            output: [
              lang === 'es'
                ? `-> Navegando a #${target}...`
                : `-> Navigating to #${target}...`,
            ],
          },
        ]);
      } else {
        setHistory((prev) => [
          ...prev,
          {
            id: entryId,
            command: rawCmd,
            output: [`Sección '#${target}' no encontrada. Usa: top, about, projects, skills, trajectory, contact`],
          },
        ]);
      }
      return;
    }

    let output: string[] = [];

    if (cmd === 'help') {
      output =
        lang === 'es'
          ? [
              'Comandos disponibles:',
              '  neofetch --profile  Muestra ficha técnica del sistema',
              '  whoami              Resumen profesional de Iván Martínez',
              '  projects            Lista los 4 sistemas principales',
              '  skills              Muestra el stack técnico',
              '  contact             Correo, teléfono, GitHub y LinkedIn',
              '  goto <sección>      Desplaza a: top | about | projects | skills | trajectory | contact',
              '  clear               Limpia la consola',
            ]
          : [
              'Available commands:',
              '  neofetch --profile  Display system profile card',
              '  whoami              Professional summary of Ivan Martinez',
              '  projects            List the 4 featured systems',
              '  skills              Display core tech stack',
              '  contact             Email, phone, GitHub & LinkedIn',
              '  goto <section>      Scroll to: top | about | projects | skills | trajectory | contact',
              '  clear               Clear terminal output',
            ];
    } else if (cmd === 'neofetch' || cmd === 'neofetch --profile') {
      output = NEOFETCH_LINES;
    } else if (cmd === 'whoami') {
      output = [
        `${PROFILE.name} (${PROFILE.handle})`,
        lang === 'es'
          ? 'Desarrollador Full Stack Junior · 10.º sem. Ingeniería de Sistemas (Uniguajira)'
          : 'Junior Full Stack Developer · 10th sem. Systems Engineering (Uniguajira)',
        lang === 'es'
          ? '~13 años de experiencia operativa, inventarios, caja y soporte técnico.'
          : '~13 years of operational, inventory, POS, and IT support experience.',
      ];
    } else if (cmd === 'projects' || cmd === 'ls') {
      output = PROJECTS.map(
        (p) => `• ${p.title} [${p.year}] — ${p.stack.slice(0, 4).join(', ')} (${p.repoUrl})`
      );
    } else if (cmd === 'skills') {
      output = [
        'Languages : Python, JavaScript, TypeScript, Java, Dart, C++, Bash',
        'Backend   : Django, DRF, Spring Boot, Node.js, Express, JWT, Google OAuth',
        'Frontend  : React 18, Angular 21, Vite, Tailwind CSS, Next.js, Flutter',
        'Databases : PostgreSQL, MySQL, Firebase, Supabase, SQLite',
        'DevOps    : Docker, Linux, Git, GitHub Actions, Railway, Netlify',
      ];
    } else if (cmd === 'contact') {
      output = [
        `Email    : ${PROFILE.email}`,
        `Phone    : ${PROFILE.phone}`,
        `GitHub   : ${PROFILE.github}`,
        `LinkedIn : ${PROFILE.linkedin}`,
        `Location : ${PROFILE.location}`,
      ];
    } else {
      output = [
        lang === 'es'
          ? `bash: ${rawCmd}: comando no encontrado. Escribe 'help' para ver opciones.`
          : `bash: ${rawCmd}: command not found. Type 'help' for available commands.`,
      ];
    }

    const entryId = Date.now();
    setHistory((prev) => [...prev, { id: entryId, command: rawCmd, output: [] }]);
    streamOutput(entryId, output);
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
    <section id="terminal" className="relative border-b border-zinc-200/70 py-14 sm:py-16 dark:border-zinc-800/70">
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
                ? '// Consola Interactiva · Tab autocompleta · ↑↓ historial'
                : '// Interactive Console · Tab autocomplete · ↑↓ history'}
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
          <GridCellMarkers />
          <div className="flex items-center justify-between border-b border-zinc-800/90 bg-zinc-900/90 px-4 py-2.5">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-zinc-500" />
              <span className="h-2.5 w-2.5 rounded-full bg-zinc-600" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#0066FF]" />
            </div>
            <span className="truncate font-mono text-xs text-zinc-400">ivnmtz09@workstation: ~</span>
            <span className="hidden font-mono text-[10px] text-[#0066FF] sm:inline">bash · interactive</span>
          </div>

          <div
            ref={scrollContainerRef}
            className="max-h-[340px] overflow-y-auto p-4 font-mono text-[11px] leading-relaxed sm:p-5 sm:text-[13px]"
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
                {entry.output.length > 0 && (
                  <pre className="mt-2 overflow-x-auto whitespace-pre-wrap break-words text-zinc-300">
                    {entry.output.join('\n')}
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
                      ? "escribe 'help', 'projects', 'goto skills', 'clear'..."
                      : "type 'help', 'projects', 'goto skills', 'clear'..."
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
