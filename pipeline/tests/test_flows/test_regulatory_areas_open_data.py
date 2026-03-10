from io import BytesIO
from unittest.mock import patch

import geopandas as gpd
import pandas as pd
import pytest

from src.flows.regulatory_areas_open_data import (
    extract_regulatory_areas_open_data,
    get_regulatory_areas_for_csv,
    get_regulatory_areas_for_geopackage,
    regulatory_areas_open_data_flow,
)
from tests.test_shared_tasks.test_datagouv import make_square_multipolygon
from src.helpers.normalize_gdf import normalize_gdf

@pytest.fixture
def regulatory_areas_open_data():
    return gpd.GeoDataFrame(
        {
            "id": [
                1
            ],
            "url": ["url1",],
            "layer_name": [
                "layer_name1",
            ],
            "facade": [
                "MED",
            ],
            "ref_reg": [
                "ref_reg1_edited",
            ],
            "edition": [
                pd.to_datetime("2025-01-10"),
            ],
            "editeur": [
                "editeur1",
            ],
            "source": [
                "source1",
            ],
            "thematique": ["thematique1",],
            "observation": [
                "obs1",
            ],
            "date": [
                pd.to_datetime("2025-01-01"),
            ],
            "date_fin": [
                pd.to_datetime("2025-12-31"),
            ],
            "duree_validite": [
                "validite1",
            ],
            "temporalite": [
                "tempo1",
            ],
            "type": [
                "type1",
            ],
            "wkt": [
                "MULTIPOLYGON(((0 0,10 0,10 10,0 10,0 0)))",
            ],
            "resume": [
                "resume1",
            ],
            "poly_name": [
                "poly_name1",
            ],
            "plan": [
                "plan1",
            ],
            "geometry": [
                make_square_multipolygon(0, 0, 10, 10),
            ],
            "authorization_periods": [
                "période d'autorisation1",
            ],
            "prohibition_periods": [
                "période de prohibition1",
            ],
            "additional_ref_reg": [
                None,
            ],
            "themes": [
                "theme1,theme2",
            ],
            "tags": [
                "tag1,tag2",
            ],
        },
    )


@pytest.fixture
def regulatory_areas_for_csv():
    return pd.DataFrame(
        {
            "id": [
                1,
            ],
            "url": ["url1",],
            "layer_name": [
                "layer_name1",
            ],
            "facade": [
                "MED",
            ],
            "ref_reg": [
                "ref_reg1_edited",
            ],
            "edition": [
                pd.to_datetime("2025-01-10 00:00:00"),
            ],
            "source": [
                "source1",
            ],
            "observation": [
                "obs1",
            ],
            "date": [
                pd.to_datetime("2025-01-01"),
            ],
            "date_fin": [
                pd.to_datetime("2025-12-31"),
            ],
            "duree_validite": [
                "validite1",
            ],
            "temporalite": [
                "tempo1",
            ],
            "type": [
                "type1",
            ],
            "wkt": [
                "MULTIPOLYGON(((0 0,10 0,10 10,0 10,0 0)))",
            ],
            "resume": [
                "resume1",
            ],
            "poly_name": [
                "poly_name1",
            ],
            "plan": [
                "plan1",
            ],
            "authorization_periods": [
                "période d'autorisation1",
            ],
            "prohibition_periods": [
                "période de prohibition1",
            ],
            "additional_ref_reg": [
                None,
            ],
            "themes": [
                "theme1,theme2",
            ],
            "tags": [
                "tag1,tag2",
            ],
        },
    )


