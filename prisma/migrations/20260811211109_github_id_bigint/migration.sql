-- AlterTable
ALTER TABLE "github_commits" ALTER COLUMN "committedAt" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "syncedAt" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "github_connections" ALTER COLUMN "githubId" SET DATA TYPE BIGINT,
ALTER COLUMN "lastSyncAt" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "github_issues" ALTER COLUMN "githubId" SET DATA TYPE BIGINT,
ALTER COLUMN "createdAt" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "updatedAt" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "closedAt" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "syncedAt" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "github_pull_requests" ALTER COLUMN "githubId" SET DATA TYPE BIGINT,
ALTER COLUMN "createdAt" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "updatedAt" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "mergedAt" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "closedAt" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "syncedAt" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "github_releases" ALTER COLUMN "githubId" SET DATA TYPE BIGINT,
ALTER COLUMN "publishedAt" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "syncedAt" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "github_repositories" ALTER COLUMN "githubId" SET DATA TYPE BIGINT,
ALTER COLUMN "lastSyncAt" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "createdAt" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "updatedAt" DROP DEFAULT,
ALTER COLUMN "updatedAt" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "github_workflow_runs" ALTER COLUMN "githubId" SET DATA TYPE BIGINT,
ALTER COLUMN "createdAt" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "updatedAt" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "syncedAt" SET DATA TYPE TIMESTAMP(3);

-- RenameIndex
ALTER INDEX "github_commits_sha_repositoryId_key" RENAME TO "github_commits_repositoryId_sha_key";

-- RenameIndex
ALTER INDEX "github_issues_githubId_repositoryId_key" RENAME TO "github_issues_repositoryId_githubId_key";

-- RenameIndex
ALTER INDEX "github_pull_requests_githubId_repositoryId_key" RENAME TO "github_pull_requests_repositoryId_githubId_key";

-- RenameIndex
ALTER INDEX "github_releases_githubId_repositoryId_key" RENAME TO "github_releases_repositoryId_githubId_key";

-- RenameIndex
ALTER INDEX "github_workflow_runs_githubId_repositoryId_key" RENAME TO "github_workflow_runs_repositoryId_githubId_key";
