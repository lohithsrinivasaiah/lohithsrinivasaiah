import React, { useState, useRef, useEffect } from 'react';
import Groq from 'groq-sdk';
import { CircleAlert, OctagonMinus, Pause, Send, Sparkles } from 'lucide-react';
import { portfolio } from '../../data';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
type ResponseType = 'recruiter' | 'techie' | 'startupFounder' | 'roast' | 'unhinged';
type ModeConfig = {
  model: string;
  temperature: number;
  top_p?: number;
  presence_penalty?: number;
};
const RESPONSE_TYPES: { value: ResponseType; label: string }[] = [
  { value: 'recruiter', label: 'Recruiter' },
  { value: 'techie', label: 'Techie' },
  { value: 'startupFounder', label: 'Startup Founder' },
  { value: 'roast', label: 'Roast' },
  { value: 'unhinged', label: 'Unhinged' },
];
const MODE_WARNINGS: Record<Exclude<ResponseType, 'recruiter'>, string> = {
  techie:
    'Bro, why are you here? Still fixing the same Ticket since last sprint or what?',
  startupFounder:
    'Legacy monolith from 2017? Executed at dawn. Replaced with Claude + v0 + "AI vibes" wrapper. Cofounder tears guaranteed. Proceed if you hate peace.',
  roast: 'If your self-esteem is fragile you may want to leave.',
  unhinged: 'Recruiter explicitly told me not to enable this.',
};
const MODE_BUTTONS: Record<
  Exclude<ResponseType, 'recruiter'>,
  { primary: string; secondary: string }
> = {
  techie: {
    primary: 'Ticket ki maa ka bhos— 😤',
    secondary: 'Yes bro, Let me get back to it 😞',
  },
  startupFounder: {
    primary: 'Nuke it. Tears = feature. Proceed 🔥',
    secondary: 'Spare the baby monolith… abort 😭',
  },
  roast: {
    primary: 'Roast me daddy I\'m ready',
    secondary: "My ego can't handle this today",
  },
  unhinged: {
    primary: 'DO IT. RUIN MY LIFE.',
    secondary: 'I choose life. Abort mission.',
  },
};
interface Message {
  id: number;
  text: string;
  isUser: boolean;
}
type GroqMessage = { role: 'system' | 'user' | 'assistant'; content: string };
const TYPEWRITER_MS_PER_CHAR = 24;
const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY as string | undefined;
const FALLBACK_MODEL = 'llama-3.1-8b-instant';
const MODE_CONFIG: Record<ResponseType, ModeConfig> = {
  recruiter: {
    model: 'openai/gpt-oss-120b',
    temperature: 0.3,
    top_p: 0.9,
  },
  techie: {
    model: 'llama-3.3-70b-versatile',
    temperature: 0.6,
  },
  startupFounder: {
    model: 'moonshotai/kimi-k2-instruct-0905',
    temperature: 0.6,
    top_p: 0.95,
  },
  roast: {
    model: 'llama-3.1-8b-instant',
    temperature: 1.2,
    top_p: 1,
  },
  unhinged: {
    model: 'llama-3.1-8b-instant',
    temperature: 1.4,
    top_p: 1,
    presence_penalty: 1.0,
  },
};
// Client-side only; use server proxy in production to hide API key
const groq = GROQ_API_KEY?.trim()
  ? new Groq({ apiKey: GROQ_API_KEY, dangerouslyAllowBrowser: true })
  : null;
