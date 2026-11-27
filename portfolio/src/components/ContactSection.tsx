import { FormEvent, useState } from 'react';
import { Check, Copy, Github, Linkedin, Mail, MapPin, Phone, Send } from 'lucide-react';
import { Lang, PROFILE, UI_COPY } from '../data/portfolioData';
import { useScrollReveal } from '../hooks/useScrollEffects';
import { soundEngine } from '../utils/soundEngine';

interface ContactSectionProps { lang: Lang; }

export function ContactSection({ lang }: ContactSectionProps) {
  const copy = UI_COPY[lang].contact;
  const [copiedField, setCopiedField] = useState<'email' | 'phone' | 'message' | null>(null);
  const [senderName, setSenderName] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const { ref, visible } = useScrollReveal();

  const copyText = async (text: string, field: 'email' | 'phone' | 'message') => {
    soundEngine.playClick();
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      window.setTimeout(() => setCopiedField(null), 2000);
    } catch { /* ignored */ }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    soundEngine.playEnter();
    const sub = encodeURIComponent(subject || `Contacto desde portafolio - ${senderName}`);
    const body = encodeURIComponent(`${senderName ? `Hola Iván, soy ${senderName}.\n\n` : ''}${message}`);
    window.location.href = `mailto:${PROFILE.email}?subject=${sub}&body=${body}`;
  };

  return (
    <section
      id="contact"
      tabIndex={-1}
      className="relative py-18 sm:py-26"
    >
      <div
        ref={ref}
        className={`mx-auto max-w-6xl px-4 transition-[opacity,transform] duration-500 ease-out sm:px-6 ${
          visible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
        }`}
      >
        {/* Two-column layout: open 3D ENVELOPE space LEFT (col-span-5), Contact & Form RIGHT (col-span-7) */}
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-center">
          <div data-stage-anchor className="h-44 sm:h-52 lg:h-auto lg:col-span-5 lg:min-h-[480px]" aria-hidden="true" />

          {/* Right column — Contact info cards + quick mailto form */}
          <div className="space-y-5 lg:col-span-7">
            <div className="glass relative p-6">
              <p className="font-mono text-xs font-semibold tracking-wider text-[color:var(--glass-accent)] uppercase">{copy.eyebrow}</p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl dark:text-white">{copy.title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-zinc-700 sm:text-[0.9375rem] dark:text-zinc-300">{copy.subtitle}</p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="glass flex items-center justify-between gap-2 p-4">
                <div className="flex min-w-0 flex-1 items-center gap-3">
                  <Mail className="h-5 w-5 shrink-0 text-[#0066FF]" />
                  <div className="min-w-0 flex-1">
                    <p className="font-mono text-[11px] text-zinc-500 dark:text-zinc-400">{copy.emailLabel}</p>
                    <a
                      href={`mailto:${PROFILE.email}`}
                      className="block truncate font-mono text-xs font-semibold text-zinc-900 hover:text-[color:var(--glass-accent)] dark:text-white"
                    >
                      {PROFILE.email}
                    </a>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => copyText(PROFILE.email, 'email')}
                  className="glass-blue inline-flex shrink-0 items-center gap-1 px-2.5 py-1.5 font-mono text-[11px] font-medium text-[color:var(--glass-accent)]"
                >
                  {copiedField === 'email' ? <><Check className="h-3.5 w-3.5" />{copy.copiedBtn}</> : <><Copy className="h-3.5 w-3.5" />{copy.copyBtn}</>}
                </button>
              </div>

              <div className="glass flex items-center justify-between gap-2 p-4">
                <div className="flex min-w-0 flex-1 items-center gap-3">
                  <Phone className="h-5 w-5 shrink-0 text-[#0066FF]" />
                  <div className="min-w-0 flex-1">
                    <p className="font-mono text-[11px] text-zinc-500 dark:text-zinc-400">{copy.phoneLabel}</p>
                    <a
                      href={`https://wa.me/${PROFILE.phoneRaw}`}
                      target="_blank"
                      rel="noreferrer"
                      className="block truncate font-mono text-xs font-semibold text-zinc-900 hover:text-[color:var(--glass-accent)] dark:text-white"
                    >
                      {PROFILE.phone}
                    </a>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => copyText(PROFILE.phone, 'phone')}
                  className="glass-blue inline-flex shrink-0 items-center gap-1 px-2.5 py-1.5 font-mono text-[11px] font-medium text-[color:var(--glass-accent)]"
                >
                  {copiedField === 'phone' ? <><Check className="h-3.5 w-3.5" />{copy.copiedBtn}</> : <><Copy className="h-3.5 w-3.5" />{copy.copyBtn}</>}
                </button>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="glass flex flex-1 items-center gap-3 px-4 py-3">
                <MapPin className="h-4 w-4 shrink-0 text-[#0066FF]" />
                <div className="min-w-0">
                  <p className="font-mono text-[10px] text-zinc-500 uppercase dark:text-zinc-400">{copy.locationLabel}</p>
                  <p className="truncate text-xs font-semibold text-zinc-900 sm:text-sm dark:text-white">{PROFILE.location}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <a
                  href={PROFILE.github}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => soundEngine.playClick()}
                  className="glass-chip glass-hover inline-flex items-center gap-2 px-4 py-3 font-mono text-xs font-semibold text-zinc-800 hover:text-[color:var(--glass-accent)] dark:text-zinc-200"
                >
                  <Github className="h-4 w-4" />GitHub
                </a>
                <a
                  href={PROFILE.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => soundEngine.playClick()}
                  className="glass-chip glass-hover inline-flex items-center gap-2 px-4 py-3 font-mono text-xs font-semibold text-zinc-800 hover:text-[color:var(--glass-accent)] dark:text-zinc-200"
                >
                  <Linkedin className="h-4 w-4" />LinkedIn
                </a>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="glass relative p-6">
              <h3 className="font-mono text-sm font-bold text-zinc-900 uppercase dark:text-white">{copy.formTitle}</h3>
              <div className="mt-4 space-y-3">
                <div className="grid gap-3 sm:grid-cols-2">
                  <input
                    type="text"
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    placeholder={copy.namePlaceholder}
                    className="glass-chip w-full px-3.5 py-2.5 text-sm text-zinc-900 outline-none placeholder-zinc-500 focus:border-[#0066FF] focus:ring-1 focus:ring-[#0066FF] dark:text-white dark:placeholder-zinc-500"
                  />
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder={copy.subjectPlaceholder}
                    className="glass-chip w-full px-3.5 py-2.5 text-sm text-zinc-900 outline-none placeholder-zinc-500 focus:border-[#0066FF] focus:ring-1 focus:ring-[#0066FF] dark:text-white dark:placeholder-zinc-500"
                  />
                </div>
                <textarea
                  rows={4}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={copy.messagePlaceholder}
                  className="glass-chip w-full resize-none px-3.5 py-2.5 text-sm text-zinc-900 outline-none placeholder-zinc-500 focus:border-[#0066FF] focus:ring-1 focus:ring-[#0066FF] dark:text-white dark:placeholder-zinc-500"
                />
              </div>
              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 bg-[#0066FF] px-5 py-2.5 font-mono text-xs font-semibold tracking-wider text-white uppercase transition hover:bg-[#0052CC]"
                >
                  <Send className="h-4 w-4" />{copy.sendMailto}
                </button>
                <button
                  type="button"
                  onClick={() => copyText(`${subject ? `${subject}\n\n` : ''}${message}`, 'message')}
                  className="glass-chip glass-hover inline-flex items-center gap-2 px-4 py-2.5 font-mono text-xs font-semibold tracking-wider text-zinc-700 uppercase hover:text-[color:var(--glass-accent)] dark:text-zinc-300"
                >
                  {copiedField === 'message' ? <><Check className="h-4 w-4 text-[#0066FF]" />{copy.copiedBtn}</> : <><Copy className="h-4 w-4" />{copy.copyMessage}</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
