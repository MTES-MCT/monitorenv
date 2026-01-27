CREATE SCHEMA IF NOT EXISTS prod;
DROP TABLE IF EXISTS prod.reg_cacem CASCADE;

CREATE TABLE IF NOT EXISTS prod.reg_cacem
(
    id             serial primary key,
    geom           geometry(MultiPolygon, 4326),
    ref_reg        varchar,
    date_modif     date
);

insert into prod.reg_cacem (id, geom, ref_reg, date_modif) values (1, 'MULTIPOLYGON(((0 0,10 0,10 10,0 10,0 0)))', 'ref_reg1', '2026-01-01');
insert into prod.reg_cacem (id, geom, ref_reg, date_modif) values (2, 'MULTIPOLYGON(((120 -20,135 -20,135 -10,120 -10,120 -20)))', 'ref_reg2', '2026-01-01');