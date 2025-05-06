import pandas as pd
import prefect
from pathlib import Path
from prefect import Flow, case, task
from sqlalchemy import text
from src.db_config import create_engine
from src.pipeline.generic_tasks import delete_rows, extract, load
from src.pipeline.processing import prepare_df_for_loading
from src.pipeline.shared_tasks.update_queries import delete_required, insert_required, merge_hashes, select_ids_to_delete, select_ids_to_insert, select_ids_to_update, update_required
from src.pipeline.utils import psql_insert_copy
from src.read_query import read_query


""" Thèmes """
@task(checkpoint=False)
def extract_local_themes_hashes() -> pd.DataFrame:
    """
    Extract themes hashes from cacem

    Returns:
        pd.DataFrame: GeoDataFrame of themes ids + row_hash
    """
    return extract(
        db_name="cacem_local", query_filepath="cross/cacem/themes_hashes.sql"
    )


@task(checkpoint=False)
def extract_remote_themes_hashes() -> pd.DataFrame:
    """
    Extract themes hashes from monitorenv

    Returns:
        pd.DataFrame: GeoDataFrame of themes ids + row_hash
    """
    return extract(
        db_name="monitorenv_remote",
        query_filepath="monitorenv/themes_hashes.sql",
    )

@task(checkpoint=False)
def delete_themes(ids_to_delete: set):
    logger = prefect.context.get("logger")
    delete_rows(
        table_name="themes",
        schema="public",
        db_name="monitorenv_remote",
        table_id_column="id",
        ids_to_delete=ids_to_delete,
        logger=logger,
    )


@task(checkpoint=False)
def extract_new_themes(ids_to_update: set) -> pd.DataFrame:
    return extract(
        "cacem_local",
        "cross/cacem/themes.sql",
        params={"ids": tuple(ids_to_update)},
    )

@task(checkpoint=False)
def update_themes(new_themes: pd.DataFrame):
    """Load the output of ``extract_rows_to_update`` task into ``themes``
    table.

    Args:
        new_themes (pd.DataFrame): output of ``extract_rows_to_update`` task.
    """
    e = create_engine("monitorenv_remote")
    logger = prefect.context.get("logger")

    with e.begin() as connection:
        logger.info("Creating temporary table")
        connection.execute(
            text(
                """CREATE TEMP TABLE tmp_themes(
                id serial,
                name varchar,
                parent_id int,
                started_at timestamp,
                ended_at timestamp,
                row_hash text)
                ON COMMIT DROP;"""
            )
        )

        columns_to_load = [
            "id",
            "name",
            "parent_id",
            "started_at",
            "ended_at",
            "row_hash"
        ]

        logger.info("Loading to temporary table")

        new_themes[columns_to_load].to_sql(
            "tmp_themes",
            connection,
            if_exists="append",
            index=False,
            method=psql_insert_copy,
        )

        logger.info(f"Updating themes from temporary table {len(new_themes)}")
        connection.execute(
            text(
                """UPDATE themes
                SET name = tmp.name,
                parent_id = tmp.parent_id,
                started_at = tmp.started_at,
                ended_at = tmp.ended_at,
                row_hash = tmp.row_hash
                FROM tmp_themes tmp
                where themes.id = tmp.id;
                """
            )
        )


@task(checkpoint=False)
def load_new_themes(new_themes: pd.DataFrame):
    """Load the output of ``extract_new_themes`` task into ``themes``
    table.

    Args:
        new_themes (pd.DataFrame): output of ``extract_new_themes`` task.
    """
    load(
        new_themes,
        table_name="themes",
        schema="public",
        db_name="monitorenv_remote",
        logger=prefect.context.get("logger"),
        how="append",
    )


""" Tags """
@task(checkpoint=False)
def extract_local_tags_hashes() -> pd.DataFrame:
    """
    Extract tags hashes from cacem

    Returns:
        pd.DataFrame: GeoDataFrame of tags ids + row_hash
    """
    return extract(
        db_name="cacem_local", query_filepath="cross/cacem/tags_hashes.sql"
    )


@task(checkpoint=False)
def extract_remote_tags_hashes() -> pd.DataFrame:
    """
    Extract tags hashes from monitorenv

    Returns:
        pd.DataFrame: GeoDataFrame of tags ids + row_hash
    """
    return extract(
        db_name="monitorenv_remote",
        query_filepath="monitorenv/tags_hashes.sql",
    )

