import type { NextPage } from 'next';

declare module 'next' {
  export type PageProps<P = {}, S = {}> = {
    params: Promise<P>;
    searchParams: Promise<S>;
  };
}
