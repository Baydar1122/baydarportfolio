import fs from 'fs';
import path from 'path';

const GITHUB_USERNAME = 'Baydar1122';
const OUTPUT_FILE = path.join(process.cwd(), 'src/data/projects.generated.json');

async function syncGithubProjects() {
  console.log(`[Sync] Fetching public repositories for ${GITHUB_USERNAME}...`);
  const headers = {
    'User-Agent': 'Baydar-Portfolio-SyncScript',
    'Accept': 'application/vnd.github.v3+json'
  };

  // Token usage removed to prevent 401 errors from expired tokens

  try {
    const res = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=100&type=all`, { headers });
    
    if (!res.ok) {
      console.warn(`[Sync] GitHub API returned status ${res.status}. Using existing cached file if available.`);
      if (fs.existsSync(OUTPUT_FILE)) return;
      // Fallback fallback output if network fails
      fs.writeFileSync(OUTPUT_FILE, JSON.stringify([], null, 2));
      return;
    }

    const repos = await res.json();
    
    const formattedProjects = repos
      .filter(repo => !repo.archived)
      .map(repo => ({
        id: repo.id,
        name: repo.name,
        title: repo.name.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        description: repo.description || 'Modern web software repository.',
        language: repo.language || 'TypeScript',
        topics: repo.topics || [],
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        homepage: repo.homepage || null,
        html_url: repo.html_url,
        updated_at: repo.updated_at,
        og_image: `https://opengraph.githubassets.com/1/${GITHUB_USERNAME}/${repo.name}`
      }));

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(formattedProjects, null, 2));
    console.log(`[Sync] Successfully synced ${formattedProjects.length} repositories to projects.generated.json!`);
  } catch (err) {
    console.error('[Sync] Error during GitHub sync:', err.message);
    if (!fs.existsSync(OUTPUT_FILE)) {
      fs.writeFileSync(OUTPUT_FILE, JSON.stringify([], null, 2));
    }
  }
}

syncGithubProjects();
