import { Badge } from "@/components/ui/badge";

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
        <Badge variant="secondary" className="mb-4">
          {badge}
        </Badge>
      )}
      <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
        {highlight ? (
          <>
            {title} <span className="gradient-text">{highlight}</span>
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
