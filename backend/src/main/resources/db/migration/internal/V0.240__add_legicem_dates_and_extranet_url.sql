-- Columns added to the `legicem` table after `V0.239__create_legicem_table.sql`
-- was deployed.
-- `page_updated_date` is null for pages that were never updated.
-- `IF NOT EXISTS` makes this migration safe on databases where these columns
-- were already added by hand.
ALTER TABLE public.legicem
    ADD COLUMN IF NOT EXISTS page_url_extranet VARCHAR,
    ADD COLUMN IF NOT EXISTS page_published_date DATE,
    ADD COLUMN IF NOT EXISTS page_updated_date DATE;
