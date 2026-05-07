const SUPABASE_URL = 'https://aexrgtpxyzfxjecozstf.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFleHJndHB4eXpmeGplY296c3RmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIyOTY0MjcsImV4cCI6MjA4Nzg3MjQyN30._ZSmh9iTP3etyGj5XrkEGJtRp9kR8z6jAmLOMesIvkg';
const EMAIL = 'mybs1522@gmail.com';

async function sendRequest(product) {
  console.log(`Sending email for product: ${product}...`);
  const res = await fetch(`${SUPABASE_URL}/functions/v1/send-access-email`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
    },
    body: JSON.stringify({ email: EMAIL, product: product, name: 'Bhave Testing' })
  });

  const text = await res.text();
  console.log(`Response for ${product}: ${res.status} ${text}`);
  if (!res.ok) {
    throw new Error(`Failed to send ${product}`);
  }
}

async function run() {
  try {
    // 1. Paid $9 (Render Upsell)
    await sendRequest('render');
    
    // Wait a couple of seconds
    await new Promise(r => setTimeout(r, 2000));
    
    // 2. Skipped $27, Paid $36 (Books Bundle)
    await sendRequest('books');
    
    console.log("Done! Check your email and supabase leads database.");
  } catch (err) {
    console.error(err);
  }
}

run();
