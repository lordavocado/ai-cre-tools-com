
"use server";

import { z } from "zod";
import { subscribeToMailchimp, createSubscriptionConfig } from "@/lib/mailchimp";

const NewsletterSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  source: z.string().optional(),
});

export async function subscribeToNewsletter(prevState: any, formData: FormData) {
  const validatedFields = NewsletterSchema.safeParse({
    email: formData.get("email"),
    source: formData.get("source"),
  });

  if (!validatedFields.success) {
    return {
      message: validatedFields.error.flatten().fieldErrors.email?.[0] || "Invalid input.",
      success: false,
    };
  }

  try {
    const { email, source = 'homepage' } = validatedFields.data;
    
    // Get configuration for the signup source
    const config = createSubscriptionConfig(source);
    
    const result = await subscribeToMailchimp({
      email,
      ...config
    });
    
    return {
      message: result.message,
      success: result.success,
    };
  } catch (error) {
    console.error("Newsletter subscription error:", error);
    return {
      message: "An unexpected error occurred. Please try again later.",
      success: false,
    };
  }
}

// New action for custom subscription with specific tags/interests
export async function subscribeWithCustomOptions(prevState: any, formData: FormData) {
  const validatedFields = NewsletterSchema.safeParse({
    email: formData.get("email"),
  });

  if (!validatedFields.success) {
    return {
      message: validatedFields.error.flatten().fieldErrors.email?.[0] || "Invalid input.",
      success: false,
    };
  }

  try {
    const email = validatedFields.data.email;
    
    // Get custom options from form data
    const tags = formData.get("tags")?.toString().split(',').filter(Boolean) || [];
    const source = formData.get("source")?.toString() || 'custom';
    const firstName = formData.get("firstName")?.toString();
    const lastName = formData.get("lastName")?.toString();
    
    // Prepare merge fields
    const mergeFields: { [key: string]: string } = {
      SOURCE: source
    };
    
    if (firstName) mergeFields.FNAME = firstName;
    if (lastName) mergeFields.LNAME = lastName;
    
    // Get interests from form data (expects format: interestId=true)
    const interests: { [key: string]: boolean } = {};
    for (const [key, value] of formData.entries()) {
      if (key.startsWith('interest_')) {
        const interestId = key.replace('interest_', '');
        interests[interestId] = value === 'true' || value === 'on';
      }
    }
    
    const result = await subscribeToMailchimp({
      email,
      tags,
      interests,
      mergeFields,
      source
    });
    
    return {
      message: result.message,
      success: result.success,
    };
  } catch (error) {
    console.error("Newsletter subscription error:", error);
    return {
      message: "An unexpected error occurred. Please try again later.",
      success: false,
    };
  }
}
