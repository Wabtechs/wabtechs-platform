import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  getStatusMeta,
  getPriorityMeta,
  getSeverityMeta,
  getTypeMeta,
  getMethodMeta,
} from "@/lib/os-labels";

export function OsStatusBadge({ status, className }: { status: string; className?: string }) {
  const meta = getStatusMeta(status);
  return (
    <Badge variant="outline" className={cn("border-transparent", meta.className, className)}>
      {meta.label}
    </Badge>
  );
}

export function OsPriorityBadge({ priority, className }: { priority: string; className?: string }) {
  const meta = getPriorityMeta(priority);
  return (
    <Badge variant="outline" className={cn("border-transparent", meta.className, className)}>
      {meta.label}
    </Badge>
  );
}

export function OsSeverityBadge({ severity, className }: { severity: string; className?: string }) {
  const meta = getSeverityMeta(severity);
  return (
    <Badge variant="outline" className={cn("border-transparent", meta.className, className)}>
      {meta.label}
    </Badge>
  );
}

export function OsTypeBadge({ type, className }: { type: string; className?: string }) {
  const meta = getTypeMeta(type);
  return (
    <Badge variant="outline" className={cn("border-transparent", meta.className, className)}>
      {meta.label}
    </Badge>
  );
}

export function OsMethodBadge({ method, className }: { method: string; className?: string }) {
  const meta = getMethodMeta(method);
  return (
    <Badge variant="outline" className={cn("border-transparent", meta.className, className)}>
      {meta.label}
    </Badge>
  );
}
