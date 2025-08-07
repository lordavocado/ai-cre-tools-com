import type { NextPage } from 'next';

declare module 'next' {
  export type PageProps<P = {}, S = {}> = {
    params: P;
    searchParams: S;
  };
}
