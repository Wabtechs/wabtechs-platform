import type { Metadata } from "next";
import { MobileAppRepository } from "@/modules/mobile-builder/database/repository";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, Smartphone } from "lucide-react";

export const metadata: Metadata = { title: "Nouvelle application — Mobile Center" };
export const dynamic = "force-dynamic";

const repo = new MobileAppRepository();

export default async function NewAppPage() {
  async function createApp(formData: FormData) {
    "use server";
    const name = formData.get("name") as string;
    const packageName = formData.get("packageName") as string;
    const bundleId = formData.get("bundleId") as string;
    const repositoryUrl = formData.get("repositoryUrl") as string;
    const description = (formData.get("description") as string) || undefined;
    const framework = (formData.get("framework") as string) || "NEXT_JS";
    const version = (formData.get("version") as string) || "1.0.0";

    await repo.create({
      name,
      packageName,
      bundleId,
      repositoryUrl,
      description,
      framework: framework as "NEXT_JS" | "REACT_NATIVE" | "EXPO" | "VUE" | "SVELTEKIT" | "CUSTOM",
      version,
    });

    redirect("/admin/mobile/apps");
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center gap-4">
        <Button variant="outline" asChild>
          <Link href="/admin/mobile/apps">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Nouvelle application</h1>
      </div>

      <form
        action={createApp}
        className="space-y-6 rounded-lg border border-white/10 bg-[#1F1F1F] p-8"
      >
        <div className="space-y-2">
          <Label htmlFor="name">Nom de l&apos;application</Label>
          <Input id="name" name="name" required placeholder="Santé Connect" />
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="packageName">Package Android</Label>
            <Input
              id="packageName"
              name="packageName"
              required
              placeholder="com.wabtechs.santeconnect"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bundleId">Bundle iOS</Label>
            <Input id="bundleId" name="bundleId" required placeholder="com.wabtechs.santeconnect" />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="repositoryUrl">URL du repository GitHub</Label>
          <Input
            id="repositoryUrl"
            name="repositoryUrl"
            required
            placeholder="https://github.com/Wabtechs/sante_connect"
          />
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="framework">Framework</Label>
            <Select name="framework" defaultValue="NEXT_JS">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="NEXT_JS">Next.js</SelectItem>
                <SelectItem value="REACT_NATIVE">React Native</SelectItem>
                <SelectItem value="EXPO">Expo</SelectItem>
                <SelectItem value="VUE">Vue</SelectItem>
                <SelectItem value="SVELTEKIT">SvelteKit</SelectItem>
                <SelectItem value="CUSTOM">Custom</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="version">Version initiale</Label>
            <Input id="version" name="version" defaultValue="1.0.0" />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            rows={3}
            placeholder="Description de l'application..."
          />
        </div>

        <div className="flex gap-4">
          <Button type="submit" className="flex-1">
            <Smartphone className="mr-2 h-4 w-4" />
            Créer l&apos;application
          </Button>
          <Button variant="outline" asChild>
            <Link href="/admin/mobile/apps">Annuler</Link>
          </Button>
        </div>
      </form>
    </div>
  );
}
