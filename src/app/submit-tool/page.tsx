"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Check, Loader2, Send, Sparkles } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { TOOL_SUBMISSION_CATEGORIES } from '@/lib/tool-submission-categories';

const NONE_CATEGORY = '__none__';

/** Matches directory search + listing cards (`DirectorySearch`, `DirectoryItemCard`) */
const inputClassName =
  'h-11 rounded-[8px] border-[1.25px] border-[#e0e0e0] bg-white text-sm text-[#1f1f1f] placeholder:text-[#999999] shadow-none transition-colors focus-visible:border-[#629649] focus-visible:ring-1 focus-visible:ring-[#629649] focus-visible:outline-none';

const textareaClassName =
  'min-h-[140px] resize-y rounded-[8px] border-[1.25px] border-[#e0e0e0] bg-white text-sm text-[#1f1f1f] placeholder:text-[#999999] shadow-none transition-colors focus-visible:border-[#629649] focus-visible:ring-1 focus-visible:ring-[#629649] focus-visible:outline-none';

const selectTriggerClassName =
  'h-11 rounded-[8px] border-[1.25px] border-[#e0e0e0] bg-white text-sm text-[#1f1f1f] shadow-none focus:ring-1 focus:ring-[#629649] data-[placeholder]:text-[#999999]';

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
  name: z.string().max(200).optional(),
  category: z.string().optional(),
}).superRefine((data, ctx) => {
  const cat = data.category?.trim();
  if (cat && !(TOOL_SUBMISSION_CATEGORIES as readonly string[]).includes(cat)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Pick a category from the list or leave it unset.',
      path: ['category'],
    });
  }
});

type SubmitToolFormData = z.infer<typeof submitToolSchema>;

const nextSteps = [
  'We review each submission for relevance to commercial real estate and AI.',
  'If we accept it, we enrich the listing (automated research when available, otherwise manual curation).',
  'We may email you if something about the product or URL is unclear.',
  'Approved tools are usually published within a few business days.',
];

