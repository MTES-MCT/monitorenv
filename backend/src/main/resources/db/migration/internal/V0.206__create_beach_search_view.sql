CREATE MATERIALIZED VIEW search_beaches AS
SELECT id,
       official_name,
       name,
       geom,
       postcode,
       unaccent(name)          as unaccent_name,
       unaccent(official_name) as unaccent_official_name
from beaches;
