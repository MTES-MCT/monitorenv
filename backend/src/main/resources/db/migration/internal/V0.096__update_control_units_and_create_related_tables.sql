-- We shouldn't have to do that but there seems to be an inconsistency (`2003`) in `V0.060__create_administrations.sql`.
SELECT setval('public.administrations_id_seq', (SELECT MAX(id) FROM public.administrations));

CREATE TABLE public.bases (
    id SERIAL PRIMARY KEY,
    name VARCHAR NOT NULL UNIQUE,

    created_at_utc TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at_utc TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE public.administrations
    ADD COLUMN created_at_utc TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ADD COLUMN updated_at_utc TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE public.control_units
    ADD COLUMN area_note VARCHAR,
    ADD COLUMN terms_note VARCHAR,

    ADD COLUMN created_at_utc TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ADD COLUMN updated_at_utc TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP;

CREATE TABLE public.control_unit_contacts (
    id SERIAL PRIMARY KEY,
    control_unit_id INT NOT NULL,
    email VARCHAR,
    name VARCHAR NOT NULL,
    note VARCHAR,
    phone VARCHAR,

    created_at_utc TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at_utc TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_control_unit_contacts_control_control_unit_id_control_units
        FOREIGN KEY (control_unit_id)
        REFERENCES control_units(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE TABLE public.control_unit_resources (
    id SERIAL PRIMARY KEY,
    -- TODO Make that non-nullable once all resources will have been attached to a base.
    base_id INT,
    control_unit_id INT NOT NULL,
    name VARCHAR NOT NULL,
    note VARCHAR,
    photo BYTEA,
    -- TODO Make that non-nullable once all resources will have been attached to a type.
    type VARCHAR,

    created_at_utc TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at_utc TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_control_unit_resources_base_id_bases
        FOREIGN KEY (base_id)
        REFERENCES bases(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT fk_control_unit_resources_control_unit_id_control_units
        FOREIGN KEY (control_unit_id)
        REFERENCES control_units(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

-- Copy the old `public.control_resources` data into the new `public.control_unit_resources` table,
-- preserving the original `id` values
INSERT INTO public.control_unit_resources (
    id,
    control_unit_id,
    name,
    created_at_utc,
    updated_at_utc
)
SELECT
    id,
    unit_id AS control_unit_id,
    name AS name,
    CURRENT_TIMESTAMP AS created_at_utc,
    CURRENT_TIMESTAMP AS updated_at_utc
FROM public.control_resources;

-- Update the `public.control_unit_resources.id` sequence
SELECT setval('public.control_unit_resources_id_seq', (SELECT MAX(id) FROM public.control_unit_resources));

-- Replace `public.missions_control_resources.id` <-> `public.control_resources.id` relationship
ALTER TABLE public.missions_control_resources
    DROP CONSTRAINT IF EXISTS missions_control_resources_control_resource_id_fkey;
-- with `public.missions_control_resources.id` <-> `public.control_unit_resources.id`
ALTER TABLE public.missions_control_resources
    ADD CONSTRAINT fk_missions_control_resources_control_resource_id_control_unit_resources
        FOREIGN KEY (control_resource_id)
        REFERENCES public.control_unit_resources(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE;

-- Drop old `public.control_resources` table
DROP TABLE public.control_resources;
