-- Add controls table

CREATE TABLE IF NOT EXISTS public.operations (
  id integer PRIMARY KEY,
  type_operation text,
  statut_operation CHARACTER VARYING(100),
  input_start_datetime_utc TIMESTAMP,
  input_end_datetime_utc TIMESTAMP,
  facade CHARACTER VARYING(100),
  longitude DOUBLE PRECISION,
  latitude DOUBLE PRECISION,
  thematique text
);



CREATE INDEX ON public.operations (id);
CREATE INDEX ON public.operations (input_start_datetime_utc DESC);