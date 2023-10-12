#!/bin/bash
set -e

BACKUP_FILE_PATH="./.backups/$(date '+%Y-%m-%d').sql"

if [ ! -d ./.backups ]; then
  echo "Creating directory './.backups'…"
  mkdir ./.backups
fi

echo "Dumping databases in '${BACKUP_FILE_PATH}'…"
docker exec -t monitorenv-db-1 pg_dump -c -F p -U postgres monitorenvdb > "${BACKUP_FILE_PATH}"
