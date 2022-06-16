
CREATE TABLE control_resources (
    id integer NOT NULL PRIMARY KEY,
    geom public.geometry(Point,4326),
    facade text,
    administration text,
    resource_name text,
    size text,
    name text,
    city text,
    type text,
    intervention_zone text,
    ifr_location_ports_latitude double precision,
    ifr_location_ports_longitude double precision,
    telephone text,
    mail text,
    unit text
);