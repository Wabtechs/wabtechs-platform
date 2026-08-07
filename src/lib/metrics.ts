const counters = new Map<string, number>();

const STARTS_AT = Date.now();

export function incrementCounter(route: string): void {
  const key = route || "unknown";
  counters.set(key, (counters.get(key) ?? 0) + 1);
}

export function renderCounters(): string {
  let out = "# HELP wabtechs_requests_total Nombre total de requêtes HTTP par route.\n";
  out += "# TYPE wabtechs_requests_total counter\n";
  for (const [route, count] of counters) {
    out += `wabtechs_requests_total{route="${escapeLabel(route)}"} ${count}\n`;
  }

  out += "# HELP wabtechs_process_uptime_seconds Temps de fonctionnement du processus.\n";
  out += "# TYPE wabtechs_process_uptime_seconds gauge\n";
  out += `wabtechs_process_uptime_seconds ${Math.floor((Date.now() - STARTS_AT) / 1000)}\n`;

  return out;
}

function escapeLabel(value: string): string {
  return value.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\n/g, "");
}
