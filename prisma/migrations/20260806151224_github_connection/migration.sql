-- CreateTable
CREATE TABLE "github_connections" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "githubId" INTEGER NOT NULL,
    "login" TEXT NOT NULL,
    "name" TEXT,
    "avatarUrl" TEXT,
    "accessToken" TEXT NOT NULL,
    "tokenType" TEXT NOT NULL DEFAULT 'bearer',
    "scope" TEXT,
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "github_connections_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "github_connections_userId_key" ON "github_connections"("userId");

-- AddForeignKey
ALTER TABLE "github_connections" ADD CONSTRAINT "github_connections_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
