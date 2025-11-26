#!/bin/bash

docker run --rm -t --network=host --name monitorenv-pipeline-register-flows \
	-v "$(pwd)"/infra/configurations/prefect-agent/backend.toml:/home/monitorenv-pipeline/.prefect/backend.toml \
        -v "$(pwd)"/datascience/.env:/home/monitorenv-pipeline/datascience/.env \
        --env-file datascience/.env \
        -e MONITORENV_VERSION \
        -e VESSEL_FILES_GID="$(getent group monitorenv_etl | cut -d: -f3)" \
        ghcr.io/mtes-mct/monitorenv/monitorenv-pipeline:$MONITORENV_VERSION \
        python main.py
