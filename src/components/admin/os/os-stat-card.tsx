import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface OsStatCardProps {
  label: string;
  value: string | number;
  hint?: string;
  accent?: string;
  icon?: React.ReactNode;
}

export function OsStatCard({ label, value, hint, accent = "text-foreground", icon }: OsStatCardProps) {
  return (
    <Card className="border-gray-200/80 bg-white dark:border-border dark:bg-card">
      <CardContent className="flex items-start justify-between p-5">
        <div className="min-w-0">
          <p className="text-[12px] font-medium text-gray-500 dark:text-gray-400">{label}</p>
          <p className={cn("mt-1.5 truncate text-2xl font-semibold tracking-tight", accent)}>{value}</p>
          {hint && <p className="mt-1 text-[12px] text-gray-400 dark:text-gray-500">{hint}</p>}
        </div>
        {icon && (
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/[0.06] text-primary">
            {icon}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
