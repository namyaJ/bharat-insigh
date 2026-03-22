import { createBrowserClient } from '@supabase/ssr';

let client = null;

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Return null if Supabase is not configured
  if (!url || !key || url.includes('your-supabase') || key.includes('your-supabase')) {
    return null;
  }

  if (!client) {
    client = createBrowserClient(url, key);
  }
  return client;
}
