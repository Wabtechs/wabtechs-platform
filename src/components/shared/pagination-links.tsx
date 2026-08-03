import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PaginationLinksProps {
  currentPage: number;
  totalPages: number;
  basePath: string;
  searchParams?: Record<string, string | undefined>;
  className?: string;
}

function buildHref(
  basePath: string,
  page: number,
  searchParams?: Record<string, string | undefined>,
): string {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(searchParams ?? {})) {
    if (value) params.set(key, value);
  }
  params.set("page", String(page));
  const query = params.toString();
  return query ? `${basePath}?${query}` : basePath;
}

export function PaginationLinks({
  currentPage,
  totalPages,
  basePath,
  searchParams,
  className,
}: PaginationLinksProps) {
  if (totalPages <= 1) return null;

  const start = Math.max(1, currentPage - 2);
  const end = Math.min(totalPages, currentPage + 2);
  const pageNumbers: number[] = [];
  for (let i = start; i <= end; i++) pageNumbers.push(i);

  return (
    <div className={cn("mt-8 flex items-center justify-center gap-2", className)}>
      {currentPage > 1 ? (
        <Button variant="outline" size="icon" asChild>
          <Link href={buildHref(basePath, currentPage - 1, searchParams)}>
            <ChevronLeft className="h-4 w-4" />
          </Link>
        </Button>
      ) : (
        <Button variant="outline" size="icon" disabled>
          <ChevronLeft className="h-4 w-4" />
        </Button>
      )}
      {pageNumbers.map((page) => (
        <Button
          key={page}
          variant={page === currentPage ? "default" : "outline"}
          size="icon"
          asChild={page !== currentPage}
        >
          {page === currentPage ? (
            page
          ) : (
            <Link href={buildHref(basePath, page, searchParams)}>{page}</Link>
          )}
        </Button>
      ))}
      {currentPage < totalPages ? (
        <Button variant="outline" size="icon" asChild>
          <Link href={buildHref(basePath, currentPage + 1, searchParams)}>
            <ChevronRight className="h-4 w-4" />
          </Link>
        </Button>
      ) : (
        <Button variant="outline" size="icon" disabled>
          <ChevronRight className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
