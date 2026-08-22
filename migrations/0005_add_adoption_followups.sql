DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'adoption_follow_up_stage') THEN
    CREATE TYPE adoption_follow_up_stage AS ENUM ('Pendiente', 'Contrato firmado', 'Entregado', 'Seguimiento 1', 'Seguimiento 2', 'Cerrado');
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS adoption_followups (
  id TEXT PRIMARY KEY,
  pet_id TEXT REFERENCES pets(id) ON DELETE SET NULL,
  pet_name TEXT NOT NULL,
  adopter_name TEXT NOT NULL,
  adopter_email TEXT NOT NULL,
  adopter_phone TEXT NOT NULL,
  adopter_address TEXT NOT NULL,
  adopter_city TEXT NOT NULL,
  adoption_date TEXT NOT NULL,
  next_follow_up_date TEXT NOT NULL,
  process_stage adoption_follow_up_stage NOT NULL,
  notes TEXT NOT NULL,
  care_plan TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS adoption_followups_process_stage_idx ON adoption_followups(process_stage);
CREATE INDEX IF NOT EXISTS adoption_followups_pet_id_idx ON adoption_followups(pet_id);
