"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";

interface CopyButtonProps {
  text: string;
  className?: string;
}

export function CopyButton({ text, className }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className={cn(
        "inline-flex items-center gap-1 rounded-md border bg-muted px-2 py-1 text-xs transition-colors hover:bg-accent",
        className,
      )}
    >
      {copied ? (
        <>
          <Check className="h-3 w-3" />
          Copié
        </>
      ) : (
        <>
          <Copy className="h-3 w-3" />
          Copier
        </>
      )}
    </button>
  );
}
