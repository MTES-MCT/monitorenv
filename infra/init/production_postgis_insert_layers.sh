#!/bin/sh
set -e
export PGPASSWORD=${POSTGRES_PASSWORD}
export DB_HOST=${POSTGRES_HOST}
export DB_NAME=${POSTGRES_DB}
export DB_SCHEMA=public
export DB_USER=${POSTGRES_USER}

# récupération des données intégration
PGCLIENTENCODING=UTF-8 psql -h ${POSTGRES_HOST} -d ${DB_NAME} -U ${DB_USER} -f home/monitorenv/data/integration.sql

# Control Resources
PGCLIENTENCODING=UTF-8 psql -h ${POSTGRES_HOST} -d ${DB_NAME} -U ${DB_USER} -f home/monitorenv/data/control_resources_admin_and_units_data.sql
