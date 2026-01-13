CREATE TABLE public.last_positions
(
    id        SERIAL PRIMARY KEY,
    mmsi      INT UNIQUE,
    vessel_id INT,
    coord     GEOMETRY,
    status    VARCHAR,
    course    SMALLINT,
    heading   SMALLINT,
    speed     SMALLINT,
    ts        TIMESTAMPTZ
);