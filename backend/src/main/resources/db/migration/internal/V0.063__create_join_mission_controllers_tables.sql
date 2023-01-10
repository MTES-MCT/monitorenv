create table missions_control_units (
    id serial primary key,
    mission_id integer references missions not null,
    control_unit_id integer references control_units(id) not null,
    contact text,
    unique (mission_id, control_unit_id)
);

create table missions_control_resources (
    id serial primary key,
    mission_id integer references missions not null,
    control_resource_id integer references control_resources(id) not null,
    unique (mission_id, control_resource_id)
);

-- Add control units
WITH missions_units_name AS (
    select
        id AS mission_id,
        jsonb_array_elements(resource_units) ->> 'unit' AS unit_name,
        jsonb_array_elements(resource_units) ->> 'contact' AS unit_contact
    from missions
)

INSERT INTO missions_control_units(mission_id, control_unit_id, contact)
    SELECT
        mun.mission_id,
        cu.id AS control_unit_id,
        mun.unit_contact AS contact
    FROM missions_units_name mun
    JOIN control_units cu
    ON mun.unit_name = cu.name;

-- Add control resources
WITH missions_control_resource_names AS (
    select
        id AS mission_id,
        jsonb_array_elements_text(jsonb_array_elements(resource_units) -> 'resources')::VARCHAR AS resource_name,
        jsonb_array_elements(resource_units) ->> 'unit' AS unit_name
    from missions
)

INSERT INTO missions_control_resources
    SELECT
        mcrn.mission_id,
        cr.id AS control_resource_id
    FROM missions_control_resource_names mcrn
    JOIN control_units cu
    ON mcrn.unit_name = cu.name
    JOIN control_resources cr
    ON mcrn.resource_name = cr.name AND cu.id = cr.unit_id;

ALTER TABLE public.missions
DROP COLUMN resource_units;