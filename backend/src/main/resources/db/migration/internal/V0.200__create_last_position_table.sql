CREATE TABLE public.last_positions
(
    id        SERIAL,
    mmsi      INT,
    vessel_id INT,
    coord     GEOMETRY,
    status    VARCHAR,
    course    DOUBLE PRECISION,
    heading   DOUBLE PRECISION,
    speed     DOUBLE PRECISION,
    ts        TIMESTAMPTZ
);