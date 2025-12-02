from io import BytesIO

import geopandas as gpd
import requests
from prefect import flow, get_run_logger, task
from sqlalchemy import text

from config import AMP_AREAS_URL, LIBRARY_LOCATION, PROXIES
from src.db_config import create_engine
from src.helpers.spatial import to_multipolygon
from src.processing import prepare_df_for_loading
from src.utils import psql_insert_copy

AMP_AREAS_FILE_PATH = LIBRARY_LOCATION / "data/amp_areas.zip"

AMP_AREAS_COLUMNS = [
    "mpa_id",
    "mpa_pid",
    "gid",
    "des_id",
    "mpa_status",
    "mpa_name",
    "mpa_oriname",
    "des_desigfr",
    "des_desigtype",
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
    "country_iso3namefr",
    "geom",
]


@task
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


@task
def transform_amp_areas(amp_areas: gpd.GeoDataFrame) -> gpd.GeoDataFrame:
    """
    Transforms the ``amp_areas`` DataFrame to match the desired table columns.
    """

    amp_areas = amp_areas.copy(deep=True)
    amp_areas.columns = amp_areas.columns.map(str.lower)
    amp_areas = amp_areas.rename(
        columns={
            "geometry": "geom",
            "nom": "mpa_name",
            "mpa_orinam": "mpa_oriname",
            "des_desigf": "des_desigfr",
            "des_desigt": "des_desigtype",
            "mpa_datebe": "mpa_datebegin",
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
            "country_i0": "country_iso3namefr",
        }
    )
    amp_areas = amp_areas.set_geometry("geom")
    amp_areas["geom"] = amp_areas.geom.map(to_multipolygon)
    amp_areas = amp_areas.to_crs("EPSG:4326")
    return amp_areas


@task
def load_amp_areas(amp_areas: gpd.GeoDataFrame):

    logger = get_run_logger()

    e = create_engine("cacem_local")

    with e.begin() as connection:
        logger.info("Creating temporary table")
        connection.execute(
            text(
                "CREATE TEMP TABLE tmp_amp_ofb("
                "    id serial PRIMARY KEY,"
                "    geom geometry,"
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
            df=amp_areas,
            logger=logger,
            nullable_integer_columns=[
                "gid",
                "mpa_id",
                "mpa_pid",
                "des_id",
                "mpa_statusyr",
                "mpa_wdpaid",
                "mpa_marine",
            ],
        )

        columns_to_load = AMP_AREAS_COLUMNS

        logger.info("Loading amp to temporary table")

        amp_areas[columns_to_load].to_sql(
            "tmp_amp_ofb",
            connection,
            if_exists="append",
            index=False,
            method=psql_insert_copy,
        )

        logger.info("Updating amp from temporary table")

        updated_rows = connection.execute(
            text(
                'UPDATE prod."Aires marines protégées" p '
                "SET "
                "    geom = st_multi(st_setsrid(ep.geom,4326)), "
                "    mpa_pid = ep.mpa_pid, "
                "    gid = ep.gid, "
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
        logger.info(f"Number of rows updated: {updated_rows.rowcount}")

        logger.info("Delete amp not existing in temporary table")
        deleted_rows = connection.execute(
            text(
                'DELETE FROM prod."Aires marines protégées" p '
                "WHERE p.mpa_id NOT IN "
                "    (SELECT mpa_id FROM tmp_amp_ofb);"
            )
        )
        logger.info(f"Number of rows deleted: {deleted_rows.rowcount}")

        logger.info("Insert missing amp from temporary table")
        inserted_rows = connection.execute(
            text(
                'INSERT INTO prod."Aires marines protégées" ('
                "    geom, mpa_id, mpa_pid, gid, mpa_name, mpa_oriname, "
                "    des_id, des_desigfr, des_desigtype, mpa_status, "
                "    mpa_datebegin, mpa_statusyr, mpa_wdpaid, mpa_wdpapid, "
                "    mpa_mnhnid, mpa_marine, mpa_calcarea, mpa_calcmarea, "
                "    mpa_reparea, mpa_repmarea, mpa_url, mpa_updatewhen, "
                "    iucn_idiucn, subloc_code, subloc_name, country_piso3, "
                "    country_iso3, country_iso3namefr "
                "    )"
                "SELECT "
                "    st_multi(st_setsrid(geom,4326)), mpa_id, mpa_pid, gid, mpa_name, mpa_oriname, "
                "    des_id, des_desigfr, des_desigtype, mpa_status, "
                "    mpa_datebegin, mpa_statusyr, mpa_wdpaid, mpa_wdpapid, "
                "    mpa_mnhnid, mpa_marine, mpa_calcarea, mpa_calcmarea, "
                "    mpa_reparea, mpa_repmarea, mpa_url, mpa_updatewhen, "
                "    iucn_idiucn, subloc_code, subloc_name, country_piso3, "
                "    country_iso3, country_iso3namefr "
                "FROM tmp_amp_ofb "
                "WHERE mpa_id NOT IN "
                '    (SELECT mpa_id FROM prod."Aires marines protégées" WHERE mpa_id is not null);'
            )
        )
        logger.info(f"Number of rows inserted: {inserted_rows.rowcount}")


@flow(name="update amp from ofb")
def update_amp_from_ofb_flow():
    amp_areas = extract_amp_areas(url=AMP_AREAS_URL, proxies=PROXIES)
    amp_areas = transform_amp_areas(amp_areas)
    load_amp_areas(amp_areas)
