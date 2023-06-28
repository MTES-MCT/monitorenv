CREATE SEQUENCE infractions_observation_reports_id_seq;

CREATE TYPE infractions_observations_reports_source_type AS ENUM ('SEMAPHORE', 'CONTROL_UNIT', 'OTHER');
CREATE TYPE infractions_observations_reports_target_type AS ENUM ('VEHICLE', 'COMPANY', 'INDIVIDUAL');
CREATE TYPE infractions_observations_reports_vehicle_type AS ENUM ('VESSEL', 'OTHER');
CREATE TYPE infractions_observations_reports_report_type AS ENUM ('INFRACTION', 'OBSERVATION');


CREATE TABLE infractions_observations_reports (
    id BIGINT NOT NULL DEFAULT nextval('infractions_observation_reports_id_seq'::regclass),
    source_type infractions_observations_reports_source_type ,
    semaphore_id BIGINT,
    control_unit_id BIGINT,
    source_name text,
    target_type infractions_observations_reports_target_type,
    vehicle_type infractions_observations_reports_vehicle_type,
    target_details jsonb,
    geom geometry(Geometry, 4326),
    description text,
    report_type infractions_observations_reports_report_type,
    theme text,
    sub_themes text[],
    action_taken text,
    is_infraction_proven boolean,
    is_control_required boolean,
    is_unit_available boolean,
    created_at timestamp,
    validity_time integer,
    is_deleted boolean DEFAULT false NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT fk_semaphores FOREIGN KEY (semaphore_id) REFERENCES semaphores (id),
    CONSTRAINT fk_control_units FOREIGN KEY (control_unit_id) REFERENCES control_units (id)
)