import pandas as pd
import prefect
from pathlib import Path
from prefect import Flow, case, task
from sqlalchemy import text
from src.db_config import create_engine
from src.pipeline.generic_tasks import extract, load
from src.pipeline.shared_tasks.update_queries import insert_required, merge_hashes, select_ids_to_insert, select_ids_to_update, update_required
from src.pipeline.utils import psql_insert_copy
from src.read_query import read_query


""" Thèmes """
@task(checkpoint=False)
def extract_local_themes() -> pd.DataFrame:
    """
    Extract themes from cacem

    Returns:
        pd.DataFrame: GeoDataFrame of themes
    """
    return extract(
        db_name="cacem_local", query_filepath="cross/cacem/themes.sql"
    )


@task(checkpoint=False)
def extract_remote_themes() -> pd.DataFrame:
    """
    Extract themes from monitorenv

    Returns:
        pd.DataFrame: GeoDataFrame of themes
    """
    return extract(
        db_name="monitorenv_remote",
        query_filepath="monitorenv/themes.sql",
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
                ended_at timestamp)
                ON COMMIT DROP;"""
            )
        )

        columns_to_load = [
            "id",
            "name",
            "parent_id",
            "started_at",
            "ended_at",
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
                ended_at = tmp.ended_at
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
def extract_local_tags() -> pd.DataFrame:
    """
    Extract tags from cacem

    Returns:
        pd.DataFrame: GeoDataFrame of tags
    """
    return extract(
        db_name="cacem_local", query_filepath="cross/cacem/tags.sql"
    )


@task(checkpoint=False)
def extract_remote_tags() -> pd.DataFrame:
    """
    Extract tags from monitorenv

    Returns:
        pd.DataFrame: GeoDataFrame of tags
    """
    return extract(
        db_name="monitorenv_remote",
        query_filepath="monitorenv/tags.sql",
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
                ended_at timestamp)
                ON COMMIT DROP;"""
            )
        )

        columns_to_load = [
            "id",
            "name",
            "parent_id",
            "started_at",
            "ended_at",
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
                ended_at = tmp.ended_at
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
    local_themes = extract_local_themes()
    remote_themes = extract_remote_themes()
    outer = merge_hashes(local_themes, remote_themes)
    inner_merged = merge_hashes(local_themes, remote_themes, "inner")

    themes_ids_to_update = select_ids_to_update(inner_merged)
    cond_update = update_required(themes_ids_to_update)
    with case(cond_update, True):
        new_themes = extract_new_themes(themes_ids_to_update)
        update_themes(new_themes)
    
    themes_ids_to_insert = select_ids_to_insert(outer)
    cond_insert = insert_required(themes_ids_to_insert)
    with case(cond_insert, True):
        new_themes = extract_new_themes(themes_ids_to_insert)
        load_new_themes(new_themes)

    
    """ Tags """
    local_tags = extract_local_tags()
    remote_tags = extract_remote_tags()
    outer = merge_hashes(local_tags, remote_tags)
    inner_merged = merge_hashes(local_tags, remote_tags, "inner")

    tags_ids_to_update = select_ids_to_update(inner_merged)
    cond_update = update_required(tags_ids_to_update)
    with case(cond_update, True):
        new_tags = extract_new_tags(tags_ids_to_update)
        update_tags(new_tags)
    
    tags_ids_to_insert = select_ids_to_insert(outer)
    cond_insert = insert_required(tags_ids_to_insert)
    with case(cond_insert, True):
        new_tags = extract_new_tags(tags_ids_to_insert)
        load_new_tags(new_tags)


flow.file_name = Path(__file__).name
