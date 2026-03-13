import {
  Mail,
  Github,
  Linkedin,
  Code2,
  Terminal,
  Zap,
  Award,
  BookOpen,
  Coffee,
  Database,
  Server,
  Brain,
  Sparkles,
  Cloud,
  Box,
  GitBranch,
  Key,
  Settings,
  FileJson,
  TestTube2,
  type LucideIcon,
} from 'lucide-react';

import portfolioData from './portfolio.json';
import { XLogo } from '../app/components/icons/XLogo';

// Icon name to Lucide component mapping
const ICON_MAP: Record<string, LucideIcon> = {
  Mail,
  Github,
  Linkedin,
  X: XLogo,
  Code2,
  Terminal,
  Zap,
  Award,
  BookOpen,
  Coffee,
  Database,
  Server,
  Brain,
  Sparkles,
  Cloud,
  Box,
  GitBranch,
  Key,
  Settings,
  FileJson,
  TestTube2,
};

export function getIcon(name: string): LucideIcon {
  return ICON_MAP[name] ?? Code2;
}

// Skill name to icon mapping for Technical Skills section
const SKILL_ICON_MAP: Record<string, LucideIcon> = {
  // Languages
  Python: Code2,
  Go: Code2,
  SQL: Database,
  // AI & LLM
  'Large Language Models (LLM)': Brain,
  'Agentic AI': Sparkles,
  LangChain: Zap,
  LlamaIndex: Zap,
  'OpenAI API': Sparkles,
  Groq: Sparkles,
  SQLAlchemy: Database,
  // Backend
  Django: Server,
  'Django REST Framework': Server,
  PostgreSQL: Database,
  MongoDB: Database,
  MySQL: Database,
  Jinja: Code2,
  // Testing
  'Test Automation': TestTube2,
  TDD: TestTube2,
  BDD: TestTube2,
  'Postman API': FileJson,
  'Swagger API': FileJson,
  // Tools & Cloud
  AWS: Cloud,
  'AWS Lambda': Cloud,
  'Amazon S3': Cloud,
  Jenkins: Settings,
  Bitbucket: GitBranch,
  GitHub: Github,
  'CI/CD': Settings,
  Docker: Box,
  Linux: Terminal,
  SSH: Key,
};

export function getSkillIcon(skillName: string): LucideIcon {
  return SKILL_ICON_MAP[skillName] ?? Code2;
}

// Re-export typed portfolio data
export const portfolio = portfolioData as PortfolioData;

export type PortfolioData = {
  profile: {
    name: string;
    username: string;
    title: string;
    avatar: string;
    heroSubtitle?: string;
    heroTagline?: string;
  };
  experience: ExperienceItem[];
  about: {
    bio: string[];
    highlights: { icon: string; title: string; description: string }[];
    skills: { category: string; icon: string; items: string[] }[];
  };
  projects: Project[];
  projectStats: {
    totalProjects: string;
    githubStars: string;
    contributions: string;
    openSource: string;
  };
  contact: {
    availability: {
      status: string;
      location: string;
      timezone: string;
    };
    methods: {
      icon: string;
      label: string;
      value: string;
      link: string;
      primary?: boolean;
    }[];
    cta: {
      title: string;
      description: string;
    };
    responseTime: string;
    responseDescription: string;
  };
};

export type ExperienceItem = {
  id: number;
  company: string;
  companyLogo?: string;
  companyDuration: string;
  type: 'work' | 'education';
  roles: {
    title: string;
    timeline: string;
    startDate?: string;
    endDate?: string;
    duration: string;
    location: string;
    summary: string;
    achievements: string[];
    technologies: string[];
  }[];
};

export type Project = {
  id: number;
  name: string;
  description: string;
  techStack: string[];
  link?: string;
  status: 'active' | 'completed' | 'archived';
};

// Parse "Jan 2023 - Present" into startDate and endDate
function parseTimeline(timeline: string): { startDate: string; endDate: string } {
  const parts = timeline.split(/\s*-\s*/).map((p) => p.trim());
  return {
    startDate: parts[0] ?? '',
    endDate: parts[1] ?? '',
  };
}

// Transform experience for Experience component (companies with positions)
export function getExperience() {
  return portfolio.experience.map((exp) => {
    const positions = exp.roles.map((role, idx) => {
      const { startDate, endDate } = role.startDate && role.endDate
        ? { startDate: role.startDate, endDate: role.endDate }
        : parseTimeline(role.timeline);
      return {
        id: exp.id * 100 + idx,
        role: role.title,
        startDate,
        endDate,
        duration: role.duration,
        location: role.location,
        summary: role.summary,
        achievements: role.achievements ?? [],
        technologies: role.technologies,
        type: exp.type,
      };
    });
    return {
      id: exp.id,
      name: exp.company,
      logo: exp.companyLogo,
      totalTenure: exp.companyDuration,
      positions,
    };
  });
}
