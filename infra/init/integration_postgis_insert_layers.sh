#!/bin/sh
set -e
export PGPASSWORD=${POSTGRES_PASSWORD}
export DB_HOST=${POSTGRES_HOST}
export DB_NAME=${POSTGRES_DB}
export DB_SCHEMA=public
export DB_USER=${POSTGRES_USER}

# Données Production
# Initialiation des couches admin
# Initialisation des couches reg
# Initialisation des données moyens
PGCLIENTENCODING=UTF-8 psql -h ${DB_HOST} -d ${DB_NAME} -U ${DB_USER} -f data/production.sql
# missions samples 
PGCLIENTENCODING=UTF-8 psql -h 0.0.0.0 -d ${DB_NAME} -U ${DB_USER} -f data/integration/missions.sql