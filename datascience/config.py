import os
from pathlib import Path

from dotenv import load_dotenv

load_dotenv()

# Package structure
ROOT_DIRECTORY = Path(__file__).parent
LIBRARY_LOCATION = ROOT_DIRECTORY / Path("src")
QUERIES_LOCATION = LIBRARY_LOCATION / Path("pipeline/queries")
TEST_DATA_LOCATION = ROOT_DIRECTORY / Path("tests/test_data")

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
