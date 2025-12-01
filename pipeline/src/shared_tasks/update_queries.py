import pandas as pd
import prefect
from prefect import task


@task
def update_required(ids_to_update: set) -> bool:
    logger = prefect.context.get("logger")
    n = len(ids_to_update)
    if n > 0:
        logger.info(f"Found {n} row(s) to update.")
        res = True
    else:
        logger.info("No row update was found.")
        res = False
    return res


@task
def merge_hashes(
    local_hashes: pd.DataFrame, remote_hashes: pd.DataFrame, how: str = "outer"
) -> pd.DataFrame:
    return pd.merge(local_hashes, remote_hashes, on="id", how=how)


@task
def select_ids_to_update(hashes: pd.DataFrame) -> set:
    ids_to_update = set(
        hashes.loc[
            (hashes.cacem_row_hash.notnull())
            & (hashes.cacem_row_hash != hashes.monitorenv_row_hash),
            "id",
        ]
    )

    return ids_to_update


@task
def select_ids_to_delete(hashes: pd.DataFrame) -> set:
    return set(hashes.loc[hashes.cacem_row_hash.isna(), "id"])


@task
def select_ids_to_insert(hashes: pd.DataFrame) -> set:
    return set(hashes.loc[hashes.monitorenv_row_hash.isna(), "id"])


@task
def insert_required(ids_to_insert: set) -> bool:
    logger = prefect.context.get("logger")
    n = len(ids_to_insert)
    if n > 0:
        logger.info(f"Found {n} row(s) to add.")
        res = True
    else:
        logger.info("No row to add was found.")
        res = False
    return res


@prefect.task
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
