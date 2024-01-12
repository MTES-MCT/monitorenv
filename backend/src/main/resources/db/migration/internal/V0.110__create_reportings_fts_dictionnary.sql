/* create an extension for case-insensitive and accent-insensitive searches */
CREATE EXTENSION unaccent;

CREATE TEXT SEARCH CONFIGURATION mydict ( COPY = simple );

ALTER TEXT SEARCH CONFIGURATION mydict
  ALTER MAPPING FOR hword, hword_part, word
  WITH unaccent, simple;

CREATE INDEX idx_reportings_search ON public.reportings USING GIST (to_tsvector('mydict', target_details));