DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'pet_species') THEN
    CREATE TYPE pet_species AS ENUM ('Perro', 'Gato', 'Otro');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'pet_gender') THEN
    CREATE TYPE pet_gender AS ENUM ('Macho', 'Hembra');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'pet_size') THEN
    CREATE TYPE pet_size AS ENUM ('Pequeño', 'Mediano', 'Grande');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'pet_status') THEN
    CREATE TYPE pet_status AS ENUM ('Disponible', 'En Proceso', 'Adoptado');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'application_home_type') THEN
    CREATE TYPE application_home_type AS ENUM ('Casa', 'Departamento', 'Otro');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'application_status') THEN
    CREATE TYPE application_status AS ENUM ('Pendiente', 'En revisión', 'Aprobada', 'Rechazada');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'foster_home_type') THEN
    CREATE TYPE foster_home_type AS ENUM ('Casa', 'Departamento', 'Finca');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'foster_species') THEN
    CREATE TYPE foster_species AS ENUM ('Perros', 'Gatos', 'Cualquiera');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'foster_status') THEN
    CREATE TYPE foster_status AS ENUM ('Activa', 'En pausa', 'Disponible');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'thank_role') THEN
    CREATE TYPE thank_role AS ENUM ('Donante', 'Voluntario', 'Empresa Aliada', 'Padrino');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'custom_field_type') THEN
    CREATE TYPE custom_field_type AS ENUM ('text', 'email', 'tel', 'date', 'number', 'select', 'boolean', 'textarea');
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS pets (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  species pet_species NOT NULL,
  breed TEXT NOT NULL,
  age TEXT NOT NULL,
  gender pet_gender NOT NULL,
  size pet_size NOT NULL,
  status pet_status NOT NULL,
  location TEXT NOT NULL,
  image TEXT NOT NULL,
  health JSONB NOT NULL DEFAULT '[]'::jsonb,
  personality JSONB NOT NULL DEFAULT '[]'::jsonb,
  story TEXT NOT NULL,
  views INTEGER NOT NULL DEFAULT 0,
  applications_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS adoption_applications (
  id TEXT PRIMARY KEY,
  applicant_name TEXT NOT NULL,
  applicant_email TEXT NOT NULL,
  applicant_phone TEXT NOT NULL,
  pet_name TEXT NOT NULL,
  pet_id TEXT REFERENCES pets(id) ON DELETE SET NULL,
  pet_image TEXT NOT NULL,
  home_type application_home_type NOT NULL,
  has_other_pets BOOLEAN NOT NULL,
  yard BOOLEAN NOT NULL,
  status application_status NOT NULL,
  date_submitted TEXT NOT NULL,
  experience TEXT NOT NULL,
  custom_responses JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS foster_homes (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  home_type foster_home_type NOT NULL,
  yard BOOLEAN NOT NULL,
  preferred_species foster_species NOT NULL,
  max_capacity INTEGER NOT NULL,
  current_pets_count INTEGER NOT NULL DEFAULT 0,
  status foster_status NOT NULL,
  notes TEXT NOT NULL,
  registered_date TEXT NOT NULL,
  current_fostered_pet TEXT,
  custom_responses JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS sponsor_thanks (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  role thank_role NOT NULL,
  amount_or_contribution TEXT NOT NULL,
  message TEXT NOT NULL,
  avatar_url TEXT NOT NULL,
  date TEXT NOT NULL,
  is_public BOOLEAN NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS shelter_settings (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  tagline TEXT NOT NULL,
  description TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  country TEXT NOT NULL,
  zip_code TEXT NOT NULL,
  primary_color TEXT NOT NULL,
  accent_color TEXT NOT NULL,
  logo_url TEXT NOT NULL,
  hero_banner_url TEXT NOT NULL,
  adoption_contract_terms TEXT NOT NULL,
  shelter_rules TEXT NOT NULL,
  visiting_hours TEXT NOT NULL,
  adoption_form_fields JSONB NOT NULL DEFAULT '[]'::jsonb,
  foster_form_fields JSONB NOT NULL DEFAULT '[]'::jsonb,
  foster_requirements TEXT NOT NULL,
  social_links JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS pets_status_idx ON pets(status);
CREATE INDEX IF NOT EXISTS pets_name_idx ON pets(name);
CREATE INDEX IF NOT EXISTS adoption_applications_status_idx ON adoption_applications(status);
CREATE INDEX IF NOT EXISTS adoption_applications_pet_id_idx ON adoption_applications(pet_id);
CREATE INDEX IF NOT EXISTS foster_homes_status_idx ON foster_homes(status);
CREATE INDEX IF NOT EXISTS foster_homes_city_idx ON foster_homes(city);
CREATE INDEX IF NOT EXISTS sponsor_thanks_is_public_idx ON sponsor_thanks(is_public);
