import ast
from io import BytesIO
import json
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
            "id": [1, 2],
            "creation": [
                pd.to_datetime("2025-01-01 00:00:00"),
                pd.to_datetime("2025-01-01 00:00:00"),
            ],
            "url": ["url1", "url2"],
            "layer_name": ["layer_name1", "layer_name2"],
            "facade": ["MED", "NAMO"],
            "ref_reg": ["ref_reg1", "ref_reg2"],
            "edition": [
                pd.to_datetime("2025-06-06 00:00:00"),
                pd.to_datetime("2025-07-21 00:00:00"),
            ],
            "editeur": ["editeur1", "editeur2"],
            "source": ["source1", "source2"],
            "observation": ["obs1", "obs2"],
            "date": [
                pd.to_datetime("2025-01-01 00:00:00"),
                pd.to_datetime("2025-01-12 00:00:00"),
            ],
            "date_fin": [
                pd.to_datetime("2025-12-31 00:00:00"),
                pd.to_datetime("2026-04-12 00:00:00"),
            ],
            "type": ["type1", "type2"],
            "wkt": [
                "MULTIPOLYGON(((0 0,10 0,10 10,0 10,0 0)))",
                "MULTIPOLYGON(((120 -20,135 -20,135 -10,120 -10,120 -20)))",
            ],
            "resume": ["resume1", "resume2"],
            "poly_name": ["poly_name1 qui est différent du CACEM", "poly_name2 qui est différent du CACEM"],
            "plan": ["plan1", "plan2"],
            "geometry": [
                make_square_multipolygon(0, 0, 10, 10),
                make_square_multipolygon(120, -20, 15, 10),
            ],
            "authorization_periods": [
                "période d'autorisation1",
                "période d'autorisation2",
            ],
            "prohibition_periods": [
                "période de prohibition1",
                "période de prohibition2",
            ],
            "additional_ref_reg": [
                [{"id": "55a403ba-3077-40aa-8241-967be5314b8c", "refReg": "Arrêté interpréfectoral du 22 décembre..."}],
                None,
            ],
            "location": ["location1", "location2"],
            "themes": ["AMP sans réglementation particulière,Pêche à pied", ""],
            "sub_themes": ["", ""],
            "tags": ["tag1", ""],
            "sub_tags": ["sub-tag1", ""],
        },
        geometry="geometry",
    )


@pytest.fixture
def regulatory_areas_for_csv():
    return pd.DataFrame(
        {
            "id": [1, 2],
            "creation": [
                pd.to_datetime("2025-01-01 00:00:00"),
                pd.to_datetime("2025-01-01 00:00:00"),
            ],
            "url": ["url1", "url2"],
            "layer_name": ["layer_name1", "layer_name2"],
            "facade": ["MED", "NAMO"],
            "ref_reg": ["ref_reg1", "ref_reg2"],
            "edition": [
                pd.to_datetime("2025-06-06 00:00:00"),
                pd.to_datetime("2025-07-21 00:00:00"),
            ],
            "source": ["source1", "source2"],
            "observation": ["obs1", "obs2"],
            "date": [
                pd.to_datetime("2025-01-01 00:00:00"),
                pd.to_datetime("2025-01-12 00:00:00"),
            ],
            "date_fin": [
                pd.to_datetime("2025-12-31 00:00:00"),
                pd.to_datetime("2026-04-12 00:00:00"),
            ],
            "type": ["type1", "type2"],
            "wkt": [
                "MULTIPOLYGON(((0 0,10 0,10 10,0 10,0 0)))",
                "MULTIPOLYGON(((120 -20,135 -20,135 -10,120 -10,120 -20)))",
            ],
            "resume": ["resume1", "resume2"],
            "poly_name": ["poly_name1 qui est différent du CACEM", "poly_name2 qui est différent du CACEM"],
            "plan": ["plan1", "plan2"],
            "authorization_periods": [
                "période d'autorisation1",
                "période d'autorisation2",
            ],
            "prohibition_periods": [
                "période de prohibition1",
                "période de prohibition2",
            ],
            "additional_ref_reg": [
                [{"id": "55a403ba-3077-40aa-8241-967be5314b8c", "refReg": "Arrêté interpréfectoral du 22 décembre..."}],
                None,
            ],
            "themes": ["AMP sans réglementation particulière,Pêche à pied", ""],
            "sub_themes": ["", ""],
            "tags": ["tag1", ""],
            "sub_tags": ["sub-tag1", ""],
            "location": ["location1", "location2"],
        }
    )


