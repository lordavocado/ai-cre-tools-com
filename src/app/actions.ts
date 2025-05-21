
"use server";

import { z } from "zod";
import { submitNewsletter as submitNewsletterToSheet } from "@/lib/sheets"; // Assuming this function exists

const NewsletterSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
});

export async function subscribeToNewsletter(prevState: any, formData: FormData) {
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
    const result = await submitNewsletterToSheet(validatedFields.data.email);
    return result;
  } catch (error) {
    console.error("Newsletter subscription error:", error);
    return {
      message: "An unexpected error occurred. Please try again later.",
      success: false,
    };
  }
}
