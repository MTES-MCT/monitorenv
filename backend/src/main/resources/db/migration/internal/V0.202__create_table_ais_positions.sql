CREATE EXTENSION IF NOT EXISTS timescaledb;

CREATE TABLE public.ais_positions
(
    id      SERIAL,
    mmsi    INT,
    coord   GEOMETRY,
    status  TEXT,
    course  SMALLINT,
    heading SMALLINT,
    speed   SMALLINT,
    ts      TIMESTAMPTZ,
    PRIMARY KEY (mmsi, ts)
);

SELECT create_hypertable('ais_positions', by_range('ts', INTERVAL '1 day'), if_not_exists => TRUE);
