"use client";

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { subscribeToNewsletter } from "@/app/actions";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Mail } from "lucide-react";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" aria-disabled={pending} disabled={pending} aria-label="Subscribe to email updates" className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/30">
      <Mail className="mr-1 h-4 w-4" />
      {pending ? "Subscribing..." : "Get email updates"}
    </Button>
  );
}

interface NewsletterFormProps {
  source?: string;
  className?: string;
}

export function NewsletterForm({ source = "homepage", className }: NewsletterFormProps) {
  const initialState = { message: "", success: false };
  const [state, formAction] = useActionState(subscribeToNewsletter, initialState);
  const { toast } = useToast();

  useEffect(() => {
    if (state.message) {
      toast({
        title: state.success ? "Success!" : "Oops!",
        description: state.message,
        variant: state.success ? "default" : "destructive",
      });
    }
  }, [state, toast]);

  return (
    <form action={formAction} className={className || ""}>
      <div className="flex gap-2 w-full">
        <Input
          type="email"
          name="email"
          placeholder="Enter your email"
          required
          className="text-sm min-w-0 flex-1 md:w-64"
          aria-label="Email for newsletter"
        />
        <SubmitButton />
      </div>
      {/* Hidden field to track signup source */}
      <input type="hidden" name="source" value={source} />
      {state.message && !state.success && (
        <p className="text-sm text-destructive">{state.message}</p>
      )}
    </form>
  );
}
