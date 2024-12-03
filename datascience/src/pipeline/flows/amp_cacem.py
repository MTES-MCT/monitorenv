from pathlib import Path

import pandas as pd
import prefect
from prefect import Flow, case, task
from sqlalchemy import text

from src.db_config import create_engine
from src.pipeline.generic_tasks import delete_rows, extract, load
from src.pipeline.utils import psql_insert_copy
from src.pipeline.shared_tasks.update_queries import delete_required, insert_required, merge_hashes, select_ids_to_delete, select_ids_to_insert, select_ids_to_update, update_required



@task(checkpoint=False)
def extract_local_hashes() -> pd.DataFrame:
    """
    Extract amp hashes from cacem

    Returns:
        pd.DataFrame: GeoDataFrame of amp ids + row_hash
    """
    return extract(
        db_name="cacem_local", query_filepath="cross/cacem/amp_hashes.sql"
    )


@task(checkpoint=False)
def extract_remote_hashes() -> pd.DataFrame:
    """
    Extract amp hashes from monitorenv

    Returns:
        pd.DataFrame: GeoDataFrame of amp ids + row_hash
    """
    return extract(
        db_name="monitorenv_remote",
        query_filepath="monitorenv/amp_hashes.sql",
    )



@task(checkpoint=False)
def delete(ids_to_delete: set):
    logger = prefect.context.get("logger")
    delete_rows(
        table_name="amp_cacem",
        schema="public",
        db_name="monitorenv_remote",
        table_id_column="id",
        ids_to_delete=ids_to_delete,
        logger=logger,
    )


@task(checkpoint=False)
def extract_new_amp(ids_to_upsert: set) -> pd.DataFrame:
    return extract(
        "cacem_local",
        "cross/cacem/amp.sql",
        params={"ids": tuple(ids_to_upsert)},
    )



@task(checkpoint=False)
def update_amps(new_amps: pd.DataFrame):
    """Load the output of ``extract_rows_to_update`` task into ``amp``
    table.

    Args:
        new_regulations (pd.DataFrame): output of ``extract_rows_to_update`` task.
    """
    e = create_engine("monitorenv_remote")
    logger = prefect.context.get("logger")

    with e.begin() as connection:
        logger.info("Creating temporary table")
        connection.execute(
            text(
                """CREATE TEMP TABLE tmp_amp_cacem(
                id serial,
                geom public.geometry(MultiPolygon,4326),
                mpa_oriname text,
                des_desigfr text,
                row_hash text,
                mpa_type text,
                ref_reg text,
                url_legicem text)
                ON COMMIT DROP;"""
            )
        )

        columns_to_load = [
            "id",
            "geom",
            "mpa_oriname",
            "des_desigfr",
            "row_hash",
            "mpa_type",
            "ref_reg",
            "url_legicem"
        ]

        logger.info("Loading to temporary table")

        new_amps[columns_to_load].to_sql(
            "tmp_amp_cacem",
            connection,
            if_exists="append",
            index=False,
            method=psql_insert_copy,
        )

        logger.info(f"Updating amp_cacem from temporary table {len(new_amps)}")
        connection.execute(
            text(
                """UPDATE amp_cacem amp
                SET geom = tmp.geom,
                mpa_oriname = tmp.mpa_oriname,
                des_desigfr = tmp.des_desigfr,
                row_hash = tmp.row_hash,
                mpa_type = tmp.mpa_type,
                ref_reg = tmp.ref_reg,
                url_legicem = tmp.url_legicem
                FROM tmp_amp_cacem tmp
                where amp.id = tmp.id;
                """
            )
        )

@task(checkpoint=False)
def load_new_amps(new_amp: pd.DataFrame):
    """Load the output of ``extract_rows_to_upsert`` task into ``amp``
    table.

    Args:
        new_amp (pd.DataFrame): output of ``extract_rows_to_upsert`` task.
    """
    load(
        new_amp,
        table_name="amp_cacem",
        schema="public",
        db_name="monitorenv_remote",
        logger=prefect.context.get("logger"),
        how="append",
    )


with Flow("import amp cacem") as flow:
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
        new_regulations = extract_new_amp(ids_to_update)
        update_amps(new_regulations)
    
    ids_to_insert = select_ids_to_insert(outer_hashes)
    cond_insert = insert_required(ids_to_insert)
    with case(cond_insert, True):
        new_regulations = extract_new_amp(ids_to_insert)
        load_new_amps(new_regulations)


flow.file_name = Path(__file__).name
