"use client";

import { useEffect, useMemo, useState } from "react";
import { useTheme } from "next-themes";
import Editor from "@monaco-editor/react";
import {
  AlertCircle,
  ArrowLeft,
  ChevronRight,
  ExternalLink,
  File,
  FileCode2,
  FileImage,
  FileJson,
  FileText,
  Folder,
  FolderOpen,
  Github,
  Loader2,
  Search,
  Settings,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface TreeFile {
  path: string;
  size: number;
}

interface TreeNode {
  name: string;
  path: string;
  type: "dir" | "file";
  size?: number;
  children: TreeNode[];
}

interface FileContent {
  name: string;
  path: string;
  size: number;
  content: string;
  htmlUrl: string;
}

const LANGUAGE_BY_EXT: Record<string, string> = {
  ts: "typescript",
  tsx: "typescript",
  js: "javascript",
  jsx: "javascript",
  mjs: "javascript",
  cjs: "javascript",
  json: "json",
  jsonc: "json",
  html: "html",
  htm: "html",
  css: "css",
  scss: "scss",
  less: "less",
  md: "markdown",
  mdx: "markdown",
  yml: "yaml",
  yaml: "yaml",
  xml: "xml",
  svg: "xml",
  py: "python",
  rb: "ruby",
  go: "go",
  rs: "rust",
  java: "java",
  c: "c",
  h: "c",
  cpp: "cpp",
  cs: "csharp",
  php: "php",
  sh: "shell",
  bash: "shell",
  zsh: "shell",
  ps1: "powershell",
  sql: "sql",
  toml: "ini",
  ini: "ini",
  dockerfile: "dockerfile",
  prisma: "plaintext",
  vue: "vue",
  svelte: "svelte",
  graphql: "graphql",
  gql: "graphql",
  swift: "swift",
  kt: "kotlin",
  dart: "dart",
  lua: "lua",
  r: "r",
  sol: "sol",
  env: "ini",
};

function detectLanguage(filePath: string): string {
  const name = filePath.split("/").pop() ?? "";
  if (name === "Dockerfile") return "dockerfile";
  const ext = name.split(".").pop()?.toLowerCase() ?? "";
  return LANGUAGE_BY_EXT[ext] ?? "plaintext";
}

function fileIcon(path: string) {
  const name = path.split("/").pop() ?? "";
  if (/\.(png|jpe?g|gif|webp|svg|ico|bmp)$/i.test(name)) return FileImage;
  if (/\.(json|jsonc|lock)$/i.test(name)) return FileJson;
  if (/\.(md|mdx|txt|rst)$/i.test(name)) return FileText;
  if (/\.(env|config|gitignore|npmrc)$/i.test(name)) return Settings;
  if (/\.(ts|tsx|js|jsx|py|go|rs|java|cs|cpp|c|php|rb)$/i.test(name)) return FileCode2;
  return File;
}

function buildTree(files: TreeFile[]): TreeNode[] {
  const root: TreeNode[] = [];
  const map = new Map<string, TreeNode>();

  for (const file of files) {
    const parts = file.path.split("/");
    let current = root;
    let acc = "";
    parts.forEach((part, index) => {
      acc = acc ? `${acc}/${part}` : part;
      let node = map.get(acc);
      if (!node) {
        const isFile = index === parts.length - 1;
        node = {
          name: part,
          path: acc,
          type: isFile ? "file" : "dir",
          size: isFile ? file.size : undefined,
          children: [],
        };
        map.set(acc, node);
        current.push(node);
      }
      current = node.children;
    });
  }

  return root;
}

interface TreeProps {
  nodes: TreeNode[];
  depth: number;
  openDirs: Set<string>;
  toggleDir: (path: string) => void;
  activePath: string | null;
  onSelect: (path: string) => void;
}

function FileTreeNode({ nodes, depth, openDirs, toggleDir, activePath, onSelect }: TreeProps) {
  return (
    <>
      {nodes.map((node) => {
        const indent = depth * 14 + 6;
        if (node.type === "dir") {
          const open = openDirs.has(node.path);
          return (
            <div key={node.path}>
              <button
                type="button"
                onClick={() => toggleDir(node.path)}
                className="flex w-full items-center gap-1 rounded-md py-[3px] pr-2 text-left text-[12px] text-gray-600 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/5"
                style={{ paddingLeft: indent }}
              >
                <ChevronRight
                  className={`h-3 w-3 shrink-0 transition-transform ${open ? "rotate-90" : ""}`}
                />
                {open ? (
                  <FolderOpen className="h-3.5 w-3.5 shrink-0 text-amber-500" />
                ) : (
                  <Folder className="h-3.5 w-3.5 shrink-0 text-amber-500" />
                )}
                <span className="truncate">{node.name}</span>
              </button>
              {open && (
                <FileTreeNode
                  nodes={node.children}
                  depth={depth + 1}
                  openDirs={openDirs}
                  toggleDir={toggleDir}
                  activePath={activePath}
                  onSelect={onSelect}
                />
              )}
            </div>
          );
        }
        const Icon = fileIcon(node.path);
        const active = activePath === node.path;
        return (
          <button
            key={node.path}
            type="button"
            onClick={() => onSelect(node.path)}
            className={`flex w-full items-center gap-1 rounded-md py-[3px] pr-2 text-left text-[12px] transition-colors ${
              active
                ? "bg-primary/10 text-primary font-medium"
                : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/5"
            }`}
            style={{ paddingLeft: indent + 18 }}
          >
            <Icon className={`h-3.5 w-3.5 shrink-0 ${active ? "" : "text-gray-400"}`} />
            <span className="truncate">{node.name}</span>
          </button>
        );
      })}
    </>
  );
}

export function RepoBrowser({ owner, repo }: { owner: string; repo: string }) {
  const { theme } = useTheme();
  const isDark =
    theme === "dark" ||
    (theme === "system" &&
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);

  const [files, setFiles] = useState<TreeFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [defaultBranch, setDefaultBranch] = useState<string | null>(null);
  const [openDirs, setOpenDirs] = useState<Set<string>>(new Set());
  const [query, setQuery] = useState("");
  const [activePath, setActivePath] = useState<string | null>(null);
  const [content, setContent] = useState<FileContent | null>(null);
  const [contentLoading, setContentLoading] = useState(false);
  const [contentError, setContentError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/github/repos/${owner}/${repo}/tree`)
      .then((res) => {
        if (!res.ok)
          return res.json().then((b: { error?: string }) => Promise.reject(new Error(b.error)));
        return res.json();
      })
      .then((data: { files: TreeFile[]; defaultBranch: string }) => {
        if (!cancelled) {
          setFiles(data.files);
          setDefaultBranch(data.defaultBranch);
        }
      })
      .catch((e: unknown) => {
        if (!cancelled)
          setError(e instanceof Error ? e.message : "Impossible de charger l'arborescence.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [owner, repo]);

  const toggleDir = (path: string) => {
    setOpenDirs((prev) => {
      const next = new Set(prev);
      if (next.has(path)) next.delete(path);
      else next.add(path);
      return next;
    });
  };

  const openFile = (path: string) => {
    setActivePath(path);
    setContent(null);
    setContentError(null);
    setContentLoading(true);
    const encoded = path.split("/").map(encodeURIComponent).join("/");
    const ref = defaultBranch ? `?ref=${encodeURIComponent(defaultBranch)}` : "";
    fetch(`/api/github/repos/${owner}/${repo}/content/${encoded}${ref}`)
      .then((res) => {
        if (!res.ok)
          return res.json().then((b: { error?: string }) => Promise.reject(new Error(b.error)));
        return res.json();
      })
      .then((data: FileContent) => setContent(data))
      .catch((e: unknown) =>
        setContentError(e instanceof Error ? e.message : "Impossible de charger le fichier."),
      )
      .finally(() => setContentLoading(false));
  };

  const visibleFiles = useMemo(() => {
    if (!query.trim()) return files;
    const q = query.toLowerCase();
    return files.filter((f) => f.path.toLowerCase().includes(q));
  }, [files, query]);

  const tree = useMemo(() => buildTree(visibleFiles), [visibleFiles]);

  const lineCount = content ? content.content.split("\n").length : 0;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Button size="sm" variant="ghost" asChild>
            <a href="/admin/github">
              <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
              GitHub
            </a>
          </Button>
          <div className="flex items-center gap-2">
            <Github className="text-primary h-4 w-4" />
            <h1 className="dark:text-foreground font-mono text-[15px] font-semibold tracking-tight text-gray-900">
              {owner}/{repo}
            </h1>
            {defaultBranch && (
              <span className="rounded-md bg-gray-100 px-1.5 py-0.5 text-[10px] font-medium tracking-wide text-gray-500 uppercase dark:bg-white/5 dark:text-gray-400">
                {defaultBranch}
              </span>
            )}
          </div>
        </div>
        <Button size="sm" variant="outline" asChild>
          <a href={`https://github.com/${owner}/${repo}`} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="mr-1.5 h-3.5 w-3.5" />
            Ouvrir sur GitHub
          </a>
        </Button>
      </div>

      {error && (
        <Card className="border-destructive/40 bg-destructive/5">
          <CardContent className="text-destructive flex items-center gap-3 py-3 text-[13px]">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {error}
          </CardContent>
        </Card>
      )}

      {loading ? (
        <Card className="border-border bg-card">
          <CardContent className="flex h-[60vh] items-center justify-center">
            <Loader2 className="text-primary h-6 w-6 animate-spin" />
          </CardContent>
        </Card>
      ) : (
        <Card className="border-border bg-card overflow-hidden">
          <div className="flex h-[calc(100vh-220px)] min-h-[460px]">
            <div className="flex w-64 shrink-0 flex-col border-r border-gray-100 dark:border-white/[0.06]">
              <div className="border-b border-gray-100 p-2.5 dark:border-white/[0.06]">
                <div className="relative">
                  <Search className="text-muted-foreground absolute top-1/2 left-2.5 h-3.5 w-3.5 -translate-y-1/2" />
                  <Input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Filtrer les fichiers"
                    className="h-8 pl-8 text-[12px]"
                  />
                </div>
              </div>
              <div className="min-h-0 flex-1 overflow-auto p-2">
                {tree.length === 0 ? (
                  <p className="px-2 py-6 text-center text-[12px] text-gray-500">
                    {query ? "Aucun fichier ne correspond." : "Aucun fichier dans ce dépôt."}
                  </p>
                ) : (
                  <FileTreeNode
                    nodes={tree}
                    depth={0}
                    openDirs={openDirs}
                    toggleDir={toggleDir}
                    activePath={activePath}
                    onSelect={openFile}
                  />
                )}
              </div>
              <div className="border-t border-gray-100 px-3 py-2 text-[11px] text-gray-500 dark:border-white/[0.06] dark:text-gray-400">
                {files.length.toLocaleString("fr-FR")} fichiers · lecture seule
              </div>
            </div>

            <div className="flex min-w-0 flex-1 flex-col">
              <div className="flex h-11 shrink-0 items-center justify-between gap-3 border-b border-gray-100 px-4 dark:border-white/[0.06]">
                {activePath ? (
                  <>
                    <div className="flex min-w-0 items-center gap-2">
                      <FileCode2 className="h-3.5 w-3.5 shrink-0 text-gray-400" />
                      <span className="truncate font-mono text-[12px] font-medium text-gray-700 dark:text-gray-200">
                        {activePath}
                      </span>
                      <span className="hidden shrink-0 text-[11px] text-gray-400 sm:inline">
                        · {lineCount.toLocaleString("fr-FR")} lignes ·{" "}
                        {(content?.size ?? 0).toLocaleString("fr-FR")} octets
                      </span>
                    </div>
                    {content?.htmlUrl && (
                      <Button size="sm" variant="ghost" asChild>
                        <a href={content.htmlUrl} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      </Button>
                    )}
                  </>
                ) : (
                  <span className="text-[12px] text-gray-400">
                    Sélectionnez un fichier dans l&apos;arborescence pour l&apos;afficher.
                  </span>
                )}
              </div>

              <div className="relative min-h-0 flex-1">
                {contentError && (
                  <div className="flex h-full items-center justify-center">
                    <Card className="border-destructive/40 bg-destructive/5">
                      <CardContent className="text-destructive flex items-center gap-3 py-3 text-[13px]">
                        <AlertCircle className="h-4 w-4 shrink-0" />
                        {contentError}
                      </CardContent>
                    </Card>
                  </div>
                )}
                {content && !contentError && (
                  <Editor
                    height="100%"
                    path={activePath ?? "file"}
                    language={detectLanguage(activePath ?? "")}
                    value={content.content}
                    theme={isDark ? "vs-dark" : "light"}
                    options={{
                      readOnly: true,
                      minimap: { enabled: false },
                      fontSize: 13,
                      lineNumbers: "on",
                      scrollBeyondLastLine: false,
                      wordWrap: "on",
                      automaticLayout: true,
                      tabSize: 2,
                      renderWhitespace: "selection",
                      padding: { top: 12 },
                    }}
                  />
                )}
                {contentLoading && (
                  <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/60 backdrop-blur-sm dark:bg-black/60">
                    <Loader2 className="text-primary h-5 w-5 animate-spin" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
