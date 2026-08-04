import path from "path";
import fs from "fs/promises";
import { type BuildResult, type MobileApp } from "@/modules/mobile-builder/types/mobile.types";
import { runCommand, EncryptionService } from "@/modules/mobile-builder/utils/env-detection";
import { CapacitorService } from "./capacitor.service";

export class AndroidBuildService {
  private app: MobileApp;
  private capacitor: CapacitorService;
  private androidProjectPath: string;

  constructor(app: MobileApp, capacitor: CapacitorService) {
    this.app = app;
    this.capacitor = capacitor;
    this.androidProjectPath = capacitor.getAndroidProjectPath();
  }

  async prepareBuild(): Promise<void> {
    if (!this.androidProjectPath || !(await this.pathExists(this.androidProjectPath))) {
      await this.capacitor.addAndroid();
    }
    await this.configureSigning();
    await this.capacitor.sync("android");
  }

  private async pathExists(p: string): Promise<boolean> {
    try {
      await fs.access(p);
      return true;
    } catch {
      return false;
    }
  }

  private async configureSigning(): Promise<void> {
    const secrets = await this.getKeystoreSecrets();

    const keyProperties = `storeFile=wabtechs-release.keystore
storePassword=${secrets.storePassword}
keyAlias=wabtechs-key
keyPassword=${secrets.keyPassword}
`;

    await fs.writeFile(path.join(this.androidProjectPath, "key.properties"), keyProperties);

    const buildGradlePath = path.join(this.androidProjectPath, "app", "build.gradle");
    const buildGradle = await fs.readFile(buildGradlePath, "utf-8");

    const signingConfig = `
signingConfigs {
    release {
        storeFile file("wabtechs-release.keystore")
        storePassword System.env.WABTECHS_STORE_PASSWORD
        keyAlias "wabtechs-key"
        keyPassword System.env.WABTECHS_KEY_PASSWORD
    }
}

buildTypes {
    release {
        minifyEnabled true
        proguardFiles getDefaultProguardFile("proguard-android-optimize.txt"), "proguard-rules.pro"
        signingConfig signingConfigs.release
    }
}
`;

    if (!buildGradle.includes("signingConfigs")) {
      const updatedGradle = buildGradle.replace(
        /android \{/,
        `android {\n    ${signingConfig.trim()}\n`,
      );
      await fs.writeFile(buildGradlePath, updatedGradle);
    }
  }

  private async getKeystoreSecrets(): Promise<{ storePassword: string; keyPassword: string }> {
    const { db } = await import("@/lib/prisma");
    const cert = await db.mobileCertificate.findFirst({
      where: { appId: this.app.id, provider: "android-keystore" },
      select: { encryptedSecret: true },
    });

    if (cert) {
      const decrypted = EncryptionService.decrypt(cert.encryptedSecret);
      const parsed = JSON.parse(decrypted) as { storePassword: string; keyPassword: string };
      return parsed;
    }

    return { storePassword: "default", keyPassword: "default" };
  }

  async generateAPK(): Promise<BuildResult> {
    const startTime = Date.now();
    await this.prepareBuild();

    const result = await runCommand("cd android && ./gradlew assembleRelease", {
      timeout: 600000,
    });

    const duration = Date.now() - startTime;

    if (!result.success) {
      return {
        success: false,
        logs: result.output + (result.error || ""),
        duration,
        error: result.error || "Build failed",
      };
    }

    const apkPath = path.join(this.androidProjectPath, "app", "build", "outputs", "apk", "release");
    const apkExists = await this.pathExists(apkPath);

    return {
      success: apkExists,
      apkPath: apkExists ? apkPath : undefined,
      logs: result.output,
      duration,
    };
  }

  async generateAAB(): Promise<BuildResult> {
    const startTime = Date.now();
    await this.prepareBuild();

    const result = await runCommand("cd android && ./gradlew bundleRelease", {
      timeout: 600000,
    });

    const duration = Date.now() - startTime;

    if (!result.success) {
      return {
        success: false,
        logs: result.output + (result.error || ""),
        duration,
        error: result.error || "Build failed",
      };
    }

    const aabPath = path.join(
      this.androidProjectPath,
      "app",
      "build",
      "outputs",
      "bundle",
      "release",
    );
    const aabExists = await this.pathExists(aabPath);

    return {
      success: aabExists,
      aabPath: aabExists ? aabPath : undefined,
      logs: result.output,
      duration,
    };
  }

  async signApplication(keystoreBase64: string): Promise<void> {
    const keystorePath = path.join(this.androidProjectPath, "app", "release.keystore");
    const buffer = Buffer.from(keystoreBase64, "base64");
    await fs.writeFile(keystorePath, buffer);
  }

  async validateBuild(): Promise<{ valid: boolean; errors: string[] }> {
    const errors: string[] = [];
    const aabDir = path.join(
      this.androidProjectPath,
      "app",
      "build",
      "outputs",
      "bundle",
      "release",
    );
    const apkDir = path.join(this.androidProjectPath, "app", "build", "outputs", "apk", "release");

    if (!(await this.pathExists(aabDir)) && !(await this.pathExists(apkDir))) {
      errors.push("No build output found in expected directories");
    }

    return { valid: errors.length === 0, errors };
  }

  async uploadArtifact(artifactPath: string): Promise<string> {
    const result = await runCommand(`npx capcopy upload ${artifactPath}`, { timeout: 300000 });
    if (result.success) {
      return result.output.trim();
    }
    throw new Error(`Failed to upload artifact: ${result.error}`);
  }
}
