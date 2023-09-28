#!/bin/bash
set -e

LAST_BACKUP_FILE_NAME=$(ls -p ./.backups | grep -v / | sort -V | tail -n 1)
LAST_BACKUP_FILE_PATH="./.backups/${LAST_BACKUP_FILE_NAME}"

# echo "Stopping and removing database container with its volume…"
# docker compose \
# 		--project-name monitorenv \
# 		--project-directory ./infra/docker \
# 		--env-file='./infra/.env' \
# 		-f ./infra/docker/docker-compose.yml \
# 		-f ./infra/docker/docker-compose.dev.yml \
# 		rm -f -s -v db

# echo "Starting databse container…"
# docker compose \
# 		--project-name monitorenv \
# 		--project-directory ./infra/docker \
# 		--env-file='./infra/.env' \
# 		-f ./infra/docker/docker-compose.yml \
# 		-f ./infra/docker/docker-compose.dev.yml \
#     up --wait db

# # echo "Waiting for database to be ready…"
# timeout 90s bash -c "until docker exec monitorenv-db-1 pg_isready ; do sleep 1 ; done"

echo "Restoring backup '${LAST_BACKUP_FILE_PATH}'…"
cat "${LAST_BACKUP_FILE_PATH}" | docker exec -t monitorenv-db-1 pg_restore -c -d monitorenvdb -F c -U postgres
