import geopandas as gpd
import pandas as pd
from prefect import flow, task

from config import (
    IS_INTEGRATION,
    REGULATORY_AREAS_CSV_RESOURCE_ID,
    REGULATORY_AREAS_CSV_RESOURCE_TITLE,
    REGULATORY_AREAS_DATASET_ID,
    REGULATORY_AREAS_GEOPACKAGE_RESOURCE_ID,
    REGULATORY_AREAS_GEOPACKAGE_RESOURCE_TITLE,
)
from src.generic_tasks import extract
from src.shared_tasks.datagouv import (
    get_csv_file_object,
    get_geopackage_file_object,
    update_resource,
)


@task
def extract_regulations_open_data() -> gpd.GeoDataFrame:
    return extract(
        "cacem_local",
        "cross/cacem/regulations_open_data.sql",
        backend="geopandas",
        geom_col="geometry",
        parse_dates=["edition", "date_fin", "date"],
    )


@task
def get_regulations_for_csv(regulations: gpd.GeoDataFrame) -> pd.DataFrame:

    columns = [
        "id",
        "ent_name",
        "url",
        "layer_name",
        "facade",
        "ref_reg",
        "edition",
        "source",
        "obs",
        "date",
        "date_fin",
        "validite",
        "tempo",
        "type",
        "wkt",
        "resume",
        "poly_name",
        "plan",
    ]

    return pd.DataFrame(regulations[columns])


@task
def get_regulations_for_geopackage(
    regulations: gpd.GeoDataFrame,
) -> gpd.GeoDataFrame:

    columns = [
        "id",
        "ent_name",
        "url",
        "layer_name",
        "facade",
        "ref_reg",
        "edition",
        "source",
        "obs",
        "date",
        "date_fin",
        "validite",
        "tempo",
        "type",
        "resume",
        "poly_name",
        "plan",
        "geometry",
    ]

    return regulations[columns].copy(deep=True)


@flow(name="Monitorenv - Regulations open data")
def regulations_open_data_flow(
    dataset_id: str = REGULATORY_AREAS_DATASET_ID,
    csv_resource_id: str = REGULATORY_AREAS_CSV_RESOURCE_ID,
    gpkg_resource_id: str = REGULATORY_AREAS_GEOPACKAGE_RESOURCE_ID,
    csv_resource_title: str = REGULATORY_AREAS_CSV_RESOURCE_TITLE,
    gpkg_resource_title: str = REGULATORY_AREAS_GEOPACKAGE_RESOURCE_TITLE,
    is_integration: bool = IS_INTEGRATION,
):

    regulations = extract_regulations_open_data()

    regulations_for_csv = get_regulations_for_csv(regulations)
    regulations_for_geopackage = get_regulations_for_geopackage(regulations)

    csv_file = get_csv_file_object(regulations_for_csv)
    geopackage_file = get_geopackage_file_object(
        regulations_for_geopackage, layers="facade"
    )

    update_resource(
        dataset_id=dataset_id,
        resource_id=csv_resource_id,
        resource_title=csv_resource_title,
        resource=csv_file,
        mock_update=is_integration,
    )

    update_resource(
        dataset_id=dataset_id,
        resource_id=gpkg_resource_id,
        resource_title=gpkg_resource_title,
        resource=geopackage_file,
        mock_update=is_integration,
    )
