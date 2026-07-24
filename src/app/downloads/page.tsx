import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Download } from "lucide-react";

export const metadata: Metadata = { title: "Téléchargements" };

const DOWNLOADS = [
  { title: "WabTechs VSCode Theme", description: "Thème VSCode personnalisé", size: "2 MB" },
  { title: "Terminal Config", description: "Configuration terminal et shell", size: "15 KB" },
];

export default function DownloadsPage() {
  return (
    <div className="pt-24 pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <Badge variant="secondary" className="mb-4"><Download className="mr-1 h-3 w-3" /> Téléchargements</Badge>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Téléchargements <span className="gradient-text">gratuits</span></h1>
        </div>
        <div className="mt-16 space-y-4 max-w-3xl mx-auto">
          {DOWNLOADS.map((d) => (
            <Card key={d.title} className="flex items-center justify-between cursor-pointer transition-all hover:shadow-lg">
              <CardHeader><CardTitle className="text-base">{d.title}</CardTitle><CardDescription>{d.description}</CardDescription></CardHeader>
              <div className="pr-6"><Badge variant="outline">{d.size}</Badge></div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
