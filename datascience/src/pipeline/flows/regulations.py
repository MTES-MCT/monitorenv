import pandas as pd
import prefect
from pathlib import Path
from prefect import Flow, case, task
from sqlalchemy import DDL, text
from src.db_config import create_engine
from src.pipeline.generic_tasks import delete_rows, extract, load
from src.pipeline.shared_tasks.update_queries import delete_required, insert_required, merge_hashes, select_ids_to_delete, select_ids_to_insert, select_ids_to_update, update_required
from src.pipeline.utils import psql_insert_copy
from prefect.tasks.control_flow import merge

@task(checkpoint=False)
def extract_local_hashes() -> pd.DataFrame:
    """
    Extract regulations hashes from cacem

    Returns:
        pd.DataFrame: GeoDataFrame of regulation ids + row_hash
    """
    return extract(
        db_name="cacem_local", query_filepath="cross/cacem/regulations_hashes.sql"
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
def extract_new_regulatory_areas(ids_to_update: set) -> pd.DataFrame:
    return extract(
        "cacem_local",
        "cross/cacem/regulations.sql",
        params={"ids": tuple(ids_to_update)},
    )

@task(checkpoint=False)
def update_regulatory_areas(new_regulatory_areas: pd.DataFrame):
    """Load the output of ``extract_rows_to_update`` task into ``regulations``
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
                """CREATE TEMP TABLE tmp_regulations_cacem(
                id serial,
                geom public.geometry(MultiPolygon,4326),
                entity_name character varying,
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
                row_hash text)
                ON COMMIT DROP;"""
            )
        )

        columns_to_load = [
            "id",
            "geom",
            "entity_name",
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
            "row_hash"
        ]

        logger.info("Loading to temporary table")


        new_regulatory_areas[columns_to_load].to_sql(
            "tmp_regulations_cacem",
            connection,
            if_exists="append",
            index=False,
            method=psql_insert_copy,
        )
         

        logger.info("Updating regulations_cacem from temporary table {len(new_regulatory_areas)}")
        connection.execute(
            text(
                """UPDATE regulations_cacem reg
                SET geom = tmp.geom,
                entity_name = tmp.entity_name,
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
                row_hash = tmp.row_hash
                FROM tmp_regulations_cacem tmp
                WHERE reg.id = tmp.id;
                """
            )
        )


@task(checkpoint=False)
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
        logger=prefect.context.get("logger"),
        how="append",
    )

@task(checkpoint=False)
def extract_themes_regulatory_areas() -> pd.DataFrame:
    return extract(
        db_name="cacem_local",
        query_filepath="cross/cacem/themes_regulatory_areas.sql",
    )

@task(checkpoint=False)
def load_themes_regulatory_areas(themes_regulatory_areas: pd.DataFrame):
    load(
        themes_regulatory_areas,
        table_name="themes_regulatory_areas",
        schema="public",
        db_name="monitorenv_remote",
        logger=prefect.context.get("logger"),
        how="replace"
    )

@task(checkpoint=False)
def extract_tags_regulatory_areas() -> pd.DataFrame:
    return extract(
        db_name="cacem_local",
        query_filepath="cross/cacem/tags_regulatory_areas.sql",
    )

@task(checkpoint=False)
def load_tags_regulatory_areas(tags_regulatory_areas: pd.DataFrame):
    load(
        tags_regulatory_areas,
        table_name="tags_regulatory_areas",
        schema="public",
        db_name="monitorenv_remote",
        logger=prefect.context.get("logger"),
        how="replace"
    )


with Flow("Regulations") as flow:
    local_hashes = extract_local_hashes()
    remote_hashes = extract_remote_hashes()
    outer_hashes = merge_hashes(local_hashes, remote_hashes)
    inner_merged = merge_hashes(local_hashes, remote_hashes, "inner")

    themes_regulatory_areas = extract_themes_regulatory_areas()
    loaded_themes_regulatory_areas = load_themes_regulatory_areas(themes_regulatory_areas)

    tags_regulatory_areas = extract_tags_regulatory_areas()
    loaded_tags_regulatory_areas = load_tags_regulatory_areas(tags_regulatory_areas)

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
        load_new_regulations(new_regulations)

    themes_regulatory_areas = extract_themes_regulatory_areas()
    load_themes_regulatory_areas(themes_regulatory_areas)

    tags_regulatory_areas = extract_tags_regulatory_areas()
    load_tags_regulatory_areas(tags_regulatory_areas)

flow.file_name = Path(__file__).name
