
from pathlib import Path
import geopandas as gpd
import prefect
from prefect import Flow, task

from src.pipeline.generic_tasks import extract, load

@task(checkpoint=False)
def extract_marine_cultures_85() -> gpd.GeoDataFrame:
    return extract(
        db_name="cacem_local",
        query_filepath="cross/cacem/marine_cultures_85.sql",
        backend="geopandas",
        geom_col="geom",
        crs=4326,
    )

@task(checkpoint=False)
def load_marine_cultures_85(marine_cultures_85: gpd.GeoDataFrame):
    load(
        marine_cultures_85,
        table_name="marine_cultures_85",
        schema="public",
        db_name="monitorenv_remote",
        logger=prefect.context.get("logger"),
        how="replace",
    )

@task(checkpoint=False)
def extract_marine_cultures_33() -> gpd.GeoDataFrame:
    return extract(
        db_name="cacem_local",
        query_filepath="cross/cacem/marine_cultures_33.sql",
        backend="geopandas",
        geom_col="geom",
        crs=4326,
    )

@task(checkpoint=False)
def load_marine_cultures_33(marine_cultures_33: gpd.GeoDataFrame):
    load(
        marine_cultures_33,
        table_name="marine_cultures_33",
        schema="public",
        db_name="monitorenv_remote",
        logger=prefect.context.get("logger"),
        how="replace",
    )

@task(checkpoint=False)
def extract_gulf_of_lion_marine_park() -> gpd.GeoDataFrame:
    return extract(
        db_name="cacem_local",
        query_filepath="cross/cacem/gulf_of_lion_marine_park.sql",
        backend="geopandas",
        geom_col="geom",
        crs=4326,
    )

@task(checkpoint=False)
def load_gulf_of_lion_marine_park(gulf_of_lion_marine_park: gpd.GeoDataFrame):
    load(
        gulf_of_lion_marine_park,
        table_name="gulf_of_lion_marine_park",
        schema="public",
        db_name="monitorenv_remote",
        logger=prefect.context.get("logger"),
        how="replace",
    )


@task(checkpoint=False)
def extract_cerbere_banyuls_national_reserve() -> gpd.GeoDataFrame:
    return extract(
        db_name="cacem_local",
        query_filepath="cross/cacem/cerbere_banyuls_national_reserve.sql",
        backend="geopandas",
        geom_col="geom",
        crs=4326,
    )

@task(checkpoint=False)
def load_cerbere_banyuls_national_reserve(cerbere_banyuls_national_reserve: gpd.GeoDataFrame):
    load(
        cerbere_banyuls_national_reserve,
        table_name="cerbere_banyuls_national_reserve",
        schema="public",
        db_name="monitorenv_remote",
        logger=prefect.context.get("logger"),
        how="replace",
    )

@task(checkpoint=False)
def extract_moeze_oleron_national_reserve() -> gpd.GeoDataFrame:
    return extract(
        db_name="cacem_local",
        query_filepath="cross/cacem/moeze_oleron_national_reserve.sql",
        backend="geopandas",
        geom_col="geom",
        crs=4326,
    )

@task(checkpoint=False)
def load_moeze_oleron_national_reserve(moeze_oleron_national_reserve: gpd.GeoDataFrame):
    load(
        moeze_oleron_national_reserve,
        table_name="moeze_oleron_national_reserve",
        schema="public",
        db_name="monitorenv_remote",
        logger=prefect.context.get("logger"),
        how="replace",
    )


with Flow("Localized Areas") as flow:
      
      marine_cultures_85 = extract_marine_cultures_85()
      load_marine_cultures_85(marine_cultures_85)

      marine_cultures_33 = extract_marine_cultures_33()
      load_marine_cultures_33(marine_cultures_33)

      gulf_of_lion_marine_park = extract_gulf_of_lion_marine_park()
      load_gulf_of_lion_marine_park(gulf_of_lion_marine_park)

      cerbere_banyuls_national_reserve = extract_cerbere_banyuls_national_reserve()
      load_cerbere_banyuls_national_reserve(cerbere_banyuls_national_reserve)

      moeze_oleron_national_reserve = extract_moeze_oleron_national_reserve()
      load_moeze_oleron_national_reserve(moeze_oleron_national_reserve)

flow.file_name = Path(__file__).name