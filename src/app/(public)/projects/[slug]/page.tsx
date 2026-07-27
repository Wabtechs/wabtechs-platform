import type { Metadata } from "next";

export const metadata: Metadata = { title: "Projet" };

export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return (
    <div className="pt-24 pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="text-muted-foreground">Projet: {slug}</p>
      </div>
    </div>
  );
}
