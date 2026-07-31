export function fmtEur(value: number | string | { toString(): string } | null | undefined): string {
  if (value === null || value === undefined) return "0 €";
  const n = typeof value === "number" ? value : Number(value.toString());
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);
}

export function fmtNum(value: number | null | undefined): string {
  if (value === null || value === undefined) return "0";
  return new Intl.NumberFormat("fr-FR").format(value);
}

export function fmtDate(value: Date | string | null | undefined): string {
  if (!value) return "—";
  return new Intl.DateTimeFormat("fr-FR", { year: "numeric", month: "short", day: "numeric" }).format(new Date(value));
}

export function fmtDateTime(value: Date | string | null | undefined): string {
  if (!value) return "—";
  return new Intl.DateTimeFormat("fr-FR", { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(value));
}

export function daysUntil(value: Date | string | null | undefined): number | null {
  if (!value) return null;
  const now = new Date();
  const target = new Date(value);
  return Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

export function pct(value: number | null | undefined): string {
  if (value === null || value === undefined) return "0%";
  return `${value}%`;
}
