interface OsPageHeaderProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  accent?: string;
  children?: React.ReactNode;
}

export function OsPageHeader({ title, description, icon, accent = "text-primary", children }: OsPageHeaderProps) {
  return (
    <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        {icon && (
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/[0.06]">
            <span className={accent}>{icon}</span>
          </div>
        )}
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-foreground">{title}</h1>
          {description && <p className="mt-0.5 text-[13px] text-gray-500 dark:text-gray-400">{description}</p>}
        </div>
      </div>
      {children && <div className="flex items-center gap-2">{children}</div>}
    </div>
  );
}
