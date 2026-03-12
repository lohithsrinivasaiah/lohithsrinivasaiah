import { useState, useEffect } from 'react';
import type { Project } from '@/data';

const CONTRIBUTOR_FETCH_LIMIT = 20; // Cap to avoid rate limits and long load times
const SIX_MONTHS_MS = 6 * 30 * 24 * 60 * 60 * 1000;

interface GitHubRepo {
  name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  topics?: string[];
  language: string | null;
  updated_at: string;
  private: boolean;
}

interface ContributorStats {
  total: number;
}

function getStatus(updatedAt: string): 'active' | 'completed' | 'archived' {
  const updated = new Date(updatedAt).getTime();
  const now = Date.now();
  const sixMonthsAgo = now - SIX_MONTHS_MS;
  const oneYearAgo = now - 2 * SIX_MONTHS_MS;

  if (updated >= sixMonthsAgo) return 'active';
  if (updated >= oneYearAgo) return 'completed';
  return 'archived';
}

function mapRepoToProject(
  repo: GitHubRepo,
  index: number,
  commits?: number
): Project {
  const techStack = (repo.topics?.length ? repo.topics : [repo.language].filter(Boolean)) as string[];
  return {
    id: index + 1,
    name: repo.name,
    description: repo.description || 'No description',
    techStack,
    link: repo.html_url,
    status: getStatus(repo.updated_at),
  };
}

export interface GitHubProjectsResult {
  projects: Project[];
  totalStars: number;
  totalCommits: number;
  openSourceCount: number;
  loading: boolean;
  error: string | null;
}

export function useGitHubProjects(username: string): GitHubProjectsResult {
  const [projects, setProjects] = useState<Project[]>([]);
  const [totalStars, setTotalStars] = useState(0);
  const [totalCommits, setTotalCommits] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const token = import.meta.env.VITE_GITHUB_TOKEN;
  const headers: HeadersInit = token
    ? { Authorization: `Bearer ${token}` }
    : {};

  useEffect(() => {
    if (!username) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const repoRes = await fetch(
          `https://api.github.com/users/${username}/repos?type=owner&per_page=100&sort=updated`,
          { headers }
        );

        if (!repoRes.ok) {
          const errData = await repoRes.json().catch(() => ({}));
          throw new Error(errData.message || `GitHub API error: ${repoRes.status}`);
        }

        const repoData: GitHubRepo[] = await repoRes.json();
        const publicRepos = repoData.filter((r) => !r.private);

        let starSum = 0;
        let commitSum = 0;
        const limit = token ? CONTRIBUTOR_FETCH_LIMIT : Math.min(10, publicRepos.length);

        const projectsWithCommits: Array<{ project: Project; commits: number }> = [];

        for (let i = 0; i < publicRepos.length; i++) {
          const repo = publicRepos[i];
          starSum += repo.stargazers_count;

          let commits = 0;
          if (i < limit) {
            try {
              const statsRes = await fetch(
                `https://api.github.com/repos/${username}/${repo.name}/stats/contributors`,
                { headers }
              );
              if (statsRes.ok) {
                const stats: ContributorStats[] = await statsRes.json();
                commits = stats.reduce((acc, c) => acc + (c.total ?? 0), 0);
                commitSum += commits;
              }
            } catch {
              // Skip contributor stats on failure
            }
          }

          projectsWithCommits.push({
            project: mapRepoToProject(repo, i, commits),
            commits,
          });
        }

        setProjects(projectsWithCommits.map((p) => p.project));
        setTotalStars(starSum);
        setTotalCommits(commitSum);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch GitHub projects');
        setProjects([]);
        setTotalStars(0);
        setTotalCommits(0);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [username, token]);

  return {
    projects,
    totalStars,
    totalCommits,
    openSourceCount: projects.length,
    loading,
    error,
  };
}
