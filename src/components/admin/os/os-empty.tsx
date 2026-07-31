import { Card, CardContent } from "@/components/ui/card";

export function OsEmpty({ icon, title, hint }: { icon?: React.ReactNode; title: string; hint?: string }) {
  return (
    <Card className="border-gray-200/80 bg-white dark:border-border dark:bg-card">
      <CardContent className="flex flex-col items-center justify-center py-16 text-center">
        {icon && <div className="mb-3 text-gray-300 dark:text-gray-600">{icon}</div>}
        <p className="text-[13px] font-medium text-gray-600 dark:text-gray-300">{title}</p>
        {hint && <p className="mt-1 max-w-sm text-[12px] text-gray-400 dark:text-gray-500">{hint}</p>}
      </CardContent>
    </Card>
  );
}
