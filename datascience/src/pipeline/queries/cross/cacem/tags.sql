SELECT 
    id,
    "name",
    parent_id,
    started_at,
    ended_at
FROM prod.tags
WHERE id IN :ids