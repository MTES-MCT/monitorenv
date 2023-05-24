CREATE TABLE IF NOT EXISTS public."amp_cacem"
(
    id serial NOT NULL,
    geom geometry(MultiPolygon,4326) NOT NULL,
    mpa_oriname text NOT NULL,
    des_desigfr text NOT NULL,
    row_hash text,
    CONSTRAINT "amp_cacem_pkey" PRIMARY KEY (id)
);
