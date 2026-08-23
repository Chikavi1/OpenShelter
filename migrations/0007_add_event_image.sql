ALTER TABLE shelter_events ADD COLUMN IF NOT EXISTS image text NOT NULL DEFAULT '/events.png';
UPDATE shelter_events SET image = '/events.png' WHERE image IS NULL OR image = '';
