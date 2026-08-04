-- CreateEnum
CREATE TYPE "MobileFramework" AS ENUM ('NEXT_JS', 'REACT_NATIVE', 'EXPO', 'VUE', 'SVELTEKIT', 'CUSTOM');

-- CreateEnum
CREATE TYPE "PlatformTarget" AS ENUM ('ANDROID', 'IOS', 'BOTH');

-- CreateEnum
CREATE TYPE "BuildStatus" AS ENUM ('PENDING', 'BUILDING', 'SUCCESS', 'FAILED');

-- CreateEnum
CREATE TYPE "ReleaseStatus" AS ENUM ('DRAFT', 'INTERNAL_TESTING', 'BETA', 'PRODUCTION');

-- CreateTable
CREATE TABLE "mobile_apps" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "packageName" TEXT NOT NULL,
    "bundleId" TEXT NOT NULL,
    "description" TEXT,
    "icon" TEXT,
    "splashScreen" TEXT,
    "repositoryUrl" TEXT NOT NULL,
    "framework" "MobileFramework" NOT NULL DEFAULT 'NEXT_JS',
    "version" TEXT NOT NULL DEFAULT '1.0.0',
    "status" "BuildStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "mobile_apps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mobile_builds" (
    "id" TEXT NOT NULL,
    "appId" TEXT NOT NULL,
    "platform" "PlatformTarget" NOT NULL,
    "version" TEXT NOT NULL,
    "status" "BuildStatus" NOT NULL DEFAULT 'PENDING',
    "logs" TEXT,
    "artifactUrl" TEXT,
    "duration" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "mobile_builds_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mobile_certificates" (
    "id" TEXT NOT NULL,
    "appId" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "encryptedSecret" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3),

    CONSTRAINT "mobile_certificates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mobile_releases" (
    "id" TEXT NOT NULL,
    "appId" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "status" "ReleaseStatus" NOT NULL DEFAULT 'DRAFT',
    "changelog" TEXT,
    "buildId" TEXT,
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "mobile_releases_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "store_integrations" (
    "id" TEXT NOT NULL,
    "appId" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "credentials" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'disconnected',
    "lastSync" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "store_integrations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mobile_audit_logs" (
    "id" TEXT NOT NULL,
    "appId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "userId" TEXT,
    "details" JSONB,
    "ipAddress" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "mobile_audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "mobile_apps_slug_key" ON "mobile_apps"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "mobile_apps_packageName_key" ON "mobile_apps"("packageName");

-- CreateIndex
CREATE UNIQUE INDEX "mobile_apps_bundleId_key" ON "mobile_apps"("bundleId");

-- CreateIndex
CREATE INDEX "mobile_apps_slug_idx" ON "mobile_apps"("slug");

-- CreateIndex
CREATE INDEX "mobile_builds_appId_idx" ON "mobile_builds"("appId");

-- CreateIndex
CREATE INDEX "mobile_builds_status_idx" ON "mobile_builds"("status");

-- CreateIndex
CREATE INDEX "mobile_certificates_appId_idx" ON "mobile_certificates"("appId");

-- CreateIndex
CREATE INDEX "mobile_releases_appId_idx" ON "mobile_releases"("appId");

-- CreateIndex
CREATE INDEX "mobile_releases_status_idx" ON "mobile_releases"("status");

-- CreateIndex
CREATE INDEX "store_integrations_appId_idx" ON "store_integrations"("appId");

-- CreateIndex
CREATE INDEX "mobile_audit_logs_appId_idx" ON "mobile_audit_logs"("appId");

-- CreateIndex
CREATE INDEX "mobile_audit_logs_action_idx" ON "mobile_audit_logs"("action");

-- AddForeignKey
ALTER TABLE "mobile_builds" ADD CONSTRAINT "mobile_builds_appId_fkey" FOREIGN KEY ("appId") REFERENCES "mobile_apps"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mobile_certificates" ADD CONSTRAINT "mobile_certificates_appId_fkey" FOREIGN KEY ("appId") REFERENCES "mobile_apps"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mobile_releases" ADD CONSTRAINT "mobile_releases_appId_fkey" FOREIGN KEY ("appId") REFERENCES "mobile_apps"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mobile_releases" ADD CONSTRAINT "mobile_releases_buildId_fkey" FOREIGN KEY ("buildId") REFERENCES "mobile_builds"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "store_integrations" ADD CONSTRAINT "store_integrations_appId_fkey" FOREIGN KEY ("appId") REFERENCES "mobile_apps"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mobile_audit_logs" ADD CONSTRAINT "mobile_audit_logs_appId_fkey" FOREIGN KEY ("appId") REFERENCES "mobile_apps"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mobile_audit_logs" ADD CONSTRAINT "mobile_audit_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
