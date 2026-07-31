import type { Metadata } from "next";
import Link from "next/link";
import { db } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Pencil, Briefcase } from "lucide-react";
import { DeleteResumeItemButton } from "./delete-button";

export const metadata: Metadata = { title: "Gestion des expériences" };
export const dynamic = "force-dynamic";

export default async function AdminResumeItemsPage() {
  const items = await db.resumeItem.findMany({
    orderBy: { order: "asc" },
  });

  return (
    <div className="min-h-screen">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10">
              <Briefcase className="h-5 w-5 text-indigo-500" />
            </div>
            <div>
              <h1 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-foreground">
                Expériences
              </h1>
              <p className="mt-0.5 text-[13px] text-gray-500 dark:text-gray-400">
                {items.length} expériences au total
              </p>
            </div>
          </div>
        </div>
        <Button
          asChild
          size="sm"
          className="h-8 bg-primary text-white shadow-sm shadow-[#842ae3]/20 hover:bg-[#7323c4] hover:shadow-md hover:shadow-[#842ae3]/25"
        >
          <Link href="/admin/resume-items/new">
            <Plus className="mr-1.5 h-3.5 w-3.5" />
            Nouvelle expérience
          </Link>
        </Button>
      </div>

      <div className="space-y-2">
        {items.length === 0 ? (
          <Card className="border-gray-200/80 bg-white dark:border-border dark:bg-card">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Briefcase className="mb-3 h-8 w-8 text-gray-300 dark:text-gray-600" />
              <p className="text-[13px] text-gray-500">Aucune expérience</p>
              <Link
                href="/admin/resume-items/new"
                className="mt-2 text-[12px] font-medium text-primary hover:underline"
              >
                Créer votre première expérience
              </Link>
            </CardContent>
          </Card>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              className="group flex items-center justify-between rounded-xl border border-gray-200/80 bg-white px-5 py-4 transition-all duration-200 hover:shadow-[0_4px_20px_rgb(0,0,0,0.03)] dark:border-border dark:bg-card dark:hover:shadow-[0_4px_20px_rgb(0,0,0,0.15)]"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="truncate text-[14px] font-medium text-gray-900 dark:text-foreground">
                    {item.title}
                  </p>
                </div>
                <div className="mt-1.5 flex items-center gap-2 text-[12px] text-gray-400">
                  <span className="font-medium">{item.company}</span>
                  <span>·</span>
                  <span>{item.years}</span>
                </div>
              </div>
              <div className="ml-4 flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  asChild
                  className="h-8 w-8 text-gray-400 hover:text-gray-900 dark:hover:text-foreground"
                >
                  <Link href={`/admin/resume-items/${item.id}/edit`}>
                    <Pencil className="h-3.5 w-3.5" />
                  </Link>
                </Button>
                <DeleteResumeItemButton id={item.id} />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
