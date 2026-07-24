import { Clock, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { PostMeta } from "@/lib/mdx";
import { formatDate } from "@/lib/utils";

interface PostHeaderProps {
  post: PostMeta;
}

export function PostHeader({ post }: PostHeaderProps) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <div className="mb-4 flex flex-wrap items-center justify-center gap-2">
        {post.tags.map((tag) => (
          <Badge key={tag} variant="secondary">
            {tag}
          </Badge>
        ))}
      </div>
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
        {post.title}
      </h1>
      <p className="mt-4 text-lg text-muted-foreground">{post.description}</p>
      <div className="mt-6 flex items-center justify-center gap-4 text-sm text-muted-foreground">
        <span>{post.author}</span>
        <span className="h-1 w-1 rounded-full bg-muted-foreground" />
        <span className="flex items-center gap-1">
          <Calendar className="h-3 w-3" />
          {formatDate(post.date)}
        </span>
        <span className="h-1 w-1 rounded-full bg-muted-foreground" />
        <span className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          {post.readTime} min de lecture
        </span>
      </div>
    </div>
  );
}
