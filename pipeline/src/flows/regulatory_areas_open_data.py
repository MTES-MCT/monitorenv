from datetime import datetime, timezone
import json

import geopandas as gpd
import pandas as pd
from prefect import flow, task, get_run_logger

from config import (
    GEOPLATEFORME_WORKFLOWS_LOCATION,
    IS_INTEGRATION,
    REGULATORY_AREAS_CSV_RESOURCE_ID,
    REGULATORY_AREAS_CSV_RESOURCE_TITLE,
    REGULATORY_AREAS_DATASET_ID,
    REGULATORY_AREAS_GEOPACKAGE_RESOURCE_ID,
    REGULATORY_AREAS_GEOPACKAGE_RESOURCE_TITLE,
    REGULATORY_AREAS_GEOPLATEFORME_CONFIGURATION_ID,
    REGULATORY_AREAS_GEOPLATEFORME_CSV_FILENAME,
    REGULATORY_AREAS_GEOPLATEFORME_DATASHEET_NAME,
    REGULATORY_AREAS_GEOPLATEFORME_OFFERING_ID,
    REGULATORY_AREAS_GEOPLATEFORME_PRODUCER,
    REGULATORY_AREAS_GEOPLATEFORME_SRS,
    REGULATORY_AREAS_GEOPLATEFORME_STORED_DATA_NAME,
    REGULATORY_AREAS_GEOPLATEFORME_UPLOAD_NAME,
)
from src.generic_tasks import extract
from src.shared_tasks.datagouv import (
    get_csv_file_object,
    get_geopackage_file_object,
    update_resource,
)
from src.shared_tasks.geoplateforme import (
    delete_data_store_stored_data,
    deliver_to_data_store,
    run_data_store_workflow,
    swap_configuration_stored_data,
)


@task
def extract_regulatory_areas_open_data() -> gpd.GeoDataFrame:
    return extract(
        "monitorenv_remote",
        "monitorenv/regulatory_areas_open_data.sql",
        backend="geopandas",
        geom_col="geometry",
        parse_dates=["creation", "edition", "date_fin", "date"], 
    )


@task
def get_regulatory_areas_for_csv(regulatory_areas: gpd.GeoDataFrame) -> pd.DataFrame:

    columns = [
        "id",
        "creation",
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
        "creation",
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
    for col in ["creation", "edition", "date", "date_fin"]:
        if col in gdf.columns:
            gdf[col] = gdf[col].astype("datetime64[ms]")
            
    # Convert the 'additional_ref_reg' column to JSON strings to ensure compatibility with Geopackage        
    gdf["additional_ref_reg"] = gdf["additional_ref_reg"].apply(json.dumps)
    gdf["themes"] = gdf["themes"].apply(json.dumps)
    gdf["tags"] = gdf["tags"].apply(json.dumps)

    return gdf

@task
def get_regulatory_areas_for_geoplateforme_csv(
    regulatory_areas: gpd.GeoDataFrame,
) -> pd.DataFrame:
    columns = [
        "id",
        "creation",
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

def get_stored_data_name(base_name: str) -> str:
    """
    Returns the name of the stored data to create for this run. Stored data names must
    be unique, as a new one is created at each run.
    """
    return f"{base_name}_{datetime.now(timezone.utc):%Y%m%dT%H%M%S}"


@flow(name="Monitorenv - Regulatory Areas open data")
def regulatory_areas_open_data_flow(
    dataset_id: str = REGULATORY_AREAS_DATASET_ID,
    csv_resource_id: str = REGULATORY_AREAS_CSV_RESOURCE_ID,
    gpkg_resource_id: str = REGULATORY_AREAS_GEOPACKAGE_RESOURCE_ID,
    csv_resource_title: str = REGULATORY_AREAS_CSV_RESOURCE_TITLE,
    gpkg_resource_title: str = REGULATORY_AREAS_GEOPACKAGE_RESOURCE_TITLE,
    geoplateforme_upload_name: str = REGULATORY_AREAS_GEOPLATEFORME_UPLOAD_NAME,
    geoplateforme_csv_filename: str = REGULATORY_AREAS_GEOPLATEFORME_CSV_FILENAME,
    geoplateforme_stored_data_name: str = REGULATORY_AREAS_GEOPLATEFORME_STORED_DATA_NAME,
    geoplateforme_configuration_id: str = REGULATORY_AREAS_GEOPLATEFORME_CONFIGURATION_ID,
    geoplateforme_offering_id: str = REGULATORY_AREAS_GEOPLATEFORME_OFFERING_ID,
    geoplateforme_datasheet_name: str = REGULATORY_AREAS_GEOPLATEFORME_DATASHEET_NAME,
    geoplateforme_producer: str = REGULATORY_AREAS_GEOPLATEFORME_PRODUCER,
    geoplateforme_srs: str = REGULATORY_AREAS_GEOPLATEFORME_SRS,
    is_integration: bool = IS_INTEGRATION,
):

    regulatory_areas = extract_regulatory_areas_open_data()
    logger = get_run_logger()
    logger.info(f"Number of regulatory areas extracted: {len(regulatory_areas)}")

    regulatory_areas_for_csv = get_regulatory_areas_for_csv(regulatory_areas)
    regulatory_areas_for_geoplateforme_csv = get_regulatory_areas_for_geoplateforme_csv(regulatory_areas)
    regulatory_areas_for_geopackage = get_regulatory_areas_for_geopackage(regulatory_areas)

    csv_file = get_csv_file_object(regulatory_areas_for_csv)
    geoplateforme_csv_file = get_csv_file_object(regulatory_areas_for_geoplateforme_csv)

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

    """ TODO: Replace mock_update with is_integration after test """
    deliver_to_data_store(
        upload_name=geoplateforme_upload_name,
        description="Zones réglementaires du CACEM",
        srs=geoplateforme_srs,
        files={geoplateforme_csv_filename: geoplateforme_csv_file},
        tags={"source": "monitorenv"},
        comments=None,
        mock_update=False,
    )

    stored_data_name = get_stored_data_name(geoplateforme_stored_data_name)

    run_data_store_workflow(
        workflow_file=GEOPLATEFORME_WORKFLOWS_LOCATION / "regulatory_areas_workflow.jsonc",
        step="creation-base",
        params={
            "upload_name": geoplateforme_upload_name,
            "stored_data_name": stored_data_name,
            "datasheet_name": geoplateforme_datasheet_name,
            "producer": geoplateforme_producer,
            "production_year": str(datetime.now(timezone.utc).year),
        },
        tags=None,
        comments=None,
        mock_update=False,
    )

    previous_stored_data_id = swap_configuration_stored_data(
        configuration_id=geoplateforme_configuration_id,
        offering_id=geoplateforme_offering_id,
        stored_data_name=stored_data_name,
        mock_update=False,
    )

    delete_data_store_stored_data(
        stored_data_id=previous_stored_data_id,
        mock_update=False,
    )