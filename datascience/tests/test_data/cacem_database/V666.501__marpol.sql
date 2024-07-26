CREATE SCHEMA IF NOT EXISTS prod;
DROP TABLE IF EXISTS prod.marpol;
CREATE TABLE prod.marpol (
    id integer PRIMARY KEY,
    geom public.geometry(MultiPolygon,4326),
    zone character varying(254),
    "zone_neca" character varying(10),
    "zone_seca" character varying(10)
);


INSERT INTO prod.marpol VALUES (4, '0106000020E61000000100000001030000000100000009000000AD0812BCE168E4BFCCDEEA3227BD4840BE63AEABD812E4BF1C5E8873F8AC484044BD156CA117DABF84C0E2AF49AC48408E16A14DE463CCBFBC9F7168A2A5484008BF4C12D0F97B3F9494F5EA3CAB4840399BF9438A28B43FDC4BF050D9BB48404BAA02B73C2CCCBF24A79C8362CD4840BC46F7A9D24DE1BFA0238D36B2D04840AD0812BCE168E4BFCCDEEA3227BD4840', 'Baltic sea and North sea', NULL, 'SECA');


CREATE INDEX sidx_marpol_geom ON prod.marpol USING gist (geom);
