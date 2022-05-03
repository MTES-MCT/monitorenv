-- Add controls table

CREATE TABLE IF NOT EXISTS public.missions (
  id serial PRIMARY KEY,
  mission_type text,
  mission_status text,
  input_start_datetime_utc TIMESTAMP,
  input_end_datetime_utc TIMESTAMP,
  facade CHARACTER VARYING(100),
  theme text,
  observations text
);



CREATE INDEX ON public.missions (id);
CREATE INDEX ON public.missions (input_start_datetime_utc DESC);