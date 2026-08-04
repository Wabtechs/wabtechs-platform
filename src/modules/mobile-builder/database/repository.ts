import {
  type MobileApp,
  type CreateMobileAppInput,
} from "@/modules/mobile-builder/types/mobile.types";
import { db } from "@/lib/prisma";
import { type BuildStatus, type ReleaseStatus, type PlatformTarget } from "@prisma/client";
import { type InputJsonValue } from "@prisma/client/runtime/library";

export class MobileAppRepository {
  async create(input: CreateMobileAppInput): Promise<MobileApp> {
    const slug = input.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    return db.mobileApp.create({
      data: {
        name: input.name,
        slug,
        packageName: input.packageName,
        bundleId: input.bundleId,
        description: input.description,
        icon: input.icon,
        splashScreen: input.splashScreen,
        repositoryUrl: input.repositoryUrl,
        framework: input.framework || "NEXT_JS",
        version: input.version || "1.0.0",
        status: "PENDING",
      },
    });
  }

  async getAll(): Promise<MobileApp[]> {
    return db.mobileApp.findMany({
      orderBy: { createdAt: "desc" },
    });
  }

  async getById(id: string): Promise<MobileApp | null> {
    return db.mobileApp.findUnique({
      where: { id },
      include: {
        builds: { orderBy: { createdAt: "desc" } },
        releases: { orderBy: { createdAt: "desc" } },
        certificates: true,
        storeIntegrations: true,
      },
    });
  }

  async getBySlug(slug: string): Promise<MobileApp | null> {
    return db.mobileApp.findUnique({
      where: { slug },
      include: {
        builds: { orderBy: { createdAt: "desc" } },
        releases: { orderBy: { createdAt: "desc" } },
      },
    });
  }

  async update(id: string, data: Partial<CreateMobileAppInput>): Promise<MobileApp> {
    return db.mobileApp.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        packageName: data.packageName,
        bundleId: data.bundleId,
        repositoryUrl: data.repositoryUrl,
        framework: data.framework,
        version: data.version,
        icon: data.icon,
        splashScreen: data.splashScreen,
      },
    });
  }

  async delete(id: string): Promise<void> {
    await db.mobileApp.delete({ where: { id } });
  }

  async updateStatus(id: string, status: BuildStatus): Promise<MobileApp> {
    return db.mobileApp.update({
      where: { id },
      data: { status },
    });
  }
}

export class MobileBuildRepository {
  async create(data: { appId: string; platform: PlatformTarget; version: string }) {
    return db.mobileBuild.create({
      data: {
        app: { connect: { id: data.appId } },
        platform: data.platform,
        version: data.version,
        status: "PENDING",
      },
    });
  }

  async getAll() {
    return db.mobileBuild.findMany({
      orderBy: { createdAt: "desc" },
      include: { app: true },
    });
  }

  async getById(id: string) {
    return db.mobileBuild.findUnique({
      where: { id },
      include: { app: true },
    });
  }

  async update(
    id: string,
    data: Partial<{
      status: BuildStatus;
      logs: string;
      artifactUrl: string | null;
      duration: number;
      completedAt: Date;
    }>,
  ) {
    return db.mobileBuild.update({
      where: { id },
      data,
    });
  }

  async getByAppId(appId: string) {
    return db.mobileBuild.findMany({
      where: { appId },
      orderBy: { createdAt: "desc" },
    });
  }
}

export class MobileCertificateRepository {
  async create(data: {
    appId: string;
    provider: string;
    name: string;
    encryptedSecret: string;
    expiresAt?: Date;
  }) {
    return db.mobileCertificate.create({
      data: {
        app: { connect: { id: data.appId } },
        provider: data.provider,
        name: data.name,
        encryptedSecret: data.encryptedSecret,
        status: "active",
        expiresAt: data.expiresAt,
      },
    });
  }

  async getByAppId(appId: string) {
    return db.mobileCertificate.findMany({
      where: { appId },
    });
  }

  async getById(id: string) {
    return db.mobileCertificate.findUnique({
      where: { id },
    });
  }

  async getAll() {
    return db.mobileCertificate.findMany();
  }

  async delete(id: string) {
    await db.mobileCertificate.delete({ where: { id } });
  }
}

export class MobileReleaseRepository {
  async create(data: {
    appId: string;
    version: string;
    buildId?: string;
    changelog?: string;
    status?: ReleaseStatus;
  }) {
    return db.mobileRelease.create({
      data: {
        app: { connect: { id: data.appId } },
        version: data.version,
        build: data.buildId ? { connect: { id: data.buildId } } : undefined,
        changelog: data.changelog,
        status: data.status || "DRAFT",
      },
    });
  }

  async getAll() {
    return db.mobileRelease.findMany({
      orderBy: { createdAt: "desc" },
      include: { app: true, build: true },
    });
  }

  async getByAppId(appId: string) {
    return db.mobileRelease.findMany({
      where: { appId },
      orderBy: { createdAt: "desc" },
      include: { build: true },
    });
  }

  async update(
    id: string,
    data: Partial<{
      version: string;
      status: ReleaseStatus;
      changelog: string;
      buildId: string | null;
    }>,
  ) {
    return db.mobileRelease.update({
      where: { id },
      data: {
        version: data.version,
        status: data.status,
        changelog: data.changelog,
        build: data.buildId ? { connect: { id: data.buildId } } : undefined,
      },
    });
  }

  async publish(id: string) {
    return db.mobileRelease.update({
      where: { id },
      data: { status: "PRODUCTION", publishedAt: new Date() },
    });
  }
}

export class MobileAuditLogRepository {
  async create(data: {
    appId: string;
    action: string;
    userId?: string | null;
    details?: Record<string, unknown>;
    ipAddress?: string;
  }) {
    return db.mobileAuditLog.create({
      data: {
        app: { connect: { id: data.appId } },
        user: data.userId ? { connect: { id: data.userId } } : undefined,
        action: data.action,
        details: data.details as InputJsonValue | undefined,
        ipAddress: data.ipAddress,
      },
    });
  }

  async getByAppId(appId: string, limit = 100) {
    return db.mobileAuditLog.findMany({
      where: { appId },
      orderBy: { createdAt: "desc" },
      take: limit,
      include: { user: true },
    });
  }
}

export class StoreIntegrationRepository {
  async create(data: { appId: string; provider: string; credentials: string }) {
    return db.storeIntegration.create({
      data: {
        app: { connect: { id: data.appId } },
        provider: data.provider,
        credentials: data.credentials,
        status: "connected",
        lastSync: new Date(),
      },
    });
  }

  async getByAppId(appId: string) {
    return db.storeIntegration.findMany({
      where: { appId },
    });
  }

  async updateStatus(id: string, status: string) {
    return db.storeIntegration.update({
      where: { id },
      data: { status, lastSync: new Date() },
    });
  }
}
