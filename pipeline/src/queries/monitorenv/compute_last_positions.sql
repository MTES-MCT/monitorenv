WITH last_n_minutes_positions AS (
    SELECT 
        id,
        mmsi,
        coord,
        status,
        course,
        heading,
        speed,
        ts,
        ROW_NUMBER() OVER (
            PARTITION BY mmsi
            ORDER BY ts DESC, id DESC) AS rk
    FROM ais_positions
    WHERE ts > CURRENT_TIMESTAMP - make_interval(mins => :minutes)
    AND ts < CURRENT_TIMESTAMP + INTERVAL '1 day'
    AND mmsi IS NOT NULL
),

last_positions AS (
    SELECT *
    FROM last_n_minutes_positions
    WHERE rk = 1
)

SELECT
    -- The DISTINCT ON clause is required to remove possible duplicates due to vessels
    -- for which we receive each position multiple times
    DISTINCT ON (lp.mmsi)
    lp.id,
    lv.ship_id as vessel_id,
    lp.mmsi,
    lp.coord,
    lp.status,
    lp.course,
    lp.heading,
    lp.speed,
    lp.ts
FROM last_positions lp
LEFT JOIN latest_vessels lv 
ON lp.mmsi = lv.mmsi_number::integer;