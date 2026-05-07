-- Add individual product purchase flags so we can track 
-- exactly what each user bought (users can skip upsells)
ALTER TABLE leads ADD COLUMN IF NOT EXISTS has_render boolean DEFAULT false;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS has_full boolean DEFAULT false;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS has_books boolean DEFAULT false;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS has_downsell boolean DEFAULT false;

-- Backfill existing leads based on their current stage
UPDATE leads SET has_render = true WHERE stage IN ('render-bundle', 'full-bundle', 'books-bundle');
UPDATE leads SET has_full = true WHERE stage IN ('full-bundle', 'books-bundle');
UPDATE leads SET has_books = true WHERE stage = 'books-bundle';
UPDATE leads SET has_downsell = true WHERE stage = 'books-downsell';
