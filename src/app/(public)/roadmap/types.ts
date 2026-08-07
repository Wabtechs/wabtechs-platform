export interface OsProject {
  id: string;
  slug: string;
  name: string;
  color: string;
  description: string | null;
  status: string;
  type: string;
  version: string;
}

export interface OsModule {
  id: string;
  name: string;
  description: string | null;
  status: string;
  version: string;
  priority: string;
  complexity: string;
  progress: number;
  testCoverage: number;
  security: number;
  performance: number;
  seo: number;
  accessibility: number;
  maintainability: number;
  technicalDebt: number;
  createdAt: string;
  updatedAt: string;
  project: { id: string; slug: string; name: string; color: string };
  featureCount: number;
  featureProgress: number;
}

export interface OsSubtask {
  id: string;
  title: string;
  done: boolean;
}

export interface OsBugRef {
  id: string;
  title: string;
  severity: string;
  status: string;
}

export interface OsFeature {
  id: string;
  title: string;
  description: string | null;
  priority: string;
  status: string;
  points: number;
  createdAt: string;
  updatedAt: string;
  projectId: string;
  moduleId: string | null;
  epicId: string | null;
  sprintId: string | null;
  assigneeId: string | null;
  progress: number;
  subtaskTotal: number;
  subtaskDone: number;
  project: { id: string; slug: string; name: string; color: string };
  module: { id: string; name: string } | null;
  assignee: { id: string; name: string | null; avatar: string | null } | null;
  subtasks: OsSubtask[];
  bugs: OsBugRef[];
  bugCount: number;
}

export interface OsBug {
  id: string;
  title: string;
  description: string | null;
  severity: string;
  priority: string;
  status: string;
  impact: number;
  fixHours: number;
  version: string | null;
  reproduce: string | null;
  expected: string | null;
  actual: string | null;
  fix: string | null;
  resolvedAt: string | null;
  createdAt: string;
  updatedAt: string;
  projectId: string;
  featureId: string | null;
  assigneeId: string | null;
  project: { id: string; slug: string; name: string; color: string };
  feature: { id: string; title: string } | null;
  assignee: { id: string; name: string | null; avatar: string | null } | null;
}

export interface OsRoadmapItem {
  id: string;
  title: string;
  description: string | null;
  type: string;
  priority: string;
  progress: number;
  startDate: string | null;
  endDate: string | null;
  estimatedHours: number;
  actualHours: number;
  roi: number;
  impact: number;
  dependencies: string | null;
  risks: string | null;
  createdAt: string;
  updatedAt: string;
  project: { id: string; slug: string; name: string; color: string };
}

export interface OsActivity {
  id: string;
  action: string;
  entity: string;
  entityId: string | null;
  details: string | null;
  createdAt: string;
  userName: string | null;
  avatar: string | null;
}

export interface RoadmapStats {
  projectProgress: number;
  featureTotal: number;
  featureDone: number;
  featureInProgress: number;
  featurePlanned: number;
  featureBacklog: number;
  bugOpen: number;
  bugCritical: number;
  bugSeverityCounts: Record<string, number>;
  moduleCount: number;
  moduleDone: number;
  roadmapCount: number;
  featureCounts: Record<string, number>;
}

export type ViewMode = "kanban" | "modules" | "timeline" | "bugs";
export type FilterStatus =
  | "all"
  | "BACKLOG"
  | "PLANNED"
  | "READY"
  | "DEVELOPMENT"
  | "REVIEW"
  | "TESTING"
  | "VALIDATION"
  | "DONE"
  | "RELEASED";
export type FilterPriority = "all" | "URGENT" | "HIGH" | "MEDIUM" | "LOW";
export type BugSeverity = "all" | "BLOCKER" | "CRITICAL" | "MAJOR" | "MINOR" | "TRIVIAL";
