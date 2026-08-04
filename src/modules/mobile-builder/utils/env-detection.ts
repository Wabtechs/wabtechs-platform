import crypto from "crypto";

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

const ENCRYPTION_KEY =
  process.env.MOBILE_ENCRYPTION_KEY ||
  process.env.NEXTAUTH_SECRET ||
  "default-dev-key-change-in-production";
const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 16;
const TAG_LENGTH = 16;

export class EncryptionService {
  private static getKey(): Buffer {
    return crypto.scryptSync(ENCRYPTION_KEY, "wabtechs-salt", 32);
  }

  static encrypt(text: string): string {
    const iv = crypto.randomBytes(IV_LENGTH);
    const key = this.getKey();
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
    const encrypted = Buffer.concat([cipher.update(text, "utf8"), cipher.final()]);
    const tag = cipher.getAuthTag();
    return Buffer.concat([iv, tag, encrypted]).toString("base64url");
  }

  static decrypt(encrypted: string): string {
    const data = Buffer.from(encrypted, "base64url");
    const iv = data.subarray(0, IV_LENGTH);
    const tag = data.subarray(IV_LENGTH, IV_LENGTH + TAG_LENGTH);
    const encryptedText = data.subarray(IV_LENGTH + TAG_LENGTH);
    const key = this.getKey();
    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(tag);
    const decrypted = Buffer.concat([decipher.update(encryptedText), decipher.final()]);
    return decrypted.toString("utf8");
  }
}

export class EnvDetectionService {
  static async checkJava(): Promise<{ installed: boolean; version?: string; path?: string }> {
    try {
      const result = await runCommand("java -version", { timeout: 10000 });
      if (result.success) {
        const versionMatch = result.output.match(/version "([^"]+)"/);
        const pathResult = await runCommand("where java", { timeout: 5000 });
        return {
          installed: true,
          version: versionMatch ? versionMatch[1] : undefined,
          path: pathResult.success ? pathResult.output.trim() : undefined,
        };
      }
      return { installed: false };
    } catch {
      return { installed: false };
    }
  }

  static async checkAndroidSdk(): Promise<{
    installed: boolean;
    path?: string;
    buildTools?: string[];
  }> {
    const androidHome = process.env.ANDROID_HOME || process.env.ANDROID_SDK_ROOT;
    if (!androidHome) return { installed: false };

    try {
      const buildToolsResult = await runCommand(`ls ${androidHome}/build-tools`, { timeout: 5000 });
      const buildTools = buildToolsResult.success
        ? buildToolsResult.output
            .trim()
            .split("\n")
            .filter((b) => b.trim())
        : [];

      return {
        installed: true,
        path: androidHome,
        buildTools,
      };
    } catch {
      return { installed: false };
    }
  }

  static async checkAndroidStudio(): Promise<{
    installed: boolean;
    path?: string;
    version?: string;
  }> {
    const possiblePaths = [
      "C:\\Program Files\\Android\\Android Studio",
      "C:\\Program Files\\JetBrains\\AndroidStudio",
    ];

    for (const basePath of possiblePaths) {
      try {
        const exists = await runCommand(`Test-Path "${basePath}"`, { timeout: 5000 });
        if (exists.success && exists.output.toLowerCase().includes("true")) {
          return { installed: true, path: basePath };
        }
      } catch {
        // Continue checking
      }
    }

    return { installed: false };
  }

  static async checkGradle(): Promise<{ installed: boolean; version?: string }> {
    try {
      const result = await runCommand("gradle --version", { timeout: 10000 });
      if (result.success) {
        const versionMatch = result.output.match(/Gradle (\S+)/);
        return {
          installed: true,
          version: versionMatch ? versionMatch[1] : undefined,
        };
      }
      return { installed: false };
    } catch {
      return { installed: false };
    }
  }

  static async runDiagnostic(): Promise<EnvironmentDiagnostic> {
    const [androidStudio, androidSdk, java, gradle] = await Promise.all([
      this.checkAndroidStudio(),
      this.checkAndroidSdk(),
      this.checkJava(),
      this.checkGradle(),
    ]);

    return {
      androidStudio: {
        name: "Android Studio",
        installed: androidStudio.installed,
        version: androidStudio.version,
        path: androidStudio.path,
        description: "IDE for Android app development",
      },
      androidSdk: {
        name: "Android SDK",
        installed: androidSdk.installed,
        path: androidSdk.path,
        description: "Software Development Kit for Android",
      },
      java: {
        name: "Java JDK",
        installed: java.installed,
        version: java.version,
        path: java.path,
        description: "Java Development Kit (required for Android builds)",
      },
      gradle: {
        name: "Gradle",
        installed: gradle.installed,
        version: gradle.version,
        description: "Build tool for Android projects",
      },
      androidBuildTools: {
        name: "Android Build Tools",
        installed: Boolean(androidSdk.buildTools && androidSdk.buildTools.length > 0),
        description: "Build tools version(s): " + (androidSdk.buildTools?.join(", ") || "none"),
      },
    };
  }
}

import { exec } from "child_process";

export async function runCommand(
  command: string,
  options: { timeout?: number } = {},
): Promise<{ success: boolean; output: string; error?: string }> {
  return new Promise((resolve) => {
    exec(
      command,
      { timeout: options.timeout || 30000 },
      (err: Error | null, stdout: string, stderr: string) => {
        if (err) {
          resolve({ success: false, output: stdout, error: stderr || err.message });
        } else {
          resolve({ success: true, output: stdout });
        }
      },
    );
  });
}
