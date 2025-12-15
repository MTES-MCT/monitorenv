SELECT
    pos.id,
    pos.mmsi,
    pos.vessel_id,
    pos.coord,
    pos.status,
    pos.course,
    pos.heading,
    pos.speed,
    pos.ts
FROM last_positions pos