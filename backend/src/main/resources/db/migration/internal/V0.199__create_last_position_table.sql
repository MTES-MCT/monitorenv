CREATE TABLE public.last_positions
(
    id      SERIAL,
    mmsi    INT,
    coord   geometry,
    status  VARCHAR,
    course  DOUBLE PRECISION,
    heading DOUBLE PRECISION,
    speed   DOUBLE PRECISION,
    ts      TIMESTAMPTZ
);