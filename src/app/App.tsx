import { LeftSidebar } from './components/LeftSidebar';
import { Hero } from './components/Hero';
import { ChatInterface } from './components/ChatInterface';
import { Experience } from './components/Experience';
import { About } from './components/About';
import { Contact } from './components/Contact';
import { RightSidebar } from './components/RightSidebar';
import { MobileHeader } from './components/MobileHeader';
import { ActiveSectionProvider } from './contexts/ActiveSectionContext';
import { useGitHubProjects } from '@/hooks/useGitHubProjects';
import { portfolio } from '@/data';

export default function App() {
  const username = portfolio.profile.username;
  const { projects, loading, error } = useGitHubProjects(username);

  const projectsData = {
    projects,
    loading,
    error,
  };

  return (
    <ActiveSectionProvider>
      <div className="app-shell-bg relative h-screen min-h-screen overflow-hidden flex flex-col md:flex-row">
      {/* Mobile Header - visible only on mobile */}
      <MobileHeader projectsData={projectsData} />

      {/* Left Sidebar - Navigation (hidden on mobile) */}
      <LeftSidebar />

      {/* Center Content Area - mr-80 reserves space for fixed right sidebar on desktop */}
      <main className="flex-1 min-h-0 overflow-y-auto md:mr-80">
        <div className="max-w-4xl mx-auto pt-0 px-4 md:px-6 pb-16 md:pb-20 relative">
          <div className="relative z-10 flex flex-col gap-10 md:gap-12">
            <div id="home" className="scroll-mt-6 flex flex-col gap-10 md:gap-12">
              <Hero />
              <div id="chat" className="scroll-mt-6">
                <ChatInterface />
              </div>
            </div>
            <div id="experience" className="scroll-mt-6">
              <Experience />
            </div>
            <div id="about" className="scroll-mt-6">
              <About />
            </div>
            <div id="contact" className="scroll-mt-6">
              <Contact />
            </div>
          </div>
        </div>
      </main>

      {/* Right Sidebar - Projects (hidden on mobile) */}
      <RightSidebar {...projectsData} />
      </div>
    </ActiveSectionProvider>
  );
}