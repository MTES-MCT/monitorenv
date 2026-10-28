-- Table filled by the `Monitorenv - Scrape legicem` pipeline flow.
-- It holds the two latest scrapings of Legicem (`latest` and `previous`), with one
-- row per downloadable document of each Legicem page (or one row with null
-- document fields for pages without any document).
CREATE TYPE public.legicem_extraction_occurence AS ENUM ('latest', 'previous');

CREATE TABLE public.legicem (
    extraction_datetime_utc TIMESTAMP NOT NULL,
    extraction_occurence legicem_extraction_occurence NOT NULL,
    page_title VARCHAR NOT NULL,
    page_url VARCHAR NOT NULL,
    document_title VARCHAR,
    document_url VARCHAR
);
