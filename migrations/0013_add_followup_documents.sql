-- Add documents jsonb to adoption_followups (moved from application docs)
ALTER TABLE adoption_followups ADD COLUMN IF NOT EXISTS documents jsonb NOT NULL DEFAULT '[]'::jsonb;
