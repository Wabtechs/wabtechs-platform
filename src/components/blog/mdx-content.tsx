"use client";

import { MDXRemote, type MDXRemoteSerializeResult } from "next-mdx-remote/client";

interface MDXContentProps {
  source: MDXRemoteSerializeResult;
}

const mdxComponents = {
  h2: ({ children, ...props }: React.ComponentPropsWithoutRef<"h2">) => (
    <h2 className="mt-12 mb-4 text-2xl font-bold tracking-tight" id={typeof children === "string" ? children.toLowerCase().replace(/\s+/g, "-") : undefined} {...props}>
      {children}
    </h2>
  ),
  h3: ({ children, ...props }: React.ComponentPropsWithoutRef<"h3">) => (
    <h3 className="mt-8 mb-3 text-xl font-semibold tracking-tight" {...props}>
      {children}
    </h3>
  ),
  p: ({ children, ...props }: React.ComponentPropsWithoutRef<"p">) => (
    <p className="mb-4 leading-7 text-muted-foreground" {...props}>
      {children}
    </p>
  ),
  ul: ({ children, ...props }: React.ComponentPropsWithoutRef<"ul">) => (
    <ul className="mb-4 ml-6 list-disc space-y-1 text-muted-foreground" {...props}>
      {children}
    </ul>
  ),
  ol: ({ children, ...props }: React.ComponentPropsWithoutRef<"ol">) => (
    <ol className="mb-4 ml-6 list-decimal space-y-1 text-muted-foreground" {...props}>
      {children}
    </ol>
  ),
  li: ({ children, ...props }: React.ComponentPropsWithoutRef<"li">) => (
    <li className="leading-7" {...props}>
      {children}
    </li>
  ),
  a: ({ children, href, ...props }: React.ComponentPropsWithoutRef<"a">) => (
    <a href={href} className="font-medium text-primary underline underline-offset-4 hover:text-primary/80" target="_blank" rel="noopener noreferrer" {...props}>
      {children}
    </a>
  ),
  blockquote: ({ children, ...props }: React.ComponentPropsWithoutRef<"blockquote">) => (
    <blockquote className="my-6 border-l-2 border-primary/30 pl-6 italic text-muted-foreground" {...props}>
      {children}
    </blockquote>
  ),
  pre: ({ children, ...props }: React.ComponentPropsWithoutRef<"pre">) => (
    <pre className="mb-6 overflow-x-auto rounded-lg border bg-muted p-4 text-sm" {...props}>
      {children}
    </pre>
  ),
  code: ({ children, className, ...props }: React.ComponentPropsWithoutRef<"code">) => {
    if (className) {
      return (
        <code className={className} {...props}>
          {children}
        </code>
      );
    }
    return (
      <code className="rounded bg-muted px-1.5 py-0.5 text-sm font-mono" {...props}>
        {children}
      </code>
    );
  },
  table: ({ children, ...props }: React.ComponentPropsWithoutRef<"table">) => (
    <div className="my-6 overflow-x-auto">
      <table className="w-full border-collapse text-sm" {...props}>
        {children}
      </table>
    </div>
  ),
  th: ({ children, ...props }: React.ComponentPropsWithoutRef<"th">) => (
    <th className="border-b bg-muted/50 px-4 py-2 text-left font-semibold" {...props}>
      {children}
    </th>
  ),
  td: ({ children, ...props }: React.ComponentPropsWithoutRef<"td">) => (
    <td className="border-b px-4 py-2" {...props}>
      {children}
    </td>
  ),
  hr: (props: React.ComponentPropsWithoutRef<"hr">) => (
    <hr className="my-12 border-t" {...props} />
  ),
};

export function MDXContent({ source }: MDXContentProps) {
  return (
    <article className="prose prose-neutral dark:prose-invert max-w-none">
      <MDXRemote {...source} components={mdxComponents} />
    </article>
  );
}
