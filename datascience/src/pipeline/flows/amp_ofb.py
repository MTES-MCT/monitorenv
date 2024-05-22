from io import BytesIO
from pathlib import Path

import geopandas as gpd
import prefect
from prefect import Flow, task
import requests
from sqlalchemy import text

from config import AMP_AREAS_URL, LIBRARY_LOCATION, PROXIES
from src.db_config import create_engine
from src.pipeline.generic_tasks import load
from src.pipeline.helpers.spatial import to_multipolygon
from src.pipeline.processing import prepare_df_for_loading
from src.pipeline.utils import psql_insert_copy

AMP_AREAS_FILE_PATH = LIBRARY_LOCATION / "pipeline/data/amp_areas.zip"


@task(checkpoint=False)
def extract_amp_areas(url: str, proxies: dict) -> gpd.GeoDataFrame:
    """
    Download shapefile of AMP and load to GeoDataFrame.

    Args:
        url (str): url to fetch the shapefile from
        proxies (dict): http and https proxies to use for the download.

    Returns:
        gpd.GeoDataFrame: GeoDataFrame of AMP areas
    """

    r = requests.get(url, proxies=proxies)
    r.raise_for_status()

    # The file needs to be downloaded first and loaded as GeoDataFrame from the
    # downloaded file, as loading the bytes stream directly to GeoDataFrame results in
    # fiona using an incorrect encoding that cannot be enforced in `gpd.read_file` :
    # passing `encoding` as keyword argument to `gpd.read_file` results in a conflict
    # in fiona when the input is an bytes stream.
    with open(AMP_AREAS_FILE_PATH, "wb") as f:
        f.write(BytesIO(r.content).read())

    amp_areas = gpd.read_file(AMP_AREAS_FILE_PATH)

    return amp_areas


@task(checkpoint=False)
def transform_amp_areas(amp_areas: gpd.GeoDataFrame) -> gpd.GeoDataFrame:
    """
    Transforms the ``amp_areas`` DataFrame to match the desired table columns.
    """

    amp_areas = amp_areas.copy(deep=True)
    amp_areas.columns = amp_areas.columns.map(str.lower)
    # amp_areas = amp_areas.drop(columns=["id"])
    amp_areas = gpd.GeoDataFrame(amp_areas)
    amp_areas = amp_areas.rename(columns={
        "geometry"  : "wkb_geometry",
        "nom"       : "mpa_name",
        "mpa_orinam": "mpa_oriname",
        "des_desigf": "des_desigfr",
        "des_desigt": "des_desigtype",
        "debut"     : "mpa_datebegin",
        "mpa_statu0": "mpa_statusyr",
        "mpa_wdpapi": "mpa_wdpapid",
        "mpa_calcar": "mpa_calcarea",
        "mpa_calcma": "mpa_calcmarea",
        "mpa_repare": "mpa_reparea",
        "mpa_repmar": "mpa_repmarea",
        "mpa_update": "mpa_updatewhen",
        "iucn_idiuc": "iucn_idiucn",
        "subloc_cod": "subloc_code",
        "subloc_nam": "subloc_name",
        "country_pi": "country_piso3",
        "country_is": "country_iso3",
        "country_i0": "country_iso3namefr"
        })
    amp_areas = amp_areas.set_geometry("geom")
    amp_areas["geom"] = amp_areas.wkb_geometry.map(to_multipolygon)

    return amp_areas


