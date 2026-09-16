const GITHUB_API = 'https://api.github.com';

export interface GithubConfig {
  token: string;
  repo: string;
  branch: string;
}

/** Reads GITHUB_TOKEN / GITHUB_REPO / GITHUB_BRANCH. Undefined if not configured yet. */
export function getGithubConfig(): GithubConfig | undefined {
  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPO;
  if (!token || !repo) return undefined;
  return { token, repo, branch: process.env.GITHUB_BRANCH || 'main' };
}

export class GithubError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

async function githubFetch(path: string, token: string, init?: RequestInit) {
  return fetch(`${GITHUB_API}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'Content-Type': 'application/json',
      ...init?.headers,
    },
    cache: 'no-store',
  });
}

/** The file's current blob sha, or undefined if it doesn't exist yet. Throws on any other failure. */
export async function getFileSha(config: GithubConfig, path: string): Promise<string | undefined> {
  const query = `?ref=${encodeURIComponent(config.branch)}`;
  const response = await githubFetch(`/repos/${config.repo}/contents/${path}${query}`, config.token);

  if (response.ok) {
    const json = (await response.json()) as { sha?: string };
    return json.sha;
  }
  if (response.status === 404) return undefined;

  const detail = await response.text();
  throw new GithubError(502, `GitHub rejected the read (${response.status}): ${detail.slice(0, 300)}`);
}

/** Creates or updates a file. Pass `sha` when overwriting an existing one. */
export async function putFile(
  config: GithubConfig,
  path: string,
  content: string,
  message: string,
  sha?: string,
): Promise<{ replaced: boolean; commitUrl?: string }> {
  const response = await githubFetch(`/repos/${config.repo}/contents/${path}`, config.token, {
    method: 'PUT',
    body: JSON.stringify({
      message: message.slice(0, 200),
      content: Buffer.from(content, 'utf8').toString('base64'),
      branch: config.branch,
      ...(sha ? { sha } : {}),
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new GithubError(502, `GitHub rejected the commit (${response.status}): ${detail.slice(0, 300)}`);
  }

  const result = (await response.json()) as { commit?: { html_url?: string } };
  return { replaced: Boolean(sha), commitUrl: result.commit?.html_url };
}
