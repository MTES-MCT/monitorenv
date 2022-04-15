-- Add controls table

CREATE TABLE IF NOT EXISTS public.missions (
  id integer PRIMARY KEY,
  type_mission text,
  status_mission CHARACTER VARYING(100),
  input_start_datetime_utc TIMESTAMP,
  input_end_datetime_utc TIMESTAMP,
  facade CHARACTER VARYING(100),
  longitude DOUBLE PRECISION,
  latitude DOUBLE PRECISION,
  theme text
);



CREATE INDEX ON public.missions (id);
CREATE INDEX ON public.missions (input_start_datetime_utc DESC);