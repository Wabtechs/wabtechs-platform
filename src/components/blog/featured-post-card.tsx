import Link from "next/link";
import { Clock, ArrowRight, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { PostMeta } from "@/lib/mdx";
import { formatDate } from "@/lib/utils";

interface FeaturedPostCardProps {
  post: PostMeta;
}

export function FeaturedPostCard({ post }: FeaturedPostCardProps) {
  return (
    <Link href={`/blog/${post.slug}`}>
      <Card className="group relative overflow-hidden border-primary/20 bg-gradient-to-br from-primary/5 via-background to-primary/10 transition-all hover:shadow-xl hover:border-primary/40">
        <div className="absolute top-4 right-4">
        </div>
        <CardHeader className="pb-4">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <Badge className="bg-primary text-primary-foreground text-xs">
              <Star className="mr-1 h-3 w-3" />
              Featured
            </Badge>
            {post.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              {post.readTime} min
            </span>
          </div>
          <CardTitle className="text-xl group-hover:text-primary transition-colors line-clamp-2">
            {post.title}
          </CardTitle>
          <CardDescription className="line-clamp-3 text-sm">
            {post.description}
          </CardDescription>
          <div className="flex items-center justify-between pt-2">
            <p className="text-xs text-muted-foreground">{formatDate(post.date)}</p>
            <span className="flex items-center gap-1 text-xs font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
              Lire
              <ArrowRight className="h-3 w-3" />
            </span>
          </div>
        </CardHeader>
      </Card>
    </Link>
  );
}
