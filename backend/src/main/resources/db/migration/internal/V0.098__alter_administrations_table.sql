ALTER TABLE public.administrations
    ADD COLUMN is_archived BOOLEAN NOT NULL DEFAULT FALSE;
