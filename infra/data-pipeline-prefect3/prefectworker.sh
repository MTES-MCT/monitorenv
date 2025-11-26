#!/bin/bash
source <VENV-LOCATION-TO-CHANGE>/bin/activate && \
source ~/.prefect-worker && \
prefect worker start --pool monitorenv --type docker --with-healthcheck

