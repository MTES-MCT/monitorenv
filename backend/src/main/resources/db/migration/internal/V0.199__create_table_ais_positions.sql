CREATE EXTENSION IF NOT EXISTS timescaledb;

CREATE TABLE public.ais_positions
(
    mmsi    INT,
    coord   GEOMETRY,
    status  TEXT,
    course  DOUBLE PRECISION,
    heading DOUBLE PRECISION,
    speed   DOUBLE PRECISION,
    ts      TIMESTAMPTZ,
    PRIMARY KEY (mmsi, ts)
);

SELECT create_hypertable('ais_positions', by_range('ts', INTERVAL '1 day'), if_not_exists => TRUE);
