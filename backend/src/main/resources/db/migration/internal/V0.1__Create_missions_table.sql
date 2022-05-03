-- Add missions table
-- CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS public.missions (
  id serial PRIMARY KEY,
  mission_type text,
  unit text,
  administration text,
  mission_status text,
  author text,
  observations text,
  facade CHARACTER VARYING(100),
  theme text,
  input_start_datetime_utc TIMESTAMP,
  input_end_datetime_utc TIMESTAMP,
  actions jsonb
);



CREATE INDEX ON public.missions (id);
CREATE INDEX ON public.missions (input_start_datetime_utc DESC);