ALTER TABLE adoption_applications
  ADD COLUMN IF NOT EXISTS applicant_address TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS applicant_city TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS documents JSONB NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS verification JSONB NOT NULL DEFAULT '{"identity":false,"address":false,"homeConditions":false,"interview":false,"references":false,"eligibility":false}'::jsonb,
  ADD COLUMN IF NOT EXISTS review_notes TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS reviewed_at TEXT;

ALTER TABLE adoption_followups
  ADD COLUMN IF NOT EXISTS application_id TEXT REFERENCES adoption_applications(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS last_contact_date TEXT,
  ADD COLUMN IF NOT EXISTS verification_status TEXT NOT NULL DEFAULT 'Pendiente',
  ADD COLUMN IF NOT EXISTS follow_up_checks JSONB NOT NULL DEFAULT '{"contacted":false,"petSafe":false,"healthUpToDate":false,"conditionsMet":false}'::jsonb,
  ADD COLUMN IF NOT EXISTS incidents TEXT NOT NULL DEFAULT '';

CREATE INDEX IF NOT EXISTS adoption_followups_application_id_idx ON adoption_followups(application_id);
