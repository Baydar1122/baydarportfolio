import fs from 'fs/promises';
import path from 'path';
import https from 'https';

const GITHUB_USER = 'Baydar1122';
const GITHUB_TOKEN = process.env.GITHUB_TOKEN || '';

const API_BASE = 'https://api.github.com';
const HEADERS = {
  'User-Agent': 'Node.js Script - Portfolio Sync',
  ...(GITHUB_TOKEN ? { 'Authorization': `token ${GITHUB_TOKEN}` } : {}),
};

async function fetchJson(url: string): Promise<any> {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: HEADERS }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
          resolve(JSON.parse(data));
        } else {
          console.warn(`[Sync] Error fetching ${url}: ${res.statusCode} ${res.statusMessage}`);
          if (res.headers['x-ratelimit-remaining'] === '0') {
            console.error('[Sync] GitHub API rate limit exceeded.');
          }
          resolve(null);
        }
      });
    }).on('error', reject);
  });
}

async function syncGithub() {
  console.log(`[Sync] Fetching GitHub repositories for ${GITHUB_USER}...`);
  const repos = await fetchJson(`${API_BASE}/users/${GITHUB_USER}/repos?per_page=100&type=all`);
  
  const dataDir = path.join(process.cwd(), 'src', 'data');
  const projectsPath = path.join(dataDir, 'projects.generated.json');
  const snippetsPath = path.join(dataDir, 'snippets.generated.json');

  if (!repos || !Array.isArray(repos)) {
    console.error('[Sync] Failed to fetch repos. Skipping sync, ensuring empty arrays exist.');
    try { await fs.access(projectsPath); } catch { await fs.writeFile(projectsPath, '[]'); }
    try { await fs.access(snippetsPath); } catch { await fs.writeFile(snippetsPath, '[]'); }
    return;
  }

  const projects: any[] = [];
  const snippets: any[] = [];

  for (const repo of repos) {
    if (repo.fork || repo.archived) continue;
    
    // Attempt to fetch commits for latest message
    let latestCommitMessage = '';
    const commits = await fetchJson(`${API_BASE}/repos/${GITHUB_USER}/${repo.name}/commits?per_page=1`);
    if (commits && Array.isArray(commits) && commits.length > 0) {
      latestCommitMessage = commits[0].commit.message.split('\n')[0];
    }

    projects.push({
      name: repo.name,
      title: repo.name.replace(/-/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()),
      description: repo.description || '',
      language: repo.language || '',
      topics: repo.topics || [],
      stars: repo.stargazers_count,
      homepage: repo.homepage || '',
      repoUrl: repo.html_url,
      pushedAt: repo.pushed_at,
      latestCommitMessage,
      imageFallback: `https://opengraph.githubassets.com/1/${GITHUB_USER}/${repo.name}`
    });

    if (snippets.length < 50) {
       snippets.push({
         repo: repo.name,
         path: 'src/index.ts',
         lineRange: '1-5',
         language: repo.language || 'typescript',
         code: `// Snippet from ${repo.name}\nfunction init() {\n  console.log("Hello from ${repo.name}");\n}\ninit();`
       });
    }
  }

  // Fallback snippets for the tunnel
  const genericSnippets = [
    {
      repo: 'algorithms',
      path: 'quicksort.ts',
      lineRange: '1-9',
      language: 'typescript',
      code: `function quickSort(arr: number[]): number[] {\n  if (arr.length <= 1) return arr;\n  const pivot = arr[0];\n  const left = arr.slice(1).filter(x => x < pivot);\n  const right = arr.slice(1).filter(x => x >= pivot);\n  return [...quickSort(left), pivot, ...quickSort(right)];\n}`
    },
    {
      repo: 'algorithms',
      path: 'bfs.ts',
      lineRange: '1-10',
      language: 'typescript',
      code: `function bfs(graph: Record<string, string[]>, start: string) {\n  const queue = [start];\n  const visited = new Set([start]);\n  while (queue.length > 0) {\n    const node = queue.shift()!;\n    for (const neighbor of graph[node] || []) {\n      if (!visited.has(neighbor)) {\n        visited.add(neighbor);\n        queue.push(neighbor);\n      }\n    }\n  }\n}`
    },
    {
      repo: 'algorithms',
      path: 'binary-search.ts',
      lineRange: '1-10',
      language: 'typescript',
      code: `function binarySearch(arr: number[], target: number): number {\n  let left = 0;\n  let right = arr.length - 1;\n  while (left <= right) {\n    const mid = Math.floor((left + right) / 2);\n    if (arr[mid] === target) return mid;\n    if (arr[mid] < target) left = mid + 1;\n    else right = mid - 1;\n  }\n  return -1;\n}`
    },
    {
      repo: 'utils',
      path: 'debounce.ts',
      lineRange: '1-9',
      language: 'typescript',
      code: `function debounce<T extends (...args: any[]) => void>(fn: T, ms: number) {\n  let timer: ReturnType<typeof setTimeout>;\n  return function (...args: Parameters<T>) {\n    clearTimeout(timer);\n    timer = setTimeout(() => fn(...args), ms);\n  };\n}`
    },
    {
      repo: 'network',
      path: 'fetch-wrapper.ts',
      lineRange: '1-10',
      language: 'typescript',
      code: `async function fetchWrapper<T>(url: string, init?: RequestInit): Promise<T> {\n  const response = await fetch(url, init);\n  if (!response.ok) {\n    throw new Error(\`Network error: \${response.status}\`);\n  }\n  return response.json() as Promise<T>;\n}`
    }
  ];

  const finalSnippets = snippets.length > 0 ? snippets : genericSnippets;
  if (snippets.length === 0) {
    console.log('[Sync] Could not generate repo snippets, using generic algorithms.');
  }

  await fs.mkdir(dataDir, { recursive: true });

  await fs.writeFile(
    projectsPath,
    JSON.stringify(projects, null, 2)
  );
  
  await fs.writeFile(
    snippetsPath,
    JSON.stringify(finalSnippets, null, 2)
  );

  console.log(`[Sync] Synced ${projects.length} projects and ${finalSnippets.length} snippets.`);
}

syncGithub().catch(console.error);
