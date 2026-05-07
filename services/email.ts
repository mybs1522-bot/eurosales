const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL ?? 'https://aexrgtpxyzfxjecozstf.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY ?? 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFleHJndHB4eXpmeGplY296c3RmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIyOTY0MjcsImV4cCI6MjA4Nzg3MjQyN30._ZSmh9iTP3etyGj5XrkEGJtRp9kR8z6jAmLOMesIvkg';

export type EmailProduct =
  | 'sketchup-free'
  | 'render-bundle'
  | 'full-bundle'
  | 'books-bundle'
  | 'books-downsell';

/**
 * Fire-and-forget: sends the correct stage email and upserts the lead.
 * Never throws — failures are logged silently.
 */
export function sendStageEmail(
  email: string,
  product: EmailProduct,
  phone?: string,
  name?: string,
  role?: string,
): void {
  if (!email || !SUPABASE_URL) return;
  fetch(`${SUPABASE_URL}/functions/v1/send-access-email`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    },
    body: JSON.stringify({
      email,
      product,
      whatsapp: phone ?? null,
      name: name ?? null,
      role: role ?? null,
    }),
  }).catch((err) => console.warn('[sendStageEmail] Failed silently:', err));
}
