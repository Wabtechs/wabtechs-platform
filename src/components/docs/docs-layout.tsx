import { DocsSidebar } from "./docs-sidebar";
import type { DocMeta } from "@/lib/mdx";

interface DocsLayoutProps {
  children: React.ReactNode;
  docs: DocMeta[];
}

export function DocsLayout({ children, docs }: DocsLayoutProps) {
  return (
    <div className="flex gap-8">
      <aside className="hidden w-64 shrink-0 lg:block">
        <DocsSidebar docs={docs} />
      </aside>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
