DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'shelter_event_status') THEN
    CREATE TYPE shelter_event_status AS ENUM ('Programado', 'En preparación', 'En curso', 'Finalizado', 'Cancelado');
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'shelter_event_category') THEN
    CREATE TYPE shelter_event_category AS ENUM ('Adopción', 'Recaudación', 'Voluntariado', 'Vacunación', 'Educativo');
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS shelter_events (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category shelter_event_category NOT NULL,
  status shelter_event_status NOT NULL,
  event_date TEXT NOT NULL,
  event_time TEXT NOT NULL,
  location TEXT NOT NULL,
  attendees_target INTEGER NOT NULL DEFAULT 0,
  contact_name TEXT NOT NULL,
  contact_phone TEXT NOT NULL,
  registration_link TEXT NOT NULL,
  description TEXT NOT NULL,
  notes TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS shelter_events_status_idx ON shelter_events(status);
CREATE INDEX IF NOT EXISTS shelter_events_event_date_idx ON shelter_events(event_date);
