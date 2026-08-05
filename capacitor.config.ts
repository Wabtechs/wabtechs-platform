import type { CapacitorConfig } from "@capacitor/cli";

const isDev = process.env.NODE_ENV !== "production";
const devUrl = "http://10.0.2.2:3000"; // Android emulator -> host localhost

const config: CapacitorConfig = {
  appId: "com.wabtechs.platform",
  appName: "Wabtechs Platform",
  webDir: "dist", // dummy, will be overridden by server.url in dev
  server: isDev
    ? {
        url: devUrl,
        cleartext: true,
      }
    : undefined,
  android: {
    allowMixedContent: isDev,
    loggingBehavior: "debug",
  },
};

export default config;
