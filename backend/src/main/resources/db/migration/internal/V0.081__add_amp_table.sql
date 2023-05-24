CREATE TABLE IF NOT EXISTS public."amp_cacem"
(
    id serial NOT NULL,
    geom geometry(MultiPolygon,4326),
    mpa_oriname text,
    des_desigfr text,
    row_hash text,
    CONSTRAINT "amp_cacem_pkey" PRIMARY KEY (id)
);
