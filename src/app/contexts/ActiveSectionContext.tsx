import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
  type ReactNode,
} from 'react';

const SECTION_IDS = ['home', 'experience', 'about', 'contact'] as const;

interface ActiveSectionContextValue {
  activeSection: string;
  setActiveSection: (id: string) => void;
}

const ActiveSectionContext = createContext<ActiveSectionContextValue | null>(
  null
);

export function useActiveSection() {
  const context = useContext(ActiveSectionContext);
  if (!context) {
    throw new Error(
      'useActiveSection must be used within an ActiveSectionProvider'
    );
  }
  return context;
}

export function ActiveSectionProvider({ children }: { children: ReactNode }) {
  const [activeSection, setActiveSection] = useState('home');
  const ratiosRef = useRef<Record<string, number>>({});

  useEffect(() => {
    const main = document.querySelector('main');
    if (!main) return;

    const sectionElements = SECTION_IDS.map((id) =>
      document.getElementById(id)
    ).filter((el): el is HTMLElement => el !== null);

    if (sectionElements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const id = entry.target.id;
          if (SECTION_IDS.includes(id as (typeof SECTION_IDS)[number])) {
            ratiosRef.current[id] = entry.intersectionRatio;
          }
        }

        const best = SECTION_IDS.reduce<{ id: string; ratio: number }>(
          (acc, id) => {
            const ratio = ratiosRef.current[id] ?? 0;
            return ratio > acc.ratio ? { id, ratio } : acc;
          },
          { id: 'home', ratio: 0 }
        );

        if (best.ratio > 0) {
          setActiveSection(best.id);
        }
      },
      {
        root: main,
        rootMargin: '-20% 0px',
        threshold: [0, 0.25, 0.5, 0.75, 1],
      }
    );

    sectionElements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const setActive = useCallback((id: string) => {
    setActiveSection(id);
  }, []);

  return (
    <ActiveSectionContext.Provider
      value={{ activeSection, setActiveSection: setActive }}
    >
      {children}
    </ActiveSectionContext.Provider>
  );
}
