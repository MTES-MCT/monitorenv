import pandas as pd
from prefect import flow, get_run_logger, task
from sqlalchemy import text

from src.db_config import create_engine
from src.generic_tasks import extract, load
from src.shared_tasks.update_queries import (
    insert_required,
    merge_hashes,
    select_ids_to_insert,
    select_ids_to_update,
    update_required,
)
from src.utils import psql_insert_copy

""" Thèmes """


@task
def extract_local_themes() -> pd.DataFrame:
    """
    Extract themes from cacem

    Returns:
        pd.DataFrame: GeoDataFrame of themes + row_hash
    """
    return extract(
        db_name="cacem_local", query_filepath="cross/cacem/themes_hashes.sql"
    )


@task
def extract_remote_themes() -> pd.DataFrame:
    """
    Extract themes from monitorenv

    Returns:
        pd.DataFrame: GeoDataFrame of themes id + row_hash
    """
    return extract(
        db_name="monitorenv_remote",
        query_filepath="monitorenv/themes_hashes.sql",
    )


@task
def extract_new_themes(ids_to_update: set) -> pd.DataFrame:
    return extract(
        "cacem_local",
        "cross/cacem/themes.sql",
        params={"ids": tuple(ids_to_update)},
    )


@task
def update_themes(new_themes: pd.DataFrame):
    """Load the output of ``extract_rows_to_update`` task into ``themes``
    table.

    Args:
        new_themes (pd.DataFrame): output of ``extract_rows_to_update`` task.
    """
    e = create_engine("monitorenv_remote")
    logger = get_run_logger()

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
                control_plan_themes_id int,
                control_plan_sub_themes_id int,
                control_plan_tags_id int,
                reportings_control_plan_sub_themes_id int)
                ON COMMIT DROP;"""
            )
        )

        columns_to_load = [
            "id",
            "name",
            "parent_id",
            "started_at",
            "ended_at",
            "control_plan_themes_id",
            "control_plan_sub_themes_id",
            "control_plan_tags_id",
            "reportings_control_plan_sub_themes_id",
        ]

        int_columns = [
            "id",
            "parent_id",
            "control_plan_themes_id",
            "control_plan_sub_themes_id",
            "control_plan_tags_id",
            "reportings_control_plan_sub_themes_id",
        ]
        for col in int_columns:
            new_themes[col] = new_themes[col].astype("Int64")

        logger.info("Loading to temporary table")

        new_themes[columns_to_load].to_sql(
            "tmp_themes",
            connection,
            if_exists="append",
            index=False,
            method=psql_insert_copy,
        )

        logger.info("Updating themes from temporary table {len(new_themes)}")
        connection.execute(
            text(
                """UPDATE themes
                SET name = tmp.name,
                parent_id = tmp.parent_id,
                started_at = tmp.started_at,
                ended_at = tmp.ended_at,
                control_plan_themes_id = tmp.control_plan_themes_id,
                control_plan_sub_themes_id = tmp.control_plan_sub_themes_id,
                control_plan_tags_id = tmp.control_plan_tags_id,
                reportings_control_plan_sub_themes_id = tmp.reportings_control_plan_sub_themes_id
                FROM tmp_themes tmp
                where themes.id = tmp.id;
                """
            )
        )


@task
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
        logger=get_run_logger(),
        how="append",
        nullable_integer_columns=[
            "parent_id",
            "control_plan_themes_id",
            "control_plan_sub_themes_id",
            "control_plan_tags_id",
            "reportings_control_plan_sub_themes_id",
        ],
    )


""" Tags """


@task
def extract_local_tags() -> pd.DataFrame:
    """
    Extract tags from cacem

    Returns:
        pd.DataFrame: GeoDataFrame of tags + row_hash
    """
    return extract(
        db_name="cacem_local", query_filepath="cross/cacem/tags_hashes.sql"
    )


@task
def extract_remote_tags() -> pd.DataFrame:
    """
    Extract tags from monitorenv

    Returns:
        pd.DataFrame: GeoDataFrame of tags
    """
    return extract(
        db_name="monitorenv_remote",
        query_filepath="monitorenv/tags_hashes.sql",
    )


@task
def extract_new_tags(ids_to_update: set) -> pd.DataFrame:
    return extract(
        "cacem_local",
        "cross/cacem/tags.sql",
        params={"ids": tuple(ids_to_update)},
    )


@task
def update_tags(new_tags: pd.DataFrame):
    """Load the output of ``extract_rows_to_update`` task into ``tags``
    table.

    Args:
        new_tags (pd.DataFrame): output of ``extract_rows_to_update`` task.
    """
    e = create_engine("monitorenv_remote")
    logger = get_run_logger()

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

        int_columns = [
            "id",
            "parent_id",
        ]
        for col in int_columns:
            new_tags[col] = new_tags[col].astype("Int64")

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


@task
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
        logger=get_run_logger(),
        how="append",
        nullable_integer_columns=["parent_id"],
    )


@flow(name="Themes and Tags")
def themes_and_tags_flow():
    """ Thèmes """
    local_themes = extract_local_themes()
    remote_themes = extract_remote_themes()
    outer = merge_hashes(local_themes, remote_themes)
    inner_merged = merge_hashes(local_themes, remote_themes, "inner")

    themes_ids_to_update = select_ids_to_update(inner_merged)
    cond_update = update_required(themes_ids_to_update)
    if cond_update is True:
        new_themes = extract_new_themes(themes_ids_to_update)
        update_themes(new_themes)

    themes_ids_to_insert = select_ids_to_insert(outer)
    cond_insert = insert_required(themes_ids_to_insert)
    if cond_insert is True:
        new_themes = extract_new_themes(themes_ids_to_insert)
        load_new_themes(new_themes)

    """ Tags """
    local_tags = extract_local_tags()
    remote_tags = extract_remote_tags()
    outer = merge_hashes(local_tags, remote_tags)
    inner_merged = merge_hashes(local_tags, remote_tags, "inner")

    tags_ids_to_update = select_ids_to_update(inner_merged)
    cond_update = update_required(tags_ids_to_update)
    if cond_update is True:
        new_tags = extract_new_tags(tags_ids_to_update)
        update_tags(new_tags)

    tags_ids_to_insert = select_ids_to_insert(outer)
    cond_insert = insert_required(tags_ids_to_insert)
    if cond_insert is True:
        new_tags = extract_new_tags(tags_ids_to_insert)
        load_new_tags(new_tags)
