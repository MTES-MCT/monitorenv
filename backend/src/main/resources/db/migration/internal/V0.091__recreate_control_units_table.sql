-- TODO !!! IMPORTANT !!! DOUBLE-CHECK THAT IN PRODUCTION !!!
-- We shouldn't have to do that but there seems to be an inconsistency (`2003`) in `V0.060__create_administrations.sql`.
ALTER SEQUENCE public.administrations_id_seq RESTART WITH 2007;

ALTER TABLE public.control_resources RENAME TO legacy_control_resources;
-- ALTER TABLE public.legacy_control_resources RENAME CONSTRAINT control_resources_pkey TO legacy_control_resources_pkey;
ALTER SEQUENCE public.control_resources_id_seq RENAME TO legacy_control_resources_id_seq;

ALTER TABLE public.control_units RENAME TO legacy_control_units;
ALTER TABLE public.legacy_control_units RENAME CONSTRAINT control_units_pkey TO legacy_control_units_pkey;
ALTER SEQUENCE public.control_units_id_seq RENAME TO legacy_control_units_id_seq;

CREATE TABLE public.bases (
    id SERIAL PRIMARY KEY,
    name VARCHAR NOT NULL UNIQUE,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE public.administrations
    ADD COLUMN created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ADD COLUMN updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP;

CREATE TABLE public.control_units (
    id SERIAL PRIMARY KEY,
    administration_id INT NOT NULL,
    area_note VARCHAR,
    is_archived BOOLEAN NOT NULL,
    name VARCHAR NOT NULL,
    terms_note VARCHAR,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_administration FOREIGN KEY (administration_id) REFERENCES administrations(id)
);

CREATE TABLE public.control_unit_contacts (
    id SERIAL PRIMARY KEY,
    control_unit_id INT NOT NULL,
    email VARCHAR,
    name VARCHAR NOT NULL,
    note VARCHAR,
    phone VARCHAR,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_control_unit FOREIGN KEY (control_unit_id) REFERENCES control_units(id)
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

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_base FOREIGN KEY (base_id) REFERENCES bases(id),
    CONSTRAINT fk_control_unit FOREIGN KEY (control_unit_id) REFERENCES control_units(id)
);

INSERT INTO public.control_units (
    id,
    administration_id,
    is_archived,
    name,
    created_at,
    updated_at
)
SELECT
    id,
    administration_id,
    archived AS is_archived,
    name,
    CURRENT_TIMESTAMP AS created_at,
    CURRENT_TIMESTAMP AS updated_at
FROM
    public.legacy_control_units;
