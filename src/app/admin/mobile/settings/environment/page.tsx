import type { Metadata } from "next";
import { EnvDetectionService } from "@/modules/mobile-builder/utils/env-detection";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle } from "lucide-react";

export const metadata: Metadata = { title: "Diagnostic environnement — Mobile Center" };
export const dynamic = "force-dynamic";

function StatusIcon({ installed }: { installed: boolean }) {
  return installed ? (
    <CheckCircle className="h-5 w-5 text-green-500" />
  ) : (
    <XCircle className="h-5 w-5 text-red-500" />
  );
}

export default async function EnvironmentPage() {
  const diagnostic = await EnvDetectionService.runDiagnostic();

  const checks = [
    { ...diagnostic.androidStudio, name: "Android Studio" },
    { ...diagnostic.androidSdk, name: "Android SDK" },
    { ...diagnostic.java, name: "Java JDK" },
    { ...diagnostic.gradle, name: "Gradle" },
    { ...diagnostic.androidBuildTools, name: "Android Build Tools" },
  ];

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold">Diagnostic environnement</h1>
      <p className="text-muted-foreground mt-2">
        Vérifiez que tous les outils de build mobile sont disponibles.
      </p>

      <div className="mt-8 space-y-4">
        {checks.map((check) => (
          <Card key={check.name}>
            <CardContent className="flex items-center gap-4 pt-6">
              <StatusIcon installed={check.installed} />
              <div className="flex-1">
                <p className="font-medium">{check.name}</p>
                <p className="text-muted-foreground text-sm">
                  {check.installed
                    ? check.version
                      ? `Version ${check.version}`
                      : check.path
                        ? `Chemin: ${check.path}`
                        : "Installé"
                    : "Non installé"}
                </p>
                {check.description && (
                  <p className="text-muted-foreground mt-1 text-xs">{check.description}</p>
                )}
              </div>
              <Badge variant={check.installed ? "default" : "destructive"}>
                {check.installed ? "OK" : "Manquant"}
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8 rounded-lg border border-white/10 bg-[#1F1F1F] p-6">
        <h2 className="mb-4 text-lg font-semibold">Commandes utiles</h2>
        <pre className="text-muted-foreground text-sm whitespace-pre-wrap">
          {`# Synchroniser Capacitor
npx cap sync android

# Ouvrir Android Studio
npx cap open android

# Générer APK debug
cd android && ./gradlew assembleDebug

# Générer APK production
cd android && ./gradlew assembleRelease

# Générer AAB Google Play
cd android && ./gradlew bundleRelease`}
        </pre>
      </div>
    </div>
  );
}
