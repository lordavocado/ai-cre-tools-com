
import { Button } from "@/components/ui/button";
import { NewsletterForm } from "./NewsletterForm";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function Hero() {
  return (
    <section className="py-20 md:py-32 bg-gradient-to-b from-background to-secondary/30">
      <div className="container text-center">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-primary">
          Build Powerful Directories with Google Sheets
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-10">
          Sheet2Site Pro is the ultimate boilerplate to create stunning, SEO-optimized directories using the simplicity of Google Sheets as your database. Launch your site in minutes.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <Button asChild size="lg" className="shadow-lg">
            <Link href="#directory">
              Explore Directory <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="shadow-lg">
            <Link href="/guides/getting-started">
              Get Started Guide
            </Link>
          </Button>
        </div>
        <div>
          <h3 className="text-md font-semibold mb-3">Stay Updated</h3>
          <NewsletterForm />
        </div>
      </div>
    </section>
  );
}
