SELECT
    pos.id,
    pos.mmsi
    pos.coord,
    pos.status,
    pos.course,
    pos.heading,
    pos.speed,
    pos.ts
FROM last_positions pos