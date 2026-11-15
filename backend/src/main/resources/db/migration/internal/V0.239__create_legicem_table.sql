-- Table filled by the `Monitorenv - Scrape legicem` pipeline flow.
-- It holds the two latest scrapings of Legicem (`latest` and `previous`), with one
-- row per downloadable document of each Legicem page (or one row with null
-- document fields for pages without any document).
-- `page_updated_date` is null for pages that were never updated.
CREATE TYPE public.legicem_extraction_occurence AS ENUM ('latest', 'previous');

CREATE TABLE public.legicem (
    extraction_datetime_utc TIMESTAMP NOT NULL,
    extraction_occurence legicem_extraction_occurence NOT NULL,
    page_title VARCHAR NOT NULL,
    page_url VARCHAR NOT NULL,
    page_url_extranet VARCHAR,
    page_published_date DATE,
    page_updated_date DATE,
    document_title VARCHAR,
    document_url VARCHAR
);
