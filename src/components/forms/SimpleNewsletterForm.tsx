"use client";

import { useActionState, useId } from 'react';
import { useFormStatus } from 'react-dom';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { subscribeToNewsletter } from "@/app/actions";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Mail } from "lucide-react";
import { cn } from "@/lib/utils";

interface SubmitButtonProps {
  className?: string;
}

function SubmitButton({ className }: SubmitButtonProps) {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      aria-disabled={pending}
      disabled={pending}
      aria-label="Subscribe to email updates"
      className={cn(
        "w-full sm:w-auto bg-neutral-200 text-neutral-900 hover:bg-neutral-300 border border-neutral-300 hover:shadow-lg hover:shadow-neutral-400/30",
        className
      )}
    >
      <Mail className="mr-1 h-4 w-4" />
      {pending ? "Subscribing..." : "Get email updates"}
    </Button>
  );
}

interface NewsletterFormProps {
  source?: string;
  className?: string;
  fieldsClassName?: string;
  inputClassName?: string;
  buttonClassName?: string;
}

export function NewsletterForm({
  source = "homepage",
  className,
  fieldsClassName,
  inputClassName,
  buttonClassName,
}: NewsletterFormProps) {
  const initialState = { message: "", success: false };
  const [state, formAction] = useActionState(subscribeToNewsletter, initialState);
  const { toast } = useToast();
  const emailId = useId();
  const hintId = useId();

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
    <form action={formAction} className={cn(className)}>
      <div className={cn("flex w-full gap-2", fieldsClassName)}>
        <label htmlFor={emailId} className="sr-only">
          Email address for newsletter
        </label>
        <Input
          id={emailId}
          type="email"
          name="email"
          placeholder="Enter your email"
          required
          className={cn("text-sm min-w-0 flex-1 md:w-64", inputClassName)}
          aria-describedby={hintId}
        />
        <SubmitButton className={buttonClassName} />
      </div>
      <span id={hintId} className="sr-only">
        Subscribe to receive AI CRE Tools updates
      </span>
      {/* Hidden field to track signup source */}
      <input type="hidden" name="source" value={source} />
      {state.message && !state.success && (
        <p className="mt-2 text-sm text-destructive" role="alert">{state.message}</p>
      )}
    </form>
  );
}
