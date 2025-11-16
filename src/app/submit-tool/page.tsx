"use client";

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Linkedin, Twitter } from 'lucide-react';

export default function SubmitToolPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-2xl">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Submit a New AI CRE Tool</h1>
        <p className="text-lg text-gray-600">
          We&apos;re pausing form submissions for now. If you have a tool that belongs in our directory, we still want to hear from you!
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 justify-center text-2xl">Let&apos;s Connect</CardTitle>
          <CardDescription className="text-center">
            Share your tool by sending a connection request and message on LinkedIn or X.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-center">
            <Button asChild variant="outline" className="w-full sm:w-auto gap-2">
              <Link href="https://www.linkedin.com/in/nichlaskvist/" target="_blank" rel="noopener noreferrer">
                <Linkedin className="h-5 w-5" />
                Connect on LinkedIn
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full sm:w-auto gap-2">
              <Link href="https://x.com/nkjorg" target="_blank" rel="noopener noreferrer">
                <Twitter className="h-5 w-5" />
                Message on X (Twitter)
              </Link>
            </Button>
          </div>
          <p className="text-sm text-gray-500 text-center leading-relaxed">
            When you reach out, please include a brief overview of the tool, who it helps, and any standout features we should know
            about. We&apos;ll follow up with the next steps after reviewing your message.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
