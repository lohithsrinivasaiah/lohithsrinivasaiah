import { useState } from 'react';
import { Menu, Rocket } from 'lucide-react';
import { portfolio } from '@/data';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from './ui/sheet';
import { LeftSidebarContent } from './LeftSidebar';
import { RightSidebarContent } from './RightSidebar';
import type { Project } from '@/data';

interface MobileHeaderProps {
  projectsData: {
    projects: Project[];
    loading: boolean;
    error: string | null;
  };
}

export function MobileHeader({ projectsData }: MobileHeaderProps) {
  const { profile } = portfolio;
  const [navOpen, setNavOpen] = useState(false);
  const [projectsOpen, setProjectsOpen] = useState(false);

  return (
    <header className="md:hidden sticky top-0 z-40 flex items-center justify-between h-14 px-4 bg-background border-b border-border shrink-0">
      <Sheet open={navOpen} onOpenChange={setNavOpen}>
        <SheetTrigger
          className="flex items-center justify-center min-h-[44px] min-w-[44px] -ml-2 p-2 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          aria-label="Open navigation"
        >
          <Menu className="size-5" />
        </SheetTrigger>
        <SheetContent
          side="left"
          className="w-[min(85vw,320px)] max-w-md border-border bg-background p-0 pt-4"
        >
          <div className="h-full overflow-y-auto">
            <LeftSidebarContent onNavigate={() => setNavOpen(false)} />
          </div>
        </SheetContent>
      </Sheet>

      <span className="text-sm text-foreground font-medium truncate">
        {profile.username}
      </span>

      <Sheet open={projectsOpen} onOpenChange={setProjectsOpen}>
        <SheetTrigger
          className="flex items-center justify-center min-h-[44px] min-w-[44px] -mr-2 p-2 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          aria-label="Open projects"
        >
          <Rocket className="size-5 text-blue-400" />
        </SheetTrigger>
        <SheetContent
          side="right"
          className="w-[min(85vw,320px)] max-w-md border-border bg-background p-0 pt-4"
        >
          <div className="h-full overflow-y-auto">
            <RightSidebarContent {...projectsData} />
          </div>
        </SheetContent>
      </Sheet>
    </header>
  );
}