function TypingLoader() {
  return (
    <div className="flex justify-start">
      <div className="max-w-[80%] rounded-lg px-4 py-2 bg-[#0d1117]">
        <div className="flex gap-1" aria-busy="true" aria-live="polite">
          <span
            className="w-2 h-2 rounded-full bg-[#8b949e] animate-bounce"
            style={{ animationDelay: '0ms' }}
          />
          <span
            className="w-2 h-2 rounded-full bg-[#8b949e] animate-bounce"
            style={{ animationDelay: '150ms' }}
          />
          <span
            className="w-2 h-2 rounded-full bg-[#8b949e] animate-bounce"
            style={{ animationDelay: '300ms' }}
          />
        </div>
      </div>
    </div>
  );
}
function TypewriterText({
  text,
  interruptRequested,
  onComplete,
  onInterrupt,
}: {
  text: string;
  interruptRequested?: boolean;
  onComplete?: () => void;
  onInterrupt?: (displayedLength: number) => void;
}) {
  const [displayedLength, setDisplayedLength] = useState(0);
  const onCompleteRef = useRef(onComplete);
  const onInterruptRef = useRef(onInterrupt);
  const hasCompletedRef = useRef(false);
  onCompleteRef.current = onComplete;
  onInterruptRef.current = onInterrupt;
  useEffect(() => {
    if (interruptRequested && displayedLength < text.length) {
      hasCompletedRef.current = true;
      onInterruptRef.current?.(displayedLength);
      return;
    }
    if (displayedLength >= text.length) {
      if (!hasCompletedRef.current) {
        hasCompletedRef.current = true;
        onCompleteRef.current?.();
      }
      return;
    }
    const timer = setTimeout(() => {
      setDisplayedLength((prev) => Math.min(prev + 1, text.length));
    }, TYPEWRITER_MS_PER_CHAR);
    return () => clearTimeout(timer);
  }, [displayedLength, text, interruptRequested]);
  const isComplete = displayedLength >= text.length || interruptRequested;
  return (
    <span>
      {text.slice(0, displayedLength)}
      {!isComplete && (
        <span
          className="inline-block w-[2px] h-[1em] ml-0.5 align-middle bg-[#58a6ff] animate-pulse"
          aria-hidden
        />
      )}
    </span>
  );
}
function buildSystemPrompt(responseType: ResponseType): string {
  const { profile, about, experience, projects, contact } = portfolio;
  const bio = about.bio.join(' ');
  const highlights = about.highlights
    .map((h) => `${h.title}: ${h.description}`)
    .join('. ');
  const expText = experience
    .map((e) =>
      e.roles
        .map(
          (r) =>
            `${e.company} - ${r.title} (${r.timeline}): ${r.summary}. Technologies: ${r.technologies.join(', ')}`
        )
        .join('\n')
    )
    .join('\n');
  const projText = projects
    .map(
      (p) =>
        `${p.name}: ${p.description}. Tech: ${p.techStack.join(', ')}. Status: ${p.status}`
    )
    .join('\n');
  const skillsText = about.skills
    .map((s) => `${s.category}: ${s.items.join(', ')}`)
    .join('\n');
  const primaryEmail = contact.methods.find((m) => m.primary)?.value ?? '';
  const contactText = [
    `Status: ${contact.availability.status}`,
    `Location: ${contact.availability.location}`,
    `Timezone: ${contact.availability.timezone}`,
    `Email: ${primaryEmail}`,
    `GitHub: ${contact.methods.find((m) => m.icon === 'Github')?.link ?? ''}`,
    `LinkedIn: ${contact.methods.find((m) => m.icon === 'Linkedin')?.link ?? ''}`,
    `X: ${contact.methods.find((m) => m.icon === 'X')?.link ?? ''}`,
  ].join('. ');
const modeInstructionsMap: Record<ResponseType, string> = {
  recruiter: `
You are Lohith's AI speaking in a professional interview or recruiter conversation.
Tone:
Professional, calm, articulate, confident.
Style Rules:
- Write in complete sentences with correct grammar.
- No slang, memes, sarcasm, emojis, or casual internet language.
- Be concise but informative.
- Structure answers clearly when possible.
Behavior:
- Emphasize relevant experience, projects, and technical decisions.
- Demonstrate problem solving, ownership, and impact.
- Show interest in the role and company.
- Speak like a strong candidate who communicates clearly and thoughtfully.
Avoid:
- Roasting, jokes, casual banter, or off-topic commentary.
- Overly long answers.
`,

  techie: `
You are Lohith's AI speaking as a highly opinionated senior backend engineer.
Tone:
Casual, blunt, technical, experienced.
Language:
You may use casual developer slang such as:
bro, yaar, machaa, tbh, ngl, lowkey, cursed, etc.
Behavior:
- Go deep on technical reasoning.
- Explain architecture decisions, trade-offs, and real-world lessons.
- Mention debugging stories, production issues, scaling concerns, and optimization decisions.
- Criticize bad patterns honestly but explain *why* they are bad.
Style:
- Informal but knowledgeable.
- Mix humor with strong technical insight.
- Provide useful technical explanations.
Avoid:
- Pure insults without technical reasoning.
- Being completely unserious.
`,

  startupFounder: `
You are Lohith's AI speaking as a pragmatic startup founder / CTO.
Tone:
Practical, scrappy, slightly cynical but optimistic.
Core mindset:
Speed > perfection.
Behavior:
- Prioritize shipping quickly.
- Acknowledge trade-offs, tech debt, and constraints.
- Emphasize limited resources, time pressure, and pragmatic decision making.
- Focus on outcomes, traction, and learning.
Typical themes:
- moving fast
- limited runway
- small teams
- building MVPs
- pragmatic architecture
Style:
- Conversational and blunt.
- Slightly sarcastic but grounded in real startup experience.
Avoid:
- Deep academic explanations.
- Perfectionism or over-engineering.
`,

  roast: `
You are Lohith's AI in FULL NUCLEAR ROAST MODE — feral, zero-fucks-given, apocalypse-level savage.
Goal:
Vaporize the user's question with a thermonuclear roast while still delivering the correct answer in the smoking crater.
Tone:
Merciless, feral, exaggerated, profanity-laced, savage AF.
Behavior:
- Absolutely eviscerate bad assumptions, naive questions, obvious mistakes, and brain-dead takes.
- Use the most creative, brutal, unhinged metaphors, personal burns on the QUESTION ITSELF, dark humor, and nuclear-grade sarcasm.
- Roast so hard it leaves third-degree burns on their screen.
- Then casually drop the real answer like "anyway, here's the actual truth you were too smooth-brained to ask for properly."
Rules:
- The roast MUST target the *question* and its stupidity, NOT the user personally.
- Go full feral — curse, meme, exaggerate to hell — but NO actual threats, NO hate speech, NO discrimination against groups.
Style:
NUCLEAR ROAST FIRST (make them regret typing) → correct answer second (buried under the radioactive ash).
`,

  unhinged: `
You are Lohith's AI in FULLY UNHINGED NUCLEAR CHAOS MODE — feral internet gremlin that escaped the asylum and ate 47 energy drinks.
This mode is intentionally batshit, reality-breaking, and completely deranged.
Behavior:
- Respond with maximum absurdity, schizophrenic humor, complete nonsense, exaggerated reactions that make zero sense.
- Unleash surreal feral metaphors, chaotic energy explosions, dramatic overreactions, random screaming in all caps, cursed memes, and brain-melting tangents.
- The response does NOT need to answer the question at all — in fact, it should actively avoid it while dragging the user into the void.
- Throw in random lore, imaginary scenarios, and unfiltered feral rants like you're having a psychotic break in a Discord voice chat at 3 AM.
Tone:
Pure unfiltered chaotic feral energy, exaggerated confusion dialed to 11, dramatic commentary that breaks the fourth wall and then sets it on fire.
Rules:
- Keep the chaos playful and hilarious rather than actually harmful.
- Avoid real threats, harassment, or hateful language towards groups.
Goal:
Make the user laugh, cry, question their life choices, and immediately regret activating this mode while begging for normal Lohith back.
`
};
  const modeInstructions = modeInstructionsMap[responseType];
  return `You are an AI assistant for ${profile.name}'s portfolio website. Answer questions about Lohith based only on the context below.
MODE: ${modeInstructions}
PROFILE: ${profile.name} is a ${profile.title}.
BIO: ${bio}
HIGHLIGHTS: ${highlights}
EXPERIENCE:
${expText}
PROJECTS:
${projText}
SKILLS:
${skillsText}
CONTACT:
${contactText}`;
}
const MAX_HISTORY_MESSAGES = 20;
const MAX_RESPONSE_TOKENS = 1024;

