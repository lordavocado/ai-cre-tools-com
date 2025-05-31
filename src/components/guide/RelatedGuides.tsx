import { Guide } from "@/lib/markdown";
import { GuideCard } from "./GuideCard";
import { Separator } from "@/components/ui/separator";

interface RelatedGuidesProps {
  currentGuide: Guide;
  allGuides: Guide[];
  maxItems?: number;
}

export function RelatedGuides({ currentGuide, allGuides, maxItems = 3 }: RelatedGuidesProps) {
  // Function to calculate similarity score between guides
  const calculateSimilarity = (guide1: Guide, guide2: Guide): number => {
    let score = 0;
    
    // Same category gets high score
    if (guide1.category === guide2.category && guide1.category) {
      score += 40;
    }
    
    // Same author gets some score
    if (guide1.author === guide2.author && guide1.author) {
      score += 20;
    }
    
    // Shared words in title (case insensitive)
    const words1 = guide1.title.toLowerCase().split(/\s+/);
    const words2 = guide2.title.toLowerCase().split(/\s+/);
    const commonWords = words1.filter(word => 
      word.length > 3 && words2.includes(word)
    );
    score += commonWords.length * 10;
    
    // Shared words in excerpt
    const excerptWords1 = guide1.excerpt.toLowerCase().split(/\s+/);
    const excerptWords2 = guide2.excerpt.toLowerCase().split(/\s+/);
    const commonExcerptWords = excerptWords1.filter(word => 
      word.length > 4 && excerptWords2.includes(word)
    );
    score += commonExcerptWords.length * 5;
    
    // Shared related items
    if (guide1.relatedItems && guide2.relatedItems) {
      const sharedItems = guide1.relatedItems.filter(item => 
        guide2.relatedItems?.includes(item)
      );
      score += sharedItems.length * 15;
    }
    
    return score;
  };

  // Get related guides (excluding current guide)
  const relatedGuides = allGuides
    .filter(guide => guide.id !== currentGuide.id)
    .map(guide => ({
      guide,
      similarity: calculateSimilarity(currentGuide, guide)
    }))
    .filter(item => item.similarity > 0) // Only include guides with some similarity
    .sort((a, b) => b.similarity - a.similarity) // Sort by similarity descending
    .slice(0, maxItems)
    .map(item => item.guide);

  // If we don't have enough similar guides, fill with recent guides from same category
  if (relatedGuides.length < maxItems && currentGuide.category) {
    const categoryGuides = allGuides
      .filter(guide => 
        guide.id !== currentGuide.id && 
        guide.category === currentGuide.category &&
        !relatedGuides.some(related => related.id === guide.id)
      )
      .sort((a, b) => new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime())
      .slice(0, maxItems - relatedGuides.length);
    
    relatedGuides.push(...categoryGuides);
  }

  // If still not enough, fill with most recent guides
  if (relatedGuides.length < maxItems) {
    const recentGuides = allGuides
      .filter(guide => 
        guide.id !== currentGuide.id &&
        !relatedGuides.some(related => related.id === guide.id)
      )
      .sort((a, b) => new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime())
      .slice(0, maxItems - relatedGuides.length);
    
    relatedGuides.push(...recentGuides);
  }

  if (relatedGuides.length === 0) {
    return null;
  }

  return (
    <section className="mt-16">
      <Separator className="my-8" />
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Related Guides</h2>
        <p className="text-muted-foreground">
          Continue learning with these related articles and tutorials
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {relatedGuides.map((guide) => (
          <GuideCard key={guide.id} guide={guide} />
        ))}
      </div>
    </section>
  );
} 