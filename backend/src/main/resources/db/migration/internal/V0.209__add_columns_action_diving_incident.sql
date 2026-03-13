ALTER TABLE public.env_actions
    ADD COLUMN has_diving_during_operations BOOLEAN,
    ADD COLUMN incident_during_operation    BOOLEAN;
