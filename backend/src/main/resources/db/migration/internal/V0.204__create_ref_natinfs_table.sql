CREATE TABLE public.ref_natinfs
(
    id            SERIAL PRIMARY KEY,
    nature        VARCHAR,
    qualification TEXT,
    defined_by    VARCHAR,
    repressed_by  VARCHAR
);