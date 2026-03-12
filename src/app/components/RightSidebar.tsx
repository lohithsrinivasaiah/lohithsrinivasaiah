import { ExternalLink, Code2, Rocket, Loader2, AlertCircle } from 'lucide-react';
import { portfolio, getIcon, getSkillIcon } from '@/data';
import type { Project } from '@/data';

interface RightSidebarContentProps {
  projects: Project[];
  loading: boolean;
  error: string | null;
}

export function RightSidebarContent({
  projects,
  loading,
  error,
}: RightSidebarContentProps) {
  const displayProjects = error ? portfolio.projects : projects;

  return (
    <div className="flex flex-col p-4">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <Rocket className="size-5 text-[#58a6ff]" />
        <h2 className="text-white">Featured Projects</h2>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center gap-2 py-8 text-[#8b949e] text-sm">
          <Loader2 className="size-4 animate-spin" />
          <span>Loading GitHub projects...</span>
        </div>
      )}

      {/* Error fallback message */}
      {error && !loading && (
        <div className="flex items-center gap-2 py-2 mb-3 text-amber-500/90 text-xs">
          <AlertCircle className="size-3.5 shrink-0" />
          <span>Using fallback data. {error}</span>
        </div>
      )}

      {/* Projects List */}
      {!loading && (
        <div className="space-y-3">
          {displayProjects.map((project) => {
            const card = (
              <div
                key={project.id}
                className="bg-[#161b22] border border-[#30363d] rounded-lg p-4 hover:border-[#58a6ff] transition-colors group"
              >
                {/* Project Header */}
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Code2 className="size-4 text-[#8b949e]" />
                    <h3 className="text-sm text-white group-hover:text-[#58a6ff] transition-colors">
                      {project.name}
                    </h3>
                  </div>
                  {project.link && (
                    <ExternalLink className="size-3 text-[#8b949e] group-hover:text-[#58a6ff] transition-colors shrink-0" />
                  )}
                </div>

                {/* Status Badge */}
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs ${
                      project.status === 'active'
                        ? 'bg-[#238636]/20 text-[#3fb950]'
                        : project.status === 'completed'
                          ? 'bg-[#1f6feb]/20 text-[#58a6ff]'
                          : 'bg-[#6e7681]/20 text-[#8b949e]'
                    }`}
                  >
                    <div
                      className={`w-1.5 h-1.5 rounded-full ${
                        project.status === 'active'
                          ? 'bg-[#3fb950]'
                          : project.status === 'completed'
                            ? 'bg-[#58a6ff]'
                            : 'bg-[#8b949e]'
                      }`}
                    />
                    <span className="capitalize">{project.status}</span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs text-[#8b949e] leading-relaxed mb-3">
                  {project.description}
                </p>

                {/* Tech Stack */}
                <div className="flex flex-wrap gap-1.5">
                  {project.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-0.5 bg-[#0d1117] text-[#8b949e] text-xs rounded border border-[#30363d] font-mono"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            );

            return project.link ? (
              <a
                key={project.id}
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="block cursor-pointer"
              >
                {card}
              </a>
            ) : (
              <div key={project.id}>{card}</div>
            );
          })}
        </div>
      )}

      {/* Technical Skills */}
      {!loading && (
        <div className="mt-6 pt-4 border-t border-[#30363d]">
          <h3 className="text-white mb-3 flex items-center gap-2">
            <Code2 className="size-4 text-[#58a6ff]" />
            Technical Skills
          </h3>
          <div className="flex flex-col gap-4">
            {portfolio.about.skills.map((skill) => {
              const CategoryIcon = getIcon(skill.icon);
              return (
                <div key={skill.category} className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <CategoryIcon className="size-3.5 text-[#58a6ff]" />
                    <h4 className="text-xs font-medium text-[#8b949e]">{skill.category}</h4>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {skill.items.map((item) => {
                      const SkillIcon = getSkillIcon(item);
                      return (
                        <div
                          key={item}
                          className="flex items-center gap-1.5 px-2 py-1 bg-[#161b22] rounded border border-[#30363d] hover:border-[#58a6ff] transition-colors"
                        >
                          <SkillIcon className="size-3 text-[#58a6ff] shrink-0" />
                          <span className="text-xs text-[#c9d1d9] font-mono">{item}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export function RightSidebar(props: RightSidebarContentProps) {
  return (
    <aside className="hidden md:block fixed right-0 top-0 bottom-0 w-80 bg-[#0d1117] border-l border-[#30363d] overflow-y-auto z-10">
      <RightSidebarContent {...props} />
    </aside>
  );
}
