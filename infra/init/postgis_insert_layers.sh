#!/bin/sh
set -e
export PGPASSWORD=${POSTGRES_PASSWORD}
export DB_HOST=${POSTGRES_HOST}
export DB_NAME=${POSTGRES_DB}
export DB_SCHEMA=public
export DB_USER=${POSTGRES_USER}

# Administrative layers
PGCLIENTENCODING=UTF-8 psql -h ${DB_HOST} -d ${DB_NAME} -U ${DB_USER} -f data/layersdata/Insert_fao_areas.sql

PGCLIENTENCODING=UTF-8 psql -h 0.0.0.0 -d ${DB_NAME} -U ${DB_USER} -f data/layersdata/Insert_eez_areas.sql

PGCLIENTENCODING=UTF-8 psql -h 0.0.0.0 -d ${DB_NAME} -U ${DB_USER} -f data/layersdata/Insert_3_miles_areas.sql
PGCLIENTENCODING=UTF-8 psql -h 0.0.0.0 -d ${DB_NAME} -U ${DB_USER} -f data/layersdata/Insert_6_miles_areas.sql
PGCLIENTENCODING=UTF-8 psql -h 0.0.0.0 -d ${DB_NAME} -U ${DB_USER} -f data/layersdata/Insert_12_miles_areas.sql

PGCLIENTENCODING=UTF-8 psql -h 0.0.0.0 -d ${DB_NAME} -U ${DB_USER} -f data/layersdata/territorial_seas.sql
PGCLIENTENCODING=UTF-8 psql -h 0.0.0.0 -d ${DB_NAME} -U ${DB_USER} -f data/layersdata/low_water_line.sql
PGCLIENTENCODING=UTF-8 psql -h 0.0.0.0 -d ${DB_NAME} -U ${DB_USER} -f data/layersdata/straight_baseline.sql

# Regulatory layer
PGCLIENTENCODING=UTF-8 psql -h 0.0.0.0 -d ${DB_NAME} -U ${DB_USER} -f data/layersdata/regulations_cacem.sql
PGCLIENTENCODING=UTF-8 psql -h 0.0.0.0 -d ${DB_NAME} -U ${DB_USER} -f data/layersdata/regulations_cacem_normalize.sql

