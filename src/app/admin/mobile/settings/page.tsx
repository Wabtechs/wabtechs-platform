import type { Metadata } from "next";
import Link from "next/link";
import { Smartphone, Shield, Database, Server } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = { title: "Paramètres — Mobile Center" };
export const dynamic = "force-dynamic";

export default function MobileSettingsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold">Paramètres Mobile Center</h1>
      <p className="text-muted-foreground mt-2">
        Configurez le Mobile App Builder et ses intégrations.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Smartphone className="text-primary h-5 w-5" />
              Applications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4 text-sm">
              Gérez vos applications mobiles, les builds et les releases.
            </p>
            <Button asChild variant="outline">
              <Link href="/admin/mobile/apps">Voir les applications</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="text-primary h-5 w-5" />
              Certificats
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4 text-sm">
              Gérez les clés de signature Android et Apple.
            </p>
            <Button asChild variant="outline">
              <Link href="/admin/mobile/certificates">Gérer les certificats</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="text-primary h-5 w-5" />
              Stores
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4 text-sm">
              Connectez Google Play Console et App Store Connect.
            </p>
            <Button asChild variant="outline">
              <Link href="/admin/mobile/settings">Intégrations stores</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Server className="text-primary h-5 w-5" />
              Environnement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4 text-sm">
              Vérifiez la configuration de l&apos;environnement de build.
            </p>
            <Button asChild variant="outline">
              <Link href="/admin/mobile/settings/environment">Diagnostic</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
