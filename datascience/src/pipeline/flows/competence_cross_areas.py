import geopandas as gpd
import prefect
from pathlib import Path
from prefect import Flow, task
from src.pipeline.generic_tasks import extract, load


@task(checkpoint=False)
def extract_competence_cross_areas() -> gpd.GeoDataFrame:
    return extract(
        db_name="cacem_local",
        query_filepath="cross/cacem/competence_cross_areas.sql",
        backend="geopandas",
        geom_col="geom",
        crs=4326,
    )


@task(checkpoint=False)
def load_competence_cross_areas(competence_cross_areas: gpd.GeoDataFrame):
    load(
        competence_cross_areas,
        table_name="competence_cross_areas",
        schema="public",
        db_name="monitorenv_remote",
        logger=prefect.context.get("logger"),
        how="replace",
    )


with Flow("Competence cross areas") as flow:
    competence_cross_areas = extract_competence_cross_areas()
    load_competence_cross_areas(competence_cross_areas)

flow.file_name = Path(__file__).name
