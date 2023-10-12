ALTER TABLE public.env_actions
  ADD CONSTRAINT unique_mission_id_and_id UNIQUE (mission_id, id);

ALTER TABLE public.reportings
  ADD COLUMN attached_mission_id integer REFERENCES missions(id),
  ADD COLUMN attached_to_mission_at_utc TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ADD COLUMN detached_from_mission_at_utc TIMESTAMP,
  ADD COLUMN attached_env_action_id uuid,
  ADD CONSTRAINT reportings_env_actions_fk FOREIGN KEY (attached_mission_id, attached_env_action_id) REFERENCES env_actions(mission_id, id) MATCH SIMPLE
;

-- Un signalement ne peut pas être rattaché à une env_action (controle ou signalement) s'il n'est pas rattaché à une mission
ALTER TABLE public.reportings
  ADD CONSTRAINT attached_mission_id_not_null_if_attached_env_action_id_not_null
      CHECK (attached_env_action_id IS NULL
                OR (attached_mission_id IS NOT NULL
                        AND detached_from_mission_at_utc IS NULL)
        )
;

CREATE INDEX reportings_attached_mission_id_idx ON public.reportings(attached_mission_id);
CREATE INDEX reportings_attached_env_action_id_idx ON public.reportings(attached_env_action_id);