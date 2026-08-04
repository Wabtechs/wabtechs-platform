import path from "path";
import fs from "fs/promises";
import { type BuildResult, type MobileApp } from "@/modules/mobile-builder/types/mobile.types";
import { runCommand, EncryptionService } from "@/modules/mobile-builder/utils/env-detection";
import { CapacitorService } from "./capacitor.service";

export interface IosBuildResult extends BuildResult {
  ipaPath?: string;
  plistPath?: string;
}

export class IosBuildService {
  private app: MobileApp;
  private capacitor: CapacitorService;
  private iosProjectPath: string;

  constructor(app: MobileApp, capacitor: CapacitorService) {
    this.app = app;
    this.capacitor = capacitor;
    this.iosProjectPath = capacitor.getIosProjectPath();
  }

  async prepareBuild(): Promise<void> {
    if (!this.iosProjectPath || !(await this.pathExists(this.iosProjectPath))) {
      await this.capacitor.addIos();
    }
    await this.configureCodeSigning();
    await this.updateAppConfig();
    await this.capacitor.sync("ios");
  }

  private async pathExists(p: string): Promise<boolean> {
    try {
      await fs.access(p);
      return true;
    } catch {
      return false;
    }
  }

  private async configureCodeSigning(): Promise<void> {
    const { db } = await import("@/lib/prisma");
    const certs = await db.mobileCertificate.findMany({
      where: { appId: this.app.id, provider: "apple-certificate" },
      select: { encryptedSecret: true, name: true },
    });

    if (certs.length === 0) {
      throw new Error("No Apple certificates found for iOS build");
    }

    for (const cert of certs) {
      const decrypted = EncryptionService.decrypt(cert.encryptedSecret);
      const secrets = JSON.parse(decrypted) as {
        developmentCertificate: string;
        developmentProvisioningProfile: string;
        distributionCertificate: string;
        distributionProvisioningProfile: string;
      };

      const certDir = path.join(this.iosProjectPath, "certs");
      await fs.mkdir(certDir, { recursive: true });

      await fs.writeFile(
        path.join(certDir, "dev-cert.p12"),
        Buffer.from(secrets.developmentCertificate, "base64"),
      );
      await fs.writeFile(
        path.join(certDir, "dist-cert.p12"),
        Buffer.from(secrets.distributionCertificate, "base64"),
      );
      await fs.writeFile(
        path.join(certDir, "dev-profile.mobileprovision"),
        Buffer.from(secrets.developmentProvisioningProfile, "base64"),
      );
      await fs.writeFile(
        path.join(certDir, "dist-profile.mobileprovision"),
        Buffer.from(secrets.distributionProvisioningProfile, "base64"),
      );
    }
  }

  private async updateAppConfig(): Promise<void> {
    const podfilePath = path.join(this.iosProjectPath, "Podfile");
    let podfileContent = "";
    try {
      podfileContent = await fs.readFile(podfilePath, "utf-8");
    } catch {
      podfileContent = `platform :ios, '15.0'
use_frameworks!

target '${this.app.name}' do
  pod 'Capacitor', :path => '../node_modules/@capacitor/ios'
  # Add native plugins here
end
`;
    }

    await fs.writeFile(podfilePath, podfileContent);
  }

  async generateIPA(): Promise<IosBuildResult> {
    const startTime = Date.now();
    try {
      await this.prepareBuild();

      const result = await runCommand(
        "npx cap sync ios && cd ios && xcodebuild -workspace App.xcworkspace -scheme App -configuration Release -archivePath App.xcarchive archive",
        {
          timeout: 900000,
        },
      );

      const duration = Date.now() - startTime;

      if (!result.success) {
        return {
          success: false,
          logs: result.output + (result.error || ""),
          duration,
          error: result.error || "iOS build failed",
        };
      }

      const exportOptionsPath = path.join(this.iosProjectPath, "ExportOptions.plist");
      await fs.writeFile(
        exportOptionsPath,
        `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>method</key>
    <string>app-store</string>
    <key>teamID</key>
    <string>PLACEHOLDER_TEAM_ID</string>
</dict>
</plist>
`,
      );

      const exportResult = await runCommand(
        `cd ios && xcodebuild -exportArchive -archivePath App.xcarchive -exportPath . -exportOptionsPlist ExportOptions.plist`,
        { timeout: 300000 },
      );

      const ipaPath = path.join(this.iosProjectPath, "App.ipa");
      const ipaExists = await this.pathExists(ipaPath);

      return {
        success: ipaExists && exportResult.success,
        ipaPath: ipaExists ? ipaPath : undefined,
        plistPath: exportOptionsPath,
        logs:
          result.output +
          (exportResult.success ? "\n" + exportResult.output : exportResult.error || ""),
        duration,
        error: ipaExists ? undefined : "IPA not found after build",
      };
    } catch (error) {
      return {
        success: false,
        logs: "",
        duration: Date.now() - startTime,
        error: error instanceof Error ? error.message : "Unknown iOS build error",
      };
    }
  }

  async validateBuild(): Promise<{ valid: boolean; errors: string[] }> {
    const ipaPath = path.join(this.iosProjectPath, "App.ipa");
    const errors: string[] = [];

    if (!(await this.pathExists(ipaPath))) {
      errors.push("IPA file not found");
    }

    return { valid: errors.length === 0, errors };
  }
}
