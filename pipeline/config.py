import os
from pathlib import Path

from dotenv import get_key

PREFECT_API_URL = os.getenv("PREFECT_API_URL")

# Must be set to true when running tests
TEST = os.getenv("TEST", "False").lower() in ("true", "t", "yes", "y")
env_file = ".env.test" if TEST else ".env"


# Package structure
ROOT_DIRECTORY = Path(__file__).parent
DOTENV_PATH = ROOT_DIRECTORY / env_file
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
HOST_ENV_FILE_LOCATION = os.getenv("HOST_ENV_FILE_LOCATION")

EMAIL_TEMPLATES_LOCATION = LIBRARY_LOCATION / Path("pipeline/emails/templates")
EMAIL_STYLESHEETS_LOCATION = LIBRARY_LOCATION / Path(
    "pipeline/emails/stylesheets"
)

# Must be set to true to avoid external side effects (emails, data.gouv uploads...) in
# integration
IS_INTEGRATION = (
    get_key(DOTENV_PATH, "IS_INTEGRATION") or "False"
).lower() in (
    "true",
    "t",
    "yes",
    "y",
)

# Must be set to true to send controls data to the CACEM_EMAIL_ADDRESS, and
# not to real email addressees (control units)
TEST_MODE = (get_key(DOTENV_PATH, "TEST_MODE") or "False").lower() in (
    "true",
    "t",
    "yes",
    "y",
)

# Flow execution configuration
DOCKER_IMAGE = "ghcr.io/mtes-mct/monitorenv/monitorenv-pipeline-prefect3"
MONITORENV_VERSION = os.getenv("MONITORENV_VERSION")
FLOWS_LOCATION = Path("src/flows")  # relative to the WORKDIR in the image

# Proxies for pipeline flows requiring Internet access
PROXIES = {
    "http": get_key(DOTENV_PATH, "HTTP_PROXY_"),
    "https": get_key(DOTENV_PATH, "HTTPS_PROXY_"),
}

# URLs to fetch data from
FAO_AREAS_URL = (
    "https://www.fao.org/fishery/geoserver/fifao/ows?"
    "service=WFS&request=GetFeature&version=1.0.0&"
    "typeName=FAO_AREAS_ERASE&outputFormat=SHAPE-ZIP"
)

AMP_AREAS_URL = (
    "https://wxs.ofb.fr/geoserver/gestion/ows?"
    "service=WFS&request=GetFeature&version=2.0.0&"
    "typeName=ges_omon_amp_ofb_pol_3857_vue&"
    "outputFormat=SHAPE-ZIP"
)

# Metabase
METABASE_URL = os.getenv("METABASE_URL")

# Historic id ranges
HISTORIC_CONTROL_UNITS_MAX_ID = 9999

# Shift ids from Poseidon to MonitorEnv
POSEIDON_CACEM_MISSION_ID_TO_MONITORENV_MISSION_ID_SHIFT = -100000

# Email server
EMAIL_SERVER_URL = get_key(DOTENV_PATH, "EMAIL_SERVER_URL")
EMAIL_SERVER_PORT = get_key(DOTENV_PATH, "EMAIL_SERVER_PORT")
MONITORENV_SENDER_EMAIL_ADDRESS = get_key(
    DOTENV_PATH, "MONITORENV_SENDER_EMAIL_ADDRESS"
)

# Recipients
CACEM_EMAIL_ADDRESS = get_key(DOTENV_PATH, "CACEM_EMAIL_ADDRESS")
CACEM_ANALYST_NAME = get_key(DOTENV_PATH, "CACEM_ANALYST_NAME")
CACEM_ANALYST_EMAIL = get_key(DOTENV_PATH, "CACEM_ANALYST_EMAIL")

# Email actions to control units flow config
EMAIL_ALL_UNITS = (
    get_key(DOTENV_PATH, "EMAIL_ALL_UNITS") or "False"
).lower() in (
    "true",
    "t",
    "yes",
    "y",
)

# data.gouv.fr configuration
DATAGOUV_API_ENDPOINT = "https://www.data.gouv.fr/api/1"
DATAGOUV_API_KEY = get_key(DOTENV_PATH, "DATAGOUV_API_KEY")

# data.gouv.fr resource ids
REGULATORY_AREAS_DATASET_ID = "682ae3040ebe621687ec64ad"
REGULATORY_AREAS_CSV_RESOURCE_ID = "c9fe6865-602f-452c-ab31-e1d25222c158"
REGULATORY_AREAS_GEOPACKAGE_RESOURCE_ID = (
    "dd48b545-a1d1-4710-9e56-415b895f5336"
)
REGULATORY_AREAS_CSV_RESOURCE_TITLE = "regulatory_areas.csv"
REGULATORY_AREAS_GEOPACKAGE_RESOURCE_TITLE = "regulatory_areas.gpkg"

# Vessel repository XML
VESSEL_FILES_GID = os.getenv("VESSEL_FILES_GID")
VESSEL_FILES_DIRECTORY = "/data/vessel_repository"
