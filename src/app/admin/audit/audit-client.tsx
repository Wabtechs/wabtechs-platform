"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ChevronLeft, ChevronRight, ScrollText, Search } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate } from "@/lib/utils";

interface AuditLogEntry {
  id: string;
  action: string;
  entity: string;
  entityId: string | null;
  details: string | null;
  createdAt: Date;
  user: { name: string | null; email: string | null } | null;
}

interface AuditFilters {
  action: string | null;
  q: string | null;
}

const ACTION_VARIANTS: Record<string, string> = {
  CREATE: "border-green-500/30 bg-green-500/10 text-green-600 dark:text-green-400",
  UPDATE: "border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400",
  DELETE: "border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-400",
};

const ACTION_LABELS: Record<string, string> = {
  CREATE: "Création",
  UPDATE: "Modification",
  DELETE: "Suppression",
};

function buildQuery(filters: AuditFilters, page: number): string {
  const params = new URLSearchParams();
  if (filters.action) params.set("action", filters.action);
  if (filters.q) params.set("q", filters.q);
  if (page > 1) params.set("page", String(page));
  const query = params.toString();
  return query ? `?${query}` : "";
}

export function AuditClient({
  logs,
  page,
  total,
  pageSize,
  filters,
}: {
  logs: AuditLogEntry[];
  page: number;
  total: number;
  pageSize: number;
  filters: AuditFilters;
}) {
  const router = useRouter();
  const [action, setAction] = useState(filters.action ?? "");
  const [q, setQ] = useState(filters.q ?? "");

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const applyFilters = () => {
    const next: AuditFilters = {
      action: action && action !== "all" ? action : null,
      q: q.trim() || null,
    };
    router.push(`/admin/audit${buildQuery(next, 1)}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <ScrollText className="h-5 w-5" />
        <h1 className="text-xl font-semibold">Journal d&apos;audit</h1>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="audit-action">Action</Label>
              <Select value={action} onValueChange={setAction}>
                <SelectTrigger id="audit-action">
                  <SelectValue placeholder="Toutes les actions" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les actions</SelectItem>
                  {Object.entries(ACTION_LABELS).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="audit-q">Recherche</Label>
              <Input
                id="audit-q"
                placeholder="Entité, nom ou email…"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") applyFilters();
                }}
              />
            </div>
            <div className="flex items-end gap-2">
              <Button onClick={applyFilters}>
                <Search className="h-4 w-4" />
                Filtrer
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setAction("");
                  setQ("");
                  router.push("/admin/audit");
                }}
              >
                Réinitialiser
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-sm font-medium">
            {total} entrée{total > 1 ? "s" : ""}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {logs.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              Aucune entrée d&apos;audit trouvée.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Entité</TableHead>
                  <TableHead>Utilisateur</TableHead>
                  <TableHead className="max-w-[40%]">Détails</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="whitespace-nowrap text-xs">
                      {formatDate(log.createdAt)}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={ACTION_VARIANTS[log.action]}>
                        {ACTION_LABELS[log.action] ?? log.action}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">{log.entity}</TableCell>
                    <TableCell className="text-sm">
                      {log.user ? (log.user.name ?? log.user.email ?? "—") : "—"}
                    </TableCell>
                    <TableCell className="max-w-[40%] truncate text-xs text-muted-foreground">
                      {log.details ?? log.entityId ?? "—"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Page {page} sur {totalPages}
        </p>
        <div className="flex gap-2">
          {page > 1 ? (
            <Button variant="outline" asChild>
              <Link href={`/admin/audit${buildQuery(filters, page - 1)}`}>
                <ChevronLeft className="h-4 w-4" />
                Précédent
              </Link>
            </Button>
          ) : (
            <Button variant="outline" disabled>
              <ChevronLeft className="h-4 w-4" />
              Précédent
            </Button>
          )}
          {page < totalPages ? (
            <Button variant="outline" asChild>
              <Link href={`/admin/audit${buildQuery(filters, page + 1)}`}>
                Suivant
                <ChevronRight className="h-4 w-4" />
              </Link>
            </Button>
          ) : (
            <Button variant="outline" disabled>
              Suivant
              <ChevronRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
