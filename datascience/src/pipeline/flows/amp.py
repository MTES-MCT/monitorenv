from pathlib import Path

import pandas as pd
import prefect
from prefect import Flow, case, task

from src.pipeline.generic_tasks import delete_rows, extract, load


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
def merge_hashes(
    local_hashes: pd.DataFrame, remote_hashes: pd.DataFrame
) -> pd.DataFrame:
    return pd.merge(local_hashes, remote_hashes, on="id", how="outer")


@task(checkpoint=False)
def select_ids_to_upsert(hashes: pd.DataFrame) -> set:
    ids_to_upsert = set(
        hashes.loc[
            (hashes.cacem_row_hash.notnull())
            & (hashes.cacem_row_hash != hashes.monitorenv_row_hash),
            "id",
        ]
    )

    return ids_to_upsert


@task(checkpoint=False)
def select_ids_to_delete(hashes: pd.DataFrame) -> set:
    return set(hashes.loc[hashes.cacem_row_hash.isna(), "id"])


@task(checkpoint=False)
def upsert_required(ids_to_upsert: set) -> bool:
    logger = prefect.context.get("logger")
    n = len(ids_to_upsert)
    if n > 0:
        logger.info(f"Found {n} row(s) to add or upsert.")
        res = True
    else:
        logger.info("No row to add or upsert was found.")
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
def load_new_amp(new_amp: pd.DataFrame):
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
        how="upsert",
        table_id_column="id",
        df_id_column="id",
    )


with Flow("amp") as flow:

    local_hashes = extract_local_hashes()
    remote_hashes = extract_remote_hashes()
    hashes = merge_hashes(local_hashes, remote_hashes)

    ids_to_delete = select_ids_to_delete(hashes)
    cond_delete = delete_required(ids_to_delete)
    with case(cond_delete, True):
        delete(ids_to_delete)

    ids_to_upsert = select_ids_to_upsert(hashes)
    cond_upsert = upsert_required(ids_to_upsert)
    with case(cond_upsert, True):
        new_amp = extract_new_amp(ids_to_upsert)
        load_new_amp(new_amp)

flow.file_name = Path(__file__).name
