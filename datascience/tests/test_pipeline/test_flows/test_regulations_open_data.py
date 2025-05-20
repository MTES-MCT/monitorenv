from io import BytesIO
import pdb

import geopandas as gpd
import pandas as pd
import pytest

from src.pipeline.flows.regulatory_areas_open_data import (
    extract_regulations_open_data,
    flow,
    get_regulations_for_csv,
    get_regulations_for_geopackage,
)
from tests.mocks import mock_check_flow_not_running, mock_update_resource
from tests.test_pipeline.test_shared_tasks.test_datagouv import make_square_multipolygon

flow.replace(flow.get_tasks("check_flow_not_running")[0], mock_check_flow_not_running)

@pytest.fixture
def regulations_open_data():
    return gpd.GeoDataFrame(
        {
            "id": [
                1,
                2,
            ],
            "entity_name": [
                "entity_name1",
                "entity_name2",
            ],
            "url": [
                "url1",
                "url2"
            ],
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
                "2025-01-01",
                "2025-01-01",
            ],
            "editeur": [
                "editrice1",
                "editeur2",
            ],
            "source": [
                "source1",
                "source2",
            ],
            "thematique": [
                "thematique1",
                "thematique2"
            ],
            "observation": [
                "observation1",
                "observation2",
            ],
            "date": [
                "2010-06-01",
                "2005-07-01",
            ],
            "duree_validite": [
                "10 ans",
                "20 ans",
            ],
            "temporalite": [
                "temporaire",
                "permanent",
            ],
            "type": [
                "Décret",
                "Arrêté préfectoral",
            ],
            "geometry": [
                make_square_multipolygon(0, 0, 10, 10),
                make_square_multipolygon(120, -20, 15, 10),
            ],
            "wkt": [
                "MULTIPOLYGON(((0 0,10 0,10 10,0 10,0 0)))",
                "MULTIPOLYGON(((120 -20,135 -20,135 -10,120 -10,120 -20)))",
            ]
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
            "entity_name": [
                "entity_name1",
                "entity_name2",
            ],
            "url": [
                "url1",
                "url2"
            ],
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
                "2025-01-01",
                "2025-01-01",
            ],
            "editeur": [
                "editrice1",
                "editeur2",
            ],
            "source": [
                "source1",
                "source2",
            ],
            "thematique": [
                "thematique1",
                "thematique2"
            ],
            "observation": [
                "observation1",
                "observation2",
            ],
            "date": [
                "2010-06-01",
                "2005-07-01",
            ],
            "duree_validite": [
                "10 ans",
                "20 ans",
            ],
            "temporalite": [
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
            ]
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
            "entity_name": [
                "entity_name1",
                "entity_name2",
            ],
            "url": [
                "url1",
                "url2"
            ],
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
                "2025-01-01",
                "2025-01-01",
            ],
            "editeur": [
                "editrice1",
                "editeur2",
            ],
            "source": [
                "source1",
                "source2",
            ],
            "thematique": [
                "thematique1",
                "thematique2"
            ],
            "observation": [
                "observation1",
                "observation2",
            ],
            "date": [
                "2010-06-01",
                "2005-07-01",
            ],
            "duree_validite": [
                "10 ans",
                "20 ans",
            ],
            "temporalite": [
                "temporaire",
                "permanent",
            ],
            "type": [
                "Décret",
                "Arrêté préfectoral",
            ],
            "geometry": [
                make_square_multipolygon(0, 0, 10, 10),
                make_square_multipolygon(120, -20, 15, 10),
            ]
        },
    )

def test_extract_regulations_open_data(reset_test_data, regulations_open_data):
    regulations = extract_regulations_open_data.run()
    pd.testing.assert_frame_equal(regulations, regulations_open_data)


def test_get_regulations_for_csv(regulations_open_data, regulations_for_csv):
    regulations = get_regulations_for_csv.run(regulations_open_data)
    pd.testing.assert_frame_equal(regulations, regulations_for_csv)


def test_get_regulations_for_geopackage(
    regulations_open_data, regulations_for_geopackage
):
    regulations = get_regulations_for_geopackage.run(regulations_open_data)
    pd.testing.assert_frame_equal(regulations, regulations_for_geopackage)


def test_flow(reset_test_data, regulations_for_csv, regulations_for_geopackage):
    while flow.get_tasks("update_resource"):
        flow.replace(flow.get_tasks("update_resource")[0], mock_update_resource)

    flow.schedule = None
    state = flow.run()
    assert state.is_successful()

    # Check csv file object
    csv_file_object = state.result[flow.get_tasks("get_csv_file_object")[0]].result
    assert isinstance(csv_file_object, BytesIO)
    df_from_csv_file_object = pd.read_csv(csv_file_object)
    pd.testing.assert_frame_equal(
        df_from_csv_file_object.convert_dtypes(), regulations_for_csv.convert_dtypes()
    )

    # Check geopackage file object
    geopackage_file_object = state.result[
        flow.get_tasks("get_geopackage_file_object")[0]
    ].result
    assert isinstance(geopackage_file_object, BytesIO)

    layers = ["layer_name1", "layer_name2"]
    gdfs = []
    for layer in layers:
        geopackage_file_object.seek(0)
        gdfs.append(gpd.read_file(geopackage_file_object, driver="GPKG", layer=layer))

    gdf_from_geopackage_file_object = pd.concat(gdfs).reset_index(drop=True)

    pd.testing.assert_frame_equal(
        gdf_from_geopackage_file_object, regulations_for_geopackage
    )