export default function SubmitToolPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<SubmitToolFormData>({
    resolver: zodResolver(submitToolSchema),
    defaultValues: {
      website: '',
      email: '',
      comment: '',
      name: '',
      category: undefined,
    },
  });

  const onSubmit = async (data: SubmitToolFormData) => {
    setIsSubmitting(true);

    try {
      const payload = {
        website: data.website,
        email: data.email,
        comment: data.comment,
        ...(data.name?.trim() ? { name: data.name.trim() } : {}),
        ...(data.category?.trim() ? { category: data.category.trim() } : {}),
      };

      const response = await fetch('/api/submit-tool', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (response.ok) {
        toast({
          title: "Submission received",
          description: result.message || "Your tool submission has been received and will be reviewed.",
        });
        form.reset();
      } else {
        toast({
          title: "Submission failed",
          description: result.message || "An error occurred while submitting your tool. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Submission error:', error);
      toast({
        title: "Network error",
        description: "Please check your internet connection and try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-8rem)]">
      {/* Hero — same band + typography as `Hero` / DESIGN.md */}
      <section className="border-b border-[#e0e0e0] bg-[#fafafa] py-14 md:py-20">
        <div className="container px-6">
          <div className="mx-auto max-w-[70ch] text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#999999]">
              Submit a tool
            </p>
            <h1 className="mt-3 text-balance text-[32px] font-semibold leading-[1.12] tracking-[-0.02em] text-[#0f172a] sm:text-[40px] md:text-[44px]">
              Add an AI CRE tool to the directory
            </h1>
            <p className="mx-auto mt-4 max-w-lg text-pretty text-[16px] leading-relaxed text-[#737373]">
              Share a product we should list for CRE professionals. We need the official site, your email, and a short pitch; optional fields help us classify faster.
            </p>
            <Link
              href="/"
              className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-[#1f1f1f] underline-offset-4 transition-colors hover:text-[#629649] hover:underline"
            >
              <ArrowLeft className="h-4 w-4 shrink-0" aria-hidden />
              Back to directory
            </Link>
          </div>
        </div>
      </section>

      {/* Form — card matches `DirectoryItemCard` surface */}
      <section className="py-12 md:py-16">
        <div className="container px-6">
          <div className="mx-auto max-w-2xl">
            <div className="rounded-[8px] border border-[#e0e0e0] bg-white p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)] md:p-10">
              <div className="mb-8 flex flex-col gap-2 border-b border-[#f0f0f0] pb-8 md:flex-row md:items-end md:justify-between">
                <div>
                  <div className="flex items-center gap-2 text-[#0f172a]">
                    <Sparkles className="h-5 w-5 text-[#629649]" aria-hidden />
                    <h2 className="text-lg font-semibold tracking-tight md:text-xl">
                      Submission details
                    </h2>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-[#737373]">
                    Required fields are marked below. Everything else helps our reviewers but is optional.
                  </p>
                </div>
              </div>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                  <div className="space-y-6">
                    <FieldSectionLabel>Required</FieldSectionLabel>

                    <FormField
                      control={form.control}
                      name="website"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-[#1f1f1f]">
                            Tool website
                          </FormLabel>
                          <FormControl>
                            <Input
                              className={inputClassName}
                              placeholder="https://example.com"
                              autoComplete="url"
                              {...field}
                              disabled={isSubmitting}
                            />
                          </FormControl>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-[#1f1f1f]">
                            Your email
                          </FormLabel>
                          <FormControl>
                            <Input
                              className={inputClassName}
                              type="email"
                              placeholder="you@company.com"
                              autoComplete="email"
                              {...field}
                              disabled={isSubmitting}
                            />
                          </FormControl>
                          <p className="text-xs text-[#737373]">We only use this if we need clarification.</p>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="comment"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-[#1f1f1f]">
                            Why should we list it?
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              className={textareaClassName}
                              placeholder="How does this tool help CRE teams? What problem does it solve? What makes it a fit for this directory?"
                              {...field}
                              disabled={isSubmitting}
                            />
                          </FormControl>
                          <div className="flex justify-end">
                            <span className="text-xs tabular-nums text-[#999999]">
                              {field.value?.length || 0}/500
                            </span>
                          </div>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Separator className="bg-[#f0f0f0]" />

                  <div className="space-y-6">
                    <FieldSectionLabel>Optional</FieldSectionLabel>

                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-[#1f1f1f]">
                            Tool name
                          </FormLabel>
                          <FormControl>
                            <Input
                              className={inputClassName}
                              placeholder="Official product or company name"
                              {...field}
                              disabled={isSubmitting}
                            />
                          </FormControl>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-[#1f1f1f]">
                            Suggested category
                          </FormLabel>
                          <Select
                            disabled={isSubmitting}
                            value={field.value ?? NONE_CATEGORY}
                            onValueChange={(value) => field.onChange(value === NONE_CATEGORY ? undefined : value)}
                          >
                            <FormControl>
                              <SelectTrigger className={selectTriggerClassName}>
                                <SelectValue placeholder="Choose a category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="rounded-[8px] border-[#e0e0e0]">
                              <SelectItem value={NONE_CATEGORY} className="text-[#737373]">
                                No preference — we&apos;ll classify it
                              </SelectItem>
                              {TOOL_SUBMISSION_CATEGORIES.map((label) => (
                                <SelectItem key={label} value={label}>
                                  {label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Button
                    type="submit"
                    className="h-12 w-full rounded-[8px] text-sm font-semibold shadow-none"
                    disabled={isSubmitting}
                    size="lg"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Submitting…
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        Submit for review
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            </div>

            {/* Next steps — calm secondary panel */}
            <div className="mt-10 rounded-[8px] border border-[#e8e8e8] bg-[#fafafa] p-6 md:p-8">
              <h3 className="text-sm font-semibold text-[#0f172a]">
                What happens next
              </h3>
              <ul className="mt-4 space-y-3">
                {nextSteps.map((line) => (
                  <li key={line} className="flex gap-3 text-sm leading-relaxed text-[#737373]">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#e8f5ec] text-[#2f7448]">
                      <Check className="h-3 w-3 stroke-[2.5]" aria-hidden />
                    </span>
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function FieldSectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#999999]">
      {children}
    </p>
  );
}
