#!/bin/bash
source <VENV-LOCATION-TO-CHANGE>/bin/activate && \
source ~/.prefect-agent && \
prefect agent docker start --label monitorenv --api "${PREFECT_SERVER_URL}";
