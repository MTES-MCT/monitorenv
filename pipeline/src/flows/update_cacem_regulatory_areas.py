import pandas as pd
from prefect import flow, get_run_logger, task

from src.generic_tasks import extract

@task
def cacem_rows() -> pd.DataFrame:
    """
    Extract edition_bo from cacem

    Returns:
        pd.DataFrame: GeoDataFrame of id + edition_bo
    """
    return extract(
        db_name="cacem_local",
        query_filepath="cross/cacem/regulatory_area_edition_bo_date.sql",
    )

@task
def monitorenv_rows() -> pd.DataFrame:
    """
    Extract edition_bo from monitorenv

    Returns:
        pd.DataFrame: GeoDataFrame of id + edition_bo
    """
    return extract(
        db_name="monitorenv_remote",
        query_filepath="monitorenv/regulatory_area_edition_bo_date.sql",
    )




@flow(name="Monitorenv - Update CACEM Regulatory Areas")
def update_cacem_regulatory_areas_flow():
    logger = get_run_logger()
    
    cacem_df = cacem_rows()
    monitorenv_df = monitorenv_rows()

    merged = cacem_df.merge(
        monitorenv_df,
        on="id",
        how="inner",
        suffixes=("_cacem", "_monitorenv")
    )
    logger.info(f"merged: {merged}")
    
    # Récupérer les ids où edition_bo diffère
    different_ids = merged[
        merged['edition_bo_cacem'] != merged['edition_bo_monitorenv']
    ]['id'].tolist()
    
    logger.info(f"Nombre d'ids avec edition_bo différent: {len(different_ids)}")
    logger.info(f"Ids concernés: {different_ids}")


