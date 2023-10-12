#!/bin/bash
set -e

LAST_BACKUP_FILE_NAME=$(ls -p ./.backups | grep -v / | sort -V | tail -n 1)
LAST_BACKUP_FILE_PATH="./.backups/${LAST_BACKUP_FILE_NAME}"


echo "Restoring backup '${LAST_BACKUP_FILE_PATH}'…"
docker exec -t monitorenv-db-1 psql -d monitorenvdb -U postgres -f "/opt/monitorenv_backups/${LAST_BACKUP_FILE_NAME}"
