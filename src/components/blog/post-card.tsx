import Link from "next/link";
import { Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { PostMeta } from "@/lib/mdx";
import { formatDate } from "@/lib/utils";

interface PostCardProps {
  post: PostMeta;
}

export function PostCard({ post }: PostCardProps) {
  return (
    <Link href={`/blog/${post.slug}`}>
      <Card className="group h-full transition-all hover:shadow-lg hover:border-primary/50">
        <CardHeader>
          <div className="mb-2 flex flex-wrap items-center gap-2">
            {post.tags.slice(0, 2).map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              {post.readTime} min
            </span>
          </div>
          <CardTitle className="text-lg group-hover:text-primary transition-colors line-clamp-2">
            {post.title}
          </CardTitle>
          <CardDescription className="line-clamp-2">{post.description}</CardDescription>
          <p className="text-xs text-muted-foreground">{formatDate(post.date)}</p>
        </CardHeader>
      </Card>
    </Link>
  );
}
