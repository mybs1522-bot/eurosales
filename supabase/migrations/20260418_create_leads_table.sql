-- Create leads table to track funnel progression and follow-up status
CREATE TABLE IF NOT EXISTS leads (
  id            uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  email         text UNIQUE NOT NULL,
  whatsapp      text,
  stage         text NOT NULL DEFAULT 'sketchup-free',
  followup_1_at timestamptz,
  followup_2_at timestamptz,
  followup_3_at timestamptz,
  created_at    timestamptz DEFAULT now(),
  updated_at    timestamptz DEFAULT now()
);

-- Index for cron job queries (find leads needing follow-ups)
CREATE INDEX IF NOT EXISTS idx_leads_stage_updated ON leads (stage, updated_at);

-- Auto-update updated_at on any row change
CREATE OR REPLACE FUNCTION update_leads_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS leads_updated_at_trigger ON leads;
CREATE TRIGGER leads_updated_at_trigger
  BEFORE UPDATE ON leads
  FOR EACH ROW EXECUTE FUNCTION update_leads_updated_at();

-- Allow edge functions to read/write (service role bypasses RLS automatically)
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
