from io import BytesIO

import geopandas as gpd
import requests
from prefect import flow, get_run_logger, task

from config import FAO_AREAS_URL, LIBRARY_LOCATION, PROXIES
from src.generic_tasks import load
from src.helpers.spatial import to_multipolygon

FAO_AREAS_FILE_PATH = LIBRARY_LOCATION / "data/fao_areas.zip"


@task
def extract_fao_areas(url: str, proxies: dict) -> gpd.GeoDataFrame:
    """
    Download shapefile of FAO areas and load to GeoDataFrame.

    Args:
        url (str): url to fetch the shapefile from
        proxies (dict): http and https proxies to use for the download.

    Returns:
        gpd.GeoDataFrame: GeoDataFrame of FAO areas
    """

    r = requests.get(url, proxies=proxies)
    r.raise_for_status()

    # The file needs to be downloaded first and loaded as GeoDataFrame from the
    # downloaded file, as loading the bytes stream directly to GeoDataFrame results in
    # fiona using an incorrect encoding that cannot be enforced in `gpd.read_file` :
    # passing `encoding` as keyword argument to `gpd.read_file` results in a conflict
    # in fiona when the input is an bytes stream.
    with open(FAO_AREAS_FILE_PATH, "wb") as f:
        f.write(BytesIO(r.content).read())

    fao_areas = gpd.read_file(FAO_AREAS_FILE_PATH)

    return fao_areas


@task
def transform_fao_areas(fao_areas: gpd.GeoDataFrame) -> gpd.GeoDataFrame:
    """
    Transforms the ``fao_areas`` DataFrame to match the desired table columns.
    """

    fao_areas = fao_areas.copy(deep=True)
    fao_areas.columns = fao_areas.columns.map(str.lower)
    fao_areas = fao_areas.drop(columns=["id"])
    fao_areas = gpd.GeoDataFrame(fao_areas)
    fao_areas = fao_areas.rename(columns={"geometry": "wkb_geometry"})
    fao_areas = fao_areas.set_geometry("wkb_geometry")
    fao_areas["wkb_geometry"] = fao_areas.wkb_geometry.map(to_multipolygon)

    return fao_areas


@task
def load_fao_areas(fao_areas: gpd.GeoDataFrame):

    logger = get_run_logger()

    load(
        fao_areas,
        table_name="fao_areas",
        schema="public",
        db_name="monitorenv_remote",
        logger=logger,
        how="replace",
    )


@flow(name="Monitorenv - FAO areas")
def fao_areas_flow():
    fao_areas = extract_fao_areas(url=FAO_AREAS_URL, proxies=PROXIES)
    fao_areas = transform_fao_areas(fao_areas)
    load_fao_areas(fao_areas)
