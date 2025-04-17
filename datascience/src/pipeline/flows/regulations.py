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
def extract_new_regulations(ids_to_update: set) -> pd.DataFrame:
    return extract(
        "cacem_local",
        "cross/cacem/regulations.sql",
        params={"ids": tuple(ids_to_update)},
    )

@task(checkpoint=False)
def update_regulations(new_regulations: pd.DataFrame):
    """Load the output of ``extract_rows_to_update`` task into ``regulations``
    table.

    Args:
        new_regulations (pd.DataFrame): output of ``extract_rows_to_update`` task.
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
                ent_name character varying,
                url character varying,
                layer_name character varying,
                facade character varying,
                ref_reg character varying,
                edition character varying,
                editeur character varying,
                source character varying,
                obs character varying,
                thematique character varying,
                date character varying,
                validite character varying,
                date_fin character varying,
                tempo character varying,
                type character varying,
                row_hash text)
                ON COMMIT DROP;"""
            )
        )

        columns_to_load = [
            "id",
            "geom",
            "ent_name",
            "url",
            "layer_name",
            "facade",
            "ref_reg",
            "edition",
            "editeur",
            "source",
            "obs",
            "thematique",
            "date",
            "validite",
            "tempo",
            "type",
            "row_hash"
        ]

        logger.info("Loading to temporary table")

        new_regulations[columns_to_load].to_sql(
            "tmp_regulations_cacem",
            connection,
            if_exists="append",
            index=False,
            method=psql_insert_copy,
        )

        logger.info(f"Updating regulations_cacem from temporary table {len(new_regulations)}")
        connection.execute(
            text(
                """UPDATE regulations_cacem reg
                SET geom = tmp.geom,
                entity_name = tmp.ent_name,
                url = tmp.url,
                layer_name = tmp.layer_name,
                facade = tmp.facade,
                ref_reg = tmp.ref_reg,
                edition = tmp.edition,
                editeur = tmp.editeur,
                source = tmp.source,
                observation = tmp.obs,
                thematique = tmp.thematique,
                date = tmp.date,
                duree_validite = tmp.validite,
                temporalite = tmp.tempo,
                type = tmp.type,
                row_hash = tmp.row_hash
                FROM tmp_regulations_cacem tmp
                where reg.id = tmp.id;
                """
            )
        )


@task(checkpoint=False)
def load_new_regulations(new_regulations: pd.DataFrame):
    """Load the output of ``extract_new_regulations`` task into ``regulations_cacem``
    table.

    Args:
        new_amp (pd.DataFrame): output of ``extract_new_regulations`` task.
    """

    # Source -> destination column mapping
    column_mapping = {
        "geom" : "geom",
        "ent_name": "entity_name",
        "url": "url",
        "layer_name": "layer_name",
        "facade": "facade",
        "ref_reg": "ref_reg",
        "edition": "edition",
        "editeur": "editeur",
        "source": "source",
        "thematique": "thematique",
        "date": "date",
        "date_fin": "date_fin",
        "type": "type",
        "row_hash": "row_hash",
        "id": "id",
        "obs": "observation",
        "validite": "duree_validite",
        "tempo": "temporalite",
    }

     # renamed les colonnes
    new_regulations_renamed = new_regulations.rename(columns=column_mapping)

    load(
        new_regulations_renamed,
        table_name="regulations_cacem",
        schema="public",
        db_name="monitorenv_remote",
        logger=prefect.context.get("logger"),
        how="append",
    )


with Flow("Regulations") as flow:
    local_hashes = extract_local_hashes()
    remote_hashes = extract_remote_hashes()
    outer_hashes = merge_hashes(local_hashes, remote_hashes)
    inner_merged = merge_hashes(local_hashes, remote_hashes, "inner")

    ids_to_delete = select_ids_to_delete(outer_hashes)
    cond_delete = delete_required(ids_to_delete)
    with case(cond_delete, True):
        delete(ids_to_delete)

    ids_to_update = select_ids_to_update(inner_merged)
    cond_update = update_required(ids_to_update)
    with case(cond_update, True):
        new_regulations = extract_new_regulations(ids_to_update)
        update_regulations(new_regulations)
    
    ids_to_insert = select_ids_to_insert(outer_hashes)
    cond_insert = insert_required(ids_to_insert)
    with case(cond_insert, True):
        new_regulations = extract_new_regulations(ids_to_insert)
        load_new_regulations(new_regulations)


flow.file_name = Path(__file__).name
