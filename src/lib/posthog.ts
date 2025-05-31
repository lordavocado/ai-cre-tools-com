import { PostHog } from "posthog-node"

export default function PostHogClient() {
  const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY
  const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST
  
  if (!posthogKey) {
    console.warn('[PostHog] Missing NEXT_PUBLIC_POSTHOG_KEY environment variable. Server-side PostHog will not be available.')
    return null
  }
  
  try {
    const posthogClient = new PostHog(posthogKey, {
      host: posthogHost || "https://eu.i.posthog.com",
      flushAt: 1,
      flushInterval: 0,
    })
    return posthogClient
  } catch (error) {
    console.error('[PostHog] Failed to initialize server client:', error)
    return null
  }
}