@pytest.fixture
def regulatory_areas_for_geopackage():
    return gpd.GeoDataFrame(
        {
            "id": [
                1,
            ],
            "url": ["url1",],
            "layer_name": [
                "layer_name1",
            ],
            "facade": [
                "MED",
            ],
            "ref_reg": [
                "ref_reg1_edited",
            ],
            "edition": [
                pd.to_datetime("2025-01-10"),
            ],
            "source": [
                "source1",
            ],
            "observation": [
                "obs1",
            ],
            "date": [
                pd.to_datetime("2025-01-01"),
            ],
            "date_fin": [
                pd.to_datetime("2025-12-31"),
            ],
            "duree_validite": [
                "validite1",
            ],
            "temporalite": [
                "tempo1",
            ],
            "type": [
                "type1",
            ],
            "resume": [
                "resume1",
            ],
            "poly_name": [
                "poly_name1",
            ],
            "plan": [
                "plan1",
            ],
            "geometry": [
                make_square_multipolygon(0, 0, 10, 10),
            ],
            "authorization_periods": [
                "période d'autorisation1",
            ],
            "prohibition_periods": [
                "période de prohibition1",
            ],
            "additional_ref_reg": [None],
            "themes": [
                "theme1,theme2",
            ],
            "tags": [
                "tag1,tag2",
            ],
        },
    )

def test_extract_regulatory_areas_open_data(
    create_cacem_tables, reset_test_data, regulatory_areas_open_data
):
    
    regulatory_areas = extract_regulatory_areas_open_data()
    pd.testing.assert_frame_equal(regulatory_areas, regulatory_areas_open_data)


def test_get_regulatory_areas_for_csv(regulatory_areas_open_data, regulatory_areas_for_csv):
    regulatory_areas = get_regulatory_areas_for_csv(regulatory_areas_open_data)
    pd.testing.assert_frame_equal(regulatory_areas, regulatory_areas_for_csv)


def test_get_regulatory_areas_for_geopackage(
    regulatory_areas_open_data, regulatory_areas_for_geopackage
):
    regulatory_areas = get_regulatory_areas_for_geopackage(regulatory_areas_open_data)
    pd.testing.assert_frame_equal(regulatory_areas, regulatory_areas_for_geopackage)



@patch("src.flows.regulatory_areas_open_data.update_resource")
def test_flow(
    mock_update_resource,
    create_cacem_tables,
    reset_test_data,
    regulatory_areas_for_csv,
    regulatory_areas_for_geopackage,
):

    state = regulatory_areas_open_data_flow(return_state=True)
    assert state.is_completed()

    # # Check csv file object
    assert mock_update_resource.call_count == 2
    call1, call2 = mock_update_resource.call_args_list

    csv_file_object = call1.kwargs.pop("resource")
    assert call1.kwargs == {
        "dataset_id": "682ae3040ebe621687ec64ad",
        "resource_id": "c9fe6865-602f-452c-ab31-e1d25222c158",
        "resource_title": "regulatory_areas.csv",
        "mock_update": False,
    }
    assert isinstance(csv_file_object, BytesIO)
    df_from_csv_file_object = pd.read_csv(
        csv_file_object, parse_dates=["date", "date_fin", "edition"]
    )

    df_from_csv_file_object["additional_ref_reg"] = (
        df_from_csv_file_object["additional_ref_reg"].astype("Int64")
    )

    regulatory_areas_for_csv["additional_ref_reg"] = (
        regulatory_areas_for_csv["additional_ref_reg"].astype("Int64")
    )

    pd.testing.assert_frame_equal(
        df_from_csv_file_object.convert_dtypes(),
        regulatory_areas_for_csv.convert_dtypes(),
    )

    # # Check geopackage file object
    geopackage_file_object = call2.kwargs.pop("resource")
    assert call2.kwargs == {
        "dataset_id": "682ae3040ebe621687ec64ad",
        "resource_id": "dd48b545-a1d1-4710-9e56-415b895f5336",
        "resource_title": "regulatory_areas.gpkg",
        "mock_update": False,
    }

    assert isinstance(geopackage_file_object, BytesIO)
    layers = ["MED"]
    gdfs = []
    for layer in layers:
        geopackage_file_object.seek(0)
        gdfs.append(
            gpd.read_file(geopackage_file_object, driver="GPKG", layer=layer)
        )

    gdf_from_geopackage_file_object = pd.concat(gdfs).reset_index(drop=True)

    pd.testing.assert_frame_equal(
        normalize_gdf(gdf_from_geopackage_file_object),
        normalize_gdf(regulatory_areas_for_geopackage),
        check_dtype=False,
    )
