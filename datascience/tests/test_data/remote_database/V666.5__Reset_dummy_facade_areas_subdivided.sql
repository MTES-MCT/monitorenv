DELETE FROM facade_areas_subdivided;

INSERT INTO facade_areas_subdivided (
    facade, geometry
) VALUES 
('Facade A', ST_GeomFromText('MULTIPOLYGON (((10.0 45.0, -10.0 45.0, -10.0 0.0, 10.0 0.0, 10.0 45.0)))', 4326)),
('Facade B', ST_GeomFromText('MULTIPOLYGON (((10.0 45.0, -10.0 45.0, -10.0 50.0, 10.0 50.0, 10.0 45.0)))', 4326));
