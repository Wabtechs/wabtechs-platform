-- AlterTable
ALTER TABLE "projects" ADD COLUMN     "forks" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "language" TEXT NOT NULL DEFAULT 'TypeScript',
ADD COLUMN     "stars" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "error_logs" (
    "id" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "stack" TEXT,
    "code" TEXT,
    "statusCode" INTEGER,
    "path" TEXT,
    "method" TEXT,
    "userAgent" TEXT,
    "ip" TEXT,
    "userId" TEXT,
    "context" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "error_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "error_logs_createdAt_idx" ON "error_logs"("createdAt");

-- CreateIndex
CREATE INDEX "error_logs_code_idx" ON "error_logs"("code");

-- CreateIndex
CREATE INDEX "error_logs_path_idx" ON "error_logs"("path");

-- CreateIndex
CREATE INDEX "error_logs_userId_idx" ON "error_logs"("userId");

-- AddForeignKey
ALTER TABLE "error_logs" ADD CONSTRAINT "error_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
