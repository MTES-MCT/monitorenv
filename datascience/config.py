import os
from pathlib import Path

from dotenv import load_dotenv

# Package structure
ROOT_DIRECTORY = Path(__file__).parent
LIBRARY_LOCATION = ROOT_DIRECTORY / Path("src")
QUERIES_LOCATION = LIBRARY_LOCATION / Path("pipeline/queries")
TEST_DATA_LOCATION = ROOT_DIRECTORY / Path("tests/test_data")

LOCAL_MIGRATIONS_FOLDER = str(
    (
        ROOT_DIRECTORY / Path("../backend/src/main/resources/db/migration")
    ).resolve()
)
# HOST_MIGRATIONS_FOLDER envirionment variable is needed when running tests in CI to
# mount migrations folder from the host to the database container
HOST_MIGRATIONS_FOLDER = os.getenv(
    "HOST_MIGRATIONS_FOLDER", LOCAL_MIGRATIONS_FOLDER
)

# Must be set to true when running tests locally
TEST_LOCAL = os.getenv("TEST_LOCAL", "False").lower() in (
    "true",
    "t",
    "yes",
    "y",
)
if TEST_LOCAL:
    load_dotenv(ROOT_DIRECTORY / ".env.test")

# Must be set to true when running flows locally
RUN_LOCAL = os.getenv("RUN_LOCAL", "False").lower() in (
    "true",
    "t",
    "yes",
    "y",
)
if RUN_LOCAL:
    load_dotenv(ROOT_DIRECTORY / ".env")

# Flow execution configuration
DOCKER_IMAGE = "ghcr.io/mtes-mct/monitorenv/monitorenv-pipeline"
MONITORENV_VERSION = os.getenv("MONITORENV_VERSION")
FLOWS_LOCATION = Path(
    "src/pipeline/flows"
)  # relative to the WORKDIR in the image


# Proxies for pipeline flows requiring Internet access
PROXIES = {
    "http": os.environ.get("HTTP_PROXY_"),
    "https": os.environ.get("HTTPS_PROXY_"),
}

# URLs to fetch data from
FAO_AREAS_URL = (
    "http://www.fao.org/fishery/geoserver/fifao/ows?"
    "service=WFS&request=GetFeature&version=1.0.0&"
    "typeName=fifao:FAO_AREAS_CWP&outputFormat=SHAPE-ZIP"
)

# Prefect Server endpoint
PREFECT_SERVER_URL = os.getenv("PREFECT_SERVER_URL")

# Historic id ranges
HISTORIC_CONTROL_UNITS_MAX_ID = 9999

# Shift ids from Poseidon to MonitorEnv
POSEIDON_CACEM_MISSION_ID_TO_MONITORENV_MISSION_ID_SHIFT = -100000
