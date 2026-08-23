ALTER TABLE pets
  ADD COLUMN IF NOT EXISTS images JSONB NOT NULL DEFAULT '[]'::jsonb;

UPDATE pets
SET images = jsonb_build_array(image)
WHERE jsonb_array_length(images) = 0;
