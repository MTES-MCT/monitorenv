import pandas as pd
import prefect
from pathlib import Path
from prefect import Flow, case
from sqlalchemy import text
from src.pipeline.generic_tasks import delete_rows, extract, load
from src.pipeline.shared_tasks.update_queries import delete_required, insert_required, merge_hashes, select_ids_to_delete, select_ids_to_insert, select_ids_to_update, update_required
from src.pipeline.utils import psql_insert_copy
from pipeline.src.db_config import create_engine

@task(checkpoint=False)
def extract_local_hashes() -> pd.DataFrame:
    """
    Extract regulatory areas hashes from cacem

    Returns:
        pd.DataFrame: GeoDataFrame of regulatory areas ids + row_hash
    """
    return extract(
        db_name="cacem_local", query_filepath="cross/cacem/regulatory_areas_hashes.sql"
    )

@task(checkpoint=False)
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

@task(checkpoint=False)
def delete(ids_to_delete: set):
    logger = prefect.context.get("logger")
    delete_rows(
        table_name="regulatory_areas",
        schema="public",
        db_name="monitorenv_remote",
        table_id_column="id",
        ids_to_delete=ids_to_delete,
        logger=logger,
    )


@task(checkpoint=False)
def extract_new_regulatory_areas(ids_to_update: set) -> pd.DataFrame:
    return extract(
        "cacem_local",
        "cross/cacem/regulatory_areas.sql",
        params={"ids": tuple(ids_to_update)},
    )

@task(checkpoint=False)
def update_regulatory_areas(new_regulatory_areas: pd.DataFrame):
    """Load the output of ``extract_rows_to_update`` task into ``regulatory_areas``
    table.

    Args:
        new_regulatory_areas (pd.DataFrame): output of ``extract_rows_to_update`` task.
    """
    e = create_engine("monitorenv_remote")
    logger = prefect.context.get("logger")

    with e.begin() as connection:
        logger.info("Creating temporary table")
        connection.execute(
            text(
                """CREATE TEMP TABLE tmp_regulatory_areas_cacem(
                id serial,
                geom public.geometry(MultiPolygon,4326),
                ref_reg character varying,
                date_modif character varying,
                row_hash text)
                ON COMMIT DROP;"""
            )
        )

        columns_to_load = [
            "id",
            "geom",
            "ref_reg",
            "date_modif",
            "row_hash"
        ]

        logger.info("Loading to temporary table")


        new_regulatory_areas[columns_to_load].to_sql(
            "tmp_regulatory_areas_cacem",
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
                date_modif = tmp.date_modif,
                row_hash = tmp.row_hash
                FROM tmp_regulatory_areas_cacem tmp
                WHERE reg.id = tmp.id;
                """
            )
        )

@task(checkpoint=False)
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
        logger=prefect.context.get("logger"),
        how="append",
    )


with Flow("Regulatory Areas") as flow:
    local_hashes = extract_local_hashes()
    remote_hashes = extract_remote_hashes()
    outer_hashes = merge_hashes(local_hashes, remote_hashes)
    inner_merged = merge_hashes(local_hashes, remote_hashes, "inner")

    ids_to_delete = select_ids_to_delete(outer_hashes)
    cond_delete = delete_required(ids_to_delete)
    with case(cond_delete, True):
        delete(ids_to_delete)

    ids_to_update = select_ids_to_update(inner_merged)
    cond_update = update_required(ids_to_update)
    with case(cond_update, True):
        new_regulations = extract_new_regulatory_areas(ids_to_update)
        update_regulatory_areas(new_regulations)

    ids_to_insert = select_ids_to_insert(outer_hashes)
    cond_insert = insert_required(ids_to_insert)
    with case(cond_insert, True):
        new_regulations = extract_new_regulatory_areas(ids_to_insert)
        load_new_regulatory_areas(new_regulations)

flow.file_name = Path(__file__).name
