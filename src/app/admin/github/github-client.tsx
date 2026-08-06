"use client";

import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  Github,
  Loader2,
  RefreshCw,
  Star,
  GitFork,
  AlertCircle,
  ExternalLink,
  BarChart3,
  FileCode2,
  Link2,
  Unlink,
  Tag,
  GitPullRequest,
  Bug,
  Eye,
  Rocket,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Connection {
  connected: boolean;
  login: string | null;
  name: string | null;
  avatarUrl: string | null;
  scope: string | null;
}

interface Repo {
  id: number;
  name: string;
  fullName: string;
  description: string | null;
  url: string;
  language: string | null;
  stars: number;
  forks: number;
  openIssues: number;
  defaultBranch: string;
  archived: boolean;
  updatedAt: string;
  owner: string;
}

interface LanguageStat {
  name: string;
  bytes: number;
  percent: number;
}

interface Contributor {
  login: string;
  avatarUrl: string;
  contributions: number;
}

interface Analysis {
  fullName: string;
  language: string | null;
  description: string | null;
  stars: number;
  forks: number;
  watchers: number;
  openIssues: number;
  openPulls: number;
  license: string | null;
  pushedAt: string;
  defaultBranch: string;
  commits90d: number;
  languageStats: LanguageStat[];
  contributors: Contributor[];
  latestRelease: { tag: string; publishedAt: string } | null;
}

const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

