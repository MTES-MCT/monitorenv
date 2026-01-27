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
    Extract regulations hashes from cacem

    Returns:
        pd.DataFrame: GeoDataFrame of regulation ids + row_hash
    """
    return extract(
        db_name="cacem_local",
        query_filepath="cross/cacem/regulations_hashes.sql",
    )


@task
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


@task
def delete(ids_to_delete: set):
    logger = get_run_logger()
    delete_rows(
        table_name="regulations_cacem",
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
        "cross/cacem/regulations.sql",
        params={"ids": tuple(ids_to_update)},
    )


@task
def update_regulatory_areas(new_regulatory_areas: pd.DataFrame):
    """Load the output of ``extract_rows_to_update`` task into ``regulations``
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
                """CREATE TEMP TABLE tmp_regulations_cacem(
                id serial,
                geom public.geometry(MultiPolygon,4326),
                url character varying,
                layer_name character varying,
                facade character varying,
                ref_reg character varying,
                edition character varying,
                editeur character varying,
                source character varying,
                observation character varying,
                thematique character varying,
                date character varying,
                duree_validite character varying,
                date_fin character varying,
                temporalite character varying,
                type character varying,
                plan character varying,
                poly_name character varying,
                resume text,
                row_hash text)
                ON COMMIT DROP;"""
            )
        )

        columns_to_load = [
            "id",
            "geom",
            "url",
            "layer_name",
            "facade",
            "ref_reg",
            "edition",
            "editeur",
            "source",
            "observation",
            "thematique",
            "date",
            "duree_validite",
            "temporalite",
            "type",
            "plan",
            "poly_name",
            "resume",
            "row_hash",
        ]

        logger.info("Loading to temporary table")

        new_regulatory_areas[columns_to_load].to_sql(
            "tmp_regulations_cacem",
            connection,
            if_exists="append",
            index=False,
            method=psql_insert_copy,
        )

        logger.info(
            "Updating regulations_cacem from temporary table {len(new_regulatory_areas)}"
        )
        connection.execute(
            text(
                """UPDATE regulations_cacem reg
                SET geom = tmp.geom,
                url = tmp.url,
                layer_name = tmp.layer_name,
                facade = tmp.facade,
                ref_reg = tmp.ref_reg,
                edition = tmp.edition,
                editeur = tmp.editeur,
                source = tmp.source,
                observation = tmp.observation,
                thematique = tmp.thematique,
                date = tmp.date,
                duree_validite = tmp.duree_validite,
                temporalite = tmp.temporalite,
                type = tmp.type,
                plan = tmp.plan,
                poly_name = tmp.poly_name,
                resume = tmp.resume,
                row_hash = tmp.row_hash
                FROM tmp_regulations_cacem tmp
                WHERE reg.id = tmp.id;
                """
            )
        )


@task
def load_new_regulations(new_regulatory_areas: pd.DataFrame):
    """Load the output of ``extract_new_regulations`` task into ``regulations_cacem``
    table.

    Args:
        new_amp (pd.DataFrame): output of ``extract_new_regulations`` task.
    """

    load(
        new_regulatory_areas,
        table_name="regulations_cacem",
        schema="public",
        db_name="monitorenv_remote",
        logger=get_run_logger(),
        how="append",
    )


@task
def extract_themes_regulatory_areas() -> pd.DataFrame:
    return extract(
        db_name="cacem_local",
        query_filepath="cross/cacem/themes_regulatory_areas.sql",
    )


@task
def load_themes_regulatory_areas(themes_regulatory_areas: pd.DataFrame):
    load(
        themes_regulatory_areas,
        table_name="themes_regulatory_areas",
        schema="public",
        db_name="monitorenv_remote",
        logger=get_run_logger(),
        how="replace",
    )


@task
def extract_tags_regulatory_areas() -> pd.DataFrame:
    return extract(
        db_name="cacem_local",
        query_filepath="cross/cacem/tags_regulatory_areas.sql",
    )


@task
def load_tags_regulatory_areas(tags_regulatory_areas: pd.DataFrame):
    load(
        tags_regulatory_areas,
        table_name="tags_regulatory_areas",
        schema="public",
        db_name="monitorenv_remote",
        logger=get_run_logger(),
        how="replace",
    )


@flow(name="Monitorenv - Regulations")
def regulations_flow():
    local_hashes = extract_local_hashes()
    remote_hashes = extract_remote_hashes()
    outer_hashes = merge_hashes(local_hashes, remote_hashes)
    inner_merged = merge_hashes(local_hashes, remote_hashes, "inner")

    themes_regulatory_areas = extract_themes_regulatory_areas()
    load_themes_regulatory_areas(themes_regulatory_areas)

    tags_regulatory_areas = extract_tags_regulatory_areas()
    load_tags_regulatory_areas(tags_regulatory_areas)

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
        load_new_regulations(new_regulations)
