#!/bin/bash

docker run -it --network=host --name monitorenv-pipeline-agent \
	      -v "$(pwd)"/infra/configurations/prefect-agent/backend.toml:/home/monitorenv-pipeline/.prefect/backend.toml \
        -v "$(pwd)"/datascience/.env:/home/monitorenv-pipeline/datascience/.env \
        --env-file datascience/.env \
        -e MONITORENV_VERSION \
        ghcr.io/mtes-mct/monitorenv/monitorenv-pipeline:$MONITORENV_VERSION \
        /bin/bash
