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

EMAIL_TEMPLATES_LOCATION = LIBRARY_LOCATION / Path("pipeline/emails/templates")
EMAIL_STYLESHEETS_LOCATION = LIBRARY_LOCATION / Path(
    "pipeline/emails/stylesheets"
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

# Must be set to true to avoid external side effects (emails, data.gouv uploads...) in
# integration
IS_INTEGRATION = os.getenv("IS_INTEGRATION", "False").lower() in (
    "true",
    "t",
    "yes",
    "y",
)

# Must be set to true to send controls data to the CACEM_EMAIL_ADDRESS, and
# not to real email addressees (control units)
TEST_MODE = os.getenv("TEST_MODE", "False").lower() in (
    "true",
    "t",
    "yes",
    "y",
)

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

AMP_AREAS_URL = (
    "https://wxs.ofb.fr/geoserver/gestion/ows?"
    "service=WFS&request=GetFeature&version=2.0.0&"
    "typeName=ges_omon_amp_ofb_pol_3857_vue&"
    "outputFormat=SHAPE-ZIP"
)
# Prefect Server endpoint
PREFECT_SERVER_URL = os.getenv("PREFECT_SERVER_URL")

# Metabase
METABASE_URL = os.getenv("METABASE_URL")

# Historic id ranges
HISTORIC_CONTROL_UNITS_MAX_ID = 9999

# Shift ids from Poseidon to MonitorEnv
POSEIDON_CACEM_MISSION_ID_TO_MONITORENV_MISSION_ID_SHIFT = -100000

# Email server
EMAIL_SERVER_URL = os.environ.get("EMAIL_SERVER_URL")
EMAIL_SERVER_PORT = os.environ.get("EMAIL_SERVER_PORT")
MONITORENV_SENDER_EMAIL_ADDRESS = os.environ.get(
    "MONITORENV_SENDER_EMAIL_ADDRESS"
)

# Recipients
CACEM_EMAIL_ADDRESS = os.environ.get("CACEM_EMAIL_ADDRESS")

CACEM_ANALYST_NAME = os.getenv("CACEM_ANALYST_NAME")
CACEM_ANALYST_EMAIL = os.getenv("CACEM_ANALYST_EMAIL")

# Email actions to control units flow config
EMAIL_ALL_UNITS = os.getenv("EMAIL_ALL_UNITS", "False").lower() in (
    "true",
    "t",
    "yes",
    "y",
)

# data.gouv.fr configuration
DATAGOUV_API_ENDPOINT = "https://www.data.gouv.fr/api/1"
DATAGOUV_API_KEY = os.getenv("DATAGOUV_API_KEY")

# data.gouv.fr resource ids
REGULATORY_AREAS_DATASET_ID = "682ae3040ebe621687ec64ad"
REGULATORY_AREAS_CSV_RESOURCE_ID = "c9fe6865-602f-452c-ab31-e1d25222c158"
REGULATORY_AREAS_GEOPACKAGE_RESOURCE_ID = "dd48b545-a1d1-4710-9e56-415b895f5336"
REGULATORY_AREAS_CSV_RESOURCE_TITLE = "regulatory_areas.csv"
REGULATORY_AREAS_GEOPACKAGE_RESOURCE_TITLE = "regulatory_areas.gpkg"

# Vessel repository XML
VESSEL_FILES_GID = os.getenv("VESSEL_FILES_GID")
VESSEL_FILES_DIRECTORY = "/data/vessel_repository"