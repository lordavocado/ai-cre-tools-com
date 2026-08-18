/** Canonical paths for directory tool pages. Keep URL construction centralized. */
export function getToolPath(slug: string): string {
  return `/tools/${slug}`;
}

/** Canonical path for a tool's alternatives page. */
export function getToolAlternativesPath(slug: string): string {
  return `${getToolPath(slug)}/alternatives`;
}

/** Appends legacy-route query parameters to a canonical redirect target. */
export function withSearchParams(
  path: string,
  searchParams: Record<string, string | string[] | undefined>
): string {
  const query = new URLSearchParams();

  for (const [key, value] of Object.entries(searchParams)) {
    if (Array.isArray(value)) {
      value.forEach((entry) => query.append(key, entry));
    } else if (value !== undefined) {
      query.set(key, value);
    }
  }

  const serialized = query.toString();
  return serialized ? `${path}?${serialized}` : path;
}
