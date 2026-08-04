export type MobileFramework = "NEXT_JS" | "REACT_NATIVE" | "EXPO" | "VUE" | "SVELTEKIT" | "CUSTOM";
export type PlatformTarget = "ANDROID" | "IOS" | "BOTH";
export type BuildStatus = "PENDING" | "BUILDING" | "SUCCESS" | "FAILED";
export type ReleaseStatus = "DRAFT" | "INTERNAL_TESTING" | "BETA" | "PRODUCTION";
export type CertificateStatus = "active" | "expired" | "revoked";
export type StoreProvider = "google-play" | "app-store";
export type StoreIntegrationStatus = "connected" | "disconnected" | "error";

export type AuditAction =
  | "BUILD_STARTED"
  | "BUILD_COMPLETED"
  | "APP_RELEASED"
  | "CERTIFICATE_UPDATED"
  | "APP_CREATED"
  | "APP_UPDATED";

export interface MobileApp {
  id: string;
  name: string;
  slug: string;
  packageName: string;
  bundleId: string;
  description?: string | null;
  icon?: string | null;
  splashScreen?: string | null;
  repositoryUrl: string;
  framework: MobileFramework;
  version: string;
  status: BuildStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface MobileBuild {
  id: string;
  appId: string;
  platform: PlatformTarget;
  version: string;
  status: BuildStatus;
  logs?: string | null;
  artifactUrl?: string | null;
  duration?: number | null;
  createdAt: Date;
  completedAt?: Date | null;
}

export interface MobileCertificate {
  id: string;
  appId: string;
  provider: string;
  name: string;
  encryptedSecret: string;
  status: CertificateStatus;
  createdAt: Date;
  expiresAt?: Date | null;
}

export interface MobileRelease {
  id: string;
  appId: string;
  version: string;
  status: ReleaseStatus;
  changelog?: string | null;
  buildId?: string | null;
  publishedAt?: Date | null;
  createdAt: Date;
}

export interface StoreIntegration {
  id: string;
  appId: string;
  provider: StoreProvider;
  credentials: string;
  status: StoreIntegrationStatus;
  lastSync?: Date | null;
  createdAt: Date;
}

export interface MobileAuditLog {
  id: string;
  appId: string;
  action: AuditAction;
  userId?: string | null;
  details?: Record<string, unknown> | null;
  ipAddress?: string | null;
  createdAt: Date;
}

export interface CreateMobileAppInput {
  name: string;
  description?: string;
  packageName: string;
  bundleId: string;
  repositoryUrl: string;
  framework?: MobileFramework;
  version?: string;
  icon?: string;
  splashScreen?: string;
}

export interface StartBuildInput {
  appId: string;
  platform: PlatformTarget;
  version: string;
}

export interface CreateReleaseInput {
  appId: string;
  version: string;
  buildId?: string;
  changelog?: string;
}

export interface EnvironmentCheck {
  name: string;
  installed: boolean;
  version?: string;
  path?: string;
  description?: string;
}

export interface EnvironmentDiagnostic {
  androidStudio: EnvironmentCheck;
  androidSdk: EnvironmentCheck;
  java: EnvironmentCheck;
  gradle: EnvironmentCheck;
  androidBuildTools: EnvironmentCheck;
}

export interface BuildResult {
  success: boolean;
  apkPath?: string;
  aabPath?: string;
  logs: string;
  duration: number;
  error?: string;
}

export interface StorePublishResult {
  success: boolean;
  track?: string;
  versionCode?: number;
  message?: string;
}
