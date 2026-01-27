import pandas as pd
from prefect import flow, get_run_logger, task
from sqlalchemy import text

from src.db_config import create_engine
from src.generic_tasks import delete_rows, extract, load
from src.shared_tasks.update_queries import (
    delete_required,
    insert_required,
    merge_hashes,
    select_ids_to_delete,
    select_ids_to_insert,
    select_ids_to_update,
    update_required,
)
from src.utils import psql_insert_copy

@task
def extract_local_hashes() -> pd.DataFrame:
    """
    Extract regulatory areas hashes from cacem

    Returns:
        pd.DataFrame: GeoDataFrame of regulatory areas ids + row_hash
    """
    return extract(
        db_name="cacem_local", query_filepath="cross/cacem/regulatory_areas_hashes.sql"
    )

@task
def extract_remote_hashes() -> pd.DataFrame:
    """
    Extract regulatory areas hashes from monitorenv

    Returns:
        pd.DataFrame: GeoDataFrame of regulatory areas ids + row_hash
    """
    return extract(
        db_name="monitorenv_remote",
        query_filepath="monitorenv/regulatory_areas_hashes.sql",
    )

@task
def delete(ids_to_delete: set):
    logger = get_run_logger
    delete_rows(
        table_name="regulatory_areas",
        schema="public",
        db_name="monitorenv_remote",
        table_id_column="id",
        ids_to_delete=ids_to_delete,
        logger=logger,
    )


@task
def extract_new_regulatory_areas(ids_to_update: set) -> pd.DataFrame:
    return extract(
        "cacem_local",
        "cross/cacem/regulatory_areas.sql",
        params={"ids": tuple(ids_to_update)},
    )

@task
def update_regulatory_areas(new_regulatory_areas: pd.DataFrame):
    """Load the output of ``extract_rows_to_update`` task into ``regulatory_areas``
    table.

    Args:
        new_regulatory_areas (pd.DataFrame): output of ``extract_rows_to_update`` task.
    """
    e = create_engine("monitorenv_remote")
    logger = get_run_logger()

    with e.begin() as connection:
        logger.info("Creating temporary table")
        connection.execute(
            text(
                """CREATE TEMP TABLE tmp_regulatory_areas(
                id serial,
                geom public.geometry(MultiPolygon,4326),
                ref_reg character varying,
                edition_cacem character varying,
                row_hash text)
                ON COMMIT DROP;"""
            )
        )

        columns_to_load = [
            "id",
            "geom",
            "ref_reg",
            "edition_cacem",
            "row_hash"
        ]

        logger.info("Loading to temporary table")


        new_regulatory_areas[columns_to_load].to_sql(
            "tmp_regulatory_areas",
            connection,
            if_exists="append",
            index=False,
            method=psql_insert_copy,
        )
         

        logger.info("Updating regulatory_areas from temporary table {len(new_regulatory_areas)}")
        connection.execute(
            text(
                """UPDATE regulatory_areas reg
                SET geom = tmp.geom,
                ref_reg = tmp.ref_reg,
                edition_cacem = tmp.edition_cacem,
                row_hash = tmp.row_hash
                FROM tmp_regulatory_areas tmp
                WHERE reg.id = tmp.id;
                """
            )
        )

@task
def load_new_regulatory_areas(new_regulatory_areas: pd.DataFrame):
    """Load the output of ``extract_new_regulatory_areas`` task into ``regulatory_areas``
    table.

    Args:
        new_regulatory_areas (pd.DataFrame): output of ``extract_new_regulatory_areas`` task.
    """

    load(
        new_regulatory_areas,
        table_name="regulatory_areas",
        schema="public",
        db_name="monitorenv_remote",
        logger=get_run_logger(),
        how="append",
    )


@flow(name="Monitorenv - Regulatory Areas")
def regulatory_areas_flow():
    local_hashes = extract_local_hashes()
    remote_hashes = extract_remote_hashes()
    outer_hashes = merge_hashes(local_hashes, remote_hashes)
    inner_merged = merge_hashes(local_hashes, remote_hashes, "inner")

    ids_to_delete = select_ids_to_delete(outer_hashes)
    cond_delete = delete_required(ids_to_delete)
    if cond_delete is True:
        delete(ids_to_delete)

    ids_to_update = select_ids_to_update(inner_merged)
    cond_update = update_required(ids_to_update)
    if cond_update is True:
        new_regulations = extract_new_regulatory_areas(ids_to_update)
        update_regulatory_areas(new_regulations)

    ids_to_insert = select_ids_to_insert(outer_hashes)
    cond_insert = insert_required(ids_to_insert)
    if cond_insert is True:
        new_regulations = extract_new_regulatory_areas(ids_to_insert)
        load_new_regulatory_areas(new_regulations)

