CREATE MATERIALIZED VIEW latest_vessels AS
WITH LatestBatch AS (SELECT *,
                            MAX(batch_id) OVER (PARTITION BY ship_id) AS maxBatchId
                     FROM vessels),
     LatestRow AS (SELECT *,
                          MAX(CASE WHEN batch_id = maxBatchId THEN row_number END)
                          OVER (PARTITION BY ship_id) AS maxRowNumber
                   FROM LatestBatch)

SELECT v.*
FROM LatestRow v
WHERE v.is_banned = false
  AND v.status = 'A'
  AND row_number = maxRowNumber
  and batch_id = maxBatchId;

CREATE INDEX idx_last_vessels_shipname_trgm
    ON latest_vessels
        USING gin (UPPER(ship_name) gin_trgm_ops);

CREATE INDEX idx_latest_vessels_imo_trgm
    ON latest_vessels
        USING gin (UPPER(imo_number) gin_trgm_ops);

CREATE INDEX idx_latest_vessels_immatriculation_trgm
    ON latest_vessels
        USING gin (UPPER(immatriculation) gin_trgm_ops);

CREATE INDEX idx_latest_vessels_mmsi_trgm
    ON latest_vessels
        USING gin (UPPER(mmsi_number) gin_trgm_ops);

CREATE INDEX idx_latest_vessels_not_banned_catA ON latest_vessels (id)
    WHERE is_banned IS FALSE AND status = 'A';

