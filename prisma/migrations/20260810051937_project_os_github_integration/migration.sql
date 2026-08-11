-- CreateTable
CREATE TABLE "github_repositories" (
    "id" TEXT NOT NULL,
    "githubId" INTEGER NOT NULL,
    "owner" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "defaultBranch" TEXT NOT NULL DEFAULT 'main',
    "visibility" TEXT NOT NULL DEFAULT 'public',
    "language" TEXT,
    "description" TEXT,
    "stars" INTEGER NOT NULL DEFAULT 0,
    "forks" INTEGER NOT NULL DEFAULT 0,
    "openIssues" INTEGER NOT NULL DEFAULT 0,
    "archived" BOOLEAN NOT NULL DEFAULT false,
    "status" TEXT NOT NULL DEFAULT 'SYNCED',
    "projectId" TEXT,
    "lastSyncAt" TIMESTAMPTZ,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "github_repositories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "github_issues" (
    "id" TEXT NOT NULL,
    "githubId" INTEGER NOT NULL,
    "repositoryId" TEXT NOT NULL,
    "number" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT,
    "state" TEXT NOT NULL DEFAULT 'open',
    "htmlUrl" TEXT NOT NULL,
    "labels" JSONB,
    "assignees" JSONB,
    "isPr" BOOLEAN NOT NULL DEFAULT false,
    "projectId" TEXT,
    "bugId" TEXT,
    "featureId" TEXT,
    "createdAt" TIMESTAMPTZ NOT NULL,
    "updatedAt" TIMESTAMPTZ NOT NULL,
    "closedAt" TIMESTAMPTZ,
    "syncedAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "github_issues_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "github_pull_requests" (
    "id" TEXT NOT NULL,
    "githubId" INTEGER NOT NULL,
    "repositoryId" TEXT NOT NULL,
    "number" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT,
    "state" TEXT NOT NULL,
    "htmlUrl" TEXT NOT NULL,
    "author" TEXT,
    "headBranch" TEXT,
    "baseBranch" TEXT,
    "merged" BOOLEAN NOT NULL DEFAULT false,
    "mergeCommitSha" TEXT,
    "ciStatus" TEXT,
    "projectId" TEXT,
    "featureId" TEXT,
    "bugId" TEXT,
    "releaseId" TEXT,
    "createdAt" TIMESTAMPTZ NOT NULL,
    "updatedAt" TIMESTAMPTZ NOT NULL,
    "mergedAt" TIMESTAMPTZ,
    "closedAt" TIMESTAMPTZ,
    "syncedAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "github_pull_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "github_commits" (
    "id" TEXT NOT NULL,
    "sha" TEXT NOT NULL,
    "repositoryId" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "authorName" TEXT,
    "authorEmail" TEXT,
    "authorLogin" TEXT,
    "url" TEXT NOT NULL,
    "committedAt" TIMESTAMPTZ NOT NULL,
    "projectId" TEXT,
    "featureId" TEXT,
    "syncedAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "github_commits_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "github_releases" (
    "id" TEXT NOT NULL,
    "githubId" INTEGER NOT NULL,
    "repositoryId" TEXT NOT NULL,
    "tagName" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "body" TEXT,
    "htmlUrl" TEXT NOT NULL,
    "publishedAt" TIMESTAMPTZ,
    "projectId" TEXT,
    "osReleaseId" TEXT,
    "syncedAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "github_releases_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "github_workflow_runs" (
    "id" TEXT NOT NULL,
    "githubId" INTEGER NOT NULL,
    "repositoryId" TEXT NOT NULL,
    "runNumber" INTEGER NOT NULL,
    "name" TEXT,
    "workflowId" INTEGER,
    "branch" TEXT,
    "headSha" TEXT,
    "status" TEXT,
    "conclusion" TEXT,
    "htmlUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL,
    "updatedAt" TIMESTAMPTZ,
    "syncedAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "projectId" TEXT,
    CONSTRAINT "github_workflow_runs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "github_repositories_githubId_key" ON "github_repositories" ("githubId");

-- CreateIndex
CREATE UNIQUE INDEX "github_repositories_projectId_key" ON "github_repositories" ("projectId");

-- CreateIndex
CREATE UNIQUE INDEX "github_repositories_owner_name_key" ON "github_repositories" ("owner", "name");

-- CreateIndex
CREATE UNIQUE INDEX "github_issues_githubId_repositoryId_key" ON "github_issues" ("repositoryId", "githubId");

-- CreateIndex
CREATE INDEX "github_issues_repositoryId_number_idx" ON "github_issues" ("repositoryId", "number");

-- CreateIndex
CREATE INDEX "github_issues_state_idx" ON "github_issues" ("state");

-- CreateIndex
CREATE UNIQUE INDEX "github_issues_bugId_key" ON "github_issues" ("bugId");

-- CreateIndex
CREATE UNIQUE INDEX "github_issues_featureId_key" ON "github_issues" ("featureId");

-- CreateIndex
CREATE UNIQUE INDEX "github_pull_requests_githubId_repositoryId_key" ON "github_pull_requests" ("repositoryId", "githubId");

-- CreateIndex
CREATE INDEX "github_pull_requests_repositoryId_number_idx" ON "github_pull_requests" ("repositoryId", "number");

-- CreateIndex
CREATE INDEX "github_pull_requests_state_idx" ON "github_pull_requests" ("state");

-- CreateIndex
CREATE UNIQUE INDEX "github_commits_sha_repositoryId_key" ON "github_commits" ("repositoryId", "sha");

-- CreateIndex
CREATE INDEX "github_commits_repositoryId_committedAt_idx" ON "github_commits" ("repositoryId", "committedAt");

-- CreateIndex
CREATE UNIQUE INDEX "github_releases_githubId_repositoryId_key" ON "github_releases" ("repositoryId", "githubId");

-- CreateIndex
CREATE INDEX "github_releases_repositoryId_publishedAt_idx" ON "github_releases" ("repositoryId", "publishedAt");

-- CreateIndex
CREATE UNIQUE INDEX "github_releases_osReleaseId_key" ON "github_releases" ("osReleaseId");

-- CreateIndex
CREATE UNIQUE INDEX "github_workflow_runs_githubId_repositoryId_key" ON "github_workflow_runs" ("repositoryId", "githubId");

-- CreateIndex
CREATE INDEX "github_workflow_runs_repositoryId_createdAt_idx" ON "github_workflow_runs" ("repositoryId", "createdAt");

-- Reverse-relation-only fields (ghRepositories, ghIssues, ghPullRequests, ghCommits,
-- ghReleases, ghWorkflowRuns) on OsProject and the one-to-one links from Bug/Feature/Release
-- have no physical column on the owning side, so no ALTER TABLE is needed there.
-- Prisma resolves them through the foreign key columns on the dependent tables below.

-- Real FK additions (column-based relations):
ALTER TABLE "github_repositories" ADD CONSTRAINT "github_repositories_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "os_projects" ("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "github_issues" ADD CONSTRAINT "github_issues_repositoryId_fkey" FOREIGN KEY ("repositoryId") REFERENCES "github_repositories" ("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "github_issues" ADD CONSTRAINT "github_issues_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "os_projects" ("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "github_issues" ADD CONSTRAINT "github_issues_bugId_fkey" FOREIGN KEY ("bugId") REFERENCES "bugs" ("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "github_issues" ADD CONSTRAINT "github_issues_featureId_fkey" FOREIGN KEY ("featureId") REFERENCES "features" ("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "github_pull_requests" ADD CONSTRAINT "github_pull_requests_repositoryId_fkey" FOREIGN KEY ("repositoryId") REFERENCES "github_repositories" ("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "github_pull_requests" ADD CONSTRAINT "github_pull_requests_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "os_projects" ("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "github_pull_requests" ADD CONSTRAINT "github_pull_requests_featureId_fkey" FOREIGN KEY ("featureId") REFERENCES "features" ("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "github_pull_requests" ADD CONSTRAINT "github_pull_requests_bugId_fkey" FOREIGN KEY ("bugId") REFERENCES "bugs" ("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "github_pull_requests" ADD CONSTRAINT "github_pull_requests_releaseId_fkey" FOREIGN KEY ("releaseId") REFERENCES "releases" ("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "github_commits" ADD CONSTRAINT "github_commits_repositoryId_fkey" FOREIGN KEY ("repositoryId") REFERENCES "github_repositories" ("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "github_commits" ADD CONSTRAINT "github_commits_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "os_projects" ("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "github_commits" ADD CONSTRAINT "github_commits_featureId_fkey" FOREIGN KEY ("featureId") REFERENCES "features" ("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "github_releases" ADD CONSTRAINT "github_releases_repositoryId_fkey" FOREIGN KEY ("repositoryId") REFERENCES "github_repositories" ("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "github_releases" ADD CONSTRAINT "github_releases_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "os_projects" ("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "github_releases" ADD CONSTRAINT "github_releases_osReleaseId_fkey" FOREIGN KEY ("osReleaseId") REFERENCES "releases" ("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "github_workflow_runs" ADD CONSTRAINT "github_workflow_runs_repositoryId_fkey" FOREIGN KEY ("repositoryId") REFERENCES "github_repositories" ("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "github_workflow_runs" ADD CONSTRAINT "github_workflow_runs_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "os_projects" ("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddColumn (lastSyncAt on github_connections)
ALTER TABLE "github_connections" ADD COLUMN "lastSyncAt" TIMESTAMPTZ;
