-- CREATE EXTENSION IF NOT EXISTS timescaledb;

CREATE TABLE public.ais_positions
(
    id      SERIAL PRIMARY KEY,
    mmsi    INT,
    coord   GEOMETRY,
    status  TEXT,
    course  DOUBLE PRECISION,
    heading DOUBLE PRECISION,
    speed   DOUBLE PRECISION,
    ts      TIMESTAMPTZ
);

-- SELECT create_hypertable('ais_positions', by_range('ts', INTERVAL '1 day'), if_not_exists => TRUE);
-- CREATE INDEX ON ais_positions (mmsi, ts DESC);
--
-- ALTER TABLE ais_positions SET (
--     timescaledb.compress,
--     timescaledb.compress_segmentby = 'mmsi',
--     timescaledb.compress_orderby = 'ts DESC'
--     );
--
-- -- Compression automatique après 7 jours
-- SELECT add_compression_policy('ais_positions', INTERVAL '1 month');