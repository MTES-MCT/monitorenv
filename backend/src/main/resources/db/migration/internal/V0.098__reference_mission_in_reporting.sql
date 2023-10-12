ALTER TABLE public.env_actions
  ADD CONSTRAINT unique_mission_id_and_id UNIQUE (mission_id, id);

ALTER TABLE public.reportings RENAME COLUMN is_unit_available TO has_no_unit_available;
UPDATE public.reportings SET has_no_unit_available = NOT has_no_unit_available;

ALTER TABLE public.reportings ALTER COLUMN semaphore_id TYPE integer USING semaphore_id::integer;
ALTER TABLE public.reportings ALTER COLUMN control_unit_id TYPE integer USING control_unit_id::integer;
ALTER TABLE public.reportings
  ADD COLUMN mission_id integer REFERENCES missions(id),
  ADD COLUMN attached_to_mission_at_utc TIMESTAMP,
  ADD COLUMN detached_from_mission_at_utc TIMESTAMP,
  ADD COLUMN attached_env_action_id uuid,
  ADD CONSTRAINT fk_reportings_env_actions FOREIGN KEY (mission_id, attached_env_action_id) REFERENCES env_actions(mission_id, id) MATCH SIMPLE
;

-- Un signalement ne peut pas être rattaché à une env_action (controle ou signalement) s'il n'est pas rattaché à une mission
ALTER TABLE public.reportings
  ADD CONSTRAINT ck_mission_id_not_null_if_attached_env_action_id_not_null
      CHECK (attached_env_action_id IS NULL
                OR (mission_id IS NOT NULL
                        AND detached_from_mission_at_utc IS NULL)
        )
;

CREATE INDEX idx_reportings_mission_id ON public.reportings(mission_id);
CREATE INDEX idx_reportings_attached_env_action_id ON public.reportings(attached_env_action_id);