UPDATE missions set geom = CASE WHEN st_xmax(geom)> 230 OR st_xmin(geom)<-205 THEN geom::geography::geometry ELSE geom END;
UPDATE env_actions set geom = CASE WHEN st_xmax(geom)> 230 OR st_xmin(geom)<-205 THEN geom::geography::geometry ELSE geom END;
UPDATE reportings set geom = CASE WHEN st_xmax(geom)> 230 OR st_xmin(geom)<-205 THEN geom::geography::geometry ELSE geom END;
