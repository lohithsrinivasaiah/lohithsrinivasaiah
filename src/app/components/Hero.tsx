import { Briefcase, Sparkles, Github, Mail } from 'lucide-react';
import { portfolio, getIcon } from '@/data';
import { Button } from './ui/button';

export function Hero() {
  const { profile, about, contact } = portfolio;
  const subtitle = profile.heroSubtitle ?? profile.title;
  const tagline = profile.heroTagline ?? about.bio[0] ?? '';
  const githubLink = contact.methods.find((m) => m.icon === 'Github')?.link ?? '';

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const btnBase =
    'transition-transform duration-200 ease-out hover:-translate-y-0.5';
  const accentGreen = '#3fb950';

  return (
    <section className="relative -mx-4 md:-mx-6 px-4 md:px-6 pt-16 md:pt-24 pb-0 text-center overflow-hidden max-w-4xl mx-auto bg-transparent">
      <div
        className="hero-radial-glow absolute inset-0 z-0 pointer-events-none"
        aria-hidden
      />
      <div className="relative z-10">
      <h1
        className="text-4xl font-semibold text-white tracking-tight animate-in fade-in duration-500 fill-mode-both"
        style={{ animationDelay: '0ms' }}
      >
        Hi, I'm{' '}
        {profile.name.split(' ').map((part, i) =>
          part.toLowerCase() === 'srinivasaiah' ? (
            <span key={i} style={{ color: accentGreen }}>
              {part}
            </span>
          ) : (
            <span key={i}>{part} </span>
          )
        )}
      </h1>
      <p
        className="mt-2 text-xl md:text-2xl text-[#8b949e] animate-in fade-in duration-500 fill-mode-both"
        style={{ animationDelay: '100ms' }}
      >
        {subtitle}
      </p>
      <p
        className="mt-4 text-sm text-[#c9d1d9] max-w-2xl mx-auto animate-in fade-in duration-500 fill-mode-both"
        style={{ animationDelay: '200ms' }}
      >
        {tagline}
      </p>
      <div
        className="mt-8 flex flex-wrap justify-center gap-3 animate-in fade-in duration-500 fill-mode-both"
        style={{ animationDelay: '300ms' }}
      >
        <Button
          variant="default"
          size="lg"
          onClick={() => scrollTo('experience')}
          className={`bg-[#2ea043] hover:bg-[#3fb950] text-white border-0 ${btnBase}`}
        >
          <Briefcase className="size-4" />
          View Experience
        </Button>
        <Button
          variant="secondary"
          size="lg"
          onClick={() => scrollTo('chat')}
          className="btn-ai-glow bg-[#1e293b] text-white hover:bg-[#334155] border rounded-lg min-w-[140px] focus-visible:ring-0 focus-visible:ring-offset-0"
        >
          <Sparkles className="size-4" />
          Ask My AI
        </Button>
        <Button
          variant="outline"
          size="lg"
          asChild
          className={`border-[#30363d] text-[#c9d1d9] hover:bg-[#21262d] ${btnBase}`}
        >
          <a
            href={githubLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Github className="size-4" />
            GitHub
          </a>
        </Button>
        <Button
          variant="outline"
          size="lg"
          onClick={() => scrollTo('contact')}
          className={`border-[#30363d] text-[#c9d1d9] hover:bg-[#21262d] ${btnBase}`}
        >
          <Mail className="size-4" />
          Contact
        </Button>
      </div>
      <div
        className="mt-10 w-full max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 animate-in fade-in duration-500 fill-mode-both"
        style={{ animationDelay: '400ms' }}
      >
        {about.highlights.map((highlight) => {
          const Icon = getIcon(highlight.icon);
          return (
            <div
              key={highlight.title}
              className="bg-[#0d1117]/40 border border-[#30363d]/30 rounded-lg p-4 hover:border-[#3fb950]/60 transition-colors text-left"
            >
              <div className="flex items-center gap-2 mb-2">
                <Icon className="size-5 text-[#3fb950] shrink-0" />
                <h3 className="text-sm text-white">{highlight.title}</h3>
              </div>
              <p className="text-xs text-[#8b949e]">{highlight.description}</p>
            </div>
          );
        })}
      </div>
      </div>
    </section>
  );
}
