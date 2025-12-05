import geopandas as gpd
from prefect import flow, get_run_logger, task

from src.generic_tasks import extract, load


@task
def extract_competence_cross_areas() -> gpd.GeoDataFrame:
    return extract(
        db_name="cacem_local",
        query_filepath="cross/cacem/competence_cross_areas.sql",
        backend="geopandas",
        geom_col="geom",
        crs=4326,
    )


@task
def load_competence_cross_areas(competence_cross_areas: gpd.GeoDataFrame):
    load(
        competence_cross_areas,
        table_name="competence_cross_areas",
        schema="public",
        db_name="monitorenv_remote",
        logger=get_run_logger(),
        how="replace",
    )


@flow(name="Monitorenv - Competence cross areas")
def competence_cross_areas_flow():
    competence_cross_areas = extract_competence_cross_areas()
    load_competence_cross_areas(competence_cross_areas)
