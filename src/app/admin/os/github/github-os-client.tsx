"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
  Github,
  Loader2,
  RefreshCw,
  Star,
  GitFork,
  ExternalLink,
  AlertCircle,
  Unlink,
  Plus,
  Search,
  GitPullRequest,
  Bug,
  FileCode2,
  Rocket,
  PlayCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { OsStatCard } from "@/components/admin/os/os-stat-card";
import { OsEmpty } from "@/components/admin/os/os-empty";

interface OsGithubState {
  connected: boolean;
  connection?: {
    login: string | null;
    name: string | null;
    avatarUrl: string | null;
    scope: string | null;
    lastSyncAt: string | null;
  };
  linkedRepos: OsLinkedRepo[];
  stats: {
    repositories: number;
    issues: number;
    pullRequests: number;
    commits: number;
    releases: number;
    workflowRuns: number;
  };
}

interface OsLinkedRepo {
  id: string;
  githubId: number;
  owner: string;
  name: string;
  fullName: string;
  url: string;
  defaultBranch: string;
  visibility: string;
  language: string | null;
  description: string | null;
  stars: number;
  forks: number;
  openIssues: number;
  archived: boolean;
  status: string;
  lastSyncAt: string | null;
  project: { id: string; slug: string; name: string; color: string } | null;
}

interface AvailableRepo {
  id: number;
  name: string;
  fullName: string;
  description: string | null;
  url: string;
  language: string | null;
  stars: number;
  forks: number;
  defaultBranch: string;
  visibility: string;
  archived: boolean;
  owner: string;
}

interface OsProjectOption {
  id: string;
  slug: string;
  name: string;
}

