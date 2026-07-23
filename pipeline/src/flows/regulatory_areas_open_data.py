import json

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
def extract_regulatory_areas_open_data() -> gpd.GeoDataFrame:
    return extract(
        "cacem_local",
        "cross/cacem/regulatory_areas_open_data.sql",
        backend="geopandas",
        geom_col="geometry",
        parse_dates=["edition", "date_fin", "date"],
    )


@task
def get_regulatory_areas_for_csv(regulatory_areas: gpd.GeoDataFrame) -> pd.DataFrame:

    columns = [
        "id",
        "url",
        "layer_name",
        "facade",
        "ref_reg",
        "edition",
        "source",
        "observation",
        "date",
        "date_fin",
        "type",
        "wkt",
        "resume",
        "poly_name",
        "plan",
        "authorization_periods",
        "prohibition_periods",
        "additional_ref_reg",
        "themes",
        "tags",
        "location"
    ]

    return pd.DataFrame(regulatory_areas[columns])


@task
def get_regulatory_areas_for_geopackage(
    regulatory_areas: gpd.GeoDataFrame,
) -> gpd.GeoDataFrame:

    columns = [
        "id",
        "url",
        "layer_name",
        "facade",
        "ref_reg",
        "edition",
        "source",
        "observation",
        "date",
        "date_fin",
        "type",
        "resume",
        "poly_name",
        "plan",
        "geometry",
        "authorization_periods",
        "prohibition_periods",
        "additional_ref_reg",
        "themes",
        "tags",
        "location"
    ]

    gdf = regulatory_areas[columns].copy(deep=True)
    
    # Normalize date columns to ensure they are in the correct format for the Geopackage
    for col in ["edition", "date", "date_fin"]:
        if col in gdf.columns:
            gdf[col] = gdf[col].astype("datetime64[ms]")
            
    # Convert the 'additional_ref_reg' column to JSON strings to ensure compatibility with Geopackage        
    gdf["additional_ref_reg"] = gdf["additional_ref_reg"].apply(json.dumps)

    return gdf


@flow(name="Monitorenv - Regulatory Areas open data")
def regulatory_areas_open_data_flow(
    dataset_id: str = REGULATORY_AREAS_DATASET_ID,
    csv_resource_id: str = REGULATORY_AREAS_CSV_RESOURCE_ID,
    gpkg_resource_id: str = REGULATORY_AREAS_GEOPACKAGE_RESOURCE_ID,
    csv_resource_title: str = REGULATORY_AREAS_CSV_RESOURCE_TITLE,
    gpkg_resource_title: str = REGULATORY_AREAS_GEOPACKAGE_RESOURCE_TITLE,
    is_integration: bool = IS_INTEGRATION,
):

    regulatory_areas = extract_regulatory_areas_open_data()

    regulatory_areas_for_csv = get_regulatory_areas_for_csv(regulatory_areas)
    regulatory_areas_for_geopackage = get_regulatory_areas_for_geopackage(regulatory_areas)

    csv_file = get_csv_file_object(regulatory_areas_for_csv)
    geopackage_file = get_geopackage_file_object(
        regulatory_areas_for_geopackage, layers="facade"
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
