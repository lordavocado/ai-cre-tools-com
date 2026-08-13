import 'server-only';

import { revalidatePath, revalidateTag } from 'next/cache';

/** Invalidates all public pages whose content is derived from the directory. */
export function revalidateDirectoryCache() {
  revalidateTag('directory-items');
  revalidatePath('/', 'layout');
}
