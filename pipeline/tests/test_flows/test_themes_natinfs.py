from unittest.mock import patch
from src.flows.themes_natinfs import associate_themes_natinfs, extract_natinf, extract_themes, load_themes_natinfs, natinfs_themes_flow, validate_subtheme_parent
from src.read_query import read_query
from tests.mocks import mock_extract_side_effect, mock_get_themes_natinfs_csv_file
import pandas as pd
import pytest
import sqlalchemy


@pytest.fixture
def themes() -> pd.DataFrame:
    return pd.DataFrame(
        {
            "id": [1, 2, 3, 4, 5],
            "name": [
                "Police des mouillages",
                "Especes protegees",
                "Sous-theme mouillage A",
                "Sous-theme mouillage B",
                "Sous-theme especes C",
            ],
            "parent_id": [None, None, 1, 1, 2],
        }
    )


@pytest.fixture
def natinfs() -> pd.DataFrame:
    return pd.DataFrame(
        {
            "natinf_code": [1030, 1000, 2000, 4000]
        }
    )


@pytest.fixture
def csv_data() -> pd.DataFrame:
    return pd.DataFrame(
        {
            "theme": ["Police des mouillages", "Police des mouillages", "Police des mouillages", "Especes protegees"],
            "subtheme": ["Sous-theme mouillage A", "Sous-theme mouillage A", "Sous-theme mouillage B", "Sous-theme especes C"],
            "natinf_code": [1030, 4000, 1000, 2000]
        }
    )


@pytest.fixture
def themes_natinfs() -> pd.DataFrame:
    return pd.DataFrame(
        {
            "themes_id": [3, 3, 4, 5],
            "natinf_code": [1030, 4000, 1000, 2000]
        }
    )


@patch("src.flows.themes_natinfs.extract")
def test_extract_themes(mock_extract):
    mock_extract.side_effect = mock_extract_side_effect
    result = extract_themes()
    assert isinstance(result, sqlalchemy.sql.elements.TextClause)


@patch("src.flows.themes_natinfs.extract")
def test_extract_natinf(mock_extract):
    mock_extract.side_effect = mock_extract_side_effect
    result = extract_natinf()
    assert isinstance(result, sqlalchemy.sql.elements.TextClause)


def test_validate_subtheme_parent_all_valid(csv_data, themes):
    result = validate_subtheme_parent(csv_data, themes)
    assert len(result) == len(csv_data)


def test_validate_subtheme_parent_with_invalid_pair(csv_data, themes):
    csv_with_invalid = pd.concat(
        [
            csv_data,
            pd.DataFrame([{
                "theme": "Especes protegees",
                "subtheme": "Sous-theme mouillage A",
                "natinf_code": "12345",
            }]),
        ],
        ignore_index=True,
    )
    result = validate_subtheme_parent(csv_with_invalid, themes)
    assert len(result) == len(csv_data)

def test_validate_subtheme_parent_with_unknown_subtheme(csv_data, themes):
    csv_with_unknown = pd.concat(
        [
            csv_data,
            pd.DataFrame([{
                "theme": "Police des mouillages",
                "subtheme": "Sous-theme inconnu",
                "natinf_code": "12345",
            }]),
        ],
        ignore_index=True,
    )
    result = validate_subtheme_parent(csv_with_unknown, themes)
    assert len(result) == len(csv_data)


def test_validate_subtheme_parent_returns_dataframe(csv_data, themes):
    result = validate_subtheme_parent(csv_data, themes)
    assert isinstance(result, pd.DataFrame)
    assert list(result.columns) == list(csv_data.columns)


def test_associate_themes_natinfs(csv_data, themes, natinfs, themes_natinfs):
    result = associate_themes_natinfs(csv_data, themes, natinfs)

    assert isinstance(result, pd.DataFrame)
    assert set(result.columns) == {"themes_id", "natinf_code"}
    pd.testing.assert_frame_equal(
        result.reset_index(drop=True),
        themes_natinfs.reset_index(drop=True),
    )


def test_associate_themes_natinfs_with_unknown_natinf(csv_data, themes, natinfs):
    csv_with_unknown = pd.concat(
        [
            csv_data,
            pd.DataFrame([{
                "theme": "Police des mouillages",
                "subtheme": "Sous-theme mouillage A",
                "natinf_code": "99999",
            }]),
        ],
        ignore_index=True,
    )
    result = associate_themes_natinfs(csv_with_unknown, themes, natinfs)
    assert len(result) == len(csv_data)


def test_associate_themes_natinfs_with_duplicates(csv_data, themes, natinfs):
    csv_with_duplicates = pd.concat([csv_data, csv_data], ignore_index=True)
    result = associate_themes_natinfs(csv_with_duplicates, themes, natinfs)
    assert len(result) == len(csv_data)

def test_load_themes_natinfs(reset_test_data, themes_natinfs):
    load_themes_natinfs(themes_natinfs)
    loaded = read_query(
        "monitorenv_remote",
        "SELECT * FROM themes_natinfs ORDER BY themes_id, natinf_code",
    )
    pd.testing.assert_frame_equal(
        loaded.reset_index(drop=True),
        themes_natinfs.reset_index(drop=True),
    )


@patch("src.flows.themes_natinfs.get_csv_file", mock_get_themes_natinfs_csv_file)
def test_flow_themes_natinfs(reset_test_data):
    state = natinfs_themes_flow(return_state=True)
    assert state.is_completed()
    themes_natinfs = read_query(query = "SELECT * FROM themes_natinfs", db="monitorenv_remote")
    ## I was expecting 17 themes_natinfs but we also map older themes (ended_at < now()) so there are 21
    assert len(themes_natinfs) == 21