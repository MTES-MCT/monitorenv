-- TODO : add constraint back when new control_unit_resources have been loaded
ALTER TABLE public.missions_control_resources
DROP CONSTRAINT fk_missions_control_resources_control_resource_id_control_unit_resources;

TRUNCATE public.control_unit_resources;

CREATE TYPE control_unit_resource_type AS ENUM (
    'AIRPLANE',
    'BARGE',
    'CAR',
    'DRONE',
    'EQUESTRIAN',
    'FAST_BOAT',
    'FRIGATE',
    'HELICOPTER',
    'HYDROGRAPHIC_SHIP',
    'KAYAK',
    'LIGHT_FAST_BOAT',
    'MINE_DIVER',
    'MOTORCYCLE',
    'NET_LIFTER',
    'NO_RESOURCE',
    'OTHER',
    'PATROL_BOAT',
    'PEDESTRIAN',
    'PIROGUE',
    'RIGID_HULL',
    'SEA_SCOOTER',
    'SEMI_RIGID',
    'SUPPORT_SHIP',
    'TRAINING_SHIP',
    'TUGBOAT'
);

ALTER TABLE public.control_unit_resources
ALTER COLUMN type TYPE control_unit_resource_type USING type::control_unit_resource_type;


ALTER TABLE public.control_unit_resources
    ALTER COLUMN base_id SET NOT NULL,
    ALTER COLUMN type SET NOT NULL;