@pytest.fixture
def regulatory_areas_for_geopackage():
    gdf = gpd.GeoDataFrame(
        {
            "id": [1, 2],
            "creation": [
                "2025-01-01 00:00:00",
                "2025-01-01 00:00:00",
            ],
            "url": ["url1", "url2"],
            "layer_name": ["layer_name1", "layer_name2"],
            "facade": ["MED", "NAMO"],
            "ref_reg": ["ref_reg1", "ref_reg2"],
            "edition": [
                "2025-06-06 00:00:00",
                "2025-07-21 00:00:00",
            ],
            "source": ["source1", "source2"],
            "observation": ["obs1", "obs2"],
            "date": [
                "2025-01-01 00:00:00",
                "2025-01-12 00:00:00",
            ],
            "date_fin": [
                "2025-12-31 00:00:00",
                "2026-04-12 00:00:00",
            ],
            "type": ["type1", "type2"],
            "resume": ["resume1", "resume2"],
            "poly_name": ["poly_name1 qui est différent du CACEM", "poly_name2 qui est différent du CACEM"],
            "plan": ["plan1", "plan2"],
            "geometry": [
                make_square_multipolygon(0, 0, 10, 10),
                make_square_multipolygon(120, -20, 15, 10),
            ],
            "authorization_periods": [
                "période d'autorisation1",
                "période d'autorisation2",
            ],
            "prohibition_periods": [
                "période de prohibition1",
                "période de prohibition2",
            ],
            "additional_ref_reg": [
                [{"id": "55a403ba-3077-40aa-8241-967be5314b8c", "refReg": "Arrêté interpréfectoral du 22 décembre..."}],
                None,
            ],
            "themes": ["AMP sans réglementation particulière,Pêche à pied",  ""],
            "sub_themes": ["", ""],
            "tags": ["tag1", ""],
            "sub_tags": ["sub-tag1", ""],
            "location": ["location1", "location2"],
        },
        geometry="geometry",
    )
    for col in ["creation", "edition", "date", "date_fin"]:
        gdf[col] = pd.to_datetime(gdf[col]).astype("datetime64[ms]")
    return gdf

def test_extract_regulatory_areas_open_data(
    create_cacem_tables, reset_test_data, regulatory_areas_open_data
):
    
    regulatory_areas = extract_regulatory_areas_open_data()

    pd.testing.assert_frame_equal(regulatory_areas, regulatory_areas_open_data)


def test_extract_regulatory_areas_open_data_edition_is_most_recent(
    create_cacem_tables, reset_test_data
):
    """The `edition` column must be the most recent date between edition_bo and edition_cacem."""

    regulatory_areas = extract_regulatory_areas_open_data()
    editions_by_id = regulatory_areas.set_index("id")["edition"]

    # row 1: edition_cacem (2025-06-06) > edition_bo (2025-01-10)
    assert editions_by_id[1] == pd.to_datetime("2025-06-06 00:00:00")
    # row 2: edition_bo (2025-07-21) > edition_cacem (2025-01-13)
    assert editions_by_id[2] == pd.to_datetime("2025-07-21 00:00:00")


def test_extract_regulatory_areas_open_data_themes_and_tags(
    create_cacem_tables, reset_test_data
):
    """Themes/tags with no parent_id are top-level, those with a parent_id are sub-themes/sub-tags."""

    regulatory_areas = extract_regulatory_areas_open_data().set_index("id")
    row1 = regulatory_areas.loc[1]
    row2 = regulatory_areas.loc[2]

    assert row1["themes"] == "AMP sans réglementation particulière,Pêche à pied"
    assert row1["sub_themes"] == ""
    assert row1["tags"] == "tag1"
    assert row1["sub_tags"] == "sub-tag1"


def test_get_regulatory_areas_for_csv(regulatory_areas_open_data, regulatory_areas_for_csv):
    regulatory_areas = get_regulatory_areas_for_csv(regulatory_areas_open_data)
    pd.testing.assert_frame_equal(regulatory_areas, regulatory_areas_for_csv)


def test_get_regulatory_areas_for_geopackage(
    regulatory_areas_open_data, regulatory_areas_for_geopackage
):
    regulatory_areas = get_regulatory_areas_for_geopackage(regulatory_areas_open_data)

    # get_regulatory_areas_for_geopackage serializes additional_ref_reg (jsonb) to a JSON string
    regulatory_areas["additional_ref_reg"] = regulatory_areas["additional_ref_reg"].apply(json.loads)
    regulatory_areas_for_geopackage["additional_ref_reg"] = regulatory_areas_for_geopackage["additional_ref_reg"].apply(json.dumps).apply(json.loads)

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
        csv_file_object, parse_dates=["creation", "date", "date_fin", "edition"]
    )

    # get_regulatory_areas_for_csv doesn't JSON-serialize additional_ref_reg (jsonb), so pandas
    # writes it to CSV using Python's repr (single quotes); NaN means None
    df_from_csv_file_object["additional_ref_reg"] = df_from_csv_file_object["additional_ref_reg"].apply(
        lambda x: ast.literal_eval(x) if isinstance(x, str) else None
    )

    # GDAL's GPKG driver writes empty strings as NULL, so they must be restored before comparison
    for col in ["themes", "sub_themes", "tags", "sub_tags"]:
        df_from_csv_file_object[col] = df_from_csv_file_object[col].fillna("")


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
    layers = ["MED", "NAMO"]
    gdfs = []
    for layer in layers:
        geopackage_file_object.seek(0)
        gdfs.append(
            gpd.read_file(geopackage_file_object, driver="GPKG", layer=layer)
        )

    gdf_from_geopackage_file_object = pd.concat(gdfs).reset_index(drop=True)

    # additional_ref_reg (jsonb) was serialized to a JSON string; "null" means None
    gdf_from_geopackage_file_object["additional_ref_reg"] = gdf_from_geopackage_file_object["additional_ref_reg"].apply(
        lambda x: json.loads(x) if isinstance(x, str) else None
    )

    # GDAL's GPKG driver writes empty strings as NULL, so they must be restored before comparison
    for col in ["themes", "sub_themes", "tags", "sub_tags"]:
        gdf_from_geopackage_file_object[col] = gdf_from_geopackage_file_object[col].fillna("")

    pd.testing.assert_frame_equal(
        normalize_gdf(gdf_from_geopackage_file_object),
        normalize_gdf(regulatory_areas_for_geopackage),
    )
