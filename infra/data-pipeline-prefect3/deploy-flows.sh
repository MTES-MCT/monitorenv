#!/bin/bash
docker run -t --rm --network=host --name monitorenv-pipeline-deploy-flows \
    -v "$(pwd)"/pipeline/.env:/home/monitorenv-pipeline/pipeline/.env \
    -e HOST_ENV_FILE_LOCATION="$(pwd)"/pipeline/.env \
    -e MONITORENV_VERSION \
    -e PREFECT_API_URL \
    -e VESSEL_FILES_GID \
    docker.pkg.github.com/mtes-mct/monitorenv/monitorenv-pipeline-prefect3:$MONITORENV_VERSION \
    python main.py
