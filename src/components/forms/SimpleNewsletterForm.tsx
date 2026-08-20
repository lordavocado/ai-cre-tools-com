"use client";

import { useActionState, useId, useRef } from "react";
import { useFormStatus } from "react-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { subscribeToNewsletter } from "@/app/actions";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Mail } from "lucide-react";
import { cn } from "@/lib/utils";

const BRAND = {
  button: "border-0 bg-primary text-primary-foreground shadow-none hover:bg-primary/90",
  input:
    "border-primary bg-background focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-ring/30 placeholder:text-muted-foreground",
} as const;

interface SubmitButtonProps {
  className?: string;
  variant: "default" | "brand";
  size: "md" | "sm";
  iconClassName?: string;
}

function SubmitButton({ className, variant, size, iconClassName }: SubmitButtonProps) {
  const { pending } = useFormStatus();
  const isSm = size === "sm";
  return (
    <Button
      type="submit"
      aria-disabled={pending}
      disabled={pending}
      aria-label="Subscribe to email updates"
      className={cn(
        "shrink-0 font-semibold",
        isSm ? "h-11 gap-1.5 rounded-md px-3 text-sm sm:h-9 sm:text-xs" : "h-11 gap-1.5 rounded-lg px-3 text-sm sm:h-10",
        variant === "default" &&
          "bg-neutral-200 text-neutral-900 hover:bg-neutral-300 border border-neutral-300 hover:shadow-lg hover:shadow-neutral-400/30",
        variant === "brand" && BRAND.button,
        className
      )}
    >
      <Mail
        className={cn(
          isSm ? "h-3.5 w-3.5" : "h-4 w-4",
          variant === "brand" && "text-white",
          iconClassName
        )}
        aria-hidden
      />
      {pending ? "Subscribing…" : "Get email updates"}
    </Button>
  );
}

export interface NewsletterFormProps {
  source?: string;
  className?: string;
  fieldsClassName?: string;
  inputClassName?: string;
  buttonClassName?: string;
  /** Directory CTA: green input border and primary button (matches footer). */
  variant?: "default" | "brand";
  /** Compact controls (hero + footer). */
  size?: "md" | "sm";
  /** Replace the form with a confirmation message after successful signup (hero). */
  hideFormOnSuccess?: boolean;
}

/**
 * Shared newsletter signup: horizontal email field + submit with Mail icon.
 * Use `variant="brand"` and `size="sm"` for homepage hero and footer.
 */
export function NewsletterForm({
  source = "homepage",
  className,
  fieldsClassName,
  inputClassName,
  buttonClassName,
  variant = "default",
  size = "md",
  hideFormOnSuccess = false,
}: NewsletterFormProps) {
  const initialState = { message: "", success: false };
  const [state, formAction] = useActionState(subscribeToNewsletter, initialState);
  const { toast } = useToast();
  const emailId = useId();
  const hintId = useId();
  const errorId = useId();
  const emailRef = useRef<HTMLInputElement>(null);
  const isSm = size === "sm";

  useEffect(() => {
    if (!state.message) return;
    if (state.success && hideFormOnSuccess) return;
    if (!state.success) emailRef.current?.focus();
    toast({
      title: state.success ? "Subscribed" : "Unable to subscribe",
      description: state.message,
      variant: state.success ? "default" : "destructive",
    });
  }, [state, toast, hideFormOnSuccess]);

  if (hideFormOnSuccess && state.success) {
    return (
      <div className={cn(className)}>
        <p className="text-center text-sm font-medium text-foreground">
          You&rsquo;re in! We&rsquo;ll send new CRE AI tools straight to your inbox.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className={cn(className)}>
      <div
        className={cn(
          "flex w-full flex-wrap items-stretch gap-2",
          isSm && "gap-1.5",
          fieldsClassName
        )}
      >
        <label htmlFor={emailId} className="sr-only">
          Email address for newsletter
        </label>
        <Input
          ref={emailRef}
          id={emailId}
          type="email"
          name="email"
          placeholder="Enter your email"
          required
          className={cn(
            "min-w-0 flex-1 md:max-w-none",
            isSm
              ? "h-11 rounded-md px-3 text-base sm:h-9 sm:text-sm md:w-48"
              : "h-11 text-base sm:h-10 sm:text-sm md:w-64",
            variant === "brand" && BRAND.input,
            inputClassName
          )}
          aria-invalid={state.message && !state.success ? true : undefined}
          aria-describedby={state.message && !state.success ? `${hintId} ${errorId}` : hintId}
        />
        <SubmitButton
          variant={variant}
          size={size}
          className={buttonClassName}
        />
      </div>
      <span id={hintId} className="sr-only">
        Subscribe to receive AI CRE Tools updates
      </span>
      <input type="hidden" name="source" value={source} />
      {state.message && !state.success && (
        <p id={errorId} className="mt-2 text-sm text-destructive" role="alert">
          {state.message}
        </p>
      )}
    </form>
  );
}
