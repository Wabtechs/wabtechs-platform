import type { Metadata } from "next";
import Link from "next/link";
import { db } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Pencil, HelpCircle } from "lucide-react";
import { DeleteFaqItemButton } from "./delete-button";

export const metadata: Metadata = { title: "Gestion de la FAQ" };
export const dynamic = "force-dynamic";

export default async function AdminFaqItemsPage() {
  const items = await db.faqItem.findMany({
    orderBy: { order: "asc" },
  });

  return (
    <div className="min-h-screen">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-500/10">
              <HelpCircle className="h-5 w-5 text-teal-500" />
            </div>
            <div>
              <h1 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-foreground">
                FAQ
              </h1>
              <p className="mt-0.5 text-[13px] text-gray-500 dark:text-gray-400">
                {items.length} questions au total
              </p>
            </div>
          </div>
        </div>
        <Button
          asChild
          size="sm"
          className="h-8 bg-primary text-white shadow-sm shadow-[#842ae3]/20 hover:bg-[#7323c4] hover:shadow-md hover:shadow-[#842ae3]/25"
        >
          <Link href="/admin/faq-items/new">
            <Plus className="mr-1.5 h-3.5 w-3.5" />
            Nouvelle question
          </Link>
        </Button>
      </div>

      <div className="space-y-2">
        {items.length === 0 ? (
          <Card className="border-gray-200/80 bg-white dark:border-border dark:bg-card">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <HelpCircle className="mb-3 h-8 w-8 text-gray-300 dark:text-gray-600" />
              <p className="text-[13px] text-gray-500">Aucune question</p>
              <Link
                href="/admin/faq-items/new"
                className="mt-2 text-[12px] font-medium text-primary hover:underline"
              >
                Créer votre première question
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
                    {item.question}
                  </p>
                  <span className="inline-flex items-center rounded-full bg-teal-50 px-2 py-0.5 text-[10px] font-medium text-teal-600 dark:bg-teal-500/10 dark:text-teal-400">
                    {item.category}
                  </span>
                </div>
              </div>
              <div className="ml-4 flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  asChild
                  className="h-8 w-8 text-gray-400 hover:text-gray-900 dark:hover:text-foreground"
                >
                  <Link href={`/admin/faq-items/${item.id}/edit`}>
                    <Pencil className="h-3.5 w-3.5" />
                  </Link>
                </Button>
                <DeleteFaqItemButton id={item.id} />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
