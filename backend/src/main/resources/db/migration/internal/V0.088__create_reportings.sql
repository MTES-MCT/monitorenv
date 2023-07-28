

CREATE OR REPLACE FUNCTION reportings_yearly_sequence_value() RETURNS integer AS $$
  BEGIN
		IF NOT EXISTS (SELECT 0 FROM pg_class where relname = 'reportings_'||EXTRACT(year FROM CURRENT_TIMESTAMP)::TEXT||'_seq' )
			THEN
				EXECUTE format('CREATE SEQUENCE IF NOT EXISTS %1$I START WITH 2;', 
			   (SELECT 'reportings_'||EXTRACT(year FROM CURRENT_TIMESTAMP)::TEXT||'_seq')
			   );
 			RETURN 1;
		END IF; 
		
		RETURN (SELECT nextval('reportings_'||EXTRACT(year FROM CURRENT_TIMESTAMP)::TEXT||'_seq' ));
				
  END;
$$ LANGUAGE plpgsql;

CREATE TYPE reportings_source_type AS ENUM ('SEMAPHORE', 'CONTROL_UNIT', 'OTHER');
CREATE TYPE reportings_target_type AS ENUM ('VEHICLE', 'COMPANY', 'INDIVIDUAL');
CREATE TYPE reportings_vehicle_type AS ENUM ('VESSEL', 'OTHER');
CREATE TYPE reportings_report_type AS ENUM ('INFRACTION_SUSPICION', 'OBSERVATION');


CREATE TABLE reportings (
    id BIGINT NOT NULL DEFAULT reportings_yearly_sequence_value(),
    source_type reportings_source_type ,
    semaphore_id BIGINT,
    control_unit_id BIGINT,
    source_name text,
    target_type reportings_target_type,
    vehicle_type reportings_vehicle_type,
    target_details jsonb,
    geom geometry(Geometry, 4326),
    description text,
    report_type reportings_report_type,
    theme text,
    sub_themes text[],
    action_taken text,
    is_infraction_proven boolean,
    is_control_required boolean,
    is_unit_available boolean,
    created_at timestamp,
    validity_time integer,
    is_archived boolean DEFAULT false NOT NULL,
    is_deleted boolean DEFAULT false NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT fk_semaphores FOREIGN KEY (semaphore_id) REFERENCES semaphores (id),
    CONSTRAINT fk_control_units FOREIGN KEY (control_unit_id) REFERENCES control_units (id)
)