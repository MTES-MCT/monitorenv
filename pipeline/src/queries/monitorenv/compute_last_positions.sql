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
),

SELECT
    -- The DISTINCT ON clause is required to remove possible duplicates due to vessels
    -- for which we receive each position multiple times
    DISTINCT ON (mmsi)
    id,
    coord,
    status,
    course,
    heading,
    speed,
    ts
FROM last_positions
