"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Send, Globe, Mail, MessageSquare } from 'lucide-react';

const submitToolSchema = z.object({
  website: z.string()
    .url({ message: "Please enter a valid website URL" })
    .refine((url) => {
      try {
        const parsedUrl = new URL(url);
        return parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:';
      } catch {
        return false;
      }
    }, { message: "Website must start with http:// or https://" }),
  email: z.string()
    .email({ message: "Please enter a valid email address" }),
  comment: z.string()
    .min(10, { message: "Please provide at least 10 characters explaining why this tool is relevant" })
    .max(500, { message: "Comment must be less than 500 characters" }),
});

type SubmitToolFormData = z.infer<typeof submitToolSchema>;

export default function SubmitToolPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<SubmitToolFormData>({
    resolver: zodResolver(submitToolSchema),
    defaultValues: {
      website: '',
      email: '',
      comment: '',
    },
  });

  const onSubmit = async (data: SubmitToolFormData) => {
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/submit-tool', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        toast({
          title: "Submission Successful!",
          description: result.message || "Your tool submission has been received and will be reviewed.",
        });
        form.reset();
      } else {
        toast({
          title: "Submission Failed",
          description: result.message || "An error occurred while submitting your tool. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Submission error:', error);
      toast({
        title: "Network Error",
        description: "Please check your internet connection and try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto max-w-2xl px-6 py-14 md:py-20">
      <div className="mb-10 border-b border-border pb-10">
        <p className="mb-3 text-xs font-medium tracking-wide text-muted-foreground">
          Submit a tool
        </p>
        <h1 className="mb-3 text-[32px] font-semibold tracking-[-0.01em] text-foreground">
          Add an AI CRE tool to the directory
        </h1>
        <p className="text-sm leading-6 text-muted-foreground">
          Help us expand our directory by submitting AI tools for commercial real estate professionals.
        </p>
      </div>

      <Card className="border-border shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Send className="h-5 w-5" />
            Tool Submission Form
          </CardTitle>
          <CardDescription>
            Please provide the tool&apos;s website, your email in case we need clarification, and explain why this tool would be valuable for CRE professionals.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="website"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Globe className="h-4 w-4" />
                      Tool Website URL
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://example.com"
                        {...field}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Your Email Address
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="your.email@example.com"
                        {...field}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="comment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4" />
                      Why is this tool relevant?
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Explain how this AI tool helps commercial real estate professionals, what makes it unique, and why it should be included in our directory..."
                        className="min-h-[120px] resize-none"
                        {...field}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                    <p className="mt-1 text-sm text-muted-foreground">
                      {field.value?.length || 0}/500 characters
                    </p>
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full"
                disabled={isSubmitting}
                size="lg"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting Tool...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Submit Tool for Review
                  </>
                )}
              </Button>
            </form>
          </Form>

          <div className="mt-6 rounded-lg border border-border bg-muted/50 p-4">
            <h3 className="mb-2 text-sm font-semibold text-foreground">What happens next?</h3>
            <ul className="space-y-1.5 text-sm text-muted-foreground">
              <li>We&apos;ll review your submission for relevance and quality.</li>
              <li>If we accept it, we&apos;ll run our research flow and prepare it for publishing.</li>
              <li>We may reach out if we need clarification during review.</li>
              <li>Approved tools are usually added within 2–3 business days.</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