@task(checkpoint=False)
def load_amp_areas(amp_areas: gpd.GeoDataFrame):

    logger = prefect.context.get("logger")

    e = create_engine("monitorenv_remote")

    with e.begin() as connection:
        logger.info("Creating temporary table")
        connection.execute(
            text(
          "CREATE TEMP TABLE tmp_amp_ofb("
          "    id serial PRIMARY KEY,"
          "    geom geometry(Polygon,4326),"
          "    mpa_id integer UNIQUE NOT NULL,"
          "    mpa_pid integer,"
          "    gid integer,"
          "    mpa_name text,"
          "    mpa_oriname text,"
          "    des_id integer,"
          "    des_desigfr text,"
          "    des_desigtype text,"
          "    mpa_status text,"
          "    mpa_datebegin text,"
          "    mpa_statusyr integer,"
          "    mpa_wdpaid integer,"
          "    mpa_wdpapid text,"
          "    mpa_mnhnid text,"
          "    mpa_marine integer,"
          "    mpa_calcarea double precision,"
          "    mpa_calcmarea double precision,"
          "    mpa_reparea double precision,"
          "    mpa_repmarea double precision,"
          "    mpa_url text,"
          "    mpa_updatewhen text,"
          "    iucn_idiucn text,"
          "    subloc_code text,"
          "    subloc_name text,"
          "    country_piso3 text,"
          "    country_iso3 text,"
          "    country_iso3namefr text"
          ")"
          "ON COMMIT DROP;"
            )
        )

        amp_areas = prepare_df_for_loading(
            amp_areas,
            logger,
        )

        columns_to_load = [
            "geom",
            "mpa_id",
            "mpa_pid",
            "gid",
            "mpa_name",
            "mpa_oriname",
            "des_id",
            "des_desigfr",
            "des_desigtype",
            "mpa_status",
            "mpa_datebegin",
            "mpa_statusyr",
            "mpa_wdpaid",
            "mpa_wdpapid",
            "mpa_mnhnid",
            "mpa_marine",
            "mpa_calcarea",
            "mpa_calcmarea",
            "mpa_reparea",
            "mpa_repmarea",
            "mpa_url",
            "mpa_updatewhen",
            "iucn_idiucn",
            "subloc_code",
            "subloc_name",
            "country_piso3",
            "country_iso3",
            "country_iso3namefr"
        ]

        logger.info("Loading amp to temporary table")

        amp_areas[columns_to_load].to_sql(
            "tmp_amp_ofb",
            connection,
            if_exists="append",
            index=False,
            method=psql_insert_copy,
        )

        logger.info("Updating amp from temporary table")

        connection.execute(
            text(
                "UPDATE public.amp_cacem p "
                "SET "
                "    geom = ep.geom, "
                "    mpa_name = ep.mpa_name, "
                "    mpa_oriname = ep.mpa_oriname, "
                "    des_id = ep.des_id, "
                "    des_desigfr = ep.des_desigfr, "
                "    des_desigtype = ep.des_desigtype, "
                "    mpa_status = ep.mpa_status, "
                "    mpa_datebegin = ep.mpa_datebegin, "
                "    mpa_statusyr = ep.mpa_statusyr, "
                "    mpa_wdpaid = ep.mpa_wdpaid, "
                "    mpa_wdpapid = ep.mpa_wdpapid, "
                "    mpa_mnhnid = ep.mpa_mnhnid, "
                "    mpa_marine = ep.mpa_marine, "
                "    mpa_calcarea = ep.mpa_calcarea, "
                "    mpa_calcmarea = ep.mpa_calcmarea, "
                "    mpa_reparea = ep.mpa_reparea, "
                "    mpa_repmarea = ep.mpa_repmarea, "
                "    mpa_url = ep.mpa_url, "
                "    mpa_updatewhen = ep.mpa_updatewhen, "
                "    iucn_idiucn = ep.iucn_idiucn, "
                "    subloc_code = ep.subloc_code, "
                "    subloc_name = ep.subloc_name, "
                "    country_piso3 = ep.country_piso3, "
                "    country_iso3 = ep.country_iso3, "
                "    country_iso3namefr = ep.country_iso3namefr "
                "FROM tmp_amp_ofb ep "
                "WHERE p.mpa_id = ep.mpa_id;"
            )
        )

        logger.info("Delete amp not existing in temporary table")
        connection.execute(
            text(
                "DELETE FROM public.amp_cacem p "
                "WHERE p.mpa_id NOT IN "
                "    (SELECT mpa_id FROM tmp_amp_ofb);"
            )
        )

        logger.info("Insert missing amp from temporary table")
        connection.execute(
            text(
                "INSERT INTO public.amp_cacem ("
                "    geom, mpa_id, mpa_pid, gid, mpa_name, mpa_oriname, "
                "    des_id, des_desigfr, des_desigtype, mpa_status, "
                "    mpa_datebegin, mpa_statusyr, mpa_wdpaid, mpa_wdpapid, "
                "    mpa_mnhnid, mpa_marine, mpa_calcarea, mpa_calcmarea, "
                "    mpa_reparea, mpa_repmarea, mpa_url, mpa_updatewhen, "
                "    iucn_idiucn, subloc_code, subloc_name, country_piso3, "
                "    country_iso3, country_iso3namefr "
                "    )"
                "SELECT "
                "    geom, mpa_id, mpa_pid, gid, mpa_name, mpa_oriname, "
                "    des_id, des_desigfr, des_desigtype, mpa_status, "
                "    mpa_datebegin, mpa_statusyr, mpa_wdpaid, mpa_wdpapid, "
                "    mpa_mnhnid, mpa_marine, mpa_calcarea, mpa_calcmarea, "
                "    mpa_reparea, mpa_repmarea, mpa_url, mpa_updatewhen, "
                "    iucn_idiucn, subloc_code, subloc_name, country_piso3, "
                "    country_iso3, country_iso3namefr "
                "FROM tmp_amp_ofb "
                "WHERE mpa_id NOT IN "
                "    (SELECT mpa_id FROM public.amp_cacem);"
            )
        )


with Flow("AMP areas") as flow:
    amp_areas = extract_amp_areas(srl=AMP_AREAS_URL, proxies=PROXIES)
    amp_areas = transform_amp_areas(amp_areas)
    load_amp_areas(amp_areas)

flow.file_name = Path(__file__).name
