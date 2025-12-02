from io import BytesIO
from unittest.mock import patch

import geopandas as gpd
import pandas as pd
import pytest

from src.flows.regulations_open_data import (
    extract_regulations_open_data,
    get_regulations_for_csv,
    get_regulations_for_geopackage,
    regulations_open_data_flow,
)
from tests.test_shared_tasks.test_datagouv import make_square_multipolygon


@pytest.fixture
def regulations_open_data():
    return gpd.GeoDataFrame(
        {
            "id": [
                1,
                2,
            ],
            "ent_name": [
                "entity_name1",
                "entity_name2",
            ],
            "url": ["url1", "url2"],
            "layer_name": [
                "layer_name1",
                "layer_name2",
            ],
            "facade": [
                "MED",
                "NAMO",
            ],
            "ref_reg": [
                "ref_reg1",
                "ref_reg2",
            ],
            "edition": [
                pd.to_datetime("2025-01-01"),
                pd.to_datetime("2025-01-01"),
            ],
            "editeur": [
                "editrice1",
                "editeur2",
            ],
            "source": [
                "source1",
                "source2",
            ],
            "thematique": ["thematique1", "thematique2"],
            "obs": [
                "observation1",
                "observation2",
            ],
            "date": [
                pd.to_datetime("2010-06-01"),
                pd.to_datetime("2005-07-01"),
            ],
            "date_fin": [
                pd.to_datetime("2024-01-01"),
                pd.to_datetime("2025-01-01"),
            ],
            "validite": [
                "10 ans",
                "20 ans",
            ],
            "tempo": [
                "temporaire",
                "permanent",
            ],
            "type": [
                "Décret",
                "Arrêté préfectoral",
            ],
            "wkt": [
                "MULTIPOLYGON(((0 0,10 0,10 10,0 10,0 0)))",
                "MULTIPOLYGON(((120 -20,135 -20,135 -10,120 -10,120 -20)))",
            ],
            "resume": [
                "resume1",
                "resume2",
            ],
            "poly_name": [
                "polyname1",
                "polyname2",
            ],
            "plan": [
                "plan1",
                "plan2",
            ],
            "geometry": [
                make_square_multipolygon(0, 0, 10, 10),
                make_square_multipolygon(120, -20, 15, 10),
            ],
        },
    )


@pytest.fixture
def regulations_for_csv():
    return pd.DataFrame(
        {
            "id": [
                1,
                2,
            ],
            "ent_name": [
                "entity_name1",
                "entity_name2",
            ],
            "url": ["url1", "url2"],
            "layer_name": [
                "layer_name1",
                "layer_name2",
            ],
            "facade": [
                "MED",
                "NAMO",
            ],
            "ref_reg": [
                "ref_reg1",
                "ref_reg2",
            ],
            "edition": [
                pd.to_datetime("2025-01-01"),
                pd.to_datetime("2025-01-01"),
            ],
            "source": [
                "source1",
                "source2",
            ],
            "obs": [
                "observation1",
                "observation2",
            ],
            "date": [
                pd.to_datetime("2010-06-01"),
                pd.to_datetime("2005-07-01"),
            ],
            "date_fin": [
                pd.to_datetime("2024-01-01"),
                pd.to_datetime("2025-01-01"),
            ],
            "validite": [
                "10 ans",
                "20 ans",
            ],
            "tempo": [
                "temporaire",
                "permanent",
            ],
            "type": [
                "Décret",
                "Arrêté préfectoral",
            ],
            "wkt": [
                "MULTIPOLYGON(((0 0,10 0,10 10,0 10,0 0)))",
                "MULTIPOLYGON(((120 -20,135 -20,135 -10,120 -10,120 -20)))",
            ],
            "resume": [
                "resume1",
                "resume2",
            ],
            "poly_name": [
                "polyname1",
                "polyname2",
            ],
            "plan": [
                "plan1",
                "plan2",
            ],
        },
    )


@pytest.fixture
def regulations_for_geopackage():
    return gpd.GeoDataFrame(
        {
            "id": [
                1,
                2,
            ],
            "ent_name": [
                "entity_name1",
                "entity_name2",
            ],
            "url": ["url1", "url2"],
            "layer_name": [
                "layer_name1",
                "layer_name2",
            ],
            "facade": [
                "MED",
                "NAMO",
            ],
            "ref_reg": [
                "ref_reg1",
                "ref_reg2",
            ],
            "edition": [
                pd.to_datetime("2025-01-01"),
                pd.to_datetime("2025-01-01"),
            ],
            "source": [
                "source1",
                "source2",
            ],
            "obs": [
                "observation1",
                "observation2",
            ],
            "date": [
                pd.to_datetime("2010-06-01"),
                pd.to_datetime("2005-07-01"),
            ],
            "date_fin": [
                pd.to_datetime("2024-01-01"),
                pd.to_datetime("2025-01-01"),
            ],
            "validite": [
                "10 ans",
                "20 ans",
            ],
            "tempo": [
                "temporaire",
                "permanent",
            ],
            "type": [
                "Décret",
                "Arrêté préfectoral",
            ],
            "resume": [
                "resume1",
                "resume2",
            ],
            "poly_name": [
                "polyname1",
                "polyname2",
            ],
            "plan": [
                "plan1",
                "plan2",
            ],
            "geometry": [
                make_square_multipolygon(0, 0, 10, 10),
                make_square_multipolygon(120, -20, 15, 10),
            ],
        },
    )


def test_extract_regulations_open_data(
    create_cacem_tables, reset_test_data, regulations_open_data
):
    regulations = extract_regulations_open_data()
    pd.testing.assert_frame_equal(regulations, regulations_open_data)


def test_get_regulations_for_csv(regulations_open_data, regulations_for_csv):
    regulations = get_regulations_for_csv(regulations_open_data)
    pd.testing.assert_frame_equal(regulations, regulations_for_csv)


def test_get_regulations_for_geopackage(
    regulations_open_data, regulations_for_geopackage
):
    regulations = get_regulations_for_geopackage(regulations_open_data)
    pd.testing.assert_frame_equal(regulations, regulations_for_geopackage)


@patch("src.flows.regulations_open_data.update_resource")
def test_flow(
    mock_update_resource,
    create_cacem_tables,
    reset_test_data,
    regulations_for_csv,
    regulations_for_geopackage,
):

    state = regulations_open_data_flow(return_state=True)
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
    pd.testing.assert_frame_equal(
        df_from_csv_file_object.convert_dtypes(),
        regulations_for_csv.convert_dtypes(),
    )
    pd.testing.assert_frame_equal(
        df_from_csv_file_object.convert_dtypes(),
        regulations_for_csv.convert_dtypes(),
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
    layers = ["MED", "NAMO"]
    gdfs = []
    for layer in layers:
        geopackage_file_object.seek(0)
        gdfs.append(
            gpd.read_file(geopackage_file_object, driver="GPKG", layer=layer)
        )

    gdf_from_geopackage_file_object = pd.concat(gdfs).reset_index(drop=True)

    pd.testing.assert_frame_equal(
        gdf_from_geopackage_file_object,
        regulations_for_geopackage,
        check_dtype=False,
    )
