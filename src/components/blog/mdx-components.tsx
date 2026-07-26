"use client";

import type { ComponentPropsWithoutRef } from "react";
import { CopyButton } from "@/components/shared/copy-button";

function CodeBlock({ children, ...props }: ComponentPropsWithoutRef<"pre">) {
  const code = typeof children === "object" && children !== null && "props" in children
    ? (children as { props: { children: string } }).props.children
    : String(children);

  return (
    <div className="relative mb-6">
      <div className="flex items-center justify-between rounded-t-lg border border-white/10 bg-[#131313] px-4 py-2">
        <span className="text-xs text-muted-foreground">Code</span>
        <CopyButton text={code} />
      </div>
      <pre className="overflow-x-auto rounded-b-lg border border-t-0 border-white/10 bg-[#131313] p-4 text-sm" {...props}>
        {children}
      </pre>
    </div>
  );
}

export const mdxComponents = {
  h2: ({ children, ...props }: ComponentPropsWithoutRef<"h2">) => (
    <h2 className="mt-12 mb-4 text-2xl font-bold tracking-tight text-white" id={typeof children === "string" ? children.toLowerCase().replace(/\s+/g, "-") : undefined} {...props}>
      {children}
    </h2>
  ),
  h3: ({ children, ...props }: ComponentPropsWithoutRef<"h3">) => (
    <h3 className="mt-8 mb-3 text-xl font-semibold tracking-tight text-white" {...props}>
      {children}
    </h3>
  ),
  p: ({ children, ...props }: ComponentPropsWithoutRef<"p">) => (
    <p className="mb-4 leading-7 text-muted-foreground" {...props}>
      {children}
    </p>
  ),
  ul: ({ children, ...props }: ComponentPropsWithoutRef<"ul">) => (
    <ul className="mb-4 ml-6 list-disc space-y-1 text-muted-foreground" {...props}>
      {children}
    </ul>
  ),
  ol: ({ children, ...props }: ComponentPropsWithoutRef<"ol">) => (
    <ol className="mb-4 ml-6 list-decimal space-y-1 text-muted-foreground" {...props}>
      {children}
    </ol>
  ),
  li: ({ children, ...props }: ComponentPropsWithoutRef<"li">) => (
    <li className="leading-7" {...props}>
      {children}
    </li>
  ),
  a: ({ children, href, ...props }: ComponentPropsWithoutRef<"a">) => (
    <a href={href} className="font-medium text-primary underline underline-offset-4 hover:text-[#a855f7]" target="_blank" rel="noopener noreferrer" {...props}>
      {children}
    </a>
  ),
  blockquote: ({ children, ...props }: ComponentPropsWithoutRef<"blockquote">) => (
    <blockquote className="my-6 border-l-2 border-primary/30 pl-6 italic text-muted-foreground" {...props}>
      {children}
    </blockquote>
  ),
  pre: CodeBlock,
  code: ({ children, className, ...props }: ComponentPropsWithoutRef<"code">) => {
    if (className) {
      return (
        <code className={className} {...props}>
          {children}
        </code>
      );
    }
    return (
      <code className="rounded bg-[#131313] px-1.5 py-0.5 text-sm font-mono text-primary" {...props}>
        {children}
      </code>
    );
  },
  table: ({ children, ...props }: ComponentPropsWithoutRef<"table">) => (
    <div className="my-6 overflow-x-auto">
      <table className="w-full border-collapse text-sm" {...props}>
        {children}
      </table>
    </div>
  ),
  th: ({ children, ...props }: ComponentPropsWithoutRef<"th">) => (
    <th className="border-b border-white/10 bg-white/5 px-4 py-2 text-left font-semibold text-white" {...props}>
      {children}
    </th>
  ),
  td: ({ children, ...props }: ComponentPropsWithoutRef<"td">) => (
    <td className="border-b border-white/10 px-4 py-2" {...props}>
      {children}
    </td>
  ),
  hr: (props: ComponentPropsWithoutRef<"hr">) => (
    <hr className="my-12 border-t border-white/10" {...props} />
  ),
};