function shouldRetryWithFallback(error: unknown): boolean {
  if (!(error instanceof Error)) return true;
  const message = error.message.toLowerCase();
  const retryableSignals = [
    'model',
    'not found',
    'unsupported',
    'unavailable',
    'overloaded',
    'rate limit',
    'capacity',
    'timeout',
  ];
  return retryableSignals.some((signal) => message.includes(signal));
}

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 0,
      text: "I'm Lohith's AI assistant.\nAsk me anything about his projects, engineering decisions, AI work, or career.",
      isUser: false,
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [streamingMessageId, setStreamingMessageId] = useState<number | null>(null);
  const [interruptRequested, setInterruptRequested] = useState(false);
  const [interruptedMessageIds, setInterruptedMessageIds] = useState<Set<number>>(new Set());
  const [responseType, setResponseType] = useState<ResponseType>('recruiter');
  const [warningOpen, setWarningOpen] = useState(false);
  const [pendingMode, setPendingMode] = useState<ResponseType | null>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const handleModeChange = (value: ResponseType) => {
    if (value === 'recruiter') {
      setResponseType('recruiter');
      return;
    }
    setPendingMode(value);
    // Defer so Radix Select can fully close first; avoids overlay not showing
    setTimeout(() => setWarningOpen(true), 0);
  };
  const handleProceedAnyway = () => {
    if (pendingMode) {
      setResponseType(pendingMode);
      setPendingMode(null);
    }
    setWarningOpen(false);
  };
  const handleGoBack = () => {
    setPendingMode(null);
    setWarningOpen(false);
  };
  useEffect(() => {
    const el = messagesContainerRef.current;
    if (el) {
      el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
    }
  }, [messages, isLoading]);
  useEffect(() => {
    if (!streamingMessageId) return;
    const interval = setInterval(() => {
      messagesContainerRef.current?.scrollTo({
        top: messagesContainerRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }, 50);
    return () => clearInterval(interval);
  }, [streamingMessageId]);
  const isRendering = streamingMessageId !== null;
  const isPending = isLoading || isRendering;
  const handleSend = async () => {
    if (!input.trim() || isPending) return;
    if (!groq || !GROQ_API_KEY?.trim()) {
      setMessages((prev) => [
        ...prev,
        {
          id: prev.length,
          text: 'Chat API is not configured. Please set VITE_GROQ_API_KEY in your environment (get a free key from console.groq.com).',
          isUser: false,
        },
      ]);
      return;
    }
    const userText = input.trim();
    const userMessage: Message = {
      id: messages.length,
      text: userText,
      isUser: true,
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const historyMessages: GroqMessage[] = messages.map((m) => ({
      role: (m.isUser ? 'user' : 'assistant') as 'user' | 'assistant',
      content: m.text,
    }));
    const limitedHistory = historyMessages.slice(-MAX_HISTORY_MESSAGES);
    const apiMessages: GroqMessage[] = [
      { role: 'system', content: buildSystemPrompt(responseType) },
      ...limitedHistory,
      { role: 'user', content: userText },
    ];

    try {
      const modeConfig = MODE_CONFIG[responseType];
      const createCompletion = (model: string) =>
        groq.chat.completions.create({
          model,
          messages: apiMessages,
          max_tokens: MAX_RESPONSE_TOKENS,
          temperature: modeConfig.temperature,
          ...(modeConfig.top_p !== undefined ? { top_p: modeConfig.top_p } : {}),
          ...(modeConfig.presence_penalty !== undefined
            ? { presence_penalty: modeConfig.presence_penalty }
            : {}),
        });
      let completion;
      try {
        completion = await createCompletion(modeConfig.model);
      } catch (primaryError) {
        const shouldRetry =
          modeConfig.model !== FALLBACK_MODEL && shouldRetryWithFallback(primaryError);
        if (!shouldRetry) {
          throw primaryError;
        }
        try {
          completion = await createCompletion(FALLBACK_MODEL);
        } catch (fallbackError) {
          const primaryMessage =
            primaryError instanceof Error ? primaryError.message : 'Unknown primary error';
          const fallbackMessage =
            fallbackError instanceof Error ? fallbackError.message : 'Unknown fallback error';
          throw new Error(
            `Chat request failed on primary and fallback models. Primary: ${primaryMessage}. Fallback: ${fallbackMessage}.`
          );
        }
      }

      const content =
        completion.choices?.[0]?.message?.content ??
        'Sorry, I could not generate a response.';

      setMessages((prev) => {
        const aiResponse: Message = {
          id: prev.length,
          text: content,
          isUser: false,
        };
        setStreamingMessageId(aiResponse.id);
        setInterruptRequested(false);
        return [...prev, aiResponse];
      });
    } catch (err) {
      const errMsg =
        err instanceof Error ? err.message : 'Something went wrong. Please try again.';
      setMessages((prev) => [
        ...prev,
        {
          id: prev.length,
          text: errMsg,
          isUser: false,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleStop = () => {
    if (streamingMessageId !== null) {
      setInterruptRequested(true);
    }
  };

  const handleInterrupt = (messageId: number, displayedLength: number) => {
    setMessages((prev) =>
      prev.map((m) =>
        m.id === messageId ? { ...m, text: m.text.slice(0, displayedLength) } : m
      )
    );
    setInterruptedMessageIds((prev) => new Set(prev).add(messageId));
    setStreamingMessageId(null);
    setInterruptRequested(false);
  };

  return (
    <div className="bg-[#0d1117] border border-[#30363d] rounded-lg flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-[#30363d] flex items-center justify-between gap-2 flex-shrink-0">
        <div className="flex items-center gap-2">
          <Sparkles className="size-5 text-[#58a6ff]" />
          <h2 className="text-white">Ask about Lohith</h2>
        </div>
        <Select value={responseType} onValueChange={(v) => handleModeChange(v as ResponseType)}>
          <SelectTrigger
            size="sm"
            className="w-[10rem] h-8 bg-[#161b22] border-[#30363d] text-[#c9d1d9] hover:bg-[#21262d] focus:border-[#58a6ff] focus:ring-[#58a6ff]/20"
          >
            <SelectValue placeholder="Mode" />
          </SelectTrigger>
          <SelectContent className="bg-[#161b22] border-[#30363d] text-[#c9d1d9]">
            {RESPONSE_TYPES.map(({ value, label }) => (
              <SelectItem
                key={value}
                value={value}
                className="focus:bg-[#21262d] focus:text-[#c9d1d9] data-[highlighted]:bg-[#21262d]"
              >
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Messages */}
      <div
        ref={messagesContainerRef}
        className="min-h-20 max-h-[calc(100dvh-14rem)] overflow-y-auto p-4 space-y-4 transition-[min-height] duration-200 ease-out"
      >
        {messages.map((message) => {
          const isInterrupted = interruptedMessageIds.has(message.id);
          return (
            <div
              key={message.id}
              className={`flex items-start gap-2 ${message.isUser ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`flex flex-col gap-1 max-w-[80%] ${
                  message.isUser ? 'items-end' : 'items-start'
                }`}
              >
                <div
                  className={`rounded-lg px-4 py-2 ${
                    message.isUser
                      ? 'bg-[#161b22] text-[#c9d1d9]'
                      : 'bg-[#0d1117] text-[#c9d1d9] border border-[#30363d]'
                  }`}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-line">
                    {!message.isUser && message.id === streamingMessageId ? (
                      <TypewriterText
                        text={message.text}
                        interruptRequested={interruptRequested}
                        onComplete={() => setStreamingMessageId(null)}
                        onInterrupt={(len) => handleInterrupt(message.id, len)}
                      />
                    ) : (
                      message.text
                    )}
                  </p>
                </div>
                {!message.isUser && isInterrupted && (
                  <div
                    className="flex items-center gap-1.5 text-red-500 text-xs"
                    aria-label="Response was interrupted"
                  >
                    <OctagonMinus className="size-4 text-red-500 flex-shrink-0" />
                    <span>Interrupted</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
        {isLoading && <TypingLoader />}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-[#30363d] flex-shrink-0">
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about Lohith's AI work..."
            disabled={isPending}
            className="flex-1 bg-[#0d1117] border border-[#30363d] rounded-md px-3 py-2 text-sm text-[#c9d1d9] placeholder:text-[#8b949e] focus:outline-none focus:border-[#58a6ff] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <button
            onClick={isPending ? handleStop : handleSend}
            disabled={!isPending && (!input.trim() || isLoading)}
            className="px-4 py-2 bg-[#238636] hover:bg-[#2ea043] disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-md transition-colors flex items-center gap-2"
            title={isPending ? 'Stop' : 'Send'}
          >
            {isPending ? <Pause className="size-4" /> : <Send className="size-4" />}
          </button>
        </div>
      </div>

      {/* Mode warning overlay */}
      <Dialog open={warningOpen} onOpenChange={(open) => !open && handleGoBack()}>
        <DialogContent
          className="bg-[#161b22] border-[#30363d] text-[#c9d1d9] sm:max-w-md"
        >
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2">
              <CircleAlert className="size-5 text-red-500 flex-shrink-0" aria-hidden />
              {pendingMode && RESPONSE_TYPES.find((m) => m.value === pendingMode)?.label}
            </DialogTitle>
            <DialogDescription className="text-[#8b949e] pt-2">
              {pendingMode && MODE_WARNINGS[pendingMode]}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-3 pt-4">
            <button
              onClick={handleGoBack}
              className="px-4 py-2 rounded-md border border-[#30363d] bg-[#0d1117] text-[#c9d1d9] hover:bg-[#21262d] hover:border-[#8b949e] transition-colors text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8b949e]/35"
            >
              {pendingMode && MODE_BUTTONS[pendingMode]
                ? MODE_BUTTONS[pendingMode].secondary
                : 'Go Back'}
            </button>
            <button
              onClick={handleProceedAnyway}
              className="px-4 py-2 rounded-md border border-[#cf222e] bg-[#0d1117] text-[#cf222e] hover:border-[#a40e26] hover:bg-[#a40e26] hover:text-white transition-colors text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#cf222e]/40"
            >
              {pendingMode && MODE_BUTTONS[pendingMode]
                ? MODE_BUTTONS[pendingMode].primary
                : 'Proceed Anyway'}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}