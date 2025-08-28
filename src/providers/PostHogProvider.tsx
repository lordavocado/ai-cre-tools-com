"use client"

import posthog from "posthog-js"
import { PostHogProvider as PHProvider, usePostHog } from "posthog-js/react"
import { Suspense, useEffect, useState } from "react"
import { usePathname, useSearchParams } from "next/navigation"

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  const [isPostHogEnabled, setIsPostHogEnabled] = useState(false)
  
  useEffect(() => {
    const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY
    
    if (!posthogKey) {
      if (process.env.NODE_ENV === "development") {
        console.warn('[PostHog] Missing NEXT_PUBLIC_POSTHOG_KEY environment variable. PostHog will not be initialized.')
      }
      return
    }
    
    try {
      posthog.init(posthogKey, {
        api_host: "/ingest",
        ui_host: "https://eu.posthog.com",
        capture_pageview: false, // We capture pageviews manually
        capture_pageleave: true, // Enable pageleave capture
        capture_exceptions: true, // This enables capturing exceptions using Error Tracking, set to false if you don't want this
        debug: process.env.NODE_ENV === "development",
      })
      setIsPostHogEnabled(true)
    } catch (error) {
      console.error('[PostHog] Failed to initialize:', error)
    }
  }, [])

  // If PostHog is not enabled, just render children without PostHog context
  if (!isPostHogEnabled) {
    return <>{children}</>
  }

  return (
    <PHProvider client={posthog}>
      <SuspendedPostHogPageView />
      {children}
    </PHProvider>
  )
}

function PostHogPageView() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const posthog = usePostHog()

  useEffect(() => {
    if (pathname && posthog && process.env.NEXT_PUBLIC_POSTHOG_KEY) {
      try {
        let url = window.origin + pathname
        const search = searchParams.toString()
        if (search) {
          url += "?" + search
        }
        posthog.capture("$pageview", { "$current_url": url })
      } catch (error) {
        console.error('[PostHog] Failed to capture pageview:', error)
      }
    }
  }, [pathname, searchParams, posthog])

  return null
}

function SuspendedPostHogPageView() {
  return (
    <Suspense fallback={null}>
      <PostHogPageView />
    </Suspense>
  )
}