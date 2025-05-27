
import { getDirectoryItemBySlug, getDirectoryItems, getCategories } from "@/lib/sheets";
import type { Metadata, ResolvingMetadata } from 'next';
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  ExternalLink,
  Star,
  Tag,
  ThumbsUp,
  ThumbsDown,
  Zap,
  DollarSign,
  CalendarDays,
  Users,
  Twitter,
  Linkedin,
  Facebook,
  Info
} from "lucide-react";
import { DirectoryItemCard } from "@/components/listing/DirectoryItemCard"; // For related items

type Props = {
  params: { slug: string };
};

export async function generateStaticParams() {
  const items = await getDirectoryItems();
  return items.map((item) => ({
    slug: item.slug,
  }));
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug } = await params;
  const item = await getDirectoryItemBySlug(slug);

  if (!item) {
    return {
      title: "Item Not Found",
    };
  }

  return {
    title: item.name,
    description: item.description,
    openGraph: {
      title: item.name,
      description: item.description,
      images: item.imageUrl ? [{ url: item.imageUrl }] : [],
    },
  };
}

export default async function DirectoryItemPage({ params }: Props) {
  const { slug } = await params;
  const item = await getDirectoryItemBySlug(slug);

  if (!item) {
    notFound();
  }
  
  // Fetch related items (e.g., same category, excluding current item)
  const allItemsInCategory = await getDirectoryItems(undefined, item.category);
  const relatedItems = allItemsInCategory.filter(related => related.id !== item.id).slice(0, 3);


  return (
    <div className="container py-12 md:py-16 pl-6">
      <article className="grid lg:grid-cols-3 gap-8 md:gap-12">
        {/* Main Content Column */}
        <div className="lg:col-span-2 space-y-8">
          <Card className="overflow-hidden">
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-start gap-4 md:gap-6 mb-4">
                {item.imageUrl && (
                  <div className="relative w-full md:w-1/3 aspect-video md:aspect-square rounded-lg overflow-hidden shadow-md shrink-0">
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      layout="fill"
                      objectFit="cover"
                      data-ai-hint="product logo company"
                    />
                  </div>
                )}
                <div className="flex-grow">
                  <Link href={`/categories/${item.category}`}>
                    <Badge variant="secondary" className="mb-2 capitalize">{item.category.replace('-', ' ')}</Badge>
                  </Link>
                  <CardTitle className="text-3xl md:text-4xl font-bold">{item.name}</CardTitle>
                  <CardDescription className="text-lg text-muted-foreground mt-1">{item.tagline}</CardDescription>
                  
                  <div className="flex items-center gap-4 mt-4">
                    {item.rating && (
                      <div className="flex items-center gap-1 text-sm">
                        <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                        <span className="font-semibold">{item.rating.toFixed(1)}</span>
                        {item.reviewCount && <span className="text-muted-foreground">({item.reviewCount} reviews)</span>}
                      </div>
                    )}
                     <Button asChild variant="default" size="sm">
                        <Link href={item.website} target="_blank" rel="noopener noreferrer">
                          Visit Website <ExternalLink className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                  </div>
                </div>
              </div>
            </CardHeader>
            
            <Separator />

            {item.longDescription && (
              <CardContent className="pt-6">
                <h2 className="text-2xl font-semibold mb-3">About {item.name}</h2>
                <div className="prose prose-sm sm:prose-base max-w-none text-foreground" dangerouslySetInnerHTML={{ __html: item.longDescription }} />
              </CardContent>
            )}
          </Card>

          {item.features && item.features.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl flex items-center"><Zap className="mr-2 h-6 w-6 text-primary"/> Key Features</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {item.features.map((feature, index) => (
                    <li key={index} className="p-3 bg-secondary/50 rounded-md">
                      <p className="font-semibold text-foreground">{feature.name}</p>
                      {feature.description && <p className="text-xs text-muted-foreground">{feature.description}</p>}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {(item.pros && item.pros.length > 0 || item.cons && item.cons.length > 0) && (
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Pros & Cons</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2 flex items-center text-green-600">
                    <ThumbsUp className="mr-2 h-5 w-5"/> Pros
                  </h3>
                  <ul className="space-y-1 list-disc list-inside text-sm">
                    {item.pros?.map((pro, index) => <li key={index}>{pro}</li>)}
                    {(!item.pros || item.pros.length === 0) && <li className="text-muted-foreground">No pros listed.</li>}
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2 flex items-center text-red-600">
                    <ThumbsDown className="mr-2 h-5 w-5"/> Cons
                  </h3>
                  <ul className="space-y-1 list-disc list-inside text-sm">
                    {item.cons?.map((con, index) => <li key={index}>{con}</li>)}
                    {(!item.cons || item.cons.length === 0) && <li className="text-muted-foreground">No cons listed.</li>}
                  </ul>
                </div>
              </CardContent>
            </Card>
          )}

        </div>

        {/* Sidebar Column */}
        <aside className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex items-center"><Info className="mr-2 h-5 w-5 text-primary"/>Quick Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              {item.pricing && (
                <div className="flex items-start">
                  <DollarSign className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground shrink-0" />
                  <div>
                    <span className="font-semibold">Pricing: </span>
                    <span className="text-muted-foreground">{item.pricing}</span>
                  </div>
                </div>
              )}
              {item.category && (
                <div className="flex items-start">
                  <Tag className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground shrink-0" />
                  <div>
                    <span className="font-semibold">Category: </span>
                    <Link href={`/categories/${item.category}`} className="text-primary hover:underline capitalize">
                      {item.category.replace('-', ' ')}
                    </Link>
                  </div>
                </div>
              )}
              {item.foundedYear && (
                <div className="flex items-start">
                  <CalendarDays className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground shrink-0" />
                   <div>
                    <span className="font-semibold">Founded: </span>
                    <span className="text-muted-foreground">{item.foundedYear}</span>
                  </div>
                </div>
              )}
              {item.lastUpdated && (
                 <div className="flex items-start">
                  <CalendarDays className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground shrink-0" />
                   <div>
                    <span className="font-semibold">Last Updated: </span>
                    <span className="text-muted-foreground">{new Date(item.lastUpdated).toLocaleDateString()}</span>
                  </div>
                </div>
              )}
              {item.socials && (Object.keys(item.socials).length > 0) && (
                <div className="pt-2">
                  <p className="font-semibold mb-1">Socials:</p>
                  <div className="flex space-x-3">
                    {item.socials.twitter && <Link href={`https://twitter.com/${item.socials.twitter}`} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary"><Twitter size={18}/></Link>}
                    {item.socials.linkedin && <Link href={`https://linkedin.com/${item.socials.linkedin}`} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary"><Linkedin size={18}/></Link>}
                    {item.socials.facebook && <Link href={`https://facebook.com/${item.socials.facebook}`} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary"><Facebook size={18}/></Link>}
                  </div>
                </div>
              )}
            </CardContent>
             <CardFooter className="border-t pt-4">
                 <Button asChild className="w-full">
                    <Link href={item.website} target="_blank" rel="noopener noreferrer">
                      Visit {item.name} <ExternalLink className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
             </CardFooter>
          </Card>
          
          {relatedItems.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold mt-8">Related Tools</h3>
              <div className="grid grid-cols-1 gap-4">
                {relatedItems.map(relatedItem => (
                  <DirectoryItemCard key={relatedItem.id} item={relatedItem} />
                ))}
              </div>
            </div>
          )}

        </aside>
      </article>
    </div>
  );
}
