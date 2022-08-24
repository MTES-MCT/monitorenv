#!/bin/sh
set -e
export PGPASSWORD=${POSTGRES_PASSWORD}
export DB_HOST=${POSTGRES_HOST}
export DB_NAME=${POSTGRES_DB}
export DB_SCHEMA=public
export DB_USER=${POSTGRES_USER}
PGCLIENTENCODING=UTF-8 psql -h ${DB_HOST} -d ${DB_NAME} -U ${DB_USER} -f data/layersdata/Insert_fao_areas.sql

PGCLIENTENCODING=UTF-8 psql -h 0.0.0.0 -d ${DB_NAME} -U ${DB_USER} -f data/layersdata/Insert_eez_areas.sql

PGCLIENTENCODING=UTF-8 psql -h 0.0.0.0 -d ${DB_NAME} -U ${DB_USER} -f data/layersdata/Insert_3_miles_areas.sql
PGCLIENTENCODING=UTF-8 psql -h 0.0.0.0 -d ${DB_NAME} -U ${DB_USER} -f data/layersdata/Insert_6_miles_areas.sql
PGCLIENTENCODING=UTF-8 psql -h 0.0.0.0 -d ${DB_NAME} -U ${DB_USER} -f data/layersdata/Insert_12_miles_areas.sql

PGCLIENTENCODING=UTF-8 psql -h 0.0.0.0 -d ${DB_NAME} -U ${DB_USER} -f data/layersdata/1241_eaux_occidentales_australes_areas.sql
PGCLIENTENCODING=UTF-8 psql -h 0.0.0.0 -d ${DB_NAME} -U ${DB_USER} -f data/layersdata/1241_eaux_occidentales_septentrionales.sql
PGCLIENTENCODING=UTF-8 psql -h 0.0.0.0 -d ${DB_NAME} -U ${DB_USER} -f data/layersdata/1241_eaux_union_dans_oi_et_atl_ouest_areas.sql
PGCLIENTENCODING=UTF-8 psql -h 0.0.0.0 -d ${DB_NAME} -U ${DB_USER} -f data/layersdata/1241_mer_baltique.sql
PGCLIENTENCODING=UTF-8 psql -h 0.0.0.0 -d ${DB_NAME} -U ${DB_USER} -f data/layersdata/1241_mer_du_nord.sql
PGCLIENTENCODING=UTF-8 psql -h 0.0.0.0 -d ${DB_NAME} -U ${DB_USER} -f data/layersdata/1241_mer_mediterranee.sql
PGCLIENTENCODING=UTF-8 psql -h 0.0.0.0 -d ${DB_NAME} -U ${DB_USER} -f data/layersdata/1241_mer_noire.sql

PGCLIENTENCODING=UTF-8 psql -h 0.0.0.0 -d ${DB_NAME} -U ${DB_USER} -f data/layersdata/cormoran_areas.sql
PGCLIENTENCODING=UTF-8 psql -h 0.0.0.0 -d ${DB_NAME} -U ${DB_USER} -f data/layersdata/aem_areas.sql

PGCLIENTENCODING=UTF-8 psql -h 0.0.0.0 -d ${DB_NAME} -U ${DB_USER} -f data/layersdata/fao_CCAMLR_areas.sql
PGCLIENTENCODING=UTF-8 psql -h 0.0.0.0 -d ${DB_NAME} -U ${DB_USER} -f data/layersdata/fao_ICCAT_areas.sql
PGCLIENTENCODING=UTF-8 psql -h 0.0.0.0 -d ${DB_NAME} -U ${DB_USER} -f data/layersdata/fao_IOTC_areas.sql
PGCLIENTENCODING=UTF-8 psql -h 0.0.0.0 -d ${DB_NAME} -U ${DB_USER} -f data/layersdata/fao_NEAFC_areas.sql
PGCLIENTENCODING=UTF-8 psql -h 0.0.0.0 -d ${DB_NAME} -U ${DB_USER} -f data/layersdata/fao_SIOFA_areas.sql

PGCLIENTENCODING=UTF-8 psql -h 0.0.0.0 -d ${DB_NAME} -U ${DB_USER} -f data/layersdata/rectangles_stat_areas.sql
PGCLIENTENCODING=UTF-8 psql -h 0.0.0.0 -d ${DB_NAME} -U ${DB_USER} -f data/layersdata/brexit_areas.sql
PGCLIENTENCODING=UTF-8 psql -h 0.0.0.0 -d ${DB_NAME} -U ${DB_USER} -f data/layersdata/situation_atlantique_areas.sql
PGCLIENTENCODING=UTF-8 psql -h 0.0.0.0 -d ${DB_NAME} -U ${DB_USER} -f data/layersdata/situation_med_areas.sql
PGCLIENTENCODING=UTF-8 psql -h 0.0.0.0 -d ${DB_NAME} -U ${DB_USER} -f data/layersdata/situation_memn_areas.sql
PGCLIENTENCODING=UTF-8 psql -h 0.0.0.0 -d ${DB_NAME} -U ${DB_USER} -f data/layersdata/situation_outre_mer_areas.sql

PGCLIENTENCODING=UTF-8 psql -h 0.0.0.0 -d ${DB_NAME} -U ${DB_USER} -f data/layersdata/regulations_cacem.sql
PGCLIENTENCODING=UTF-8 psql -h 0.0.0.0 -d ${DB_NAME} -U ${DB_USER} -f data/layersdata/regulations_cacem_normalize.sql
PGCLIENTENCODING=UTF-8 psql -h 0.0.0.0 -d ${DB_NAME} -U ${DB_USER} -f data/internal/control_resources_data.sql