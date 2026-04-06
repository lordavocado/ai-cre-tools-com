"use client";

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { subscribeToNewsletter } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from 'react';
import { Mail } from "lucide-react";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" aria-disabled={pending} disabled={pending} className="bg-blue-600 hover:bg-blue-700 text-white">
      {pending ? "Subscribing..." : "Subscribe"}
    </Button>
  );
}

interface SimpleNewsletterFormProps {
  source?: string;
}

export function SimpleNewsletterForm({ 
  source = "footer" 
}: SimpleNewsletterFormProps) {
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
    <form action={formAction} className="flex gap-2">
      <div className="relative flex-1">
        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          name="email"
          type="email"
          placeholder="Enter your email"
          required
          className="pl-10"
        />
      </div>
      <input type="hidden" name="source" value={source} />
      <SubmitButton />
    </form>
  );
}
