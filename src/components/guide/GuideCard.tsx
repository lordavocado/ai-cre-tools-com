
import type { Guide } from "@/types";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Clock, UserCircle } from "lucide-react";
import { format } from "date-fns";

interface GuideCardProps {
  guide: Guide;
}

export function GuideCard({ guide }: GuideCardProps) {
  return (
    <Link href={`/guides/${guide.slug}`} className="group block">
      <Card className="h-full flex flex-col overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 hover:border-primary">
        {guide.imageUrl && (
          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-t-lg">
            <Image
              src={guide.imageUrl}
              alt={guide.title}
              layout="fill"
              objectFit="cover"
              className="transition-transform duration-300 group-hover:scale-105"
              data-ai-hint="article illustration blog"
            />
          </div>
        )}
        <CardHeader>
          {guide.category && <Badge variant="outline" className="mb-2 w-fit">{guide.category.replace('-', ' ')}</Badge>}
          <CardTitle className="text-xl group-hover:text-primary transition-colors">{guide.title}</CardTitle>
        </CardHeader>
        <CardContent className="flex-grow">
          <CardDescription className="text-sm line-clamp-3">{guide.excerpt}</CardDescription>
        </CardContent>
        <CardFooter className="text-xs text-muted-foreground border-t pt-4 flex flex-wrap gap-x-4 gap-y-2">
           <div className="flex items-center">
            <CalendarDays className="mr-1.5 h-3.5 w-3.5" />
            {format(new Date(guide.publishedDate), "MMMM d, yyyy")}
          </div>
          {guide.author && (
            <div className="flex items-center">
              <UserCircle className="mr-1.5 h-3.5 w-3.5" />
              {guide.author}
            </div>
          )}
          {guide.readingTime && (
             <div className="flex items-center">
              <Clock className="mr-1.5 h-3.5 w-3.5" />
              {guide.readingTime}
            </div>
          )}
        </CardFooter>
      </Card>
    </Link>
  );
}
