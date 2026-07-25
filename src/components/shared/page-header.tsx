interface PageHeaderProps {
  badge?: string;
  title: string;
  highlight?: string;
  description?: string;
}

export function PageHeader({ badge, title, highlight, description }: PageHeaderProps) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      {badge && (
        <span className="sub-title">{badge}</span>
      )}
      <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
        {highlight ? (
          <>
            {title} <span className="text-[#842ae3]">{highlight}</span>
          </>
        ) : (
          title
        )}
      </h1>
      {description && (
        <p className="mt-6 text-lg text-muted-foreground">{description}</p>
      )}
    </div>
  );
}