export function GithubOsClient() {
  const [state, setState] = useState<OsGithubState | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [syncingRepo, setSyncingRepo] = useState<string | null>(null);
  const [syncingAll, setSyncingAll] = useState(false);
  const [projects, setProjects] = useState<OsProjectOption[]>([]);
  const [showPicker, setShowPicker] = useState(false);
  const [search, setSearch] = useState("");
  const [availableRepos, setAvailableRepos] = useState<AvailableRepo[]>([]);
  const [loadingRepos, setLoadingRepos] = useState(false);

  const loadState = useCallback(async () => {
    try {
      setError(null);
      const res = await fetch("/api/admin/os/github");
      if (!res.ok) {
        setError("Impossible de charger l'intégration GitHub.");
        setState(null);
        return;
      }
      const data = (await res.json()) as OsGithubState;
      setState(data);
    } catch {
      setError("Impossible de charger l'intégration GitHub.");
    } finally {
      setLoading(false);
    }
  }, []);

  const loadProjects = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/os/projects");
      if (!res.ok) return;
      const data = (await res.json()) as { projects?: OsProjectOption[] };
      const list = Array.isArray(data) ? data : (data.projects ?? []);
      setProjects(list.map((p) => ({ id: p.id, slug: p.slug, name: p.name })));
    } catch {
      setProjects([]);
    }
  }, []);

  useEffect(() => {
    void loadState();
    void loadProjects();
  }, [loadState, loadProjects]);

  const syncOne = useCallback(
    async (id: string) => {
      setSyncingRepo(id);
      try {
        const res = await fetch("/api/admin/os/github/sync", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ repositoryId: id }),
        });
        if (!res.ok) {
          const data = (await res.json().catch(() => null)) as { error?: string } | null;
          toast.error(data?.error ?? "Synchronisation échouée.");
          return;
        }
        toast.success("Dépôt synchronisé.");
        await loadState();
      } finally {
        setSyncingRepo(null);
      }
    },
    [loadState],
  );

  const syncAll = useCallback(async () => {
    setSyncingAll(true);
    try {
      const res = await fetch("/api/admin/os/github/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      if (!res.ok) {
        toast.error("Synchronisation globale échouée.");
        return;
      }
      toast.success("Synchronisation globale terminée.");
      await loadState();
    } finally {
      setSyncingAll(false);
    }
  }, [loadState]);

  const unlink = useCallback(
    async (id: string) => {
      try {
        const res = await fetch(`/api/admin/os/github/repos/${id}`, { method: "DELETE" });
        if (!res.ok) {
          toast.error("Impossible de dissocier le dépôt.");
          return;
        }
        toast.success("Dépôt dissocié.");
        await loadState();
      } catch {
        toast.error("Erreur réseau.");
      }
    },
    [loadState],
  );

  const openPicker = useCallback(async () => {
    setShowPicker(true);
    setLoadingRepos(true);
    setAvailableRepos([]);
    setSearch("");
    try {
      const res = await fetch("/api/admin/os/github/available-repos");
      if (!res.ok) {
        toast.error("Impossible de lister les dépôts disponibles.");
        return;
      }
      const data = (await res.json()) as { repos: AvailableRepo[] };
      setAvailableRepos(data.repos ?? []);
    } finally {
      setLoadingRepos(false);
    }
  }, []);

  const linkRepo = useCallback(
    async (repo: AvailableRepo) => {
      try {
        const res = await fetch("/api/admin/os/github/repos", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ owner: repo.owner, name: repo.name }),
        });
        if (!res.ok) {
          const data = (await res.json().catch(() => null)) as { error?: string } | null;
          toast.error(data?.error ?? "Impossible de lier le dépôt.");
          return;
        }
        toast.success(`${repo.fullName} lié.`);
        setShowPicker(false);
        await loadState();
      } catch {
        toast.error("Erreur réseau.");
      }
    },
    [loadState],
  );

  const setProject = useCallback(
    async (repoId: string, projectId: string | null) => {
      try {
        const res = await fetch(`/api/admin/os/github/repos/${repoId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ projectId }),
        });
        if (!res.ok) {
          toast.error("Impossible d'associer le projet.");
          return;
        }
        toast.success("Projet associé.");
        await loadState();
      } catch {
        toast.error("Erreur réseau.");
      }
    },
    [loadState],
  );

  const filteredRepos = availableRepos.filter((r) => {
    const linked = new Set((state?.linkedRepos ?? []).map((x) => x.fullName.toLowerCase()));
    if (linked.has(r.fullName.toLowerCase())) return false;
    const term = search.trim().toLowerCase();
    if (!term) return true;
    return (
      r.name.toLowerCase().includes(term) ||
      r.fullName.toLowerCase().includes(term) ||
      (r.description ?? "").toLowerCase().includes(term)
    );
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="text-muted-foreground h-6 w-6 animate-spin" />
      </div>
    );
  }

  if (error || !state) {
    return (
      <OsEmpty
        icon={<AlertCircle className="h-10 w-10" />}
        title="Intégration GitHub indisponible"
        hint={error ?? undefined}
      />
    );
  }

  if (!state.connected) {
    return (
      <div className="space-y-4">
        <OsEmpty
          icon={<Github className="h-10 w-10" />}
          title="Compte GitHub non connecté"
          hint="Connectez votre compte GitHub pour synchroniser dépôts, issues et releases avec Project OS."
        />
        <div className="flex justify-center">
          <Button asChild>
            <Link href="/admin/github">
              <Github className="mr-2 h-4 w-4" />
              Se connecter à GitHub
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <OsStatCard
          label="Dépôts"
          value={state.stats.repositories}
          icon={<Github className="h-4 w-4" />}
        />
        <OsStatCard label="Issues" value={state.stats.issues} icon={<Bug className="h-4 w-4" />} />
        <OsStatCard
          label="Pull requests"
          value={state.stats.pullRequests}
          icon={<GitPullRequest className="h-4 w-4" />}
        />
        <OsStatCard
          label="Commits"
          value={state.stats.commits}
          icon={<FileCode2 className="h-4 w-4" />}
        />
        <OsStatCard
          label="Releases"
          value={state.stats.releases}
          icon={<Rocket className="h-4 w-4" />}
        />
        <OsStatCard
          label="Runs CI"
          value={state.stats.workflowRuns}
          icon={<PlayCircle className="h-4 w-4" />}
        />
      </div>

      {state.connection && (
        <Card>
          <CardHeader className="flex-row items-center justify-between gap-4">
            <CardTitle className="text-sm font-semibold">Connexion GitHub</CardTitle>
            <Button
              size="sm"
              variant="outline"
              onClick={() => void syncAll()}
              disabled={syncingAll}
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${syncingAll ? "animate-spin" : ""}`} />
              {syncingAll ? "Synchronisation…" : "Synchroniser tout"}
            </Button>
          </CardHeader>
          <CardContent className="flex flex-wrap items-center gap-4">
            {state.connection.avatarUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={state.connection.avatarUrl}
                alt={state.connection.login ?? "GitHub"}
                className="h-10 w-10 rounded-full"
              />
            )}
            <div>
              <p className="text-sm font-medium">
                {state.connection.name ?? state.connection.login}
              </p>
              <p className="text-muted-foreground text-[12px]">@{state.connection.login}</p>
            </div>
            <div className="text-muted-foreground ml-auto text-right text-[12px]">
              <p>Scopes : {state.connection.scope ?? "—"}</p>
              <p>
                Dernière sync :{" "}
                {state.connection.lastSyncAt
                  ? new Date(state.connection.lastSyncAt).toLocaleString("fr-FR")
                  : "—"}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader className="flex-row items-center justify-between gap-4">
          <CardTitle className="text-sm font-semibold">Dépôts liés</CardTitle>
          <Button size="sm" onClick={() => void openPicker()}>
            <Plus className="mr-2 h-4 w-4" />
            Lier un dépôt
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          {state.linkedRepos.length === 0 && (
            <p className="text-muted-foreground py-6 text-center text-[13px]">
              Aucun dépôt lié. Liez un dépôt pour synchroniser issues, PR, commits, releases et CI.
            </p>
          )}
          {state.linkedRepos.map((repo) => (
            <div
              key={repo.id}
              className="dark:border-border flex flex-wrap items-center gap-3 rounded-lg border p-3"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="truncate text-sm font-medium">{repo.fullName}</span>
                  {repo.archived && <Badge variant="outline">Archivé</Badge>}
                </div>
                {repo.description && (
                  <p className="text-muted-foreground mt-0.5 truncate text-[12px]">
                    {repo.description}
                  </p>
                )}
                <div className="text-muted-foreground mt-1 flex flex-wrap items-center gap-3 text-[12px]">
                  <span>{repo.language ?? "—"}</span>
                  <span className="inline-flex items-center gap-1">
                    <Star className="h-3 w-3" /> {repo.stars}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <GitFork className="h-3 w-3" /> {repo.forks}
                  </span>
                  <span>{repo.defaultBranch}</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <select
                  value={repo.project?.id ?? ""}
                  onChange={(e) => void setProject(repo.id, e.target.value || null)}
                  className="bg-background h-8 rounded-md border px-2 text-[12px]"
                >
                  <option value="">Aucun projet</option>
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
                <Button size="sm" variant="outline" asChild>
                  <a href={repo.url} target="_blank" rel="noreferrer">
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => void syncOne(repo.id)}
                  disabled={syncingRepo === repo.id}
                >
                  <RefreshCw
                    className={`mr-1 h-3.5 w-3.5 ${syncingRepo === repo.id ? "animate-spin" : ""}`}
                  />
                  Sync
                </Button>
                <Button size="sm" variant="ghost" onClick={() => void unlink(repo.id)}>
                  <Unlink className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {showPicker && (
        <Card>
          <CardHeader className="flex-row items-center justify-between gap-4">
            <CardTitle className="text-sm font-semibold">Dépôts disponibles</CardTitle>
            <Button size="sm" variant="ghost" onClick={() => setShowPicker(false)}>
              Fermer
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="relative">
              <Search className="text-muted-foreground absolute top-1/2 left-2.5 h-4 w-4 -translate-y-1/2" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher un dépôt…"
                className="pl-8"
              />
            </div>
            {loadingRepos && (
              <div className="flex items-center justify-center py-6">
                <Loader2 className="text-muted-foreground h-5 w-5 animate-spin" />
              </div>
            )}
            {!loadingRepos && filteredRepos.length === 0 && (
              <p className="text-muted-foreground py-6 text-center text-[13px]">
                Aucun dépôt disponible.
              </p>
            )}
            <div className="max-h-96 space-y-2 overflow-y-auto">
              {filteredRepos.map((repo) => (
                <div
                  key={repo.id}
                  className="dark:border-border flex items-center justify-between gap-3 rounded-lg border px-3 py-2"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{repo.fullName}</p>
                    {repo.description && (
                      <p className="text-muted-foreground truncate text-[12px]">
                        {repo.description}
                      </p>
                    )}
                  </div>
                  <Button size="sm" variant="outline" onClick={() => void linkRepo(repo)}>
                    Lier
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