export function GithubClient() {
  const searchParams = useSearchParams();
  const [connection, setConnection] = useState<Connection | null>(null);
  const [repos, setRepos] = useState<Repo[]>([]);
  const [reposLoaded, setReposLoaded] = useState(false);
  const [loadingConn, setLoadingConn] = useState(true);
  const [loadingRepos, setLoadingRepos] = useState(true);
  const [analyzing, setAnalyzing] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<Record<string, Analysis>>({});
  const [expanded, setExpanded] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const urlError = searchParams.get("error");

  const loadConnection = useCallback(async () => {
    try {
      const res = await fetch("/api/github/connection");
      const data = (await res.json()) as Connection;
      setConnection(data);
    } catch {
      setConnection({ connected: false, login: null, name: null, avatarUrl: null, scope: null });
    } finally {
      setLoadingConn(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/github/connection")
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data: Connection) => {
        if (!cancelled) setConnection(data);
      })
      .catch(() => {
        if (!cancelled) {
          setConnection({
            connected: false,
            login: null,
            name: null,
            avatarUrl: null,
            scope: null,
          });
        }
      })
      .finally(() => {
        if (!cancelled) setLoadingConn(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const loadRepos = useCallback(async () => {
    try {
      const res = await fetch("/api/github/repos");
      const data = (await res.json()) as { repos: Repo[] };
      setRepos(data.repos);
      setReposLoaded(true);
    } catch {
      setError("Impossible de charger les dépôts GitHub.");
    } finally {
      setLoadingRepos(false);
    }
  }, []);

  useEffect(() => {
    if (!connection?.connected || reposLoaded) return;
    let cancelled = false;
    fetch("/api/github/repos")
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data: { repos: Repo[] }) => {
        if (!cancelled) {
          setRepos(data.repos);
          setReposLoaded(true);
        }
      })
      .catch(() => {
        if (!cancelled) setError("Impossible de charger les dépôts GitHub.");
      })
      .finally(() => {
        if (!cancelled) setLoadingRepos(false);
      });
    return () => {
      cancelled = true;
    };
  }, [connection, reposLoaded]);

  const connect = () => {
    // eslint-disable-next-line @next/next/no-location-assign-relative-destination -- OAuth: l'API /api/github/auth répond par une redirection 307 vers GitHub, router.push ne convient pas.
    window.location.href = "/api/github/auth";
  };

  const disconnect = async () => {
    await fetch("/api/github/connection", { method: "DELETE" });
    setRepos([]);
    setReposLoaded(false);
    setAnalysis({});
    setExpanded(null);
    void loadConnection();
  };

  const toggleAnalyze = async (fullName: string) => {
    if (expanded === fullName) {
      setExpanded(null);
      return;
    }
    setExpanded(fullName);
    if (analysis[fullName]) return;

    setAnalyzing(fullName);
    setError(null);
    try {
      const [owner, repo] = fullName.split("/");
      const res = await fetch(`/api/github/repos/${owner}/${repo}/analysis`);
      if (!res.ok) {
        const body = (await res.json()) as { error?: string };
        throw new Error(body.error ?? "Analyse impossible");
      }
      const data = (await res.json()) as Analysis;
      setAnalysis((prev) => ({ ...prev, [fullName]: data }));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Analyse impossible.");
    } finally {
      setAnalyzing(null);
    }
  };

  const metricTiles = (a: Analysis) => [
    { label: "Étoiles", value: a.stars.toLocaleString(), icon: Star, color: "#f59e0b" },
    { label: "Forks", value: a.forks.toLocaleString(), icon: GitFork, color: "#3b82f6" },
    { label: "Issues ouvertes", value: a.openIssues.toLocaleString(), icon: Bug, color: "#ef4444" },
    {
      label: "PR ouvertes",
      value: a.openPulls.toLocaleString(),
      icon: GitPullRequest,
      color: "#10b981",
    },
    {
      label: "Commits (90j)",
      value: a.commits90d.toLocaleString(),
      icon: BarChart3,
      color: "#842ae3",
    },
    { label: "Watchers", value: a.watchers.toLocaleString(), icon: Eye, color: "#64748b" },
  ];

  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={fadeUp} className="flex items-center justify-between">
        <div>
          <h1 className="dark:text-foreground text-xl font-semibold tracking-tight text-gray-900">
            GitHub
          </h1>
          <p className="mt-0.5 text-[13px] text-gray-500 dark:text-gray-400">
            Connectez votre compte GitHub pour analyser vos dépôts et naviguer dans leur code.
          </p>
        </div>
      </motion.div>

      {urlError && (
        <motion.div variants={fadeUp}>
          <Card className="border-destructive/40 bg-destructive/5">
            <CardContent className="text-destructive flex items-center gap-3 py-3 text-[13px]">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {urlError === "state" && "La vérification OAuth a échoué. Réessayez."}
              {urlError === "github" &&
                "GitHub a refusé la connexion. Vérifiez la configuration GITHUB_CLIENT_ID / GITHUB_CLIENT_SECRET."}
            </CardContent>
          </Card>
        </motion.div>
      )}

      <motion.div variants={fadeUp}>
        <Card className="border-border bg-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-[14px] font-semibold">Connexion GitHub</CardTitle>
          </CardHeader>
          <CardContent>
            {loadingConn ? (
              <div className="flex h-16 items-center justify-center">
                <Loader2 className="text-muted-foreground h-5 w-5 animate-spin" />
              </div>
            ) : connection?.connected ? (
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  {connection.avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={connection.avatarUrl}
                      alt={connection.login ?? "GitHub"}
                      className="h-10 w-10 rounded-full"
                    />
                  ) : (
                    <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-full">
                      <Github className="text-primary h-5 w-5" />
                    </div>
                  )}
                  <div>
                    <p className="dark:text-foreground text-[14px] font-semibold text-gray-900">
                      {connection.name ?? connection.login}
                    </p>
                    <p className="text-[12px] text-gray-500 dark:text-gray-400">
                      @{connection.login} · connecté
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setLoadingRepos(true);
                      void loadRepos();
                    }}
                  >
                    <RefreshCw className="mr-2 h-3.5 w-3.5" />
                    Actualiser
                  </Button>{" "}
                  <Button size="sm" variant="outline" onClick={() => void disconnect()}>
                    <Unlink className="mr-2 h-3.5 w-3.5" />
                    Déconnecter
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-4 py-4 text-center">
                <div className="bg-primary/10 flex h-12 w-12 items-center justify-center rounded-2xl">
                  <Github className="text-primary h-6 w-6" />
                </div>
                <div>
                  <p className="dark:text-foreground text-[14px] font-medium text-gray-900">
                    Aucun compte GitHub connecté
                  </p>
                  <p className="mt-1 max-w-md text-[12px] text-gray-500 dark:text-gray-400">
                    Connectez-vous à GitHub pour analyser vos dépôts (langages, commits, étoiles,
                    issues, PR) et explorer leur code avec l&apos;éditeur intégré.
                  </p>
                </div>
                <Button onClick={connect}>
                  <Link2 className="mr-2 h-4 w-4" />
                  Connecter GitHub
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {error && (
        <motion.div variants={fadeUp}>
          <Card className="border-destructive/40 bg-destructive/5">
            <CardContent className="text-destructive flex items-center gap-3 py-3 text-[13px]">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </CardContent>
          </Card>
        </motion.div>
      )}

      {connection?.connected && (
        <motion.div variants={fadeUp}>
          <Card className="border-border bg-card">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-[14px] font-semibold">Dépôts ({repos.length})</CardTitle>
                {loadingRepos && <Loader2 className="text-muted-foreground h-4 w-4 animate-spin" />}
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {repos.length === 0 && !loadingRepos ? (
                <p className="px-6 py-10 text-center text-[13px] text-gray-500">
                  Aucun dépôt trouvé.
                </p>
              ) : (
                <div className="divide-y divide-gray-100/80 dark:divide-white/[0.04]">
                  {repos.map((repo) => {
                    const isExpanded = expanded === repo.fullName;
                    const a = analysis[repo.fullName];
                    return (
                      <div key={repo.id}>
                        <div className="dark:hover:bg-accent/[0.02] flex items-center justify-between gap-4 px-6 py-3.5 transition-colors hover:bg-gray-50/80">
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <button
                                onClick={() => void toggleAnalyze(repo.fullName)}
                                className="hover:text-primary dark:text-foreground text-left font-mono text-[13px] font-medium text-gray-900"
                              >
                                {repo.fullName}
                              </button>
                              {repo.archived && (
                                <span className="rounded-md bg-gray-100 px-1.5 py-0.5 text-[10px] font-medium tracking-wide text-gray-500 uppercase dark:bg-white/5 dark:text-gray-400">
                                  archived
                                </span>
                              )}
                            </div>
                            {repo.description && (
                              <p className="mt-0.5 truncate text-[12px] text-gray-500 dark:text-gray-400">
                                {repo.description}
                              </p>
                            )}
                            <div className="mt-1.5 flex flex-wrap items-center gap-3 text-[11px] text-gray-500 dark:text-gray-400">
                              {repo.language && (
                                <span className="flex items-center gap-1">
                                  <span className="bg-primary/70 h-2 w-2 rounded-full" />
                                  {repo.language}
                                </span>
                              )}
                              <span className="flex items-center gap-1">
                                <Star className="h-3 w-3" /> {repo.stars}
                              </span>
                              <span className="flex items-center gap-1">
                                <GitFork className="h-3 w-3" /> {repo.forks}
                              </span>
                              <span>
                                {new Date(repo.updatedAt).toLocaleDateString("fr-FR", {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                })}
                              </span>
                            </div>
                          </div>
                          <div className="flex shrink-0 items-center gap-2">
                            <Button size="sm" variant="outline" asChild>
                              <a href={repo.url} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="mr-1.5 h-3.5 w-3.5" />
                                GitHub
                              </a>
                            </Button>
                            <Button size="sm" variant="outline" asChild>
                              <a href={`/admin/github/repos/${repo.owner}/${repo.name}`}>
                                <FileCode2 className="mr-1.5 h-3.5 w-3.5" />
                                Code
                              </a>
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => void toggleAnalyze(repo.fullName)}
                              disabled={analyzing === repo.fullName}
                            >
                              {analyzing === repo.fullName ? (
                                <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                              ) : (
                                <BarChart3 className="mr-1.5 h-3.5 w-3.5" />
                              )}
                              {a ? (isExpanded ? "Fermer" : "Analyse") : "Analyser"}
                            </Button>
                          </div>
                        </div>

                        {isExpanded && a && (
                          <div className="border-t border-gray-100/80 bg-gray-50/50 px-6 py-5 dark:border-white/[0.04] dark:bg-black/20">
                            <div className="mb-4 flex flex-wrap items-center gap-3">
                              <h3 className="dark:text-foreground font-mono text-[13px] font-semibold text-gray-900">
                                {a.fullName}
                              </h3>
                              {a.language && (
                                <span className="flex items-center gap-1 text-[11px] text-gray-500 dark:text-gray-400">
                                  <span className="bg-primary/70 h-2 w-2 rounded-full" />
                                  {a.language}
                                </span>
                              )}
                              {a.license && (
                                <span className="flex items-center gap-1 text-[11px] text-gray-500 dark:text-gray-400">
                                  <Tag className="h-3 w-3" /> {a.license}
                                </span>
                              )}
                              <span className="text-[11px] text-gray-500 dark:text-gray-400">
                                branche {a.defaultBranch}
                              </span>
                              {a.latestRelease && (
                                <span className="flex items-center gap-1 rounded-md bg-emerald-500/10 px-1.5 py-0.5 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                                  <Rocket className="h-3 w-3" /> {a.latestRelease.tag}
                                </span>
                              )}
                            </div>

                            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
                              {metricTiles(a).map((m) => (
                                <div
                                  key={m.label}
                                  className="bg-card rounded-xl border border-gray-200/80 p-3 dark:border-white/[0.06]"
                                >
                                  <div className="flex items-center gap-1.5 text-[11px] text-gray-500 dark:text-gray-400">
                                    <m.icon className="h-3 w-3" style={{ color: m.color }} />
                                    {m.label}
                                  </div>
                                  <p className="dark:text-foreground mt-1 text-[18px] font-semibold tracking-tight text-gray-900">
                                    {m.value}
                                  </p>
                                </div>
                              ))}
                            </div>

                            {a.languageStats.length > 0 && (
                              <div className="mt-5">
                                <p className="mb-2 text-[12px] font-medium text-gray-500 dark:text-gray-400">
                                  Langages
                                </p>
                                <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-gray-200/70 dark:bg-white/5">
                                  {a.languageStats.map((lang) => (
                                    <div
                                      key={lang.name}
                                      title={`${lang.name}: ${lang.percent}%`}
                                      className="h-full"
                                      style={{
                                        width: `${lang.percent}%`,
                                        backgroundColor: `hsl(${(lang.name.length * 37) % 360}, 70%, 55%)`,
                                      }}
                                    />
                                  ))}
                                </div>
                                <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
                                  {a.languageStats.map((lang) => (
                                    <span
                                      key={lang.name}
                                      className="flex items-center gap-1.5 text-[11px] text-gray-500 dark:text-gray-400"
                                    >
                                      <span
                                        className="h-2 w-2 rounded-full"
                                        style={{
                                          backgroundColor: `hsl(${(lang.name.length * 37) % 360}, 70%, 55%)`,
                                        }}
                                      />
                                      {lang.name} · {lang.percent}%
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}

                            {a.contributors.length > 0 && (
                              <div className="mt-5">
                                <p className="mb-2 text-[12px] font-medium text-gray-500 dark:text-gray-400">
                                  Contributeurs
                                </p>
                                <div className="flex flex-wrap gap-3">
                                  {a.contributors.map((c) => (
                                    <div
                                      key={c.login}
                                      className="bg-card flex items-center gap-2 rounded-lg border border-gray-200/80 px-2.5 py-1.5 dark:border-white/[0.06]"
                                    >
                                      {c.avatarUrl && (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img
                                          src={c.avatarUrl}
                                          alt={c.login}
                                          className="h-5 w-5 rounded-full"
                                        />
                                      )}
                                      <span className="text-[11px] font-medium text-gray-700 dark:text-gray-300">
                                        {c.login}
                                      </span>
                                      <span className="text-[11px] text-gray-400 dark:text-gray-500">
                                        {c.contributions}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}

      {!connection?.connected && (
        <motion.div variants={fadeUp}>
          <div className="flex items-center gap-2 rounded-xl border border-dashed border-gray-200 bg-gray-50/60 px-4 py-3 text-[12px] text-gray-500 dark:border-white/10 dark:bg-white/[0.02] dark:text-gray-400">
            <Github className="h-4 w-4 shrink-0" />
            <span>
              Configurez <code className="font-mono">GITHUB_CLIENT_ID</code> et{" "}
              <code className="font-mono">GITHUB_CLIENT_SECRET</code> dans l&apos;environnement
              (OAuth App GitHub, redirect URI /api/github/callback) pour activer la connexion.
            </span>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
