SELECT 
    id,
    "name",
    parent_id,
    started_at,
    ended_at,
    md5(
        COALESCE("name"::VARCHAR, '') ||
        COALESCE(parent_id::INT, 0) ||
        COALESCE(started_at::TIMESTAMP, NOW()) ||
        COALESCE(ended_at::TIMESTAMP, NOW())
  ) AS cacem_row_hash
FROM prod.tags