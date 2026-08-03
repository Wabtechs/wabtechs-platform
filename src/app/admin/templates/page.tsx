import type { Metadata } from "next";
import Link from "next/link";
import { db } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Pencil, FileCode2 } from "lucide-react";
import { DeleteTemplateButton } from "./delete-button";

export const metadata: Metadata = { title: "Gestion des templates" };
export const dynamic = "force-dynamic";

export default async function AdminTemplatesPage() {
  const items = await db.template.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10">
              <FileCode2 className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <h1 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-foreground">
                Templates
              </h1>
              <p className="mt-0.5 text-[13px] text-gray-500 dark:text-gray-400">
                {items.length} templates au total
              </p>
            </div>
          </div>
        </div>
        <Button
          asChild
          size="sm"
          className="h-8 bg-primary text-white shadow-sm shadow-[#842ae3]/20 hover:bg-[#7323c4] hover:shadow-md hover:shadow-[#842ae3]/25"
        >
          <Link href="/admin/templates/new">
            <Plus className="mr-1.5 h-3.5 w-3.5" />
            Nouveau template
          </Link>
        </Button>
      </div>

      <div className="space-y-2">
        {items.length === 0 ? (
          <Card className="border-border bg-card">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <FileCode2 className="mb-3 h-8 w-8 text-gray-300 dark:text-gray-600" />
              <p className="text-[13px] text-gray-500">Aucun template</p>
              <Link
                href="/admin/templates/new"
                className="mt-2 text-[12px] font-medium text-primary hover:underline"
              >
                Créer votre premier template
              </Link>
            </CardContent>
          </Card>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              className="group flex items-center justify-between rounded-xl border border-border bg-card px-5 py-4 shadow-sm transition-all duration-200 hover:shadow-md"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="truncate text-[14px] font-medium text-gray-900 dark:text-foreground">
                    {item.name}
                  </p>
                  <span className="inline-flex items-center rounded-full bg-primary/[0.06] px-2 py-0.5 text-[10px] font-medium text-primary capitalize">
                    {item.category}
                  </span>
                  {item.published ? (
                    <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
                      Publié
                    </span>
                  ) : (
                    <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-500 dark:bg-white/5 dark:text-gray-400">
                      Brouillon
                    </span>
                  )}
                </div>
                <div className="mt-1.5 flex items-center gap-2 text-[12px] text-gray-400">
                  <span>{Number(item.price) === 0 ? "Gratuit" : `${Number(item.price)}€`}</span>
                  <span>·</span>
                  <span>v{item.version}</span>
                  <span>·</span>
                  <span>{item.downloads} téléchargements</span>
                </div>
              </div>
              <div className="ml-4 flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  asChild
                  className="h-8 w-8 text-gray-400 hover:text-gray-900 dark:hover:text-foreground"
                >
                  <Link href={`/admin/templates/${item.id}/edit`}>
                    <Pencil className="h-3.5 w-3.5" />
                  </Link>
                </Button>
                <DeleteTemplateButton id={item.id} />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
