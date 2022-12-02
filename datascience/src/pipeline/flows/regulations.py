from pathlib import Path

import pandas as pd
import prefect
from prefect import Flow, case, task

from src.pipeline.generic_tasks import delete_rows, extract, load


@task(checkpoint=False)
def extract_local_hashes() -> pd.DataFrame:
    """
    Extract regulations hashes from cacem

    Returns:
        pd.DataFrame: GeoDataFrame of regulation ids + row_hash
    """
    return extract(
        db_name="cacem_local", query_filepath="cross/regulations_hashes.sql"
    )


@task(checkpoint=False)
def extract_remote_hashes() -> pd.DataFrame:
    """
    Extract regulations hashes from monitorenv

    Returns:
        pd.DataFrame: GeoDataFrame of regulation ids + row_hash
    """
    return extract(
        db_name="monitorenv_remote",
        query_filepath="monitorenv/regulations_hashes.sql",
    )


@task(checkpoint=False)
def merge_hashes(
    local_hashes: pd.DataFrame, remote_hashes: pd.DataFrame
) -> pd.DataFrame:
    return pd.merge(local_hashes, remote_hashes, on="id", how="outer")


@task(checkpoint=False)
def select_ids_to_update(hashes: pd.DataFrame) -> set:
    ids_to_update = set(
        hashes.loc[
            (hashes.cacem_row_hash.notnull())
            & (hashes.cacem_row_hash != hashes.monitorenv_row_hash),
            "id",
        ]
    )

    return ids_to_update


@task(checkpoint=False)
def select_ids_to_delete(hashes: pd.DataFrame) -> set:
    return set(hashes.loc[hashes.cacem_row_hash.isna(), "id"])


@task(checkpoint=False)
def update_required(ids_to_update: set) -> bool:
    logger = prefect.context.get("logger")
    n = len(ids_to_update)
    if n > 0:
        logger.info(f"Found {n} row(s) to add or update.")
        res = True
    else:
        logger.info("No row to add or update was found.")
        res = False
    return res


@task(checkpoint=False)
def delete_required(ids_to_delete: set) -> bool:
    logger = prefect.context.get("logger")
    n = len(ids_to_delete)
    if n > 0:
        logger.info(f"Found {n} row(s) to delete.")
        res = True
    else:
        logger.info("No row to delete was found.")
        res = False
    return res


@task(checkpoint=False)
def delete(ids_to_delete: set):
    logger = prefect.context.get("logger")
    delete_rows(
        table_name="regulations_cacem",
        schema="public",
        db_name="monitorenv_remote",
        table_id_column="id",
        ids_to_delete=ids_to_delete,
        logger=logger,
    )


@task(checkpoint=False)
def extract_new_regulations(ids_to_update: set) -> pd.DataFrame:
    return extract(
        "cacem_local",
        "cross/regulations.sql",
        params={"ids": tuple(ids_to_update)},
    )


@task(checkpoint=False)
def load_new_regulations(new_regulations: pd.DataFrame):
    """Load the output of ``extract_rows_to_update`` task into ``regulations``
    table.

    Args:
        new_regulations (pd.DataFrame): output of ``extract_rows_to_update`` task.
    """
    load(
        new_regulations,
        table_name="regulations_cacem",
        schema="public",
        db_name="monitorenv_remote",
        logger=prefect.context.get("logger"),
        how="upsert",
        table_id_column="id",
        df_id_column="id",
    )


with Flow("Regulations") as flow:

    local_hashes = extract_local_hashes()
    remote_hashes = extract_remote_hashes()
    hashes = merge_hashes(local_hashes, remote_hashes)

    ids_to_delete = select_ids_to_delete(hashes)
    cond_delete = delete_required(ids_to_delete)
    with case(cond_delete, True):
        delete(ids_to_delete)

    ids_to_update = select_ids_to_update(hashes)
    cond_update = update_required(ids_to_update)
    with case(cond_update, True):
        new_regulations = extract_new_regulations(ids_to_update)
        load_new_regulations(new_regulations)

flow.file_name = Path(__file__).name
