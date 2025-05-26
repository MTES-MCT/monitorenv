from pathlib import Path
import pandas as pd
import prefect
from prefect import Flow, case, task
from src.pipeline.generic_tasks import delete_rows, extract, load
from src.pipeline.processing import df_values_to_psql_arrays
from src.pipeline.shared_tasks.update_queries import delete_required, insert_required, merge_hashes, select_ids_to_delete, select_ids_to_insert, select_ids_to_update, update_required
from sqlalchemy import text
from src.db_config import create_engine
from src.pipeline.utils import psql_insert_copy
from prefect.tasks.control_flow import merge

@task(checkpoint=False)
def extract_local_localized_areas_hashes() -> pd.DataFrame:
    """
    Extract localized areas hashes from cacem

    Returns:
        pd.DataFrame: GeoDataFrame of localized areas ids + row_hash
    """
    return extract(
        db_name="cacem_local", query_filepath="cross/cacem/localized_areas_hashes.sql"
    )


@task(checkpoint=False)
def extract_remote_localized_areas_hashes() -> pd.DataFrame:
    """
    Extract localized areas hashes from monitorenv

    Returns:
        pd.DataFrame: GeoDataFrame of localized areas ids + row_hash
    """
    return extract(
        db_name="monitorenv_remote",
        query_filepath="monitorenv/localized_areas_hashes.sql",
    )

@task(checkpoint=False)
def delete(ids_to_delete: set):
    logger = prefect.context.get("logger")
    delete_rows(
        table_name="localized_areas",
        schema="public",
        db_name="monitorenv_remote",
        table_id_column="id",
        ids_to_delete=ids_to_delete,
        logger=logger,
    )

@task(checkpoint=False)
def extract_new_localized_areas(ids_to_update: set) -> pd.DataFrame:
    return extract(
        "cacem_local",
        "cross/cacem/localized_areas.sql",
        params={"ids": tuple(ids_to_update)},
    )

@task(checkpoint=False)
def update_localized_areas(new_localized_areas: pd.DataFrame):
    """Load the output of ``extract_rows_to_update`` task into ``localized_areas``
    table.

    Args:
        new_localized_areas (pd.DataFrame): output of ``extract_rows_to_update`` task.
    """
    e = create_engine("monitorenv_remote")
    logger = prefect.context.get("logger")

    with e.begin() as connection:
        logger.info("Creating temporary table")
        connection.execute(
            text(
                """CREATE TEMP TABLE tmp_localized_areas(
                    id               SERIAL PRIMARY KEY,
                    geom             geometry(MultiPolygon,4326),
                    "name"           character varying,
                    control_unit_ids INTEGER[],
                    amp_ids          INTEGER[]
                ) ON COMMIT DROP;"""
            )
        )

        columns_to_load = [
            "id",
            "geom",
            "name",
            "control_unit_ids",
            "amp_ids"
        ]

        logger.info("Loading to temporary table")

        pg_array_columns = ["control_unit_ids", "amp_ids"]
        new_localized_areas[pg_array_columns] = df_values_to_psql_arrays(
            new_localized_areas[pg_array_columns]
        )
        new_localized_areas[columns_to_load].to_sql(
            "tmp_localized_areas",
            connection,
            if_exists="append",
            index=False,
            method=psql_insert_copy,

        )

        logger.info("Updating localized_areas from temporary table {len(new_localized_areas)}")
        connection.execute(
            text(
                """UPDATE localized_areas
                SET name = tmp.name,
                geom = tmp.geom,
                control_unit_ids = tmp.control_unit_ids,
                amp_ids = tmp.amp_ids
                FROM tmp_localized_areas tmp
                where localized_areas.id = tmp.id;
                """
            )
        )


@task(checkpoint=False)
def load_new_localized_areas(new_localized_areas: pd.DataFrame):
    """Load the output of ``extract_new_localized_areas`` task into ``localized_areas``
    table.

    Args:
        new_localized_areas (pd.DataFrame): output of ``extract_new_localized_areas`` task.
    """
    
    load(
        new_localized_areas,
        table_name="localized_areas",
        schema="public",
        db_name="monitorenv_remote",
        logger=prefect.context.get("logger"),
        how="append",
        nullable_integer_columns=[],
        pg_array_columns=["control_unit_ids", "amp_ids"],
    )



with Flow("Localized Areas") as flow:
    local_localized_areas_hashes = extract_local_localized_areas_hashes()
    remote_localized_areas_hashes = extract_remote_localized_areas_hashes()
    outer_hashes = merge_hashes(local_localized_areas_hashes, remote_localized_areas_hashes)
    inner_merged = merge_hashes(local_localized_areas_hashes, remote_localized_areas_hashes, "inner")

    ids_to_delete = select_ids_to_delete(outer_hashes)
    cond_delete = delete_required(ids_to_delete)
    with case(cond_delete, True):
        deleted_when_true = delete(ids_to_delete)
    with case(cond_delete, False):
        deleted_when_false = True
    deleted = merge(deleted_when_true, deleted_when_false)

    ids_to_update = select_ids_to_update(inner_merged)
    cond_update = update_required(ids_to_update)
    with case(cond_update, True):
        new_localized_areas = extract_new_localized_areas(ids_to_update)
        updated_when_true = update_localized_areas(new_localized_areas)
    with case(cond_update, False):
        updated_when_false = True
    updated = merge(updated_when_true, updated_when_false)

    ids_to_insert = select_ids_to_insert(outer_hashes)
    cond_insert = insert_required(ids_to_insert)
    with case(cond_insert, True):
        new_localized_areas = extract_new_localized_areas(ids_to_insert)
        inserted_when_true = load_new_localized_areas(new_localized_areas)
    with case(cond_insert, False):
        inserted_when_false = True
    inserted = merge(inserted_when_true, inserted_when_false)

flow.file_name = Path(__file__).name