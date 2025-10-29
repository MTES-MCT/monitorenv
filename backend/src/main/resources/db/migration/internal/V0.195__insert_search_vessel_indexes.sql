CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE INDEX idx_vessel_shipname_trgm
    ON vessels
        USING gin (UPPER(ship_name) gin_trgm_ops);

CREATE INDEX idx_vessel_imo_trgm
    ON vessels
        USING gin (UPPER(imo_number) gin_trgm_ops);

CREATE INDEX idx_vessel_immatriculation_trgm
    ON vessels
        USING gin (UPPER(immatriculation) gin_trgm_ops);

CREATE INDEX idx_vessel_mmsi_trgm
    ON vessels
        USING gin (UPPER(mmsi_number) gin_trgm_ops);

CREATE INDEX idx_vessel_not_banned_catA ON vessels (id)
    WHERE is_banned IS FALSE AND status = 'A';