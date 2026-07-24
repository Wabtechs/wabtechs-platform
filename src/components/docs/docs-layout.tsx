import { DocsSidebar } from "./docs-sidebar";

interface DocsLayoutProps {
  children: React.ReactNode;
}

export function DocsLayout({ children }: DocsLayoutProps) {
  return (
    <div className="flex gap-8">
      <aside className="hidden w-64 shrink-0 lg:block">
        <DocsSidebar />
      </aside>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
