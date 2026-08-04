import { Octokit } from "octokit";

export interface RepositoryInfo {
  name: string;
  fullName: string;
  url: string;
  defaultBranch: string;
  lastCommitSha: string;
  lastCommitDate: string;
  isNextJsApp: boolean;
  hasPackageJson: boolean;
  framework?: string;
}

export class GitHubService {
  private octokit: Octokit;

  constructor() {
    const token = process.env.GITHUB_TOKEN || process.env.GITHUB_PAT;
    if (!token) {
      throw new Error("GITHUB_TOKEN or GITHUB_PAT environment variable is required");
    }
    this.octokit = new Octokit({ auth: token });
  }

  async getRepositoryInfo(repoUrl: string): Promise<RepositoryInfo> {
    const { owner, repo } = this.parseRepoUrl(repoUrl);

    const [repoData, commits, packageJson] = await Promise.all([
      this.octokit.rest.repos.get({ owner, repo }),
      this.octokit.rest.repos.listCommits({ owner, repo, per_page: 1 }),
      this.fetchPackageJson(owner, repo).catch(() => null),
    ]);

    const defaultBranch = repoData.data.default_branch;
    const lastCommit = commits.data[0]!;

    return {
      name: repoData.data.name,
      fullName: repoData.data.full_name,
      url: repoData.data.html_url,
      defaultBranch,
      lastCommitSha: lastCommit.sha,
      lastCommitDate: lastCommit.commit.author?.date ?? new Date().toISOString(),
      isNextJsApp:
        Boolean((packageJson as Record<string, unknown>)?.next) ||
        Boolean(
          ((packageJson as Record<string, unknown>)?.dependencies as Record<string, unknown>)?.next,
        ),
      hasPackageJson: Boolean(packageJson),
      framework: packageJson ? this.detectFramework(packageJson) : undefined,
    };
  }

  private parseRepoUrl(url: string): { owner: string; repo: string } {
    const match = url.match(/github\.com\/([^/]+)\/([^/]+)(?:\/|$)/);
    if (!match) {
      throw new Error(`Invalid GitHub URL: ${url}`);
    }
    return { owner: match[1]!, repo: match[2]!.replace(/\.git$/, "") };
  }

  private async fetchPackageJson(
    owner: string,
    repo: string,
  ): Promise<Record<string, unknown> | null> {
    const { data } = await this.octokit.rest.repos.getContent({
      owner,
      repo,
      path: "package.json",
      ref: "main",
    });

    if ("content" in data && typeof data.content === "string") {
      const content = Buffer.from(data.content, "base64").toString("utf-8");
      return JSON.parse(content) as Record<string, unknown>;
    }

    return null;
  }

  private detectFramework(pkg: Record<string, unknown>): string {
    const deps = (pkg.dependencies || pkg.devDependencies || {}) as Record<string, unknown>;
    if (deps["next"]) return "Next.js";
    if (deps["react"]) return "React";
    if (deps["vue"]) return "Vue";
    if (deps["svelte"]) return "Svelte";
    return "Unknown";
  }

  async createWebhook(repoUrl: string, webhookUrl: string): Promise<string> {
    const { owner, repo } = this.parseRepoUrl(repoUrl);

    await this.octokit.rest.repos.createWebhook({
      owner,
      repo,
      name: "web",
      config: {
        url: webhookUrl,
        content_type: "json",
        secret: process.env.GITHUB_WEBHOOK_SECRET,
      },
      events: ["push", "pull_request"],
      active: true,
    });

    return `https://github.com/${owner}/${repo}/hooks`;
  }

  async listTags(repoUrl: string, limit = 10): Promise<Array<{ name: string; sha: string }>> {
    const { owner, repo } = this.parseRepoUrl(repoUrl);
    const { data } = await this.octokit.rest.repos.listTags({ owner, repo, per_page: limit });
    return data.map((tag) => ({ name: tag.name, sha: tag.commit.sha }));
  }

  async getFileContent(repoUrl: string, filePath: string, ref = "main"): Promise<string> {
    const { owner, repo } = this.parseRepoUrl(repoUrl);
    const { data } = await this.octokit.rest.repos.getContent({ owner, repo, path: filePath, ref });
    if ("content" in data && typeof data.content === "string") {
      return Buffer.from(data.content, "base64").toString("utf-8");
    }
    throw new Error(`Could not fetch content for ${filePath}`);
  }
}
