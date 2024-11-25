from logging import Logger
import pandas as pd
import prefect
from pathlib import Path
from prefect import Flow, case, task
from sqlalchemy import text
from src.db_config import create_engine
from src.pipeline.generic_tasks import delete_rows, extract, load
from src.pipeline.utils import psql_insert_copy


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
def merge_hashes(
    local_hashes: pd.DataFrame, remote_hashes: pd.DataFrame
) -> pd.DataFrame:
    return pd.merge(local_hashes, remote_hashes, on="id", how="outer")


@task(checkpoint=False)
def select_ids_to_update(hashes: pd.DataFrame) -> set:
    ids_to_update = set(
        hashes.loc[
            (hashes.cacem_row_hash.notnull())
            & (hashes.cacem_row_hash != hashes.monitorenv_row_hash),
            "id",
        ]
    )

    return ids_to_update


@task(checkpoint=False)
def select_ids_to_delete(hashes: pd.DataFrame) -> set:
    return set(hashes.loc[hashes.cacem_row_hash.isna(), "id"])


@task(checkpoint=False)
def update_required(ids_to_update: set) -> bool:
    logger = prefect.context.get("logger")
    n = len(ids_to_update)
    if n > 0:
        logger.info(f"Found {n} row(s) to add or update.")
        res = True
    else:
        logger.info("No row to add or update was found.")
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


# @task(checkpoint=False)
# def load_new_regulations(new_regulations: pd.DataFrame):
#     """Load the output of ``extract_rows_to_update`` task into ``regulations``
#     table.

#     Args:
#         new_regulations (pd.DataFrame): output of ``extract_rows_to_update`` task.
#     """
#     load(
#         new_regulations,
#         table_name="regulations_cacem",
#         schema="public",
#         db_name="monitorenv_remote",
#         logger=prefect.context.get("logger"),
#         how="upsert",
#         table_id_column="id",
#         df_id_column="id",
#     )

@task(checkpoint=False)
def load_new_regulations(new_regulations: pd.DataFrame):
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
                )
                ON COMMIT DROP;"""
            )
        )

        # a voir pour les geometries
        # new_regulations = prepare_df_for_loading(
        #     new_regulations,
        #     logger,
        # )

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
        ]

        logger.info("Loading to temporary table")

        new_regulations[columns_to_load].to_sql(
            "tmp_regulations_cacem",
            connection,
            if_exists="append",
            index=False,
            method=psql_insert_copy,
        )

        logger.info("Updating regulations_cacem from temporary table")
        connection.execute(
            text(
                """UPDATE public.regulations_cacem reg
                SET reg.geom = tmp.geom,
                reg.entity_name = tmp.entity_name,
                reg.url = tmp.url,
                reg.layer_name = tmp.layer_name,
                reg.facade = tmp.facade,
                reg.ref_reg = tmp.ref_reg,
                reg.edition = tmp.edition,
                reg.editeur = tmp.editeur,
                reg.source = tmp.source,
                reg.observation = tmp.observation,
                reg.thematique = tmp.thematique,
                reg.date = tmp.date,
                reg.duree_validite = tmp.duree_validite,
                reg.temporalite = tmp.temporalite,
                reg.type = tmp.type,
                FROM tmp_regulations_cacem tmp
                where reg.id = tmp.id;"""
            ),
        )


with Flow("Regulations") as flow:
    local_hashes = extract_local_hashes()
    remote_hashes = extract_remote_hashes()
    hashes = merge_hashes(local_hashes, remote_hashes)

    ids_to_delete = select_ids_to_delete(hashes)
    cond_delete = delete_required(ids_to_delete)
    with case(cond_delete, True):
        delete(ids_to_delete)

    ids_to_update = select_ids_to_update(hashes)
    cond_update = update_required(ids_to_update)
    with case(cond_update, True):
        new_regulations = extract_new_regulations(ids_to_update)
        load_new_regulations(new_regulations)

flow.file_name = Path(__file__).name
