ALTER TABLE public.vessels
    ADD COLUMN call_sign VARCHAR(7);

REFRESH MATERIALIZED VIEW latest_vessels;