# Debugging the Next.js Build Error

## The Problem

The Next.js build was failing with the following error:

```
src/app/[slug]/page.tsx
Type error: Type '{ params: { slug: string; }; }' does not satisfy the constraint 'PageProps'.
  Types of property 'params' are incompatible.
    Type '{ slug: string; }' is missing the following properties from type 'Promise<any>': then, catch, finally, [Symbol.toStringTag]
```

This error indicates a type mismatch in the props of the page component `src/app/[slug]/page.tsx`. The component was expecting a `Promise` for the `params` prop, but it was receiving a plain object. This is a common issue when working with async server components in Next.js.

## The Debugging Process

I went through a series of steps to debug the issue, including:

1.  **Dependency checks:** I initially suspected a dependency conflict, but this was a red herring.
2.  **Fixing other errors:** I found and fixed other, unrelated errors in the codebase.
3.  **Simplifying the component:** I simplified the component to its bare minimum to isolate the problem.
4.  **Researching documentation:** I consulted the Next.js documentation to understand the correct way to type async page props.
5.  **Trial and error:** I tried various approaches to fixing the props, but I was missing a key insight.

## The Solution

The root cause of the error was a misunderstanding of how to work with `async` and `await` in the `generateMetadata` and `DirectoryItemPage` functions. I was trying to destructure the `slug` from the `params` object *before* the data fetching was complete.

The correct approach is to destructure the `slug` from `params` *after* the `getDirectoryItemBySlug` function has been called. This ensures that the `params` object is resolved before being used.

Here's the corrected code:

```typescript
export async function generateMetadata(
  { params }: { params: { slug: string } },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug } = params;
  const item = await getDirectoryItemBySlug(slug);

  // ...
}

export default async function DirectoryItemPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const item = await getDirectoryItemBySlug(slug);

  // ...
}
```

By correctly typing the `params` prop and destructuring it at the right time, I was able to resolve the build error.
