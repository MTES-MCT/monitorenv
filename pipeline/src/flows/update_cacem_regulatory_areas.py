import pandas as pd
from src.db_config import create_engine
from src.utils import psql_insert_copy
from prefect import flow, get_run_logger, task
from sqlalchemy import text

from config import (
    IS_INTEGRATION
)

from src.shared_tasks.update_queries import (
    merge_hashes,
    select_ids_to_update,
    update_required,
)

from src.generic_tasks import extract

@task
def extract_cacem_regulatory_areas_hashes() -> pd.DataFrame:
    """
    Extract regulatory areas hashes from cacem

    Returns:
        pd.DataFrame: GeoDataFrame of regulatory area ids + row_hash
    """
    return extract(
        db_name="cacem_local",
        query_filepath="cross/cacem/regulatory_areas_hashes_for_cacem.sql",
    )

@task
def extract_monitorenv_regulatory_areas_hashes() -> pd.DataFrame:
    """
    Extract regulatory areas hashes from monitorenv

    Returns:
        pd.DataFrame: GeoDataFrame of regulatory area ids + row_hash
    """
    return extract(
        db_name="monitorenv_remote",
        query_filepath="monitorenv/regulatory_areas_hashes_for_cacem.sql",
    )

@task
def extract_env_regulatory_areas(ids_to_update: set) -> pd.DataFrame:
    return extract(
        "monitorenv_remote",
        "monitorenv/regulatory_areas.sql",
        params={"ids": tuple(ids_to_update)},
    )

@task
def update_cacem_regulatory_areas(new_regulatory_areas: pd.DataFrame):
    """Load the output of ``extract_rows_to_update`` task into ``regulatory_areas``
    table.

    Args:
        new_regulatory_areas (pd.DataFrame): output of ``extract_rows_to_update`` task.
    """
    e = create_engine("cacem_local")
    logger = get_run_logger()

    with e.begin() as connection:
        logger.info("Creating temporary table")
        connection.execute(
            text(
                """CREATE TEMP TABLE tmp_regulatory_areas(
                    id                      serial PRIMARY KEY,
                    url                     character varying,
                    layer_name              character varying,
                    facade                  character varying,
                    creation                TIMESTAMP,
                    edition_bo              TIMESTAMP,
                    editeur                 character varying,
                    source                  character varying,
                    observation             character varying,
                    thematique              character varying,
                    date                    TIMESTAMP,
                    duree_validite          character varying,
                    date_fin                TIMESTAMP,
                    temporalite             character varying,
                    type                    character varying,
                    resume                  text,
                    poly_name               text,
                    plan                    text,
                    authorization_periods   character varying,
                    prohibition_periods     character varying,
                    additional_ref_reg      jsonb,
                    themes                  character varying,
                    tags                    character varying
                )
                ON COMMIT DROP;"""
            )
        )

        columns_to_load = [
           "id",
           "url",
           "layer_name",
           "facade",
           "creation",
           "edition_bo",
           "editeur",
           "source",
           "observation",
           "thematique",
           "date",
           "duree_validite",
           "date_fin",
           "temporalite",
           "type",
           "resume",
           "poly_name",
           "plan",
           "authorization_periods",
           "prohibition_periods",
           "additional_ref_reg",
           "themes",
           "tags",
        ]

        logger.info("Loading to temporary table")

        new_regulatory_areas[columns_to_load].to_sql(
            "tmp_regulatory_areas",
            connection,
            if_exists="append",
            index=False,
            method=psql_insert_copy,
        )

        logger.info(
            f"Updating prod.reg_cacem from temporary table {len(new_regulatory_areas)}"
        )
        connection.execute(
            text(
                """UPDATE prod.reg_cacem reg
                SET url = tmp.url,
                layer_name = tmp.layer_name,
                facade = tmp.facade,
                creation = tmp.creation,
                edition_bo = tmp.edition_bo,
                editeur = tmp.editeur,
                source = tmp.source,
                observation = tmp.observation,
                thematique = tmp.thematique,
                date = tmp.date,
                duree_validite = tmp.duree_validite,
                date_fin = tmp.date_fin,
                temporalite = tmp.temporalite,
                type = tmp.type,
                resume = tmp.resume,
                poly_name = tmp.poly_name,
                plan = tmp.plan,
                authorization_periods = tmp.authorization_periods,
                prohibition_periods = tmp.prohibition_periods,
                additional_ref_reg = tmp.additional_ref_reg,
                themes = tmp.themes,
                tags = tmp.tags
                FROM tmp_regulatory_areas tmp
                WHERE reg.id = tmp.id;
                """
            )
        )



@flow(name="Monitorenv - Update CACEM Regulatory Areas")
def update_cacem_regulatory_areas_flow(
    is_integration: bool = IS_INTEGRATION,
):
    logger = get_run_logger()
    if is_integration:
        logger.info("Running in integration mode - no update will be performed")
        return
    

    cacem_hashes = extract_cacem_regulatory_areas_hashes()
    monitor_env_hashes = extract_monitorenv_regulatory_areas_hashes()

    inner_merged = merge_hashes(cacem_hashes, monitor_env_hashes, "inner")

    ids_to_update = select_ids_to_update(inner_merged)
    logger.info(f"Ids to update: {ids_to_update}")
    cond_update = update_required(ids_to_update)
    if cond_update is True:
        new_regulatory_areas = extract_env_regulatory_areas(ids_to_update)
        update_cacem_regulatory_areas(new_regulatory_areas)


