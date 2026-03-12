import { Home, Briefcase, User, Mail, Navigation } from 'lucide-react';
import { portfolio } from '@/data';
import { useActiveSection } from '@/app/contexts/ActiveSectionContext';

const { profile } = portfolio;

const navItems = [
  { icon: Home, label: 'Home', sectionId: 'home' },
  { icon: Briefcase, label: 'Experience', sectionId: 'experience' },
  { icon: User, label: 'About', sectionId: 'about' },
  { icon: Mail, label: 'Contact', sectionId: 'contact' },
];

export function LeftSidebarContent({
  onNavigate,
}: {
  onNavigate?: () => void;
}) {
  const { activeSection, setActiveSection } = useActiveSection();

  const handleNavClick = (sectionId: string) => {
    setActiveSection(sectionId);
    if (sectionId === 'home') {
      document.querySelector('main')?.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
    }
    onNavigate?.();
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      {/* Navigation */}
      <nav className="p-3 flex-1">
        <div className="flex items-center gap-2 mb-4 px-3 pt-2">
          <Navigation className="size-5 text-[#58a6ff]" />
          <h2 className="text-white">Navigation</h2>
        </div>
        <div className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.sectionId;
            return (
              <button
                key={item.label}
                onClick={() => handleNavClick(item.sectionId)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors min-h-[44px] ${
                  isActive
                    ? 'bg-[#161b22] text-white'
                    : 'text-[#8b949e] hover:bg-[#161b22] hover:text-white'
                }`}
              >
                <Icon className="size-4 shrink-0" />
                <span>{profile.username}/{item.label.toLowerCase().replace(' ', '-')}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-[#30363d]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#58a6ff] to-[#bc8cff] flex items-center justify-center text-sm">
            {profile.avatar}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm text-white truncate">{profile.name}</div>
            <div className="text-xs text-[#8b949e]">{profile.title}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function LeftSidebar() {
  return (
    <aside className="hidden md:flex md:sticky md:top-0 w-64 h-screen max-h-screen bg-[#0d1117] border-r border-[#30363d] flex-col shrink-0 self-start">
      <LeftSidebarContent />
    </aside>
  );
}