import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Documentation",
};

export default async function DocPage({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  return (
    <div className="pt-24 pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="text-muted-foreground">Doc page: {slug.join("/")}</p>
      </div>
    </div>
  );
}
