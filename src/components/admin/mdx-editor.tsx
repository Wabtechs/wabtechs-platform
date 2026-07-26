"use client";

import { useState, useCallback, useMemo } from "react";
import {
  Bold,
  Italic,
  Heading1,
  Heading2,
  Link2,
  Code,
  List,
  ListOrdered,
  Quote,
  Eye,
  Edit3,
  Columns,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function simpleMarkdown(md: string): string {
  return md
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/^### (.+)$/gm, '<h3 class="text-lg font-semibold mt-6 mb-2">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="text-xl font-bold mt-8 mb-3">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 class="text-2xl font-bold mt-8 mb-4">$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`(.+?)`/g, '<code class="rounded bg-gray-100 px-1.5 py-0.5 text-sm dark:bg-white/10">$1</code>')
    .replace(/```(\w*)\n([\s\S]*?)```/g, '<pre class="overflow-x-auto rounded-lg bg-gray-100 p-4 text-sm dark:bg-white/5"><code>$2</code></pre>')
    .replace(/^\> (.+)$/gm, '<blockquote class="border-l-4 border-primary pl-4 italic text-gray-600 dark:text-gray-400">$1</blockquote>')
    .replace(/^\- (.+)$/gm, '<li class="ml-4 list-disc">$1</li>')
    .replace(/^\d+\. (.+)$/gm, '<li class="ml-4 list-decimal">$1</li>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-primary underline">$1</a>')
    .replace(/\n\n/g, '</p><p class="mb-3">')
    .replace(/^(?!<[hlupbo])/gm, "")
    .replace(/\n/g, "\n");
}

interface MdxEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
}

export function MdxEditor({ value, onChange, placeholder = "Écrivez votre contenu en Markdown...", rows = 20 }: MdxEditorProps) {
  const [mode, setMode] = useState<"split" | "edit" | "preview">("split");

  const insertAt = useCallback(
    (before: string, after: string) => {
      const textarea = document.getElementById("mdx-editor-textarea") as HTMLTextAreaElement | null;
      if (!textarea) return;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selected = value.substring(start, end);
      const newText = value.substring(0, start) + before + selected + after + value.substring(end);
      onChange(newText);
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + before.length, start + before.length + selected.length);
      }, 0);
    },
    [value, onChange],
  );

  const toolbar = [
    { icon: Bold, title: "Gras", action: () => insertAt("**", "**") },
    { icon: Italic, title: "Italique", action: () => insertAt("*", "*") },
    { icon: Heading1, title: "Titre 1", action: () => insertAt("# ", "") },
    { icon: Heading2, title: "Titre 2", action: () => insertAt("## ", "") },
    { icon: Link2, title: "Lien", action: () => insertAt("[", "](url)") },
    { icon: Code, title: "Code", action: () => insertAt("`", "`") },
    { icon: List, title: "Liste", action: () => insertAt("- ", "") },
    { icon: ListOrdered, title: "Liste numérotée", action: () => insertAt("1. ", "") },
    { icon: Quote, title: "Citation", action: () => insertAt("> ", "") },
  ];

  const preview = useMemo(() => ({ __html: simpleMarkdown(value || "") }), [value]);

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-border">
      {/* Toolbar */}
      <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50 px-2 py-1 dark:border-border dark:bg-muted">
        <div className="flex items-center gap-0.5">
          {toolbar.map((item) => (
            <Button
              key={item.title}
              type="button"
              variant="ghost"
              size="icon"
              onClick={item.action}
              title={item.title}
              className="h-7 w-7 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-foreground"
            >
              <item.icon className="h-3.5 w-3.5" />
            </Button>
          ))}
        </div>
        <div className="flex items-center gap-0.5">
          <Button
            type="button"
            variant={mode === "edit" ? "secondary" : "ghost"}
            size="icon"
            onClick={() => setMode("edit")}
            className="h-7 w-7"
          >
            <Edit3 className="h-3.5 w-3.5" />
          </Button>
          <Button
            type="button"
            variant={mode === "split" ? "secondary" : "ghost"}
            size="icon"
            onClick={() => setMode("split")}
            className="h-7 w-7"
          >
            <Columns className="h-3.5 w-3.5" />
          </Button>
          <Button
            type="button"
            variant={mode === "preview" ? "secondary" : "ghost"}
            size="icon"
            onClick={() => setMode("preview")}
            className="h-7 w-7"
          >
            <Eye className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className={cn("flex min-h-[400px]", mode === "split" ? "divide-x divide-gray-200 dark:divide-white/10" : "")}>
        {(mode === "edit" || mode === "split") && (
          <textarea
            id="mdx-editor-textarea"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            rows={rows}
            spellCheck={false}
            className={cn(
              "w-full resize-none bg-white p-4 font-mono text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none dark:bg-card dark:text-foreground",
              mode === "split" ? "border-r border-gray-200 dark:border-border" : "",
            )}
          />
        )}
        {(mode === "preview" || mode === "split") && (
          <div
            className="prose prose-sm max-w-none p-4 text-gray-900 dark:prose-invert dark:text-gray-100"
            dangerouslySetInnerHTML={preview}
          />
        )}
      </div>
    </div>
  );
}