@task(checkpoint=False)
def delete_tags(ids_to_delete: set):
    logger = prefect.context.get("logger")
    delete_rows(
        table_name="tags",
        schema="public",
        db_name="monitorenv_remote",
        table_id_column="id",
        ids_to_delete=ids_to_delete,
        logger=logger,
    )


@task(checkpoint=False)
def extract_new_tags(ids_to_update: set) -> pd.DataFrame:
    return extract(
        "cacem_local",
        "cross/cacem/tags.sql",
        params={"ids": tuple(ids_to_update)},
    )

@task(checkpoint=False)
def update_tags(new_tags: pd.DataFrame):
    """Load the output of ``extract_rows_to_update`` task into ``tags``
    table.

    Args:
        new_tags (pd.DataFrame): output of ``extract_rows_to_update`` task.
    """
    e = create_engine("monitorenv_remote")
    logger = prefect.context.get("logger")

    with e.begin() as connection:
        logger.info("Creating temporary table")
        connection.execute(
            text(
                """CREATE TEMP TABLE tmp_tags(
                id serial,
                name varchar,
                parent_id int,
                started_at timestamp,
                ended_at timestamp,
                row_hash text)
                ON COMMIT DROP;"""
            )
        )

        columns_to_load = [
            "id",
            "name",
            "parent_id",
            "started_at",
            "ended_at",
            "row_hash"
        ]

        logger.info("Loading to temporary table")

        new_tags[columns_to_load].to_sql(
            "tmp_tags",
            connection,
            if_exists="append",
            index=False,
            method=psql_insert_copy,
        )

        logger.info(f"Updating tags from temporary table {len(new_tags)}")
        connection.execute(
            text(
                """UPDATE tags
                SET name = tmp.name,
                parent_id = tmp.parent_id,
                started_at = tmp.started_at,
                ended_at = tmp.ended_at,
                row_hash = tmp.row_hash
                FROM tmp_tags tmp
                where tags.id = tmp.id;
                """
            )
        )


@task(checkpoint=False)
def load_new_tags(new_tags: pd.DataFrame):
    """Load the output of ``extract_new_tags`` task into ``tags``
    table.

    Args:
        new_tags (pd.DataFrame): output of ``extract_new_tags`` task.
    """
    load(
        new_tags,
        table_name="tags",
        schema="public",
        db_name="monitorenv_remote",
        logger=prefect.context.get("logger"),
        how="append",
    )


with Flow("Themes and Tags") as flow:
    """ Thèmes """
    local_themes_hashes = extract_local_themes_hashes()
    remote_themes_hashes = extract_remote_themes_hashes()
    outer_hashes = merge_hashes(local_themes_hashes, remote_themes_hashes)
    inner_merged = merge_hashes(local_themes_hashes, remote_themes_hashes, "inner")

    themes_ids_to_delete = select_ids_to_delete(outer_hashes)
    cond_delete = delete_required(themes_ids_to_delete)
    with case(cond_delete, True):
        delete_themes(themes_ids_to_delete)

    themes_ids_to_update = select_ids_to_update(inner_merged)
    cond_update = update_required(themes_ids_to_update)
    with case(cond_update, True):
        new_themes = extract_new_themes(themes_ids_to_update)
        update_themes(new_themes)
    
    themes_ids_to_insert = select_ids_to_insert(outer_hashes)
    cond_insert = insert_required(themes_ids_to_insert)
    with case(cond_insert, True):
        new_themes = extract_new_themes(themes_ids_to_insert)
        load_new_themes(new_themes)

    
    """ Tags """
    local_tags_hashes = extract_local_tags_hashes()
    remote_tags_hashes = extract_remote_tags_hashes()
    outer_hashes = merge_hashes(local_tags_hashes, remote_tags_hashes)
    inner_merged = merge_hashes(local_tags_hashes, remote_tags_hashes, "inner")

    tags_ids_to_delete = select_ids_to_delete(outer_hashes)
    cond_delete = delete_required(tags_ids_to_delete)
    with case(cond_delete, True):
        delete_tags(tags_ids_to_delete)

    tags_ids_to_update = select_ids_to_update(inner_merged)
    cond_update = update_required(tags_ids_to_update)
    with case(cond_update, True):
        new_tags = extract_new_tags(tags_ids_to_update)
        update_tags(new_tags)
    
    tags_ids_to_insert = select_ids_to_insert(outer_hashes)
    cond_insert = insert_required(tags_ids_to_insert)
    with case(cond_insert, True):
        new_tags = extract_new_tags(tags_ids_to_insert)
        load_new_tags(new_tags)


flow.file_name = Path(__file__).name
