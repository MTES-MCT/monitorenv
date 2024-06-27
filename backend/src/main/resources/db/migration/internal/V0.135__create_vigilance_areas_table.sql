-- Add vigilance_areas table

CREATE TYPE vigilance_area_ending_condition AS ENUM ('NEVER', 'END_DATE','OCCURENCES_NUMBER');
CREATE TYPE vigilance_area_frequency AS ENUM ('NONE','ALL_WEEKS', 'ALL_MONTHS','ALL_YEARS','CUSTOM');
CREATE TYPE vigilance_area_visibility AS ENUM ('PUBLIC', 'PRIVATE');

CREATE TABLE IF NOT EXISTS public.vigilance_areas (
  id serial PRIMARY KEY,
  comments text,
  created_by VARCHAR(3),
  end_date_period TIMESTAMP,
  ending_condition vigilance_area_ending_condition,
  ending_occurence_date TIMESTAMP,
  ending_occurence_number INT,
  frequency vigilance_area_frequency,
  facade CHARACTER VARYING(100),
  geom geometry(Geometry, 4326),
  is_draft boolean NOT NULL DEFAULT TRUE,
  links jsonb,
  name text,
  source text,
  start_date_period TIMESTAMP,
  themes text[],
  visibility vigilance_area_visibility
);

CREATE INDEX ON public.vigilance_areas (id);
