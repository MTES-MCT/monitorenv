SELECT 
    id,
    "name",
    parent_id,
    started_at,
    ended_at
FROM prod.themes
WHERE id IN :ids