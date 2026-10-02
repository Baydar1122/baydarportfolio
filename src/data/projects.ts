import manualProjects from './projects.manual.json';
import generatedProjects from './projects.generated.json';

export interface ProjectItem {
  id: string;
  name: string;
  title: string;
  description: string;
  featured?: boolean;
  pinned?: boolean;
  role?: string;
  year?: string;
  topics: string[];
  html_url: string;
  homepage?: string | null;
  source?: string;
  details?: {
    whatItIs: string;
    whatIBuilt: string;
    whatILearned: string;
  };
  stars?: number;
  og_image?: string;
}

// Deduplicate manual and generated GitHub projects
const manualMap = new Map<string, ProjectItem>();
(manualProjects as ProjectItem[]).forEach((p) => {
  manualMap.set(p.name.toLowerCase(), p);
});

const mergedGithub = (generatedProjects as ProjectItem[]).filter(
  (g) => !manualMap.has(g.name.toLowerCase())
);

export const allProjects: ProjectItem[] = [
  ...(manualProjects as ProjectItem[]),
  ...mergedGithub
].sort((a, b) => {
  if (a.pinned && !b.pinned) return -1;
  if (!a.pinned && b.pinned) return 1;
  return 0;
});

export const allTags: string[] = Array.from(
  new Set(allProjects.flatMap((p) => p.topics || []))
).filter(Boolean);
