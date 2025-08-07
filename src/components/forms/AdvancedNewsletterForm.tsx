"use client";

import { useActionState, useEffect, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { subscribeWithCustomOptions } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";
import { Mail, User, Tags } from "lucide-react";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" aria-disabled={pending} disabled={pending} className="w-full">
      {pending ? "Subscribing..." : "Subscribe to Newsletter"}
    </Button>
  );
}

interface AdvancedNewsletterFormProps {
  source?: string;
  availableInterests?: {
    id: string;
    name: string;
    category?: string;
  }[];
  availableTags?: string[];
  title?: string;
  description?: string;
}

export function AdvancedNewsletterForm({ 
  source = "advanced",
  availableInterests = [
    { id: "product-updates", name: "Product Updates" },
    { id: "weekly-digest", name: "Weekly Digest" },
    { id: "special-offers", name: "Special Offers" },
    { id: "industry-news", name: "Industry News" },
  ],
  availableTags = ["VIP", "Early Access", "Beta Tester"],
  title = "Join Our Newsletter",
  description = "Stay updated with our latest news and updates. Customize your preferences below."
}: AdvancedNewsletterFormProps) {
  const initialState = { message: "", success: false };
  const [state, formAction] = useActionState(subscribeWithCustomOptions, initialState);
  const { toast } = useToast();
  
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  useEffect(() => {
    if (state.message) {
      toast({
        title: state.success ? "Success!" : "Oops!",
        description: state.message,
        variant: state.success ? "default" : "destructive",
      });
      
      // Reset form if successful
      if (state.success) {
        setSelectedInterests([]);
        setSelectedTags([]);
      }
    }
  }, [state, toast]);

  const handleInterestChange = (interestId: string, checked: boolean) => {
    if (checked) {
      setSelectedInterests(prev => [...prev, interestId]);
    } else {
      setSelectedInterests(prev => prev.filter(id => id !== interestId));
    }
  };

  const handleTagChange = (tag: string, checked: boolean) => {
    if (checked) {
      setSelectedTags(prev => [...prev, tag]);
    } else {
      setSelectedTags(prev => prev.filter(t => t !== tag));
    }
  };

  return (
    <Card className="w-full max-w-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5" />
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name (Optional)</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="firstName"
                    name="firstName"
                    type="text"
                    placeholder="John"
                    className="pl-10"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="lastName">Last Name (Optional)</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  type="text"
                  placeholder="Doe"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="email">Email Address *</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="john@example.com"
                  required
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          {/* Interest Selection */}
          {availableInterests.length > 0 && (
            <div className="space-y-3">
              <Label className="text-base font-medium">What interests you? (Optional)</Label>
              <div className="grid grid-cols-1 gap-3">
                {availableInterests.map((interest) => (
                  <div key={interest.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`interest_${interest.id}`}
                      name={`interest_${interest.id}`}
                      checked={selectedInterests.includes(interest.id)}
                      onCheckedChange={(checked) => 
                        handleInterestChange(interest.id, checked as boolean)
                      }
                    />
                    <Label 
                      htmlFor={`interest_${interest.id}`}
                      className="text-sm font-normal cursor-pointer"
                    >
                      {interest.name}
                      {interest.category && (
                        <span className="text-muted-foreground ml-1">({interest.category})</span>
                      )}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tag Selection */}
          {availableTags.length > 0 && (
            <div className="space-y-3">
              <Label className="text-base font-medium flex items-center gap-2">
                <Tags className="h-4 w-4" />
                Special Lists (Optional)
              </Label>
              <div className="grid grid-cols-1 gap-3">
                {availableTags.map((tag) => (
                  <div key={tag} className="flex items-center space-x-2">
                    <Checkbox
                      id={`tag_${tag}`}
                      checked={selectedTags.includes(tag)}
                      onCheckedChange={(checked) => 
                        handleTagChange(tag, checked as boolean)
                      }
                    />
                    <Label 
                      htmlFor={`tag_${tag}`}
                      className="text-sm font-normal cursor-pointer"
                    >
                      {tag}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Hidden fields for form processing */}
          <input type="hidden" name="source" value={source} />
          <input type="hidden" name="tags" value={selectedTags.join(',')} />

          {/* Submit Button */}
          <SubmitButton />

          {/* Error Message */}
          {state.message && !state.success && (
            <p className="text-sm text-destructive">{state.message}</p>
          )}
        </form>
      </CardContent>
    </Card>
  );
} 