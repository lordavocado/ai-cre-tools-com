/** One-off: print ecosystem_apps row by slug (uses .env.local service role). */
import { config } from 'dotenv';
import { resolve } from 'node:path';

config({ path: resolve(process.cwd(), '.env.local') });

import { getAdminToolBySlug } from '@/lib/supabase-admin';

const slug = process.argv[2] || 'resights';

getAdminToolBySlug(slug)
  .then((row) => {
    if (!row) {
      console.error('Not found:', slug);
      process.exit(1);
    }
    console.log(JSON.stringify(row, null, 2));
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
